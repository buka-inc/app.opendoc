import * as R from 'ramda'
import * as semver from 'semver'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SheetVersion } from './entities/sheet-version.entity'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { QuerySheetVersionsDTO } from './dto/query-sheet-versions.dto'
import { QuerySheetVersionsResponseDTO } from './dto/query-sheet-versions-response.dto'
import { Sheet } from '../sheet/entities/sheet.entity'
import { ParsedVersionDTO } from './dto/parsed-version.dto'


@Injectable()
export class SheetVersionService {
  constructor(
    @InjectPinoLogger(SheetVersion.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(SheetVersion)
    private readonly sheetVersionRepo: EntityRepository<SheetVersion>,
  ) {}

  async querySheetVersions(dto: QuerySheetVersionsDTO): Promise<QuerySheetVersionsResponseDTO> {
    const qb = this.sheetVersionRepo.createQueryBuilder('version')

    if (!R.isNil(dto.offset)) {
      void qb
        .limit(dto.limit || 10)
        .offset(dto.offset)
    }

    if (dto.sheetId) {
      void qb.andWhere({ sheet: { id: dto.sheetId } })
    }

    const [results, total] = await qb.getResultAndCount()

    return {
      results,
      pagination: {
        total,
        limit: dto.limit || 10,
        offset: dto.offset || -1,
      },
    }
  }

  async querySheetVersion(sheetVersionId: string): Promise<SheetVersion> {
    return this.sheetVersionRepo.findOneOrFail(sheetVersionId)
  }

  parse(version: string): ParsedVersionDTO {
    const parsed = semver.parse(version)
    if (!parsed) {
      throw new BadRequestException('invalid version')
    }

    const [tag, prerelease] = parsed.prerelease.length === 2 ? [String(parsed.prerelease[0]), Number(parsed.prerelease[1])] : ['', 0]

    return {
      major: parsed.major,
      minor: parsed.minor,
      patch: parsed.patch,
      tag,
      prerelease,
    }
  }

  async findMaxSheetVersion(sheet: Sheet, tag: string = ''): Promise<SheetVersion | null> {
    return this.sheetVersionRepo.findOne(
      {
        sheet,
        tag: tag ? [tag, ''] : '',
      },
      {
        orderBy: [
          { major: 'desc' },
          { minor: 'desc' },
          { patch: 'desc' },
          { prerelease: 'desc' },
        ],
      }
    )
  }

  async bumpSheetVersion(sheet: Sheet, releaseType: 'major' | 'minor' | 'patch'): Promise<SheetVersion>
  async bumpSheetVersion(sheet: Sheet, releaseType: 'prerelease', tag: string): Promise<SheetVersion>
  async bumpSheetVersion(sheet: Sheet, releaseType: 'major' | 'minor' | 'patch' | 'prerelease', tag: string = ''): Promise<SheetVersion> {
    if (releaseType === 'prerelease' && !tag) {
      throw new TypeError('tag is required when releaseType is prerelease')
    }

    const maxSheetVersion = await this.findMaxSheetVersion(sheet)

    if (!maxSheetVersion) {
      return this.sheetVersionRepo.create({
        major: 0,
        minor: 0,
        patch: 1,
        prerelease: 0,
        tag: tag,
        sheet,
      })
    }

    const version = semver.parse(semver.inc(maxSheetVersion.version, releaseType, tag))
    if (!version) {
      throw new BadRequestException('invalid version')
    }

    const prerelease = version.prerelease.length === 2 ? Number(version.prerelease[1]) : 0

    return this.sheetVersionRepo.create({
      major: version.major,
      minor: version.minor,
      patch: version.patch,
      prerelease,
      tag,
      sheet,
    })
  }
}
