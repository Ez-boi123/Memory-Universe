# Memory Universe

> 为两个人保存共同记忆的私密数字宇宙。

[访问 Memory Universe：memverse.me](https://memverse.me)

Memory Universe 是一个桌面端优先的私密记忆空间。两位用户可以通过专属关系码连接，在同一个空间中记录事件、整理照片时间线，并留下简短留言。产品采用安静、克制的宇宙视觉，希望让记忆成为主角，而不是把内容变成公开社交动态。

## 核心模块

| 模块 | 用途 |
| --- | --- |
| **Universe** | 共享空间首页，集中查看最近的事件、照片和留言 |
| **Planet** | 创建和共同编辑记忆事件，记录日期、地点、正文与照片 |
| **Milky Way** | 按记忆日期浏览照片时间线 |
| **Constellation** | 给对方留下轻量、日常的短留言 |

所有内容默认仅对同一关系空间中的两位成员可见。当前 MVP 中，每个账号只能加入一个一对一关系空间。

## 如何使用

### 1. 创建账号

打开 [https://memverse.me](https://memverse.me)，点击 **Begin Your Archive**，填写显示名称、邮箱和至少 8 位的密码完成注册。已有账号可直接选择 **Sign In**。

### 2. 与另一位用户建立关系

双方都注册后：

1. 进入 **Account** 或 **Relationship Settings**，找到自己的 `Relation Code`。
2. 将其中一人的关系码发送给另一人。
3. 由另一人在 **Relationship Settings** 中输入该关系码并确认绑定。
4. 绑定成功后，双方会进入同一个共享宇宙。

一个关系码只需要由一方输入。已经加入关系空间的账号不能再次绑定其他用户。

### 3. 记录一个记忆事件

进入 **Planet**，创建新的记忆事件：

- 填写标题、正文和记忆日期；
- 可补充地点与事件类型；
- 可为单个事件添加最多 9 张图片；
- 需要时可将事件照片同步到 **Milky Way** 时间线。

关系中的两位成员都可以编辑事件。每次保存会保留版本记录，误改时可以恢复较早的版本；删除事件前请确认，删除后不会出现在活动列表中。

### 4. 建立照片时间线

进入 **Milky Way**，上传图片并填写记忆日期，也可以补充标题与备注。保存后，照片会依照记忆日期排列在时间线上。当前支持图片文件，单张大小不超过 10 MB。

照片删除后目前无法恢复，请谨慎操作。

### 5. 留下一条消息

进入 **Constellation**，输入不超过 220 个字符的留言并发布。最新留言会显示在最前面，并带有作者与发布时间。

## 当前实现状态

账号注册与登录、关系码绑定、事件管理与版本恢复、照片上传与时间线、留言板均已接入数据库。以下能力仍在建设中：

- 邀请链接与邀请码接受流程；
- 忘记密码与邮件重置密码流程；
- 关键词和日期范围搜索；
- 独立的照片“待归档”工作流；
- 移动端优先适配与实时协作。

## 本地开发

### 环境要求

- Node.js 20+
- npm
- PostgreSQL
- S3 兼容对象存储（上传图片时需要，例如 AWS S3、Cloudflare R2 或 MinIO）

### 1. 安装依赖

```bash
npm install
```

安装完成后会通过 `postinstall` 自动生成 Prisma Client。

### 2. 配置环境变量

复制示例配置：

```powershell
Copy-Item .env.example .env.local
```

macOS / Linux：

```bash
cp .env.example .env.local
```

然后编辑 `.env.local`：

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/memory_universe"
AUTH_SECRET="replace-with-a-long-random-string"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="http://localhost:3000"

OBJECT_STORAGE_ENDPOINT="https://your-storage-endpoint"
OBJECT_STORAGE_REGION="auto"
OBJECT_STORAGE_BUCKET="memory-universe"
OBJECT_STORAGE_ACCESS_KEY_ID="replace-me"
OBJECT_STORAGE_SECRET_ACCESS_KEY="replace-me"

# 可选：公开 CDN 或自定义域名
# OBJECT_STORAGE_PUBLIC_BASE_URL="https://cdn.example.com/memory-universe"

# 部分本地或兼容服务需要 path-style URL
# OBJECT_STORAGE_FORCE_PATH_STYLE="false"

# 未绑定到事件的临时上传保留时长
EVENT_PHOTO_UPLOAD_TTL_HOURS="24"
```

可用 Node.js 生成 `AUTH_SECRET`：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

`DATABASE_URL` 和 `AUTH_SECRET` 是注册、登录及受保护页面的基础配置。对象存储变量只在使用图片上传功能时必需。

### 3. 初始化数据库

```bash
npx prisma migrate dev
```

如 Prisma Client 没有自动生成，可手动执行：

```bash
npm run prisma:generate
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 创建生产构建 |
| `npm start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint |
| `npm run typecheck` | 运行 TypeScript 类型检查 |
| `npm test` | 运行 Vitest 测试 |
| `npm run test:watch` | 以监听模式运行测试 |
| `npm run prisma:generate` | 生成 Prisma Client |
| `npm run cleanup:event-photo-uploads` | 清理超过 TTL 的临时事件图片 |

## 部署到 memverse.me

生产环境使用 [https://memverse.me](https://memverse.me)。部署时至少需要完成以下配置：

1. 准备生产 PostgreSQL 数据库与 S3 兼容对象存储。
2. 在托管平台配置与 `.env.example` 对应的环境变量。
3. 将 `NEXTAUTH_URL` 设置为 `https://memverse.me`，并使用独立生成的生产 `AUTH_SECRET`。
4. 执行 `npx prisma migrate deploy` 应用生产迁移。
5. 执行 `npm run build`，然后以 `npm start` 启动服务。
6. 将 `memverse.me` 的 DNS 记录指向部署平台，并启用 HTTPS。

不要提交 `.env.local`、数据库凭据、对象存储密钥或其他生产机密。

## 项目结构

```text
src/app/         页面、路由组与 API handlers
src/components/  通用 UI 与 Universe / Planet / Milky Way / Constellation 组件
src/lib/         鉴权、数据库、对象存储、校验与权限逻辑
src/server/      services、repositories 与 presenters
src/types/       共享 TypeScript 类型
src/styles/      全局样式与视觉设计
prisma/          Prisma schema 与数据库迁移
scripts/         维护脚本
```

## 隐私与数据说明

- Memory Universe 不是公开社交网络，关系空间中的内容默认仅对两位成员开放。
- 事件、照片和留言会保留创建者信息，方便追溯内容来源。
- 事件采用非实时协作与最后写入生效策略，并保留版本历史。
- 照片和留言删除后当前不可恢复。
- 生产部署应使用最小权限的数据库与对象存储凭据，并为数据库建立独立备份策略。
