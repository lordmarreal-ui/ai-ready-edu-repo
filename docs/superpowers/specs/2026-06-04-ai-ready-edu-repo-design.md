# AI-Ready Education Repository Design Spec

## Overview
A static, zero-backend, low-maintenance educational template designed to be easily editable by both human contributors and AI agents. Content lives as Markdown with frontmatter, auto-validated, and served via GitHub Pages.

## Architecture
- **Zero-Backend:** 100% static site.
- **Data-First:** Content is written in Markdown files with YAML frontmatter located in content/lessons/.
- **Zero-Dependency Build:** Node.js ESM scripts (scripts/validate.mjs, scripts/build-catalog.mjs) use only built-in modules to validate content and generate a static content/index.json.
- **Vanilla Frontend:** site/ contains plain HTML, CSS, and JS without bundlers. It fetches ../content/index.json to render the catalog.
- **Markdown Rendering:** Uses a local copy of marked.min.js in site/lib/ to render Markdown offline.

## System Components
1. **Content Engine:**
   - Markdown files in content/lessons/.
   - scripts/validate.mjs: Checks frontmatter, slug uniqueness, H1 presence, valid internal links.
   - scripts/build-catalog.mjs: Generates content/index.json.

2. **Frontend (site/):**
   - index.html: Catalog view with search and tag filtering.
   - Detail view via URL parameter parsing the target Markdown file.

3. **AI Integration:**
   - AGENTS.md: Explicit rules for AI agents.
   - prompts/: Standard prompts.
   - schemas/lesson.schema.json: JSON schema for the frontmatter.

4. **Governance & CI/CD:**
   - CONTRIBUTING.md, SECURITY.md, ROADMAP.md.
   - GitHub Issue & PR templates.
   - GitHub Actions: validate.yml and pages.yml.
   - License: MIT.

## Scope Limits
- No dynamic backends, auto-grading, or user authentication.
- Single root folder for lessons.
- Simple YAML parsing without heavy external libraries.
