/* Google Analytics (GA4). Paste your Measurement ID between the quotes, e.g. "G-ABC123XYZ".
   While it is empty, no tracking script is loaded. */
(function () {
  var GA_ID = "";
  if (!GA_ID) return;
  var s = document.createElement("script");
  s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag; gtag("js", new Date()); gtag("config", GA_ID);
})();
