import { Entity, ManyToOne, OneToOne, Property, Ref, t } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { ApiDocumentFile } from '~/modules/api-document-file/entities/api-document-file.entity'
import { BuildTask } from './build-task.entity'

@Entity()
export class NpmPackage extends BaseEntity {
  /**
   * Npm包名
   */
  @Property({
    columnType: 'varchar(214)',
    comment: 'Npm包名',
  })
  name!: string

  /**
   * 版本
   */
  @Property({
    columnType: 'varchar(63)',
    comment: '版本',
  })
  version!: string

  /**
   * 标签
   */
  @Property({
    columnType: 'varchar(24)',
    default: '',
    nullable: true,
    comment: '标签',
  })
  tag?: string

  /**
   * 是否已发布
   */
  @Property({
    type: t.boolean,
  })
  isPublished!: boolean

  /**
   * 发布时间
   */
  @Property({
    type: t.datetime,
    nullable: true,
  })
  publishedAt?: Date

  /**
   * Npm 压缩包
   */
  @Property({
    columnType: 'varchar(255)',
    comment: 'Npm 压缩包',
    nullable: true,
  })
  tarball?: string

  /**
   * Npm 压缩包的sha512
   */
  @Property({
    columnType: 'varchar(100)',
    comment: 'Npm压缩包的sha512',
    nullable: true,
  })
  integrity?: string

  @ManyToOne({
    entity: () => ApiDocumentFile,
    comment: '文档文件',
    ref: true,
  })
  apiDocumentFile!: Ref<ApiDocumentFile>

  @OneToOne({
    entity: () => BuildTask,
    mappedBy: 'npmPackage',
    nullable: true,
  })
  BuildTask?: Ref<BuildTask>
}
