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