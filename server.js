"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");

const app = express();
const rootDir = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const dryRun = process.env.CONTACT_DRY_RUN === "true";
const maxFileSize = 10 * 1024 * 1024;
const allowedExtensions = new Set([
  ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx",
  ".zip", ".rar", ".7z", ".jpg", ".jpeg", ".png"
]);
const allowedRevenue = new Set([
  "1亿以下", "1-5亿", "5-10亿", "10-25亿", "25-50亿", "50-100亿", "100亿以上"
]);
const allowedChannels = new Set([
  "机场广告", "杂志广告", "网络搜索", "书籍", "得到课程", "抖音", "朋友推荐", "案例", "其他"
]);
const attempts = new Map();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: maxFileSize, fields: 20, fieldSize: 16 * 1024 },
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowed = allowedExtensions.has(extension);
    callback(isAllowed ? null : new Error("UNSUPPORTED_FILE"), isAllowed);
  }
});

app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);
app.use((request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "SAMEORIGIN");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  const requestPath = request.path.toLowerCase();
  const privateFiles = new Set([
    "/server.js", "/package.json", "/package-lock.json",
    "/contact_form_setup.md", "/deployment.md"
  ]);
  const privateDirectories = ["/data/", "/node_modules/", "/tools/"];
  if (
    privateFiles.has(requestPath) ||
    privateDirectories.some((prefix) => requestPath.startsWith(prefix)) ||
    requestPath.split("/").some((part) => part.startsWith("."))
  ) {
    return response.status(404).type("text/plain").send("页面不存在");
  }
  return next();
});
app.use(express.static(rootDir, { extensions: ["html"], index: "index.html" }));

function cleanLine(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function safeFileName(file) {
  return file
    ? path.basename(file.originalname).replace(/[\u0000-\u001f\u007f]+/g, "_").slice(0, 180)
    : null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clientIp(request) {
  return cleanLine(request.ip || request.socket.remoteAddress, 80);
}

function isRateLimited(ip) {
  const now = Date.now();
  const windowStart = now - 60 * 60 * 1000;
  const recent = (attempts.get(ip) || []).filter((time) => time > windowStart);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > 5;
}

function validateOrigin(request) {
  const configuredOrigin = cleanLine(process.env.SITE_ORIGIN, 300);
  if (!configuredOrigin) return true;
  const origin = cleanLine(request.get("origin"), 300);
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(configuredOrigin).origin;
  } catch {
    return false;
  }
}

function validateSubmission(body, isEnglish = false) {
  const data = {
    name: cleanLine(body.lianxiren, 50),
    phone: cleanLine(body.tel, 30),
    title: cleanLine(body.bumen, 80),
    company: cleanLine(body.gongsi, 120),
    industry: cleanLine(body.hy, 80),
    mainBusiness: cleanLine(body.zyyw, 200),
    revenue: cleanLine(body.qyys, 30),
    channel: cleanLine(body.fangshi_type, 30),
    need: cleanText(body.content, 4000)
  };

  if (Object.values(data).some((value) => !value)) {
    return { error: isEnglish ? "Please complete all required fields." : "请完整填写所有必填信息。" };
  }
  if (!/^[0-9+()\-\s]{6,30}$/.test(data.phone)) {
    return { error: isEnglish ? "Please enter a valid telephone number." : "请填写有效的联系电话。" };
  }
  if (!allowedRevenue.has(data.revenue) || !allowedChannels.has(data.channel)) {
    return { error: isEnglish ? "A form option is invalid. Please refresh the page and try again." : "表单选项无效，请刷新页面后重试。" };
  }
  return { data };
}

function buildMail(data, submissionId, file) {
  const rows = [
    ["提交编号", submissionId],
    ["企业名称", data.company],
    ["姓名", data.name],
    ["手机", data.phone],
    ["职务", data.title],
    ["行业", data.industry],
    ["主营业务", data.mainBusiness],
    ["企业营收", data.revenue],
    ["了解渠道", data.channel],
    ["合作诉求", data.need],
    ["附件", safeFileName(file) || "无"]
  ];
  const subject = `[官网业务合作] ${data.company} / ${data.name} / ${data.industry}`;
  const text = rows.map(([label, value]) => `${label}：${value}`).join("\n\n");
  const htmlRows = rows.map(([label, value]) => (
    `<tr><th style="width:110px;padding:10px 12px;text-align:left;vertical-align:top;background:#f5f5f7;border:1px solid #ddd">${escapeHtml(label)}</th>` +
    `<td style="padding:10px 12px;white-space:pre-wrap;border:1px solid #ddd">${escapeHtml(value)}</td></tr>`
  )).join("");

  return {
    subject,
    text,
    html: `<h2 style="margin:0 0 18px">官网业务合作咨询</h2><table style="width:100%;max-width:760px;border-collapse:collapse;font-family:Arial,'PingFang SC',sans-serif">${htmlRows}</table>`
  };
}

async function appendSubmissionLog(record) {
  const dataDir = path.join(rootDir, "data");
  await fs.mkdir(dataDir, { recursive: true });
  await fs.appendFile(
    path.join(dataDir, "contact-submissions.jsonl"),
    `${JSON.stringify(record)}\n`,
    { encoding: "utf8", mode: 0o600 }
  );
}

function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.exmail.qq.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  return nodemailer.createTransport({
    host,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user, pass },
    tls: { minVersion: "TLSv1.2" }
  });
}

function wantsEnglish(request) {
  const referer = cleanLine(request.get("referer"), 400);
  const acceptLanguage = cleanLine(request.get("accept-language"), 100).toLowerCase();
  return referer.includes("/en/") || acceptLanguage.startsWith("en");
}

function responseCopy(isEnglish) {
  return isEnglish ? {
    invalidOrigin: "The submission source is invalid. Please refresh the page and try again.",
    rateLimited: "Too many submissions. Please try again later or contact us by telephone.",
    fileTooLarge: "Files must be no larger than 10 MB. Please compress the file and try again.",
    unsupportedFile: "Unsupported file type. Please upload a PDF, Office document, archive or common image file.",
    uploadFailed: "File upload failed. Please check the file and try again.",
    success: "Submitted successfully. The Hua & Hua team will contact you within two business days.",
    dryRun: "Test mode: your information was recorded, but no email was sent.",
    mailFailed: "Your message could not be sent at this time. Please try again later, call +86 21 5236 0827 or email hyh@huayuhua.com.",
  } : {
    invalidOrigin: "提交来源无效，请刷新页面后重试。",
    rateLimited: "提交过于频繁，请稍后再试或直接致电联系。",
    fileTooLarge: "文件不能超过 10MB，请压缩后重新上传。",
    unsupportedFile: "文件格式不支持，请上传 PDF、Office 文档、压缩包或常用图片。",
    uploadFailed: "文件上传失败，请检查文件后重试。",
    success: "提交成功。华与华团队将在2个工作日内与您联系。",
    dryRun: "测试模式：信息已记录，但邮件没有发送。",
    mailFailed: "邮件暂时未能发送，请稍后重试。您也可以致电 021-5236 0827 或发送邮件至 hyh@huayuhua.com。",
  };
}

app.post("/api/contact", (request, response) => {
  const ip = clientIp(request);
  const initialEnglish = wantsEnglish(request);
  const initialCopy = responseCopy(initialEnglish);
  if (!validateOrigin(request)) {
    return response.status(403).json({ ok: false, message: initialCopy.invalidOrigin });
  }
  if (isRateLimited(ip)) {
    return response.status(429).json({ ok: false, message: initialCopy.rateLimited });
  }

  upload.single("file")(request, response, async (uploadError) => {
    const submissionId = crypto.randomUUID();
    const isEnglish = cleanLine(request.body?.site_lang, 8) === "en" || initialEnglish;
    const copy = responseCopy(isEnglish);

    if (uploadError) {
      const message = uploadError.code === "LIMIT_FILE_SIZE"
        ? copy.fileTooLarge
        : uploadError.message === "UNSUPPORTED_FILE"
          ? copy.unsupportedFile
          : copy.uploadFailed;
      return response.status(400).json({ ok: false, message });
    }
    if (cleanLine(request.body?.website, 200)) {
      return response.status(200).json({ ok: true, message: copy.success });
    }

    const validation = validateSubmission(request.body || {}, isEnglish);
    if (validation.error) {
      return response.status(400).json({ ok: false, message: validation.error });
    }

    const { data } = validation;
    const mail = buildMail(data, submissionId, request.file);
    const logBase = {
      submissionId,
      submittedAt: new Date().toISOString(),
      company: data.company,
      industry: data.industry,
      fileName: safeFileName(request.file),
      fileSize: request.file?.size || 0
    };

    try {
      let messageId = "dry-run";
      if (!dryRun) {
        const transporter = createTransporter();
        const result = await transporter.sendMail({
          from: process.env.MAIL_FROM || process.env.SMTP_USER,
          to: process.env.MAIL_TO || "hyh@huayuhua.com",
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
          attachments: request.file ? [{
            filename: safeFileName(request.file),
            content: request.file.buffer,
            contentType: request.file.mimetype
          }] : []
        });
        messageId = result.messageId;
      }

      await appendSubmissionLog({ ...logBase, status: dryRun ? "dry-run" : "sent", messageId });
      return response.status(200).json({
        ok: true,
        submissionId,
        emailSent: !dryRun,
        message: dryRun ? copy.dryRun : copy.success
      });
    } catch (error) {
      await appendSubmissionLog({ ...logBase, status: "failed", errorCode: error.message }).catch(() => {});
      console.error(`[contact:${submissionId}]`, error.message);
      return response.status(503).json({
        ok: false,
        message: copy.mailFailed
      });
    }
  });
});

app.use((request, response) => {
  response.status(404).type("text/plain").send("页面不存在");
});

const server = app.listen(port, host);

server.on("listening", () => {
  const displayHost = host === "0.0.0.0" ? "127.0.0.1" : host;
  console.log(`Hua & Hua website running at http://${displayHost}:${port}`);
  if (dryRun) console.log("Contact form dry-run mode is enabled; no email will be sent.");
});

server.on("error", (error) => {
  console.error(`Unable to start server: ${error.message}`);
  process.exitCode = 1;
});
