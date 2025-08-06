// API配置文件
export const API_CONFIG = {
  // 基础URL配置
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  
  // API端点配置
  ENDPOINTS: {
    ARTICLES: '/api/articles',
    PROJECTS: '/api/projects',
    CONTACT: '/api/contact',
  },
  
  // 完整的API URL
  URLS: {
    ARTICLES: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ARTICLES}`,
    PROJECTS: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS}`,
    CONTACT: () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT}`,
  }
};

// 环境配置
export const ENV_CONFIG = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// 类型定义
export interface Article {
  id: string;
  slug: string;
  title: {
    'zh-CN': string;
    en: string;
  };
  excerpt: {
    'zh-CN': string;
    en: string;
  };
  content: {
    'zh-CN': string;
    en: string;
  };
  publishDate: string;
  readTime: string;
  tags: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: {
    'zh-CN': string;
    en: string;
  };
  description: {
    'zh-CN': string;
    en: string;
  };
  techStack: string[];
  imageUrl: string;
}

// API工具函数
export const apiUtils = {
  // 通用fetch函数
  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // 获取文章列表
  async getArticles(): Promise<Article[]> {
    return apiUtils.fetch<Article[]>(API_CONFIG.URLS.ARTICLES());
  },
  
  // 获取项目列表
  async getProjects(): Promise<Project[]> {
    return apiUtils.fetch<Project[]>(API_CONFIG.URLS.PROJECTS());
  },
  
  // 发送联系表单
  async sendContact(data: any) {
    return apiUtils.fetch(API_CONFIG.URLS.CONTACT(), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
