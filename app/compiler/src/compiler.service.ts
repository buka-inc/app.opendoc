import * as path from 'path'
import * as fs from 'fs-extra'
import * as childProcess from 'child_process'
import compressing from 'compressing'
import { Injectable } from '@nestjs/common'
import { SdkCreatedEventMessageDataDTO } from './api/backend/components/schemas'
import { compile, Compiler, FileNamingStyle } from '@opendoc/sdk'
import { formatParsedVersion } from './utils/format-parsed-version'
import { promisify } from 'util'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'


const exec = promisify(childProcess.exec)
@Injectable()
export class CompilerService {
  readonly tempDir = path.resolve('./temp')

  constructor(
    @InjectPinoLogger(CompilerService.name)
    private readonly logger: PinoLogger
  ) {}


  private async unCompress(apiFilesRaw: string): Promise<string> {
    const { temporaryDirectory } = (await import('tempy'))
    const dir = temporaryDirectory()

    const buf = Buffer.from(apiFilesRaw, 'base64')
    await compressing.tgz.uncompress(buf, dir)

    return dir
  }

  async compile(data: SdkCreatedEventMessageDataDTO): Promise<void> {
    const { sdk, version } = data
    const apiFilesDir = await this.unCompress(data.apiFilesRaw)

    const openapiFilepath = path.join(apiFilesDir, 'openapi.json')
    if (!await fs.exists(openapiFilepath)) {
      throw new Error(`Cannot compile ${sdk.name} SDK: openapi.json not found`)
    }
    const swagger = await fs.readJson(openapiFilepath)

    this.logger.debug(`apiFiles had be uncompressed to ${apiFilesDir}`)

    const { temporaryDirectory } = (await import('tempy'))
    const compileDir = temporaryDirectory()

    this.logger.debug(`Compile ${sdk.name} SDK to: ${compileDir}`)

    await compile({
      strict: true,
      outdir: compileDir,
      document: swagger,
      moduleName: sdk.name,
      fileNamingStyle: FileNamingStyle.snakeCase,
      compiler: Compiler.openapiCore,
      project: {
        name: sdk.name,
        version: formatParsedVersion(version),
      },
    })

    this.logger.debug(`Build ${sdk.name} SDK`)
    await this.build(compileDir)

    this.logger.debug(`Publish ${sdk.name} SDK`)
    await this.publish(compileDir, data)
    this.logger.debug(`${sdk.name} SDK Published`)
  }

  async build(dir: string): Promise<void> {
    try {
      await exec('npm install --production=false --legacy-peer-deps', { cwd: dir })
      await exec('npm run build', { cwd: dir })
    } catch (e) {
      if (e instanceof Error) {
        if ('stdout' in e) {
          this.logger.info(e.stdout)
        }

        if ('stderr' in e) {
          this.logger.error(e.stderr)
        }
      }

      throw e
    }
  }

  async publish(compileDir: string, data: SdkCreatedEventMessageDataDTO): Promise<void> {
    const npmrcFilepath = path.join(compileDir, '.npmrc')

    console.log('🚀 ~ CompilerService ~ publish ~ data.compiler.options:', data.compiler.options)
    // register url
    const registerUrlOption = data.compiler.options.find((option) => option.key === 'registryUrl')
    if (!registerUrlOption || !registerUrlOption.value) {
      throw new Error('Cannot publish SDK: registryUrl option not found')
    }
    const registryUrl = registerUrlOption.value.replace(/\/$/, '')
    await fs.appendFile(npmrcFilepath, `\nregistry=${registryUrl}`)

    // register access token
    const registerAccessTokenOption = data.compiler.options.find((option) => option.key === 'registryAccessToken')
    if (registerAccessTokenOption && registerAccessTokenOption.value) {
      const registryHost = registryUrl.replace(/^https?:\/\//, '')
      await fs.appendFile(npmrcFilepath, `\n//${registryHost}/:_authToken=${registerAccessTokenOption.value}\n`)
    }

    try {
      await exec(`npm publish --registry ${registryUrl}`, { cwd: compileDir })
    } catch (e) {
      if (e instanceof Error) {
        if ('stdout' in e) {
          this.logger.info(e.stdout)
        }

        if ('stderr' in e) {
          this.logger.error(e.stderr)
        }
      }

      throw e
    }
  }
}
