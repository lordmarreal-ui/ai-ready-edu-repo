import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content', 'lessons');

function validateFile(fileName, content, slugs) {
  if (!content.trim()) {
    console.error(`Error: File is empty - ${fileName}`);
    return false;
  }

  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';

  const requiredFields = ['title', 'slug', 'summary', 'level', 'tags', 'updated'];
  let isValid = true;

  for (const field of requiredFields) {
    const fieldRegex = new RegExp(`^${field}:`, 'm');
    if (!fieldRegex.test(frontmatter)) {
      console.error(`Error: Missing required frontmatter field '${field}:' in ${fileName}`);
      isValid = false;
    }
  }

  const slugMatch = frontmatter.match(/^slug:\s*"([^"]+)"/m) || frontmatter.match(/^slug:\s*'?([^"'\s]+)'?/m);
  if (slugMatch) {
    const slug = slugMatch[1];
    if (slugs.has(slug)) {
       console.error(`Error: Duplicate slug '${slug}' found in ${fileName}`);
       isValid = false;
    }
    slugs.add(slug);
  }

  if (!content.includes('\n# ') && !content.startsWith('# ')) {
    console.error(`Error: Missing H1 heading ('# ') in ${fileName}`);
    isValid = false;
  }

  return isValid;
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

    if (!validateFile(file, content, slugs)) {
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
