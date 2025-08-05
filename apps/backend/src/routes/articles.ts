import { Hono } from 'hono';
import articlesData from '../data/articles.json';

const articles = new Hono();

// 获取所有文章
articles.get('/', (c) => {
  return c.json(articlesData);
});

// 获取单篇文章
articles.get('/:slug', (c) => {
  const slug = c.req.param('slug');
  const article = articlesData.find(article => article.slug === slug);
  
  if (!article) {
    return c.json({ error: 'Article not found' }, 404);
  }
  
  return c.json(article);
});

export default articles; 