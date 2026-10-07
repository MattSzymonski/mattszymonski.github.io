// REQUIREMENTS: Any modern browser (DOMContentLoaded, querySelectorAll, requestAnimationFrame)
// DESCRIPTION: Adds a horizontal scrollbar above every `.table-scroll` element on the page and keeps
//              it mirrored with the element's native bottom scrollbar, so wide tables can be scrolled
//              from the top without first scrolling to the bottom of the table.
// USAGE: Loaded automatically on all pages via layouts/partials/extra-head.html.
//        Applies to any table wrapped in <div class="table-scroll">.
// EXAMPLE USAGE: <script src="/js/table-top-scrollbar.js" defer></script>
// --- SCRIPT ---

document.addEventListener("DOMContentLoaded", () => {
  // Build a synced top scrollbar for every table scroll wrapper found on the page
  document.querySelectorAll(".table-scroll").forEach((tableWrapper) => {
    const topScrollbar = document.createElement("div");
    topScrollbar.className = "table-scroll-top";
    topScrollbar.tabIndex = -1; // keep the mirror scrollbar out of the keyboard tab order

    const spacerElement = document.createElement("div");
    spacerElement.className = "table-scroll-top-spacer";
    topScrollbar.appendChild(spacerElement);

    tableWrapper.parentNode.insertBefore(topScrollbar, tableWrapper);

    // Copy the scroll position between the two scrollers; comparing values first prevents
    // feedback loops (assigning an unchanged value does not fire another scroll event)
    const syncScrollPositions = (sourceElement, targetElement) => {
      if (targetElement.scrollLeft !== sourceElement.scrollLeft) {
        targetElement.scrollLeft = sourceElement.scrollLeft;
      }
    };

    topScrollbar.addEventListener("scroll", () => syncScrollPositions(topScrollbar, tableWrapper));
    tableWrapper.addEventListener("scroll", () => syncScrollPositions(tableWrapper, topScrollbar));

    // Match the mirror's scrollable width to the table and hide it entirely when the table fits
    const updateTopScrollbarSize = () => {
      spacerElement.style.width = `${tableWrapper.scrollWidth}px`;
      topScrollbar.style.display = tableWrapper.scrollWidth > tableWrapper.clientWidth ? "" : "none";
    };

    updateTopScrollbarSize();
    window.addEventListener("resize", updateTopScrollbarSize);
    window.addEventListener("load", updateTopScrollbarSize);

    // Fonts finishing loading can change the rendered table width after initial layout
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateTopScrollbarSize);
    }
  });
});
