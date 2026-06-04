# 🎓 AI-Ready Educational Repository

![Status](https://img.shields.io/badge/Status-Active-success)
![Architecture](https://img.shields.io/badge/Architecture-100%25_Static-blue)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla_HTML-orange)

A zero-backend, 100% static educational platform designed from the ground up to be seamlessly interoperable with AI agents.

## 🏗️ Architecture

This project strictly adheres to a **Data-First, Zero-Backend** philosophy.
- **100% Static:** No active servers, databases, or runtime backend dependencies.
- **Vanilla HTML Frontend:** Pure HTML/CSS/JS without heavy frameworks to ensure blazing fast delivery and minimal complexity.
- **Data-First:** Content acts as the database. Markdown files dictate the platform's state.

## 🚀 How to Run Locally

Get the platform up and running in seconds.

```bash
# 1. Install dependencies
npm ci

# 2. Validate the markdown content against the schemas
npm run validate

# 3. Build the static site
npm run build
```

## 📝 Adding New Lessons

Lessons are authored in Markdown with strict Frontmatter validation. 

### Frontmatter Schema

Include the following YAML frontmatter at the top of any new lesson file:

```yaml
---
title: "Introduction to Agents"
description: "A brief overview of agentic AI frameworks."
author: "Educator Name"
date: "2026-06-04"
tags: [ai, beginner, agents]
difficulty: "Beginner"
---
```

## 🤖 AI-Ready Nature

This repository isn't just readable by humans; it's optimized for LLMs and autonomous agents.

| Feature | Description |
|---------|-------------|
| **`AGENTS.md`** | Dedicated instruction manual for AI agents operating within this repository. |
| **JSON Schema** | Enforces strict validation of all metadata, ensuring AI agents can confidently parse and manipulate lesson data. |
| **Markdown Source** | All content is plain text, the native language of language models. |

## ⚙️ CI/CD: GitHub Actions

We use GitHub Actions to enforce quality and automate deployments.

1. **Linting & Validation:** Every PR triggers a workflow that runs `npm run validate` to ensure frontmatter and markdown structure adhere to our JSON schema.
2. **Build Test:** Runs `npm run build` to verify the static site generates without errors.
3. **Deployment:** On merge to `main`, the CI automatically deploys the built static assets to GitHub Pages.

## 📂 Project Structure

```text
ai-ready-edu-repo/
├── .github/
│   └── workflows/
│       └── ci.yml
├── content/
│   └── lessons/         # Markdown lesson files
├── src/
│   ├── index.html       # Vanilla HTML frontend
│   ├── css/
│   └── js/
├── schemas/
│   └── lesson.json      # JSON Schema for lessons
├── AGENTS.md            # Instructions for AI assistants
├── README.md            # This file
└── package.json
```
