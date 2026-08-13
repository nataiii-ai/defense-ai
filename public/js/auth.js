/* ==========================================================================
   2026 神盾盃 — 會員帳號（展示模式）
   --------------------------------------------------------------------------
   流程依 2026-08-07 主辦確認：
   1. 需先「註冊帳號」，註冊完成後直接進入參賽項目選擇與報名流程。
   2. 登入身分分為：參賽者（報名的人）、管理者、評審。
      管理者與評審帳號由主辦單位開通，其工作區屬後台系統建置範圍；
      展示版提供參賽者流程。
   展示版僅以 localStorage 模擬帳號與登入狀態，不做真實驗證與加密；
   密碼政策、Email 驗證、忘記密碼等正式機制待主辦確認，不在此寫死。
   ========================================================================== */
(function () {
  'use strict';

  var ACCOUNTS_KEY = 'aicontestDemoAccountsV1';
  var SESSION_KEY = 'aicontestDemoSessionV1';

  function readJSON(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  var DemoAuth = {
    accounts: function () {
      var list = readJSON(ACCOUNTS_KEY, []);
      return Array.isArray(list) ? list : [];
    },
    findAccount: function (email) {
      var normalized = String(email || '').trim().toLowerCase();
      return this.accounts().find(function (account) {
        return account.email === normalized;
      }) || null;
    },
    register: function (email, password) {
      var normalized = String(email || '').trim().toLowerCase();
      if (this.findAccount(normalized)) return { ok: false, error: 'exists' };
      var accounts = this.accounts();
      accounts.push({ email: normalized, password: password, createdAt: new Date().toISOString() });
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      return { ok: true };
    },
    login: function (email, password) {
      var account = this.findAccount(email);
      if (!account) return { ok: false, error: 'notfound' };
      if (account.password !== password) return { ok: false, error: 'password' };
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        email: account.email,
        role: 'participant',
        loginAt: new Date().toISOString()
      }));
      return { ok: true };
    },
    logout: function () {
      localStorage.removeItem(SESSION_KEY);
    },
    session: function () {
      var session = readJSON(SESSION_KEY, null);
      return session && session.email ? session : null;
    }
  };

  window.DemoAuth = DemoAuth;

  /* ------------------------------------------------------------------
     導覽列單一入口：未登入顯示「前往報名」，登入後改為「登出」
     ------------------------------------------------------------------ */
  function updateNavEntry() {
    var entries = document.querySelectorAll('[data-auth-entry]');
    if (!entries.length) return;
    var session = DemoAuth.session();
    entries.forEach(function (entry) {
      if (session) {
        entry.textContent = '登出';
        entry.setAttribute('href', '#logout');
        entry.setAttribute('data-auth-logout', '');
        entry.setAttribute('title', '已登入：' + session.email);
      } else {
        entry.textContent = '前往報名';
        entry.setAttribute('href', 'account.html?mode=signup&next=portal.html%23tracks');
        entry.removeAttribute('data-auth-logout');
        entry.removeAttribute('title');
      }
    });
  }

  /* ------------------------------------------------------------------
     報名入口攔截：標記 data-auth-required 的連結需登入後才可進入
     ------------------------------------------------------------------ */
  document.addEventListener('click', function (event) {
    var logout = event.target.closest('[data-auth-logout]');
    if (logout) {
      event.preventDefault();
      DemoAuth.logout();
      window.location.href = 'index.html';
      return;
    }

    var jump = event.target.closest('[data-tab-jump]');
    if (jump) {
      var tab = document.getElementById(jump.getAttribute('data-tab-jump'));
      if (tab) tab.click();
      return;
    }

    var link = event.target.closest('[data-auth-required]');
    if (!link || DemoAuth.session()) return;
    event.preventDefault();
    var next = link.getAttribute('href') || 'portal.html#profile';
    window.location.href = 'account.html?reason=login-required&mode=signup&next=' + encodeURIComponent(next);
  });

  /* ------------------------------------------------------------------
     參賽者專區關卡：未登入時顯示登入提示、隱藏報名內容
     ------------------------------------------------------------------ */
  function applyPortalGate() {
    var gate = document.getElementById('portal-auth-gate');
    if (!gate) return;

    var session = DemoAuth.session();
    gate.hidden = Boolean(session);
    document.querySelectorAll('[data-requires-auth]').forEach(function (sectionEl) {
      sectionEl.hidden = !session;
    });

    var chip = document.getElementById('portal-session');
    var email = document.getElementById('portal-session-email');
    if (chip && email) {
      chip.hidden = !session;
      email.textContent = session ? '已登入｜' + session.email : '';
    }

    var logoutButton = document.getElementById('portal-logout');
    if (logoutButton && !logoutButton.hasAttribute('data-bound')) {
      logoutButton.setAttribute('data-bound', 'true');
      logoutButton.addEventListener('click', function () {
        DemoAuth.logout();
        window.location.href = 'account.html';
      });
    }
  }

  /* ------------------------------------------------------------------
     帳號頁（account.html）：登入／註冊表單
     ------------------------------------------------------------------ */
  function setupAccountPage() {
    var loginForm = document.getElementById('login-form');
    var signupForm = document.getElementById('signup-form');
    if (!loginForm && !signupForm) return;

    var params = new URLSearchParams(window.location.search);
    var nextTarget = params.get('next') || '';
    // 只允許導回站內參賽者專區，避免奇怪的轉址
    if (!/^portal\.html(?:\?track=[\w-]+)?(?:#[\w-]*)?$/.test(nextTarget)) nextTarget = 'portal.html#tracks';

    var pageAlert = document.getElementById('account-alert');

    function showPageAlert(message, type) {
      if (!pageAlert) return;
      pageAlert.hidden = false;
      pageAlert.className = 'portal-alert portal-alert--' + (type || 'success');
      pageAlert.textContent = message;
    }

    if (params.get('reason') === 'login-required') {
      showPageAlert('開始報名前需先建立帳號；已有帳號可切換至「會員登入」。', 'error');
    }

    if (params.get('mode') === 'signup' || window.location.hash === '#signup') {
      var signupTab = document.getElementById('tab-signup');
      if (signupTab) signupTab.click();
    } else if (params.get('mode') === 'login') {
      var loginModeTab = document.getElementById('tab-login');
      if (loginModeTab) loginModeTab.click();
    }

    /* 已登入狀態 */
    var sessionPanel = document.getElementById('account-session');
    var session = DemoAuth.session();
    if (sessionPanel) {
      sessionPanel.hidden = !session;
      if (session) {
        var emailSlot = document.getElementById('account-session-email');
        if (emailSlot) emailSlot.textContent = session.email;
      }
    }
    var accountLogout = document.getElementById('account-logout');
    if (accountLogout) {
      accountLogout.addEventListener('click', function () {
        DemoAuth.logout();
        window.location.reload();
      });
    }

    /* 登入：身分由帳號決定（admin＝管理者、評委帳號由 admin 建立、其餘為參賽者） */
    if (loginForm) {
      var loginStatus = document.getElementById('login-status');

      loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!loginForm.reportValidity()) return;

        var data = new FormData(loginForm);
        if (String(data.get('email') || '').trim().toLowerCase() === 'admin') {
          loginStatus.textContent = '管理者與評審請由後台系統登入；本頁供參賽者使用。';
          return;
        }

        var result = DemoAuth.login(data.get('email'), data.get('password'));
        if (result.ok) {
          window.location.href = nextTarget;
          return;
        }
        loginStatus.textContent = result.error === 'notfound'
          ? '查無此帳號，請先完成註冊後再重新登入。'
          : '密碼不正確，請再試一次。';
      });
    }

    /* 註冊完成後建立登入狀態，直接進入競賽項目選擇。 */
    if (signupForm) {
      var signupStatus = document.getElementById('signup-status');

      signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!signupForm.reportValidity()) return;

        var data = new FormData(signupForm);
        var email = String(data.get('email') || '').trim();
        var password = String(data.get('password') || '');
        var confirm = String(data.get('passwordConfirm') || '');

        if (password !== confirm) {
          signupStatus.textContent = '兩次輸入的密碼不一致，請再確認。';
          return;
        }

        var result = DemoAuth.register(email, password);
        if (!result.ok) {
          signupStatus.textContent = '此 Email 已註冊過，請直接登入。';
          return;
        }

        DemoAuth.login(email, password);
        window.location.href = nextTarget || 'portal.html#tracks';
      });
    }
  }

  updateNavEntry();
  applyPortalGate();
  setupAccountPage();
})();
