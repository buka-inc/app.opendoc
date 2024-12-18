# @opendoc/backend

## 1.8.0

### Minor Changes

- 98808ee: 插件崩溃后会周期性的检查插件状态并自动恢复插件
- 02e688b: 插件增加日志采集功能
- 3b9d484: 增加清理缓存功能

### Patch Changes

- 599e7ee: 将插件超时时间配置改为 PLUGIN\_\_TTL
- 2c07878: 修复同步地址错误可以创建 Sheet 的问题
- 66c0d31: 修复无法连接插件没有错误信息的问题

## 1.7.1

### Patch Changes

- d8461f8: 修复插件配置将自定义 Host 识别为非法地址的问题

## 1.7.0

### Minor Changes

- df84fa3: 移除内置的 SDK 模块并添加插件功能，SDK 由插件生成

## 1.6.6

### Patch Changes

- d608d9b: 修复无法安装 npm 包的问题

## 1.6.5

### Patch Changes

- a570358: 修复版本号超过 0.0.9 之后无法添加新版本
- Updated dependencies [8d75754]
  - @opendoc/sdk@1.3.3

## 1.6.4

### Patch Changes

- 2e31fcf: 修复 turborepo 升级至 2.x 导致 dockerfile 无法构建的问题

## 1.6.3

### Patch Changes

- 39f69c1: 修复 swagger 文件中存在 trace 和 option 接口时导致的编译错误
- 0661733: 增加 SDK 构建错误状态
- 39f7346: 支持手动同步 Pull 模式的 sheet
- Updated dependencies [39f69c1]
  - @opendoc/sdk@1.3.2

## 1.6.2

### Patch Changes

- efb0a0a: 创建 pull 模式 sheet 后未自动拉取 api-file
- c6a90aa: 修复应用配置的同步地址未展示的问题
- d753511: 修复 sdk 无法安装的问题
- b4806c0: 修复 sdk 构建异常后无法自动恢复
- 8dcc264: 修复无法删除应用的问题
- Updated dependencies [c27b265]
  - @opendoc/sdk@1.3.1

## 1.6.1

### Patch Changes

- e4accce: 创建 sheet 接口未设置 order 时会报错
- Updated dependencies [179bf1f]
- Updated dependencies [07b5a11]
  - @opendoc/sdk@1.3.0

## 1.6.0

### Minor Changes

- a98ce3e: 应用的页签支持目录树

### Patch Changes

- 509e5a4: 修复 openapi 的 react sdk 无法构建的问题
- Updated dependencies [a98ce3e]
- Updated dependencies [77319c0]
- Updated dependencies [509e5a4]
  - @opendoc/sdk@1.2.0

## 1.5.2

### Patch Changes

- 234ee6d: 修复由于构建结果中缺少配置文件导致自动迁移脚本无法运行的问题'

## 1.5.1

### Patch Changes

- b1cb526: 迁移脚本无法自动添加预设的应用编码黑名单

## 1.5.0

### Minor Changes

- 325bca1: 应用编码黑名单添加描述

### Patch Changes

- 4c163d7: 迁移脚本将自动添加常见的需要禁用的应用编号

## 1.4.0

### Minor Changes

- 348dae8: 支持应用名称搜索功能
- 3348525: 支持应用编号搜索
- 9dfbb49: 新增应用编码黑名单功能
- 7ad3619: 支持使用 OSS 进行文件管理
- cc65c59: 支持 Asyncapi 文档

### Patch Changes

- Updated dependencies [cc65c59]
  - @opendoc/sdk@1.1.0
