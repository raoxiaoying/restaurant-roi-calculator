import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');

if (!existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Please run "npm run build:gh-pages" first.');
  process.exit(1);
}

const indexHtmlPath = join(distDir, 'index.html');
const fourOhFourHtmlPath = join(distDir, '404.html');

if (existsSync(indexHtmlPath)) {
  const indexContent = readFileSync(indexHtmlPath, 'utf-8');
  writeFileSync(fourOhFourHtmlPath, indexContent);
  console.log('Created 404.html from index.html');
}

execSync('git checkout --orphan gh-pages', { stdio: 'inherit' });
execSync('git rm -rf .', { stdio: 'inherit' });
execSync('cp -r dist/. .', { stdio: 'inherit' });
execSync('git add -A', { stdio: 'inherit' });
execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
execSync('git push origin gh-pages --force', { stdio: 'inherit' });
execSync('git checkout main', { stdio: 'inherit' });
execSync('git branch -D gh-pages', { stdio: 'inherit' });

console.log('Deployment to GitHub Pages completed successfully!');
