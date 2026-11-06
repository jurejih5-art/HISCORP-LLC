/* Clean URLs: shows https://hiscorp.so/ and https://hiscorp.so/about
   instead of index.html / about.html when the site is online.
   Does nothing when the files are opened from your computer (file://),
   so local preview keeps working. */
(function () {
  if (!/^https?:$/.test(location.protocol)) return;

  function clean(href) {
    if (!href || /^(https?:|mailto:|tel:|\/\/|#|javascript:)/i.test(href)) return href;
    return href
      .replace(/^(\.\/)?index\.html(?=$|[?#])/i, '/')
      .replace(/\.html(?=$|[?#])/i, '');
  }

  function fixLinks(root) {
    (root || document).querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href'), c = clean(h);
      if (c !== h) a.setAttribute('href', c);
    });
  }

  // Address bar: /index.html -> /   and   /about.html -> /about
  var p = location.pathname;
  var np = p.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
  if (np !== p && window.history && history.replaceState) {
    history.replaceState(null, '', np + location.search + location.hash);
  }

  fixLinks();
  document.addEventListener('DOMContentLoaded', function () { fixLinks(); });
  window.addEventListener('load', function () { fixLinks(); });
  if (window.MutationObserver) {
    new MutationObserver(function () { fixLinks(); })
      .observe(document.documentElement, { childList: true, subtree: true });
  }
})();
