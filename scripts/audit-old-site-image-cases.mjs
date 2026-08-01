#!/usr/bin/env node

import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());
const csv = await readFile(path.join(root, 'case-content-migration', 'old-site-image-cases.csv'), 'utf8');
const rows = csv.trim().split('\n').slice(1).map((line) => {
  const [requestedOrder, brand, slug, category, cardOrder, cardAsset, oldUrl, existingAnchor, targetUrl, expectedCount] = line.split(',');
  return { requestedOrder, brand, slug, category, cardOrder, cardAsset, oldUrl, existingAnchor, targetUrl, expectedCount: Number(expectedCount) };
});
const cases = await readFile(path.join(root, 'cases.html'), 'utf8');
const enCases = await readFile(path.join(root, 'en', 'cases.html'), 'utf8');
const index = await readFile(path.join(root, 'index.html'), 'utf8');
const enIndex = await readFile(path.join(root, 'en', 'index.html'), 'utf8');
const failures = [];

const expect = (condition, message) => { if (!condition) failures.push(message); };

for (const item of rows) {
  const anchor = item.existingAnchor || `case-${item.slug}`;
  expect(cases.includes(`href="./${item.targetUrl}"`) && cases.includes(`id="${anchor}"`), `${item.brand}: Chinese card link or anchor missing`);
  expect(enCases.includes(`href="../${item.targetUrl}"`) && enCases.includes(`id="${anchor}"`), `${item.brand}: English card link or anchor missing`);
  expect(!cases.includes(item.oldUrl) && !enCases.includes(item.oldUrl), `${item.brand}: old URL remains`);

  const pagePath = path.join(root, item.targetUrl);
  try {
    await access(pagePath);
    const page = await readFile(pagePath, 'utf8');
    expect(page.includes(`<title>${item.brand}案例 | 华与华</title>`), `${item.brand}: title mismatch`);
    expect(page.includes(`case-detail-kicker">${item.category.replaceAll('&', '&amp;')} · 品牌案例`), `${item.brand}: category mismatch`);
    expect(page.includes(`href="../cases.html#${anchor}"`), `${item.brand}: return anchor mismatch`);
    expect(!page.includes('资料来源与边界'), `${item.brand}: forbidden source-boundary section present`);
    expect(page.includes(`src="../${item.cardAsset}"`), `${item.brand}: card hero mismatch`);
    const imageRefs = [...page.matchAll(new RegExp(`src="../assets/case-details/${item.slug}/([^"]+)"`, 'g'))].map((match) => match[1]);
    expect(imageRefs.length === item.expectedCount, `${item.brand}: expected ${item.expectedCount} body images, got ${imageRefs.length}`);
    for (const file of imageRefs) await access(path.join(root, 'assets', 'case-details', item.slug, file));
    const diskImages = await readdir(path.join(root, 'assets', 'case-details', item.slug));
    expect(diskImages.length === item.expectedCount, `${item.brand}: unexpected asset file count ${diskImages.length}`);
  } catch (error) {
    failures.push(`${item.brand}: ${error.message}`);
  }
}

const homepageSlugs = ['jianyi-tiles', 'sanjing-lanping', 'duke-culture', 'haodafu-online', 'yibai-pharma', 'tianqi-toothpaste', 'm-g-stationery'];
for (const slug of homepageSlugs) {
  expect(index.includes(`href="./cases/${slug}.html"`), `${slug}: Chinese homepage link missing`);
  expect(enIndex.includes(`href="../cases/${slug}.html"`), `${slug}: English homepage link missing`);
}
expect(cases.includes('class="million-award-card" href="./cases/liukexing.html"'), 'Six-star award link missing');
expect(cases.includes('https://www.huayuhua.com/index/Anli/show/catid/35/id/216.html'), 'Excluded Silian link should remain unchanged');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`PASS ${root}: ${rows.length} cases, ${rows.reduce((sum, item) => sum + item.expectedCount, 0)} body images`);
