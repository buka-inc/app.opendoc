import { Cascade, Collection, Entity, OneToMany } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { CompilerOption } from './compiler-option.entity'
import { EntityProperty } from '~/decorators/entity-property.decorator'
import { CompilerStatus } from '../constants/compiler-status'
import { IsEnum } from 'class-validator'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'


@Entity()
export class Compiler extends BaseEntity {
  @IsEnum(CompilerStatus)
  @EntityProperty({
    type: 'varchar',
    length: 15,
    comment: '编译器状态',
  })
  status!: CompilerStatus

  @EntityProperty({
    type: 'varchar',
    length: 255,
    comment: '编译器地址',
    unique: true,
  })
  url!: string

  @EntityProperty({
    type: 'varchar',
    length: 63,
    comment: '编译器名称',
  })
  name!: string

  @EntityProperty({
    type: 'varchar',
    length: 255,
    comment: '编译器描述',
  })
  description!: string

  @EntityProperty({
    type: 'varchar',
    length: 63,
    comment: '编译器名称',
  })
  author!: string

  @EntityProperty({
    type: 'varchar',
    length: 31,
    comment: '编译器版本',
  })
  version!: string

  @ApiForeignKey()
  @OneToMany({
    entity: () => CompilerOption,
    comment: '编译器选项',
    mappedBy: 'compiler',
    cascade: [Cascade.ALL],
    eager: true,
  })
  options: Collection<CompilerOption> = new Collection<CompilerOption>(this)
}
