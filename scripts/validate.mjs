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
