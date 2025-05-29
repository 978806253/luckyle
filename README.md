<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>我的个人博客与作品集</title>
  <style>
    body {
      font-family: "Helvetica Neue", sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      background-color: #f9f9f9;
      color: #333;
    }
    header {
      background-color: #007acc;
      color: white;
      padding: 2rem 1rem;
      text-align: center;
    }
    nav a {
      color: white;
      margin: 0 1rem;
      text-decoration: none;
      font-weight: bold;
    }
    main {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    section {
      margin-bottom: 3rem;
    }
    h2 {
      color: #007acc;
      border-bottom: 2px solid #eee;
      padding-bottom: 0.3rem;
    }
    .project {
      background: white;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    footer {
      text-align: center;
      padding: 2rem;
      font-size: 0.9rem;
      background: #eee;
    }
  </style>
</head>
<body>
  <header>
    <h1>你好，我是你爹</h1>
    <p>这是我的个人博客与作品集</p>
    <nav>
      <a href="#blog">博客</a>
      <a href="#projects">作品集</a>
      <a href="#about">关于我</a>
    </nav>
  </header>

  <main>
    <section id="blog">
      <h2>📚 博客文章</h2>
      <ul>
        <li><a href="#">如何开始使用 GitHub Pages</a> - 2025-05-30</li>
        <li><a href="#">我的第一个博客文章</a> - 2025-05-29</li>
      </ul>
    </section>

    <section id="projects">
      <h2>🎨 作品展示</h2>
      <div class="project">
        <h3>个人网站</h3>
        <p>使用 HTML 和 CSS 制作的响应式网站。</p>
        <a href="#">查看项目</a>
      </div>
      <div class="project">
        <h3>Unity 小游戏</h3>
        <p>。</p>
        <a href="#">查看项目</a>
      </div>
    </section>

    <section id="about">
      <h2>👤 关于我</h2>
      <p>你好！我是XX，一名学习中的开发者，喜欢前端开发、游戏设计和写博客。欢迎联系我一起交流！</p>
      <p>📧 邮箱：978806253@qq.com</p>
    </section>
  </main>

  <footer>
    &copy; 2025 小明的个人网站
  </footer>
</body>
</html>
