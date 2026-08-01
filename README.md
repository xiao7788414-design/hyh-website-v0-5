# 华与华官网重设计测试站

本仓库用于华与华官网重设计版本的公开页面测试，包含中文站、英文站、英文 NEWS 与正式网页素材。

## 本地运行

静态页面可直接通过本地 Web 服务器预览。联系表单的邮件发送功能需要 Node.js 服务和服务器端环境变量，真实 `.env` 不会提交到本仓库。

## GitHub Pages 限制

GitHub Pages 仅托管静态文件，不能运行 `server.js`，因此页面可以测试，但邮件表单后端不会在 Pages 环境中工作。完整上线需按照 `DEPLOYMENT.md` 在支持 Node.js 的服务器部署。

## 安全

请勿向公开仓库提交 `.env`、SMTP 授权码、`data/contact-submissions.jsonl`、运行日志或其他用户提交数据。
