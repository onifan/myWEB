# 后端 API 文档

## 启动服务器

```bash
pnpm dev
```

服务器将在 `http://localhost:3001` 启动

## API 文档

### Swagger UI

访问 `http://localhost:3001/api/docs` 查看交互式API文档

### OpenAPI 规范

访问 `http://localhost:3001/api/openapi.json` 获取OpenAPI规范文件

## API 端点

### 获取项目列表

- **URL**: `GET /api/projects`
- **描述**: 返回所有项目的信息
- **响应格式**: JSON
- **示例响应**:

```json
[
  {
    "id": "proj-1",
    "slug": "remote-collaboration-platform",
    "title": {
      "zh-CN": "远程协作平台",
      "en": "Remote Collaboration Platform"
    },
    "description": {
      "zh-CN": "一款提供实时文档编辑、任务管理和视频会议功能的SaaS产品。",
      "en": "A SaaS product offering real-time document editing, task management, and video conferencing."
    },
    "techStack": ["Next.js", "Hono.js", "WebSocket", "PostgreSQL"],
    "imageUrl": "https://placehold.co/600x400/3B82F6/FFFFFF?text=Project%20A"
  }
]
```

## 开发

- 使用 TypeScript 和 Hono.js
- 支持 CORS
- 集成 Swagger UI 进行API文档管理
- 使用 Zod 进行类型验证和OpenAPI规范生成
