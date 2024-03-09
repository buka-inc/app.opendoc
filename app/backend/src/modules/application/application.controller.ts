import { QueryApplicationsResponseDTO } from './dto/query-applications-response.dto'
import { Body, Controller, Delete, Get, Header, Param, Put, Query } from '@nestjs/common'
import { ApplicationService } from './application.service'
import { RegisterApplicationDTO } from './dto/register-application.dto'
import { QueryApplicationsDTO } from './dto/query-applications.dto'
import { Application } from './entity/application.entity'
import { ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'


@ApiTags('Application')
@Controller('application')
@ApiInternalServerErrorResponse({ description: '系统异常' })
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService
  ) {}

  @Put()
  @ApiOperation({ summary: '注册应用' })
  async registerApplication(
    @Body() dto: RegisterApplicationDTO
  ): Promise<void> {
    await this.applicationService.register(dto)
  }

  @Get()
  @ApiOperation({ summary: '查询应用列表' })
  async queryApplications(
    @Query() dto: QueryApplicationsDTO
  ): Promise<QueryApplicationsResponseDTO> {
    return this.applicationService.queryApplications(dto)
  }

  @Get(':applicationIdOrCode')
  @ApiOperation({ summary: '查询应用详情' })
  async queryApplication(
    @Param('applicationIdOrCode') applicationIdOrCode: string
  ): Promise<Application> {
    return this.applicationService.queryApplicationByIdOrCode(applicationIdOrCode)
  }

  @Delete(':applicationIdOrCode')
  @ApiOperation({ summary: '删除应用' })
  async deleteApplication(
    @Param('applicationIdOrCode') applicationIdOrCode: string
  ): Promise<void> {
    await this.applicationService.deleteApplication(applicationIdOrCode)
  }
}

