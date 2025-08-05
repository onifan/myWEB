import { Hono } from 'hono';
import projectsData from '../data/projects.json';

const projects = new Hono();

// 获取所有项目
projects.get('/', (c) => {
  return c.json(projectsData);
});

export default projects;