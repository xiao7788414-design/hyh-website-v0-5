#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const csvPath = path.join(root, 'case-content-migration', 'old-site-image-cases.csv');
const rows = (await readFile(csvPath, 'utf8')).trim().split('\n').slice(1).map((line) => {
  const [requestedOrder, brand, slug, category, cardOrder, cardAsset, oldUrl, existingAnchor, targetUrl, expectedCount] = line.split(',');
  return { requestedOrder, brand, slug, category, cardOrder, cardAsset, oldUrl, existingAnchor, targetUrl, expectedCount: Number(expectedCount) };
});

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function contentImages(html, oldUrl) {
  const match = html.match(/<div class="man_case_art">([\s\S]*?)<\/div>/i);
  if (!match) throw new Error(`Missing man_case_art: ${oldUrl}`);
  const urls = [...match[1].matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((item) => new URL(item[1], oldUrl).href);
  return urls.filter((url, index) => urls.indexOf(url) === index);
}

function pageHtml(item, images) {
  const brand = escapeHtml(item.brand);
  const category = escapeHtml(item.category);
  const figures = images.map((file, index) => `<figure><img alt="${brand}案例视觉资料 ${index + 1}" decoding="async"${index === 0 ? '' : ' loading="lazy"'} src="../assets/case-details/${item.slug}/${file}"/></figure>`).join('\n');
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta content="${brand}案例视觉资料，按华与华旧官网原始顺序整理。" name="description"/>
<title>${brand}案例 | 华与华</title>
<link href="../styles.css" rel="stylesheet"/>
</head>
<body class="case-detail-page">
<header class="topbar">
<a aria-label="华与华首页" class="brand" href="../index.html"><img alt="华与华" src="../assets/logo-white.png"/></a>
<button aria-expanded="false" aria-label="打开导航" class="menu-button" type="button"><span></span><span></span></button>
<nav aria-label="主导航" class="nav">
<a href="../index.html">首页</a><a href="../method.html">华与华方法</a><a aria-current="page" href="../cases.html">案例</a><a href="https://ai.huayuhua.com/app/web/home" rel="noopener" target="_blank">AI 智能体</a><a href="../business-school.html">华与华商学</a><a href="../about.html">关于我们</a><a class="nav-cta" href="../contact.html">联系我们</a><span aria-label="社交媒体" class="social-nav"><a aria-label="查看英文案例列表" class="language-switch" href="../en/cases.html" title="English">EN</a><a aria-label="微博" class="social-link" href="https://weibo.com/huashan2009" rel="noopener" target="_blank" title="微博"><img alt="" src="../assets/social-weibo.png"/></a><a aria-label="微信" class="social-link" href="https://www.huayuhua.com/uploads/images/20221212/1670791740107893.png" rel="noopener" target="_blank" title="微信"><img alt="" src="../assets/social-wechat.png"/></a><a aria-label="抖音" class="social-link" href="../assets/founder-qr-douyin-huashan.jpg" rel="noopener" target="_blank" title="抖音"><img alt="" src="../assets/social-douyin.png"/></a></span>
</nav>
</header>
<main class="case-detail-main case-longform-main">
<div class="case-detail-shell case-longform-shell">
<a class="case-detail-back" href="../cases.html#${item.existingAnchor || `case-${item.slug}`}">返回案例列表</a>
<article class="case-longform">
<header class="case-detail-hero case-longform-hero">
<div class="case-detail-hero-copy"><p class="case-detail-kicker">${category} · 品牌案例</p><h1>${brand}</h1><p class="case-detail-summary">按原始顺序呈现${brand}案例视觉资料。</p></div>
<div class="case-detail-hero-media"><img alt="${brand}案例主视觉" src="../${item.cardAsset}"/></div>
</header>
<div class="case-article-body">
<section class="case-article-fragment">
<h2>案例视觉资料</h2>
<div class="case-article-images case-image-sequence">
${figures}
</div>
</section>
</div>
</article>
</div>
</main>
<footer class="footer site-footer">
<div class="footer-top"><div class="footer-contact-line"><a class="footer-phone" href="tel:02152360827">021-52360827</a><span aria-hidden="true" class="footer-divider"></span><div class="footer-address"><p>上海市普陀区中山北路3300号环球港A座31-32楼</p><p>联系我们：<a href="mailto:hyh@huayuhua.com">hyh@huayuhua.com</a><a class="footer-more" href="../contact.html">了解更多 &gt;</a></p></div></div><a class="footer-principle" href="../contact.html#business">不投标 不比稿</a></div>
<div class="footer-bottom"><div class="footer-brand-area"><a aria-label="华与华首页" class="footer-mark" href="../index.html"><img alt="华与华" class="footer-logo" src="../assets/footer-gf.png"/></a><nav aria-label="底部导航" class="footer-nav"><a href="../about.html">关于我们</a><a href="../cases.html">华与华案例</a><a href="../contact.html">联系我们</a><a href="../method.html">华与华方法</a><a href="https://ai.huayuhua.com/app/web/home" rel="noopener" target="_blank">华与华AI智能体</a><a href="../about.html#founders">华与华创始人</a></nav></div><div class="footer-meta"><div class="footer-legal"><strong>021-52360827</strong><span>2026华与华版权所有</span><span class="footer-record"><a href="https://beian.miit.gov.cn/#/Integrated/index" rel="noopener" target="_blank">备案号：沪ICP备09060630号-1</a></span></div><figure class="footer-qr"><img alt="华与华公众号二维码" src="../assets/footer-wechat-qr.png"/><figcaption>华与华公众号</figcaption></figure></div></div>
</footer>
<script src="../script.js"></script>
</body>
</html>
`;
}

for (const item of rows) {
  const response = await fetch(item.oldUrl);
  if (!response.ok) throw new Error(`${response.status} ${item.oldUrl}`);
  const html = await response.text();
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  if (title !== item.brand) throw new Error(`Title mismatch: expected ${item.brand}, got ${title}`);
  const urls = contentImages(html, item.oldUrl);
  if (urls.length !== item.expectedCount) throw new Error(`Image count mismatch for ${item.brand}: expected ${item.expectedCount}, got ${urls.length}`);

  const assetDir = path.join(root, 'assets', 'case-details', item.slug);
  await mkdir(assetDir, { recursive: true });
  const files = [];
  for (let index = 0; index < urls.length; index += 1) {
    const url = urls[index];
    const extension = path.extname(new URL(url).pathname).toLowerCase() || '.jpg';
    const file = `${String(index + 1).padStart(2, '0')}${extension}`;
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) throw new Error(`${imageResponse.status} ${url}`);
    await writeFile(path.join(assetDir, file), Buffer.from(await imageResponse.arrayBuffer()));
    files.push(file);
  }
  await mkdir(path.join(root, 'cases'), { recursive: true });
  await writeFile(path.join(root, item.targetUrl), pageHtml(item, files));
  process.stdout.write(`${item.requestedOrder}\t${item.brand}\t${files.length}\n`);
}
