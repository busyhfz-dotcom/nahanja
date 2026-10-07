import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../public/nahanja-preview.html', import.meta.url), 'utf8');
let checked = 0;
for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
  if (!match[1].trim()) continue;
  new vm.Script(match[1], { filename: `nahanja-inline-${++checked}.js` });
}
if (!checked) throw new Error('No inline application script found');
console.log(`Checked ${checked} inline scripts`);
