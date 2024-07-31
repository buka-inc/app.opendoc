import type { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface Compiler
 * @export
 */
export interface Compiler {
  /**
   * 编译器状态
   */
  "status": "disabled" | "enabled"
  /**
   * 编译器地址
   */
  "url": string
  /**
   * 编译器名称
   */
  "name": string
  /**
   * 编译器描述
   */
  "description": string
  /**
   * 编译器名称
   */
  "author": string
  /**
   * 编译器版本
   */
  "version": string
  "options": (EntityReferenceDTO)[]
  /**
   * 主键
   */
  "id": string
  /**
   * @type date-time
   * 创建时间
   */
  "createdAt": string
  /**
   * @type date-time
   * 更新时间
   */
  "updatedAt": string
}
