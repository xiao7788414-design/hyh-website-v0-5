# 官网业务合作表单部署说明

## 邮件链路

表单通过同站点的 `POST /api/contact` 接口提交。服务器完成字段校验、提交频率限制和附件校验后，使用企业邮箱 SMTP 发送结构化邮件到业务邮箱，并在 `data/contact-submissions.jsonl` 留存简要发送记录。

IMAP 用于读取邮箱，当前表单只负责发信，因此不使用 `imap.exmail.qq.com:993`。

## 服务器环境变量

复制 `.env.example` 中的变量到部署平台的服务器环境变量设置中。不要把真实邮箱客户端专用密码写进网页、代码仓库或 `.env.example`。

- `SMTP_HOST`: `smtp.exmail.qq.com`
- `SMTP_PORT`: `465`
- `SMTP_USER`: 用于发信的企业邮箱账号
- `SMTP_PASS`: 该账号的客户端专用密码或授权码
- `MAIL_FROM`: 发件人，应与 SMTP 账号一致
- `MAIL_TO`: 接收业务合作邮件的公司邮箱
- `SITE_ORIGIN`: 正式官网完整来源，例如 `https://www.huayuhua.com`
- `TRUST_PROXY`: 仅当部署平台明确通过反向代理转发访问时设为 `true`

端口 465 使用 SSL 直连。部署时必须使用支持常驻 Node.js 服务和持久化日志目录的运行环境。

## 本地验证

安装依赖后运行 `npm run dev`。开发模式会完整校验和记录提交，但不会发送真实邮件。正式环境使用 `npm start`，并确保 `CONTACT_DRY_RUN=false`。

如需在本机验证真实收件，创建被 `.gitignore` 排除的 `.env` 文件，填写真实的 `SMTP_USER`、`SMTP_PASS`、`MAIL_FROM` 和 `MAIL_TO`，再运行 `npm run start:email`。测试模式的前端提示会明确显示“信息已记录，但邮件没有发送”，避免将本地记录误判为真实发信成功。

附件限制为 10MB，支持 PDF、Office 文档、ZIP/RAR/7Z 压缩包和 JPG/PNG 图片。附件不落本地文件系统，验证通过后直接作为邮件附件发送。
