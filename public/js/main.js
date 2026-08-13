/* ==========================================================================
   AI 競賽活動網站 — 共用互動
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  /* Shared navigation and footer keep every page aligned with the current IA. */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var navItems = [
    {
      href: 'index.html',
      label: 'HOME',
      sub: [
        ['index.html#purpose-title', '比賽目的與獎金'],
        ['index.html#schedule', '重要日期與時程'],
        ['index.html#intro', '活動八大主題']
      ]
    },
    {
      href: 'news.html',
      label: '最新消息',
      sub: [
        ['news.html#news-title', '最新公告'],
        ['news.html#gallery-title', '活動花絮'],
        ['news.html#results-title', '決賽作品與成果']
      ]
    },
    {
      href: 'competition.html',
      label: '關於競賽',
      sub: [
        ['competition.html#overview', '競賽總覽'],
        ['competition.html#shield-cup', '神盾盃資安競賽'],
        ['competition.html#ai-seminar', 'AI 研討會與競賽'],
        ['competition.html#ai-pilot', 'AI 飛行員擂台賽'],
        ['competition.html#downloads', '競賽資料下載']
      ]
    },
    {
      href: 'forum.html',
      label: '達人論壇',
      sub: [
        ['forum.html#forum-intro-title', '論壇介紹'],
        ['forum.html#agenda-title', '演講時程'],
        ['forum.html#speakers-title', '講者介紹']
      ]
    },
    {
      href: 'sponsors.html',
      label: '贊助與參展',
      sub: [
        ['sponsors.html#plans', '贊助方案'],
        ['sponsors.html#showcase', '贊助廠商展示'],
        ['sponsors.html#contact', '聯絡窗口']
      ]
    }
  ];
  var navList = document.querySelector('.site-nav__list');
  if (navList) {
    navList.innerHTML = navItems.map(function (item) {
      var current = currentPage === item.href ? ' aria-current="page"' : '';
      var hasSub = item.sub && item.sub.length;
      var submenu = hasSub ? '<ul class="site-nav__sub">' + item.sub.map(function (subItem) {
        return '<li><a href="' + subItem[0] + '">' + subItem[1] + '</a></li>';
      }).join('') + '</ul>' : '';
      var parentLink = '<a class="site-nav__link" href="' + item.href + '"' + current + (hasSub ? ' aria-haspopup="true"' : '') + '>' + item.label + '</a>';
      var toggle = hasSub ? '<button class="site-nav__submenu-toggle" type="button" aria-expanded="false" aria-label="展開' + item.label + '子選單"><span aria-hidden="true">▾</span></button>' : '';
      return '<li' + (hasSub ? ' class="site-nav__item--has-sub"' : '') + '>' + (hasSub ? '<div class="site-nav__parent">' + parentLink + toggle + '</div>' : parentLink) + submenu + '</li>';
    }).join('');

    navList.querySelectorAll('.site-nav__submenu-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var item = toggle.closest('.site-nav__item--has-sub');
        var opening = !item.classList.contains('is-submenu-open');
        navList.querySelectorAll('.site-nav__item--has-sub.is-submenu-open').forEach(function (openItem) {
          openItem.classList.remove('is-submenu-open');
          var openToggle = openItem.querySelector('.site-nav__submenu-toggle');
          if (openToggle) openToggle.setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('is-submenu-open', opening);
        toggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
        toggle.setAttribute('aria-label', (opening ? '收合' : '展開') + item.querySelector('.site-nav__link').textContent.trim() + '子選單');
      });
    });
  }

  /* 報名與參賽者專區共用同一入口；舊版第二顆報名按鈕不再顯示。 */
  document.querySelectorAll('.mobile-header-actions > a:not([data-auth-entry]), .site-nav > a:not([data-auth-entry])').forEach(function (entry) {
    entry.remove();
  });

  document.querySelectorAll('a[href^="register.html"]').forEach(function (entry) {
    entry.setAttribute('href', 'portal.html#tracks');
    entry.setAttribute('data-auth-required', '');
    if (entry.classList.contains('btn') || /報名/.test(entry.textContent)) entry.textContent = '前往報名';
  });

  var footerInner = document.querySelector('.site-footer__inner');
  if (footerInner) {
    footerInner.className = 'container site-footer__inner footer-simple';
    footerInner.innerHTML =
      '<div class="site-footer__brand"><a class="brand" href="index.html"><img class="brand__mark brand__mark--logo" src="../img/brand/shield.png" alt="" width="400" height="351"><span class="brand__text"><span>2026 神盾盃</span><small>國際邀請賽暨國防 AI 競賽</small></span></a></div>' +
      '<div class="footer-units"><div class="footer-unit-group"><h2>主辦單位</h2><div class="footer-logo-row"><a class="footer-logo footer-logo--ncsist" href="https://www.ncsist.org.tw/" target="_blank" rel="noopener"><img src="../img/brand/partners/ncsist.png" alt="國家中山科學研究院" width="627" height="517"></a></div></div>' +
      '<div class="footer-unit-group"><h2>協辦單位</h2><div class="footer-logo-row"><a class="footer-logo footer-logo--dark" href="https://www.iii.org.tw/" target="_blank" rel="noopener"><img src="../img/brand/partners/iii.svg" alt="財團法人資訊工業策進會"></a><a class="footer-logo footer-logo--light" href="https://web.ncku.edu.tw/" target="_blank" rel="noopener"><img src="../img/brand/partners/ncku.png" alt="國立成功大學"></a><a class="footer-logo footer-logo--aoc" href="https://www.crows.org/" target="_blank" rel="noopener" aria-label="國際電子戰協會 AOC"><strong>AOC</strong><span>國際電子戰協會</span></a><a class="footer-logo footer-logo--dark" href="https://www.cycraft.com/" target="_blank" rel="noopener"><img src="../img/brand/partners/cycraft.svg" alt="奧義科技股份有限公司"></a><a class="footer-logo footer-logo--symbol" href="https://www.nics.nat.gov.tw/" target="_blank" rel="noopener"><img src="../img/brand/partners/nics.svg" alt="國家資通安全研究院"></a></div></div></div>' +
      '<div class="footer-contact"><h2>CONTACT</h2><a href="mailto:AICompetitionInDefence@ncsist.org.tw">AICompetitionInDefence@ncsist.org.tw</a></div>';
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     導覽列：滾動後加上半透明背景與細邊框
     ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     行動版選單
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector('.nav-toggle');

  if (header && navToggle) {
    var navToggleLabel = navToggle.querySelector('.sr-only');

    navToggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (navToggleLabel) navToggleLabel.textContent = open ? '關閉主選單' : '開啟主選單';
    });

    // Esc 關閉選單並將焦點還給按鈕
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navToggleLabel) navToggleLabel.textContent = '開啟主選單';
        navToggle.focus();
      }
    });

    // 點擊選單外側時關閉
    document.addEventListener('click', function (e) {
      if (header.classList.contains('nav-open') && !header.contains(e.target)) {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navToggleLabel) navToggleLabel.textContent = '開啟主選單';
      }
    });
  }

  /* ------------------------------------------------------------------
     滾動進場（reduced motion 時不啟用）
     ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll('.reveal');

  if (revealTargets.length > 0) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
      );

      revealTargets.forEach(function (el) {
        observer.observe(el);
      });
    }
  }

  /* ------------------------------------------------------------------
     內容分頁（tabs）：[data-tabs] 容器內的 [role=tab] 切換對應 tabpanel。
     支援網址 hash 深連結（含跨頁 competition.html#ai-seminar）與方向鍵。
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    var panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute('aria-controls'));
    });

    function activate(tab, updateHash) {
      tabs.forEach(function (t, i) {
        var selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        t.tabIndex = selected ? 0 : -1;
        if (panels[i]) panels[i].hidden = !selected;
      });
      if (updateHash) {
        history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
      }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        activate(tab, true);
      });
      tab.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
        activate(next, true);
      });
    });

    function syncFromHash(scroll) {
      var id = window.location.hash.slice(1);
      var match = null;
      tabs.forEach(function (t) {
        if (t.getAttribute('aria-controls') === id) match = t;
      });

      // 別名：hash 指向面板內的子區塊（如 #defense-ai）時，開啟所屬分頁
      var innerTarget = null;
      if (!match && id) {
        var el = document.getElementById(id);
        var panel = el && el.closest('[role="tabpanel"]');
        if (panel) {
          tabs.forEach(function (t) {
            if (t.getAttribute('aria-controls') === panel.id) match = t;
          });
          innerTarget = el;
        }
      }

      activate(match || tabs[0], false);
      if (match && scroll) {
        (innerTarget || root).scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      } else if (innerTarget) {
        innerTarget.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }

    window.addEventListener('hashchange', function () {
      syncFromHash(true);
    });
    syncFromHash(false);
  });

  /* ------------------------------------------------------------------
     Demo 用：攔截尚未實作的連結（href="#"）並提示
     ------------------------------------------------------------------ */
  var status = document.getElementById('demo-status');
  var statusTimer = null;

  var showDemoStatus = function (message) {
    if (!status) return;
    status.textContent = message;
    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(function () {
      status.textContent = '';
    }, 5000);
  };

  document.addEventListener('click', function (e) {
    var unavailable = e.target.closest('[data-unavailable]');
    if (unavailable) {
      e.preventDefault();
      showDemoStatus(unavailable.getAttribute('data-unavailable'));
      return;
    }

    var link = e.target.closest('a[href="#"]');
    if (!link) return;
    e.preventDefault();
    var label = link.getAttribute('aria-label') || link.textContent.trim();
    showDemoStatus('「' + label + '」內容尚待主辦單位提供。');
  });

  /* ------------------------------------------------------------------
     外部報名平台確認彈窗：external 路由（SurveyCake／Kaggle）的報名
     連結先確認「即將離開本站」，繼續才另開新分頁。
     ------------------------------------------------------------------ */
  var externalModal = null;
  var externalReturnFocus = null;

  function ensureExternalModal() {
    if (externalModal) return externalModal;

    externalModal = document.createElement('div');
    externalModal.className = 'external-modal';
    externalModal.hidden = true;
    externalModal.innerHTML =
      '<div class="external-modal__card" role="dialog" aria-modal="true" aria-labelledby="external-modal-title">' +
        '<h2 id="external-modal-title">即將離開本站</h2>' +
        '<p class="external-modal__desc" data-modal-desc></p>' +
        '<div class="external-modal__actions">' +
          '<a class="btn btn--primary-light" data-modal-continue target="_blank" rel="noopener noreferrer" href="#">繼續前往</a>' +
          '<button class="btn btn--secondary" type="button" data-modal-cancel>取消</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(externalModal);

    externalModal.addEventListener('click', function (e) {
      if (e.target === externalModal || e.target.closest('[data-modal-cancel]')) {
        closeExternalModal();
      } else if (e.target.closest('[data-modal-continue]')) {
        closeExternalModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !externalModal.hidden) closeExternalModal();
    });

    return externalModal;
  }

  function openExternalModal(route, trigger) {
    var modal = ensureExternalModal();
    var platform = String(route.platform || '外部平台').split('（')[0];
    modal.querySelector('[data-modal-desc]').textContent =
      '「' + route.name + '」的報名由 ' + platform + ' 受理，將以新分頁開啟外部平台網站；' +
      '於外部平台填寫的資料依該平台規範處理。';
    modal.querySelector('[data-modal-continue]').setAttribute('href', route.url);
    externalReturnFocus = trigger;
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    modal.querySelector('[data-modal-continue]').focus();
  }

  function closeExternalModal() {
    if (!externalModal || externalModal.hidden) return;
    externalModal.hidden = true;
    document.documentElement.style.overflow = '';
    if (externalReturnFocus) {
      externalReturnFocus.focus();
      externalReturnFocus = null;
    }
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-register-route]');
    if (!link) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    var routes = (window.SITE_CONFIG || {}).registrationRoutes || {};
    var route = routes[link.getAttribute('data-register-route')];
    if (!route || !route.external || !route.url) return;

    e.preventDefault();
    openExternalModal(route, link);
  });

})();
