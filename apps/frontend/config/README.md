# API配置使用说明

## 概述

本项目使用统一的API配置文件来管理所有的接口地址，避免硬编码，便于环境切换和维护。

## 配置文件结构

### `api.ts`

- `API_CONFIG`: API基础配置
- `ENV_CONFIG`: 环境配置
- `apiUtils`: API工具函数
- 类型定义: `Article`, `Project` 等

## 使用方法

### 1. 基本使用

```typescript
import { apiUtils } from "../config/api";

// 获取文章列表
const articles = await apiUtils.getArticles();

// 获取项目列表
const projects = await apiUtils.getProjects();

// 发送联系表单
await apiUtils.sendContact(formData);
```

### 2. 环境变量配置

创建 `.env.local` 文件：

```bash
# 开发环境
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# 生产环境
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### 3. 添加新的API端点

在 `api.ts` 中添加新的端点：

```typescript
// 在 ENDPOINTS 中添加
ENDPOINTS: {
  ARTICLES: '/api/articles',
  PROJECTS: '/api/projects',
  CONTACT: '/api/contact',
  NEW_ENDPOINT: '/api/new-endpoint', // 新增
},

// 在 URLS 中添加
URLS: {
  ARTICLES: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ARTICLES}`,
  PROJECTS: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS}`,
  CONTACT: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT}`,
  NEW_ENDPOINT: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEW_ENDPOINT}`, // 新增
},

// 在 apiUtils 中添加新的方法
async getNewData() {
  return apiUtils.fetch<NewDataType>(API_CONFIG.URLS.NEW_ENDPOINT());
},
```

## 优势

1. **统一管理**: 所有API地址集中管理
2. **环境切换**: 通过环境变量轻松切换不同环境
3. **类型安全**: 提供完整的TypeScript类型定义
4. **错误处理**: 统一的错误处理机制
5. **易于维护**: 修改API地址只需在一个地方修改

## 注意事项

- 所有API调用都应该使用 `apiUtils` 中的方法
- 新增API端点时记得添加相应的类型定义
- 环境变量必须以 `NEXT_PUBLIC_` 开头才能在客户端使用
