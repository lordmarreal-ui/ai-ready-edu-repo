# AI-Ready Education Repository Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-backend, 100% static educational repository with automated markdown validation and a vanilla HTML frontend.

**Architecture:** A static site generator built with vanilla Node.js (no dependencies) that validates markdown frontmatter and compiles an index.json catalog for a vanilla HTML/JS frontend to consume.

**Tech Stack:** Node.js (built-in modules only), Vanilla HTML/CSS/JS, marked.min.js (vendored).

---

### Task 1: Project Scaffolding & Initial Config

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialize package.json**
```json
{
  "name": "ai-ready-edu-repo",
  "version": "1.0.0",
  "description": "A static, AI-ready educational repository",
  "type": "module",
  "scripts": {
    "build": "node scripts/build-catalog.mjs",
    "validate": "node scripts/validate.mjs",
    "test": "echo \"No automated tests yet\""
  },
  "author": "",
  "license": "MIT"
}
```

- [ ] **Step 2: Create .gitignore**
```text
node_modules/
.DS_Store
content/index.json
```

- [ ] **Step 3: Commit**
```bash
git add package.json .gitignore
git commit -m "chore: initial project scaffolding"
```

### Task 2: Content Structure & Sample Lessons

**Files:**
- Create: `content/lessons/command-line-basics.md`
- Create: `content/lessons/git-recovery-basics.md`
- Create: `content/lessons/static-web-foundations.md`

- [ ] **Step 1: Create command-line-basics.md**
```markdown
---
title: "Command Line Basics"
slug: "command-line-basics"
summary: "Learn the fundamentals of the command line."
level: "Beginner"
tags: ["cli", "terminal", "basics"]
updated: "2026-06-04"
---

# Command Line Basics

Welcome to the command line.

## Navigation
Use `cd` to change directories and `ls` to list files.
```

- [ ] **Step 2: Create git-recovery-basics.md**
```markdown
---
title: "Git Recovery Basics"
slug: "git-recovery-basics"
summary: "How to recover lost commits and fix mistakes."
level: "Intermediate"
tags: ["git", "version-control"]
updated: "2026-06-04"
---

# Git Recovery Basics

Don't panic when you break Git.

## Reflog
Use `git reflog` to see a history of all actions.
```

- [ ] **Step 3: Create static-web-foundations.md**
```markdown
---
title: "Static Web Foundations"
slug: "static-web-foundations"
summary: "Core concepts of HTML, CSS, and JS."
level: "Beginner"
tags: ["html", "css", "js", "web"]
updated: "2026-06-04"
---

# Static Web Foundations

Building for the web without servers.

## HTML
The structure of your page.
```

- [ ] **Step 4: Commit**
```bash
git add content/lessons/
git commit -m "content: add sample lessons"
```

### Task 3: Content Validation Script

**Files:**
- Create: `scripts/validate.mjs`

- [ ] **Step 1: Write validate.mjs**
```javascript
import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content', 'lessons');

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  if (!content.trim()) {
    console.error(`Error: File is empty - ${fileName}`);
    return false;
  }

  const requiredFields = ['title:', 'slug:', 'summary:', 'level:', 'tags:', 'updated:'];
  let hasAllFields = true;
  
  for (const field of requiredFields) {
    if (!content.includes(field)) {
      console.error(`Error: Missing required frontmatter field '${field}' in ${fileName}`);
      hasAllFields = false;
    }
  }

  if (!content.includes('\n# ')) {
    console.error(`Error: Missing H1 heading ('# ') in ${fileName}`);
    return false;
  }

  return hasAllFields;
}

function main() {
  if (!fs.existsSync(contentDir)) {
    console.error(`Directory not found: ${contentDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  let allValid = true;
  const slugs = new Set();

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const slugMatch = content.match(/slug:\s*"([^"]+)"/);
    if (slugMatch) {
      const slug = slugMatch[1];
      if (slugs.has(slug)) {
         console.error(`Error: Duplicate slug '${slug}' found in ${file}`);
         allValid = false;
      }
      slugs.add(slug);
    }

    if (!validateFile(filePath)) {
      allValid = false;
    }
  }

  if (allValid) {
    console.log('All content validated successfully.');
    process.exit(0);
  } else {
    console.error('Validation failed.');
    process.exit(1);
  }
}

main();
```

- [ ] **Step 2: Run script to verify it passes**
Run: `npm run validate`
Expected: "All content validated successfully."

- [ ] **Step 3: Commit**
```bash
git add scripts/validate.mjs
git commit -m "build: add content validation script"
```

### Task 4: Catalog Builder Script

**Files:**
- Create: `scripts/build-catalog.mjs`

- [ ] **Step 1: Write build-catalog.mjs**
```javascript
import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content', 'lessons');
const outputFile = path.join(process.cwd(), 'content', 'index.json');

function extractFrontmatter(content) {
  const meta = {};
  const match = content.match(/---\n([\s\S]*?)\n---/);
  
  if (match) {
    const yaml = match[1];
    const lines = yaml.split('\n');
    for (const line of lines) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join(':').trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(s => {
             let v = s.trim();
             if(v.startsWith('"') && v.endsWith('"')) return v.slice(1,-1);
             return v;
          });
        }
        meta[key] = value;
      }
    }
  }
  return meta;
}

function main() {
  if (!fs.existsSync(contentDir)) {
    console.error(`Directory not found: ${contentDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const catalog = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = extractFrontmatter(content);
    
    catalog.push({
      id: meta.slug || file.replace('.md', ''),
      slug: meta.slug || file.replace('.md', ''),
      title: meta.title || 'Untitled',
      summary: meta.summary || '',
      level: meta.level || 'Unknown',
      tags: meta.tags || [],
      updated: meta.updated || new Date().toISOString().split('T')[0],
      path: `lessons/${file}`
    });
  }

  fs.writeFileSync(outputFile, JSON.stringify(catalog, null, 2));
  console.log(`Catalog built with ${catalog.length} items at ${outputFile}`);
}

main();
```

- [ ] **Step 2: Run script to verify it builds correctly**
Run: `npm run build`
Expected: "Catalog built with 3 items at ..."

- [ ] **Step 3: Commit**
```bash
git add scripts/build-catalog.mjs
git commit -m "build: add script to generate catalog index.json"
```

### Task 5: Vanilla Frontend

**Files:**
- Create: `site/index.html`
- Create: `site/style.css`
- Create: `site/script.js`

- [ ] **Step 1: Write index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI-Ready Edu Repo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>AI-Ready Edu Repo</h1>
        <div id="search-container">
            <input type="text" id="search-input" placeholder="Search lessons...">
        </div>
    </header>
    
    <main>
        <div id="catalog-view">
            <div id="lesson-list"></div>
        </div>
        
        <div id="detail-view" style="display: none;">
            <button id="back-btn">&larr; Back to Catalog</button>
            <div id="lesson-content"></div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write style.css**
```css
body {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
}

header {
    margin-bottom: 2rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
}

.lesson-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: background 0.2s;
}

.lesson-card:hover {
    background: #f9f9f9;
}

.lesson-card h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
}

.tags {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.tag {
    background: #eee;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
}

#search-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

#back-btn {
    background: none;
    border: none;
    color: #0066cc;
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
    margin-bottom: 1rem;
}
```

- [ ] **Step 3: Write script.js**
```javascript
let catalog = [];

async function init() {
    try {
        const response = await fetch('../content/index.json');
        catalog = await response.json();
        
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (slug) {
            showDetail(slug);
        } else {
            renderCatalog(catalog);
        }
        
        document.getElementById('search-input').addEventListener('input', handleSearch);
        document.getElementById('back-btn').addEventListener('click', () => {
            window.history.pushState({}, '', window.location.pathname);
            document.getElementById('detail-view').style.display = 'none';
            document.getElementById('catalog-view').style.display = 'block';
            renderCatalog(catalog);
        });
        
    } catch (e) {
        document.getElementById('lesson-list').innerHTML = '<p>Error loading catalog. Make sure you ran "npm run build" first.</p>';
    }
}

function renderCatalog(items) {
    const container = document.getElementById('lesson-list');
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<p>No lessons found.</p>';
        return;
    }
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'lesson-card';
        card.onclick = () => {
            window.history.pushState({}, '', `?slug=${item.slug}`);
            showDetail(item.slug);
        };
        
        const tagsHtml = item.tags.map(t => `<span class="tag">${t}</span>`).join('');
        
        card.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <div style="font-size: 0.8rem; color: #666;">Level: ${item.level} | Updated: ${item.updated}</div>
            <div class="tags">${tagsHtml}</div>
        `;
        container.appendChild(card);
    });
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    const filtered = catalog.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.summary.toLowerCase().includes(term) ||
        item.tags.some(t => t.toLowerCase().includes(term))
    );
    renderCatalog(filtered);
}

async function showDetail(slug) {
    document.getElementById('catalog-view').style.display = 'none';
    const detailView = document.getElementById('detail-view');
    const contentContainer = document.getElementById('lesson-content');
    
    detailView.style.display = 'block';
    contentContainer.innerHTML = '<p>Loading...</p>';
    
    const lesson = catalog.find(l => l.slug === slug);
    if (!lesson) {
        contentContainer.innerHTML = '<p>Lesson not found.</p>';
        return;
    }
    
    try {
        const response = await fetch(`../content/${lesson.path}`);
        let markdown = await response.text();
        
        markdown = markdown.replace(/---\n[\s\S]*?\n---/, '');
        
        contentContainer.innerHTML = marked.parse(markdown);
    } catch (e) {
        contentContainer.innerHTML = '<p>Error loading content.</p>';
    }
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 4: Commit**
```bash
git add site/
git commit -m "feat: add vanilla HTML frontend"
```

### Task 6: GitHub Actions & Governance Files

**Files:**
- Create: `.github/workflows/validate.yml`
- Create: `.github/workflows/pages.yml`
- Create: `AGENTS.md`
- Create: `schemas/lesson.schema.json`
- Create: `LICENSE`

- [ ] **Step 1: Write validate.yml**
```yaml
name: Validate Content

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run validate
```

- [ ] **Step 2: Write pages.yml**
```yaml
name: Deploy Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          publish_branch: gh-pages
```

- [ ] **Step 3: Write AGENTS.md**
```markdown
# Instructions for AI Agents

Welcome, AI Agent! If you are modifying this repository, strictly adhere to these rules:

1. **Read First**: Always read the README.md, ROADMAP.md, and CONTRIBUTING.md before taking action.
2. **Zero-Backend**: Do not add backends, runtimes, auto-grading execution, or user auth. This is a 100% static repo.
3. **Add Content Safely**: Only add educational material as Markdown inside `content/lessons/`.
4. **Required Frontmatter**: All new files must contain complete YAML frontmatter (title, slug, summary, level, tags, updated).
5. **Validation Rule**: You MUST run `npm run validate` before committing any changes. Fix any failures.
6. **No External Logic**: Do not add dependencies to package.json.
```

- [ ] **Step 4: Write schemas/lesson.schema.json**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Lesson Frontmatter Schema",
  "type": "object",
  "required": ["title", "slug", "summary", "level", "tags", "updated"],
  "properties": {
    "title": { "type": "string" },
    "slug": { "type": "string" },
    "summary": { "type": "string" },
    "level": { "type": "string", "enum": ["Beginner", "Intermediate", "Advanced"] },
    "tags": { "type": "array", "items": { "type": "string" } },
    "updated": { "type": "string", "format": "date" }
  }
}
```

- [ ] **Step 5: Write LICENSE**
```text
MIT License

Copyright (c) 2026 lordmarreal-ui

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 6: Commit**
```bash
git add .github/ AGENTS.md schemas/ LICENSE
git commit -m "ci: add workflows and AI governance docs"
```

### Task 7: Repo Creation and Push

- [ ] **Step 1: Create repo via GitHub CLI and push**
```bash
gh repo create ai-ready-edu-repo --public --source=. --remote=origin --push
```
