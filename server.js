// server.js — 博客的大脑
const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// 1. 解析前端发来的 JSON 数据
app.use(express.json());

// 2. 前端页面放在 public 文件夹，直接提供
app.use(express.static(path.join(__dirname, 'public')));

// 🏷️ 版本信息
app.get('/api/version', (req, res) => {
  res.json({ version: '0.1.0', name: '茗的博客' });
});

// ====== 文章 API ======

// 📖 获取所有文章列表
app.get('/api/articles', (req, res) => {
  const articles = db.getAllArticles();
  res.json(articles);
});

// 🔍 获取单篇文章详情
app.get('/api/articles/:id', (req, res) => {
  const article = db.getArticle(req.params.id);
  if (!article) return res.status(404).json({ error: '文章不存在' });
  res.json(article);
});

// 📝 新建文章
app.post('/api/articles', (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) return res.status(400).json({ error: '标题和内容不能为空' });
  const article = db.createArticle(title, content, tags || '');
  res.status(201).json(article);
});

// ✏️ 更新文章
app.put('/api/articles/:id', (req, res) => {
  const { title, content, tags } = req.body;
  const result = db.updateArticle(req.params.id, title, content, tags || '');
  if (result.changes === 0) return res.status(404).json({ error: '文章不存在' });
  res.json({ message: '更新成功' });
});

// 🗑️ 删除文章
app.delete('/api/articles/:id', (req, res) => {
  const result = db.deleteArticle(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: '文章不存在' });
  res.json({ message: '删除成功' });
});

app.listen(PORT, () => {
  console.log(`🚀 博客服务器已启动：http://localhost:${PORT}`);
});
