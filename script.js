const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
const AI_AGENT_URL = "https://ai.huayuhua.com/app/web/home";
const isEnglishPage = document.documentElement.lang.toLowerCase().startsWith("en");

const megaMenuData = {
  "华与华方法": {
    label: "学习华与华方法",
    columns: [
      {
        title: "方法论",
        links: [
          ["华与华方法", "./method.html#method"],
          ["华与华企业三大原理", "./method.html#enterprise"],
          ["华与华品牌三大原理", "./method.html#brand"],
          ["华与华传播三大原理", "./method.html#communication"],
          ["华与华两大工作原理", "./method.html#work"],
          ["华与华三大核心技术", "./method.html#core"],
          ["华与华文库", "./method.html#library"],
        ],
      },
    ],
  },
  "案例": {
    label: "查看超级案例",
    columns: [
      {
        title: "精选案例",
        links: [
          ["华与华百万创意大奖赛", "./cases.html#case-57"],
          ["餐饮连锁", "./cases.html#case-29"],
          ["快消品", "./cases.html#case-30"],
          ["互联网&电商", "./cases.html#case-33"],
          ["医药&医美", "./cases.html#case-35"],
        ],
      },
      {
        title: "更多行业",
        links: [
          ["家装&家电", "./cases.html#case-36"],
          ["洗护日化", "./cases.html#case-37"],
          ["母婴用品", "./cases.html#case-47"],
          ["鞋服用品", "./cases.html#case-38"],
          ["交通出行", "./cases.html#case-39"],
          ["地产&酒店", "./cases.html#case-40"],
        ],
      },
      {
        title: "专项案例",
        links: [
          ["文化和生活服务", "./cases.html#case-41"],
          ["农产&农资", "./cases.html#case-48"],
          ["城市品牌", "./cases.html#case-42"],
          ["B to B", "./cases.html#case-43"],
        ],
      },
    ],
  },
  "AI 智能体": {
    label: "进入华与华AI智能体",
    columns: [
      {
        title: "智能体平台",
        links: [
          ["华与华智能体培训平台", AI_AGENT_URL],
          ["登录 / 注册", AI_AGENT_URL],
        ],
      },
    ],
  },
  "华与华商学": {
    label: "了解华与华商学",
    columns: [
      {
        title: "商学内容",
        links: [
          ["华与华商学", "./business-school.html#business-studies"],
          ["线下课程", "./business-school.html#offline-course"],
          ["线上课程", "./business-school.html#online-course"],
          ["学术研究", "./business-school.html#academic-research"],
        ],
      },
    ],
  },
  "关于我们": {
    label: "了解华与华",
    columns: [
      {
        title: "公司",
        links: [
          ["公司简介", "./about.html#company"],
          ["创始人", "./about.html#founders"],
          ["发展历程", "./about.html#history"],
          ["华与华咨询服务", "./about.html#consulting-service"],
          ["创意大车间", "./about.html#workshop"],
          ["超级符号展", "./about.html#exhibition"],
        ],
      },
    ],
  },
  "联系我们": {
    label: "联系华与华",
    columns: [
      {
        title: "合作与加入",
        links: [
          ["业务合作", "./contact.html#business"],
          ["10大咨询服务内容", "./contact.html"],
          ["不投标 不比稿", "./contact.html#principles"],
          ["加入我们", "./join-us.html"],
        ],
      },
    ],
  },
};

if (isEnglishPage) {
  Object.assign(megaMenuData, {
    "H&H Method": {
      label: "Explore the H&H Method",
      columns: [{
        title: "Methodology",
        links: [
          ["H&H Method", "./method.html#method"],
          ["Three Principles of Enterprise", "./method.html#enterprise"],
          ["Three Principles of Brand", "./method.html#brand"],
          ["Three Principles of Communication", "./method.html#communication"],
          ["Two Working Principles", "./method.html#work"],
          ["Three Core Technologies", "./method.html#core"],
          ["Hua & Hua Library", "./method.html#library"],
        ],
      }],
    },
    Cases: {
      label: "View Super Cases",
      columns: [
        {
          title: "Featured",
          links: [
            ["Million-Yuan Creativity Awards", "./cases.html#case-57"],
            ["Restaurant Chains", "./cases.html#case-29"],
            ["FMCG", "./cases.html#case-30"],
            ["Internet & E-commerce", "./cases.html#case-33"],
            ["Pharmaceuticals & Medical Aesthetics", "./cases.html#case-35"],
          ],
        },
        {
          title: "More Industries",
          links: [
            ["Home Improvement & Appliances", "./cases.html#case-36"],
            ["Personal & Household Care", "./cases.html#case-37"],
            ["Maternal & Baby Products", "./cases.html#case-47"],
            ["Apparel & Footwear", "./cases.html#case-38"],
            ["Mobility & Transport", "./cases.html#case-39"],
            ["Real Estate & Hotels", "./cases.html#case-40"],
          ],
        },
        {
          title: "Specialist Cases",
          links: [
            ["Culture & Lifestyle Services", "./cases.html#case-41"],
            ["Agriculture & Farm Inputs", "./cases.html#case-48"],
            ["City Branding", "./cases.html#case-42"],
            ["B2B", "./cases.html#case-43"],
          ],
        },
      ],
    },
    "AI Agents": {
      label: "Enter the H&H AI Agent Platform",
      columns: [{
        title: "AI Agent Platform",
        links: [
          ["H&H AI Agent Training Platform", AI_AGENT_URL],
          ["Log In / Register", AI_AGENT_URL],
        ],
      }],
    },
    "Business Studies": {
      label: "Explore H&H Business Studies",
      columns: [{
        title: "Programmes",
        links: [
          ["Business Studies", "./business-school.html#business-studies"],
          ["In-Person Courses", "./business-school.html#offline-course"],
          ["Online Courses", "./business-school.html#online-course"],
          ["Academic Research", "./business-school.html#academic-research"],
        ],
      }],
    },
    "About Us": {
      label: "About Hua & Hua",
      columns: [{
        title: "Company",
        links: [
          ["Company Profile", "./about.html#company"],
          ["Founders", "./about.html#founders"],
          ["Our History", "./about.html#history"],
          ["Consulting Services", "./about.html#consulting-service"],
          ["Creativity Production Plant", "./about.html#workshop"],
          ["Super Sign Exhibition", "./about.html#exhibition"],
        ],
      }],
    },
    "Contact Us": {
      label: "Contact Hua & Hua",
      columns: [{
        title: "Engagement and Careers",
        links: [
          ["Engage Us", "./contact.html#business"],
          ["10 Consulting Services", "./contact.html"],
          ["No Tendering, No Pitching", "./contact.html#principles"],
          ["Join Us", "./join-us.html"],
        ],
      }],
    },
  });
}

function createMegaMenuPanel(config) {
  const panel = document.createElement("div");
  panel.className = "nav-flyout";
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", config.label);

  const inner = document.createElement("div");
  inner.className = "nav-flyout-inner";

  const heading = document.createElement("p");
  heading.className = "nav-flyout-heading";
  heading.textContent = config.label;
  inner.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "nav-flyout-grid";

  config.columns.forEach((column) => {
    const group = document.createElement("div");
    group.className = "nav-flyout-group";

    const title = document.createElement("p");
    title.className = "nav-flyout-title";
    title.textContent = column.title;
    group.appendChild(title);

    column.links.forEach(([text, href]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = text;
      if (/^https?:\/\//.test(href)) {
        link.target = "_blank";
        link.rel = "noopener";
      }
      group.appendChild(link);
    });

    grid.appendChild(group);
  });

  inner.appendChild(grid);
  panel.appendChild(inner);
  return panel;
}

let activeMegaItem = null;

function closeMegaMenu() {
  document.querySelectorAll(".has-mega.is-open").forEach((item) => item.classList.remove("is-open"));
  document.body.classList.remove("nav-mega-open");
  activeMegaItem = null;
}

function openMegaMenu(item) {
  if (activeMegaItem && activeMegaItem !== item) {
    activeMegaItem.classList.remove("is-open");
  }
  activeMegaItem = item;
  if (item) item.classList.add("is-open");
  document.body.classList.add("nav-mega-open");
}

function pointInsideRect(point, rect) {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}

function pointerInsideMegaArea(event) {
  if (!activeMegaItem) return false;
  const topbar = document.querySelector(".topbar");
  const flyout = activeMegaItem.querySelector(".nav-flyout");
  const point = { x: event.clientX, y: event.clientY };
  return (
    (topbar && pointInsideRect(point, topbar.getBoundingClientRect())) ||
    (flyout && pointInsideRect(point, flyout.getBoundingClientRect()))
  );
}

function enhanceNavigationWithMegaMenus() {
  if (!nav || nav.dataset.megaEnhanced === "true") return;

  const backdrop = document.createElement("div");
  backdrop.className = "nav-page-blur";
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);

  [...nav.children].forEach((child) => {
    if (!(child instanceof HTMLAnchorElement)) return;
    if (child.classList.contains("language-switch")) return;

    child.classList.add("nav-link");
    const key = child.textContent.trim();
    const config = megaMenuData[key];
    if (!config) return;

    const item = document.createElement("div");
    item.className = "nav-item has-mega";
    child.parentNode.insertBefore(item, child);
    item.appendChild(child);
    item.appendChild(createMegaMenuPanel(config));

    item.addEventListener("mouseenter", () => openMegaMenu(item));
    item.addEventListener("focusin", () => openMegaMenu(item));
    item.addEventListener("focusout", (event) => {
      if (!item.contains(event.relatedTarget)) closeMegaMenu();
    });
  });

  document.addEventListener("mousemove", (event) => {
    if (activeMegaItem && !pointerInsideMegaArea(event)) closeMegaMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMegaMenu();
  });

  nav.dataset.megaEnhanced = "true";
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    if (!open) closeMegaMenu();
  });
}

enhanceNavigationWithMegaMenus();

const languageSwitch = document.querySelector(".language-switch");
if (languageSwitch) {
  const switchTarget = languageSwitch.getAttribute("href").split("#")[0];
  const syncLanguageTarget = () => {
    languageSwitch.href = `${switchTarget}${window.location.hash}`;
  };
  syncLanguageTarget();
  window.addEventListener("hashchange", syncLanguageTarget);
}

const filterButtons = document.querySelectorAll("[data-filter]");
const filterItems = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterItems.forEach((item) => {
      item.hidden = value !== "all" && item.dataset.category !== value;
    });
  });
});

document.querySelectorAll("form[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const notice = form.querySelector("[data-form-notice]");
    const submitButton = form.querySelector("button[type='submit']");
    const fileInput = form.querySelector("input[type='file']");
    const submitLabel = submitButton?.textContent || (isEnglishPage ? "Submit" : "立即提交");
    const formCopy = isEnglishPage ? {
      fileTooLarge: "Files must be no larger than 10 MB. Please compress the file and try again.",
      submitting: "Submitting...",
      pending: "Securely submitting your information. Please wait.",
      failure: "Submission failed. Please try again later, or contact us by phone or email.",
      success: "Submitted successfully. The Hua & Hua team will contact you within two business days.",
    } : {
      fileTooLarge: "文件不能超过 10MB，请压缩后重新上传。",
      submitting: "正在提交...",
      pending: "正在安全提交信息，请稍候。",
      failure: "提交失败，请稍后重试。暂时也可通过电话或邮件联系我们。",
      success: "提交成功。华与华团队将在2个工作日内与您联系。",
    };

    if (fileInput?.files[0]?.size > 10 * 1024 * 1024) {
      if (notice) {
        notice.dataset.state = "error";
        notice.textContent = formCopy.fileTooLarge;
      }
      fileInput.focus();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = formCopy.submitting;
    }
    if (notice) {
      notice.dataset.state = "pending";
      notice.textContent = formCopy.pending;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || formCopy.failure);
      }

      form.reset();
      if (notice) {
        notice.dataset.state = "success";
        notice.textContent = result.message || formCopy.success;
      }
    } catch (error) {
      if (notice) {
        notice.dataset.state = "error";
        notice.textContent = error.message || formCopy.failure;
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    }
  });
});

document.querySelectorAll("[data-founded-years]").forEach((node) => {
  const foundedYear = Number(node.dataset.foundedYear);
  const foundedMonth = Number(node.dataset.foundedMonth);
  const foundedDay = Number(node.dataset.foundedDay);
  const today = new Date();
  const anniversaryReached =
    today.getMonth() + 1 > foundedMonth ||
    (today.getMonth() + 1 === foundedMonth && today.getDate() >= foundedDay);

  if (foundedYear && foundedMonth && foundedDay) {
    const activeYear = today.getFullYear() - foundedYear + (anniversaryReached ? 1 : 0);
    const suffix = node.dataset.foundedYearsSuffix || (isEnglishPage ? " Years " : "年时间");
    node.textContent = `${activeYear}${suffix}`;
  }
});

const setupScrollAwareAutoplayVideo = (video) => {
  let videoInView = true;

  const playVideo = () => {
    if (!videoInView || document.hidden) return;
    video.play().catch(() => {
      // Some browser or system-level data-saving settings can still block autoplay.
    });
  };

  const videoObserver = new IntersectionObserver(([entry]) => {
    videoInView = entry.isIntersecting && entry.intersectionRatio >= 0.4;
    if (videoInView) {
      playVideo();
    } else {
      video.pause();
    }
  }, { threshold: [0, 0.4] });

  videoObserver.observe(video);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      video.pause();
    } else {
      playVideo();
    }
  });
};

document.querySelectorAll(".home-latest-video, .home-school-video").forEach(setupScrollAwareAutoplayVideo);

const latestCourseTrigger = document.querySelector("[data-latest-course-trigger]");
const latestCourseDialog = document.querySelector("#latest-course-dialog");
const latestCourseClose = document.querySelector("[data-latest-course-close]");

function openLatestCourseDialog() {
  if (!latestCourseDialog) return;
  if (latestCourseDialog.open) return;
  if (typeof latestCourseDialog.showModal === "function") {
    latestCourseDialog.showModal();
  } else {
    latestCourseDialog.setAttribute("open", "");
  }
}

function closeLatestCourseDialog() {
  if (!latestCourseDialog) return;
  if (typeof latestCourseDialog.close === "function") {
    latestCourseDialog.close();
  } else {
    latestCourseDialog.removeAttribute("open");
  }
}

if (latestCourseTrigger && latestCourseDialog) {
  latestCourseTrigger.addEventListener("click", openLatestCourseDialog);
  latestCourseTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLatestCourseDialog();
    }
  });
  latestCourseClose?.addEventListener("click", closeLatestCourseDialog);
  latestCourseDialog.addEventListener("click", (event) => {
    if (event.target === latestCourseDialog) closeLatestCourseDialog();
  });
}

function scrollToHashTarget() {
  if (!window.location.hash) return;
  const rawId = window.location.hash.slice(1);
  let id = rawId;
  try {
    id = decodeURIComponent(rawId);
  } catch {
    id = rawId;
  }
  const target = document.getElementById(id);
  if (!target) return;
  const topbar = document.querySelector(".topbar");
  const offset = (topbar ? topbar.offsetHeight : 0) + 18;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "auto" });
}

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    window.setTimeout(scrollToHashTarget, 60);
  });
});

window.addEventListener("hashchange", () => {
  requestAnimationFrame(scrollToHashTarget);
});
