// Renders menu.json into every <ul data-menu-section="..."> on the page.
(function () {
  function row(className) {
    var li = document.createElement("li");
    if (className) li.className = className;
    return li;
  }

  function div(className, text) {
    var el = document.createElement("div");
    el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function renderHeader(entry) {
    var li = row("box-pricing-item" + (entry.headerClass ? " " + entry.headerClass : ""));
    var title = div("box-pricing-title big text-uppercase text-spacing-120");
    var name = div("box-pricing-name font-weight-bold", entry.text);
    name.style.textDecoration = "underline";
    title.appendChild(name);
    li.appendChild(title);
    return li;
  }

  function renderLine(entry) {
    var li = row();
    if (entry.html) li.innerHTML = entry.html;
    else li.textContent = entry.text || "";
    return li;
  }

  function renderItem(entry) {
    var li = row("box-pricing-item");
    var title = div("box-pricing-title big text-uppercase text-spacing-120");
    title.appendChild(div("box-pricing-name  font-weight-bold", entry.name));
    title.appendChild(div("box-pricing-dots", entry.amount || ""));
    title.appendChild(div(entry.priceClass || "box-pricing-price h5 font-weight-bold", entry.price || ""));
    li.appendChild(title);
    li.appendChild(div("box-pricing-desc text-dark offset-top-10", entry.description || ""));
    return li;
  }

  var renderers = { header: renderHeader, line: renderLine, item: renderItem };

  function render(menu) {
    Object.keys(menu).forEach(function (sectionId) {
      var ul = document.querySelector('ul[data-menu-section="' + sectionId + '"]');
      if (!ul) return;
      menu[sectionId].forEach(function (entry) {
        ul.appendChild((renderers[entry.type] || renderItem)(entry));
      });
    });
    // The grid was laid out before the items existed, so it must be measured again.
    $(".isotope").isotope("layout");
    $(window).trigger("resize");
  }

  function showError() {
    var grid = document.querySelector(".isotope");
    if (!grid) return;
    var message = document.createElement("p");
    message.innerHTML = 'Menu sa nepodarilo načítať. Zavolajte nám na <a href="tel:0917302302">0917 302 302</a> ' +
      'alebo si pozrite ponuku na <a href="https://wolt.com/sk/svk/topolcany/restaurant/coloseum-pizzeria" target="_blank" rel="noopener">Wolte</a>.';
    grid.parentNode.insertBefore(message, grid);
  }

  // no-cache revalidates with the server, so an edited menu.json shows up immediately.
  fetch("menu.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("menu.json: HTTP " + response.status);
      return response.json();
    })
    .then(render)
    .catch(function (error) {
      console.error(error);
      showError();
    });
})();
