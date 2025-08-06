# API配置重构总结

## 完成的工作

### 1. 创建了统一的API配置文件

- **文件位置**: `apps/frontend/config/api.ts`
- **功能**: 集中管理所有API接口地址和类型定义
- **包含内容**:
  - API基础配置 (`API_CONFIG`)
  - 环境配置 (`ENV_CONFIG`)
  - API工具函数 (`apiUtils`)
  - 类型定义 (`Article`, `Project`)

### 2. 重构了硬编码的接口调用

#### 修改的文件:

1. **`apps/frontend/components/Articles.tsx`**

   - 移除了硬编码的 `http://localhost:3001/api/articles`
   - 使用 `apiUtils.getArticles()` 替代
   - 导入统一的类型定义

2. **`apps/frontend/pages/index.tsx`**
   - 移除了硬编码的 `http://localhost:3001/api/projects`
   - 使用 `apiUtils.getProjects()` 替代
   - 修复了类型错误

### 3. 创建了使用说明文档

- **文件位置**: `apps/frontend/config/README.md`
- **内容**: 详细的使用指南和最佳实践

## 配置结构

```typescript
// API配置
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  ENDPOINTS: {
    ARTICLES: "/api/articles",
    PROJECTS: "/api/projects",
    CONTACT: "/api/contact",
  },
  URLS: {
    ARTICLES: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ARTICLES}`,
    PROJECTS: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS}`,
    CONTACT: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT}`,
  },
};
```

## 使用方法

### 基本使用

```typescript
import { apiUtils } from "../config/api";

// 获取文章列表
const articles = await apiUtils.getArticles();

// 获取项目列表
const projects = await apiUtils.getProjects();
```

### 环境变量配置

创建 `.env.local` 文件:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## 优势

1. **统一管理**: 所有API地址集中在一个文件中
2. **环境切换**: 通过环境变量轻松切换不同环境
3. **类型安全**: 提供完整的TypeScript类型定义
4. **错误处理**: 统一的错误处理机制
5. **易于维护**: 修改API地址只需在一个地方修改
6. **代码复用**: 避免重复的fetch逻辑

## 验证结果

- ✅ 构建成功，无TypeScript错误
- ✅ 所有硬编码的接口地址已移除
- ✅ 类型定义完整且正确
- ✅ 代码结构清晰，易于维护

## 后续建议

1. 在部署时设置正确的环境变量
2. 添加更多的API端点时，按照现有模式在配置文件中添加
3. 考虑添加请求拦截器和响应拦截器
4. 可以添加请求重试机制和缓存策略
