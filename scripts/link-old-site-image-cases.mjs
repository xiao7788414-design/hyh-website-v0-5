#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const csvPath = path.join(root, 'case-content-migration', 'old-site-image-cases.csv');
const lines = (await readFile(csvPath, 'utf8')).trim().split('\n');
const rows = lines.slice(1).map((line) => {
  const [requestedOrder, brand, slug, category, cardOrder, cardAsset, oldUrl, existingAnchor, targetUrl] = line.split(',');
  return { requestedOrder, brand, slug, category, cardOrder, cardAsset, oldUrl, existingAnchor, targetUrl };
});

function internalizeCard(html, item, prefix) {
  const escaped = item.oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<a class="legacy-case-item" href="${escaped}"([^>]*)>`);
  const match = html.match(pattern);
  if (!match) throw new Error(`Card link not found: ${item.brand}`);
  let attributes = match[1].replace(/\s+(?:rel|target)="[^"]*"/g, '');
  if (!/\sid="/.test(attributes)) attributes += ` id="case-${item.slug}"`;
  const linked = html.replace(pattern, `<a class="legacy-case-item" href="${prefix}${item.targetUrl}"${attributes}>`);
  const altPattern = new RegExp(`(<a class="legacy-case-item" href="${(prefix + item.targetUrl).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*><img alt=")[^"]+(" src="[^"]+"/><\\/a>)`);
  return linked.replace(altPattern, `$1${item.brand}案例$2`);
}

for (const [file, prefix] of [['cases.html', './'], ['en/cases.html', '../']]) {
  let html = await readFile(path.join(root, file), 'utf8');
  for (const item of rows) html = internalizeCard(html, item, prefix);
  await writeFile(path.join(root, file), html);
}

const homeLinks = new Map([
  ['https://www.huayuhua.com/index/Anli/show/catid/7/id/171.html', 'jianyi-tiles'],
  ['https://www.huayuhua.com/index/Anli/show/catid/7/id/173.html', 'sanjing-lanping'],
  ['https://www.huayuhua.com/index/Anli/show/catid/7/id/194.html', 'duke-culture'],
  ['https://www.huayuhua.com/index/Anli/show/catid/7/id/50.html', 'haodafu-online'],
  ['https://www.huayuhua.com/index/Anli/show/catid/7/id/63.html', 'yibai-pharma'],
  ['https://www.huayuhua.com/index/Anli/show/catid/7/id/64.html', 'tianqi-toothpaste'],
  ['https://www.huayuhua.com/index/Anli/show/catid/7/id/71.html', 'm-g-stationery'],
]);

for (const [file, prefix] of [['index.html', './'], ['en/index.html', '../']]) {
  let html = await readFile(path.join(root, file), 'utf8');
  for (const [oldUrl, slug] of homeLinks) {
    const pattern = new RegExp(`href="${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" rel="noopener" target="_blank"`);
    if (!pattern.test(html)) throw new Error(`Home link not found: ${file} ${oldUrl}`);
    html = html.replace(pattern, `href="${prefix}cases/${slug}.html"`);
  }
  await writeFile(path.join(root, file), html);
}

let cases = await readFile(path.join(root, 'cases.html'), 'utf8');
const awardPattern = /href="https:\/\/mp\.weixin\.qq\.com\/s\/5Jj9KoIbQuHP3ROMwKnb6Q" rel="noopener" target="_blank"/;
if (!awardPattern.test(cases)) throw new Error('Six-star award link not found');
cases = cases.replace(awardPattern, 'href="./cases/liukexing.html"');
await writeFile(path.join(root, 'cases.html'), cases);

const updated = [lines[0], ...lines.slice(1).map((line) => line.replace(/,待迁移$/, ',已生成并内链'))].join('\n') + '\n';
await writeFile(csvPath, updated);
