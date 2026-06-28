// script.js — 前端大脑，负责和服务器对话、更新页面

// ===== 页面元素 =====
const articleList = document.getElementById('articleList');
const articleDetail = document.getElementById('articleDetail');
const detailContent = document.getElementById('detailContent');
const editor = document.getElementById('editor');
const articlesDiv = document.getElementById('articles');

// ===== 页面加载时获取所有文章 =====
loadArticles();

function loadArticles() {
  fetch('/api/articles')
    .then(res => res.json())
    .then(articles => {
      if (articles.length === 0) {
        articlesDiv.innerHTML = '<div class="empty"><span>📭</span>还没有文章，点击上方按钮写第一篇吧！</div>';
        return;
      }
      articlesDiv.innerHTML = articles.map(a => `
        <div class="article-card" onclick="viewArticle(${a.id})">
          <h3>${escapeHtml(a.title)}</h3>
          <div class="meta">
            <span>${a.created_at}</span>
            <div class="tags">${(a.tags || '').split(',').filter(t => t).map(t => `<span class="tag">${escapeHtml(t.trim())}</span>`).join('')}</div>
          </div>
        </div>
      `).join('');
    });
}

// ===== 查看文章详情 =====
function viewArticle(id) {
  fetch(`/api/articles/${id}`)
    .then(res => res.json())
    .then(article => {
      articleList.style.display = 'none';
      editor.style.display = 'none';
      articleDetail.style.display = 'block';
      detailContent.innerHTML = `
        <h1>${escapeHtml(article.title)}</h1>
        <div class="meta">
          <span>📅 ${article.created_at}</span>
          ${article.updated_at !== article.created_at ? `<span>（修改于 ${article.updated_at}）</span>` : ''}
          ${article.tags ? `<div class="tags" style="margin-top:6px;">${article.tags.split(',').filter(t => t).map(t => `<span class="tag">${escapeHtml(t.trim())}</span>`).join('')}</div>` : ''}
        </div>
        <div class="body">${escapeHtml(article.content)}</div>
        <div class="detail-actions">
          <button class="edit-btn" onclick="editArticle(${article.id})">✏️ 编辑</button>
          <button class="delete-btn" onclick="deleteArticle(${article.id})">🗑️ 删除</button>
        </div>
      `;
    });
}

// ===== 返回列表 =====
document.getElementById('backBtn').addEventListener('click', () => {
  articleDetail.style.display = 'none';
  editor.style.display = 'none';
  articleList.style.display = 'block';
  loadArticles();
});

// ===== 打开新建编辑器 =====
document.getElementById('newArticleBtn').addEventListener('click', () => {
  openEditor();
});

function openEditor(id = null, title = '', content = '', tags = '') {
  articleList.style.display = 'none';
  articleDetail.style.display = 'none';
  editor.style.display = 'block';
  document.getElementById('editId').value = id || '';
  document.getElementById('titleInput').value = title;
  document.getElementById('contentInput').value = content;
  document.getElementById('tagsInput').value = tags;
  document.getElementById('editorTitle').textContent = id ? '编辑文章' : '写新文章';
}

// ===== 编辑文章 =====
function editArticle(id) {
  fetch(`/api/articles/${id}`)
    .then(res => res.json())
    .then(article => {
      openEditor(article.id, article.title, article.content, article.tags);
    });
}

// ===== 保存文章 =====
document.getElementById('saveBtn').addEventListener('click', () => {
  const id = document.getElementById('editId').value;
  const title = document.getElementById('titleInput').value.trim();
  const content = document.getElementById('contentInput').value.trim();
  const tags = document.getElementById('tagsInput').value.trim();

  if (!title || !content) {
    alert('标题和内容不能为空哦～');
    return;
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/articles/${id}` : '/api/articles';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, tags }),
  })
    .then(res => res.json())
    .then(() => {
      articleDetail.style.display = 'none';
      editor.style.display = 'none';
      articleList.style.display = 'block';
      loadArticles();
    });
});

// ===== 取消 =====
document.getElementById('cancelBtn').addEventListener('click', () => {
  articleDetail.style.display = 'none';
  editor.style.display = 'none';
  articleList.style.display = 'block';
});

// ===== 删除文章 =====
function deleteArticle(id) {
  if (!confirm('确定要删除这篇文章吗？')) return;

  fetch(`/api/articles/${id}`, { method: 'DELETE' })
    .then(() => {
      articleDetail.style.display = 'none';
      articleList.style.display = 'block';
      loadArticles();
    });
}

// ===== 安全显示文本（防 XSS） =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
