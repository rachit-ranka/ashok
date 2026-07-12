/* ============================================================
   Ashok Traders — shared site chrome for the AIOCD tool page.
   Injects a top back-link bar + footer around the converter so
   aiocd/app.html can stay a PURE, frequently-re-frozen snapshot.

   Usage: add ONE line before </body> in your working converter
   file (and it carries over when you freeze to app.html):

     <script src="../assets/aiocd-chrome.js" defer></script>

   Nothing else in app.html needs to change. Edit the look here,
   once, and every freeze picks it up automatically.
   ============================================================ */
(function () {
  if (window.__aiocdChromeLoaded) return;      // guard against double-include
  window.__aiocdChromeLoaded = true;

  function mount() {
    var body = document.body;
    if (!body) return;

    // ---- top back-link bar (first child of <body>) ----
    if (!document.getElementById('aiocd-topbar')) {
      var bar = document.createElement('div');
      bar.id = 'aiocd-topbar';
      bar.style.cssText =
        'background:#0d1117;border-bottom:1px solid #313b48;font-size:12.5px';
      bar.innerHTML =
        '<div style="max-width:1180px;margin:0 auto;padding:8px 22px;display:flex;' +
        'justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">' +
          '<a href="index.html" style="color:#8b98a5;text-decoration:none;' +
          'display:inline-flex;align-items:center;gap:6px">' +
            '<span style="font-size:14px">←</span> Back to AIOCD Converter</a>' +
          '<a href="../index.html" style="color:#8b98a5;text-decoration:none">' +
            'Ashok Traders home ↗</a>' +
        '</div>';
      body.insertBefore(bar, body.firstChild);
    }

    // ---- footer (last child of <body>) ----
    if (!document.getElementById('aiocd-footer')) {
      var foot = document.createElement('footer');
      foot.id = 'aiocd-footer';
      foot.style.cssText =
        'border-top:1px solid #313b48;background:#1a2029;padding:20px 22px;margin-top:20px';
      foot.innerHTML =
        '<div style="max-width:1180px;margin:0 auto;display:flex;' +
        'justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;' +
        'font-size:12.5px;color:#8b98a5">' +
          '<span>A free tool by ' +
            '<strong style="color:#e6edf3;font-weight:600">Ashok Traders</strong>, Indore.</span>' +
          '<span>' +
            '<a href="index.html" style="color:#4c9be8;text-decoration:none">About the converter</a>' +
            ' · ' +
            '<a href="../index.html" style="color:#4c9be8;text-decoration:none">Back to Ashok Traders</a>' +
          '</span>' +
        '</div>';
      body.appendChild(foot);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
