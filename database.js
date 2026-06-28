// database.js — 数据库管家，负责存取文章
const Database = require('better-sqlite3');
const path = require('path');

// 数据库文件存在 data 文件夹里
const db = new Database(path.join(__dirname, 'data', 'blog.db'));

// 启动时自动建表（如果没有的话）
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

// ===== 数据库操作函数 =====

// 📝 新建文章
function createArticle(title, content, tags = '') {
  const stmt = db.prepare('INSERT INTO articles (title, content, tags) VALUES (?, ?, ?)');
  const result = stmt.run(title, content, tags);
  return { id: result.lastInsertRowid, title, tags };
}

// 📖 获取全部文章（按时间倒序，新→旧）
function getAllArticles() {
  return db.prepare('SELECT id, title, tags, created_at, updated_at FROM articles ORDER BY created_at DESC').all();
}

// 🔍 获取一篇文章的完整内容
function getArticle(id) {
  return db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
}

// ✏️ 更新文章
function updateArticle(id, title, content, tags) {
  const stmt = db.prepare('UPDATE articles SET title = ?, content = ?, tags = ?, updated_at = datetime("now") WHERE id = ?');
  return stmt.run(title, content, tags, id);
}

// 🗑️ 删除文章
function deleteArticle(id) {
  return db.prepare('DELETE FROM articles WHERE id = ?').run(id);
}

module.exports = { createArticle, getAllArticles, getArticle, updateArticle, deleteArticle };
