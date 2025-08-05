# 个人作品集项目

这是一个使用现代化技术栈构建的个人作品集项目，采用前后端分离架构。

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
# 启动前端和后端
pnpm dev

# 或者分别启动
pnpm run dev:frontend  # 前端 (http://localhost:3000)
pnpm run dev:backend   # 后端 (http://localhost:3001)
```

## 📚 API 文档

### Swagger UI

访问 `http://localhost:3001/api/docs` 查看交互式API文档

### OpenAPI 规范

访问 `http://localhost:3001/api/openapi.json` 获取OpenAPI规范文件

## 🛠️ 技术栈

### 前端

- **Next.js 14** - React全栈框架
- **React 18** - 用户界面库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化CSS框架
- **Lucide React** - 现代化图标库

### 后端

- **Hono.js** - 轻量级Web框架
- **TypeScript** - 类型安全
- **Swagger UI** - API文档和测试界面
- **CORS** - 跨域资源共享

## 📁 项目结构

```
my-portfolio-monorepo/
├── apps/
│   ├── frontend/          # Next.js前端应用
│   │   ├── components/    # React组件
│   │   ├── hooks/        # 自定义Hooks
│   │   ├── pages/        # 页面路由
│   │   ├── public/       # 静态资源
│   │   └── styles/       # 样式文件
│   └── backend/          # Hono.js后端API
│       ├── src/
│       │   ├── routes/   # API路由
│       │   ├── data/     # 数据文件
│       │   └── types.ts  # 类型定义
```

## 🌐 API 端点

### 获取项目列表

- **URL**: `GET /api/projects`
- **描述**: 返回所有项目的信息
- **响应格式**: JSON

## 🔧 开发

- 使用 TypeScript 确保类型安全
- 支持热重载开发
- 集成 Swagger UI 进行API文档管理
- 支持中英文国际化
- 响应式设计适配各种设备

## 📖 更多信息

详细的后端API文档请查看 [apps/backend/README.md](apps/backend/README.md)
