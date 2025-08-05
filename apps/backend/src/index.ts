import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { swaggerUI } from '@hono/swagger-ui';
import articles from './routes/articles';

const app = new Hono().basePath('/api');

// 应用中间件
app.use('*', logger());
app.use('*', cors({
  origin: 'http://localhost:3000', // 允许前端开发服务器访问
}));

// Swagger UI 路由
app.get('/docs', swaggerUI({ url: '/api/openapi.json' }));

// OpenAPI JSON 规范
app.get('/openapi.json', (c) => {
  return c.json({
    openapi: '3.0.0',
    info: {
      title: '个人作品集 API',
      version: '1.0.0',
      description: '个人作品集项目的后端API接口文档'
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: '开发服务器'
      }
    ],
    paths: {
      '/projects': {
        get: {
          tags: ['projects'],
          summary: '获取所有项目',
          description: '返回所有项目的信息列表',
          responses: {
            '200': {
              description: '成功获取项目列表',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        slug: { type: 'string' },
                        title: {
                          type: 'object',
                          properties: {
                            'zh-CN': { type: 'string' },
                            en: { type: 'string' }
                          }
                        },
                        description: {
                          type: 'object',
                          properties: {
                            'zh-CN': { type: 'string' },
                            en: { type: 'string' }
                          }
                        },
                        techStack: {
                          type: 'array',
                          items: { type: 'string' }
                        },
                        imageUrl: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            '500': {
              description: '服务器内部错误',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/articles': {
        get: {
          tags: ['articles'],
          summary: '获取所有文章',
          description: '返回所有文章的信息列表',
          responses: {
            '200': {
              description: '成功获取文章列表',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        slug: { type: 'string' },
                        title: {
                          type: 'object',
                          properties: {
                            'zh-CN': { type: 'string' },
                            en: { type: 'string' }
                          }
                        },
                        excerpt: {
                          type: 'object',
                          properties: {
                            'zh-CN': { type: 'string' },
                            en: { type: 'string' }
                          }
                        },
                        content: {
                          type: 'object',
                          properties: {
                            'zh-CN': { type: 'string' },
                            en: { type: 'string' }
                          }
                        },
                        publishDate: { type: 'string' },
                        readTime: { type: 'string' },
                        tags: {
                          type: 'array',
                          items: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '500': {
              description: '服务器内部错误',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/articles/{slug}': {
        get: {
          tags: ['articles'],
          summary: '获取单个文章',
          description: '根据文章slug获取单个文章的详细信息',
          parameters: [
            {
              name: 'slug',
              in: 'path',
              required: true,
              description: '文章的slug标识',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: '成功获取文章详情',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      slug: { type: 'string' },
                      title: {
                        type: 'object',
                        properties: {
                          'zh-CN': { type: 'string' },
                          en: { type: 'string' }
                        }
                      },
                      excerpt: {
                        type: 'object',
                        properties: {
                          'zh-CN': { type: 'string' },
                          en: { type: 'string' }
                        }
                      },
                      content: {
                        type: 'object',
                        properties: {
                          'zh-CN': { type: 'string' },
                          en: { type: 'string' }
                        }
                      },
                      publishDate: { type: 'string' },
                      readTime: { type: 'string' },
                      tags: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            '404': {
              description: '文章未找到',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: '服务器内部错误',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'projects',
        description: '项目相关接口'
      },
      {
        name: 'articles',
        description: '文章相关接口'
      }
    ]
  });
});

// 项目路由
app.get('/projects', async (c) => {
  try {
    const projectsData = await import('./data/projects.json');
    return c.json(projectsData.default);
  } catch (error) {
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// 挂载文章路由
app.route('/articles', articles);

// 健康检查端点
app.get('/', (c) => {
  return c.text('Hono API is alive!');
});

const port = 3001;
console.log(`Backend server is running on port ${port}`);
console.log(`Swagger UI available at: http://localhost:${port}/api/docs`);

serve({
  fetch: app.fetch,
  port,
});