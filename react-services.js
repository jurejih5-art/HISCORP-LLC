/* React-powered service explorer for the HISCORP homepage.
   React is loaded from the official React 18 UMD builds in index.html. */
(function () {
  "use strict";
  var rootElement = document.getElementById("react-services");
  if (!rootElement || !window.React || !window.ReactDOM) return;

  var h = React.createElement;
  var services = [
    { number: "01", title: "Construction", icon: "⌂", image: "card-construction", description: "Civil construction, infrastructure development and project support.", href: "services.html#construction" },
    { number: "02", title: "Procurement", icon: "▦", image: "card-procurement", description: "Global sourcing, quality supplies and efficient procurement solutions.", href: "services.html#procurement" },
    { number: "03", title: "Logistics", icon: "↗", image: "card-logistics", description: "Transport coordination, freight movement and supply-chain support.", href: "services.html#logistics" },
    { number: "04", title: "Labour Workforce", icon: "♙", image: "card-workforce", description: "Workforce sourcing and staffing solutions matched to operational needs.", href: "services.html#workforce" }
  ];

  function ServiceExplorer() {
    var shown = services;

    return h(React.Fragment, null,
      h("div", { className: "cards-grid react-cards-grid" },
        shown.map(function (service) {
          return h("article", { className: "service-card", key: service.number },
            h("div", { className: "card-image " + service.image, "aria-hidden": "true" }),
            h("div", { className: "card-body" },
              h("span", { className: "card-number" }, service.number),
              h("h3", null, h("span", { className: "react-service-icon", "aria-hidden": "true" }, service.icon), service.title),
              h("p", null, service.description),
              h("a", { href: service.href }, "Learn More ", h("span", { "aria-hidden": "true" }, "→"))
            )
          );
        })
      )
    );
  }

  ReactDOM.createRoot(rootElement).render(h(ServiceExplorer));
})();