(function initDashboardMobileTables() {
  const MOBILE_BREAKPOINT = '(max-width: 767px)';

  function getHeaderLabels(table) {
    return Array.from(table.querySelectorAll('thead th')).map((cell) =>
      cell.textContent.replace(/\s+/g, ' ').trim()
    );
  }

  function annotateTable(table) {
    const labels = getHeaderLabels(table);
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach((row) => {
      const cells = Array.from(row.children).filter((cell) => cell.tagName === 'TD');
      const isEmptyState = cells.length === 1 && Number(cells[0].getAttribute('colspan') || 0) > 1;

      cells.forEach((cell, index) => {
        if (isEmptyState) {
          cell.dataset.cardEmpty = 'true';
          cell.removeAttribute('data-label');
          return;
        }

        cell.dataset.label = labels[index] || `Column ${index + 1}`;
        cell.removeAttribute('data-card-empty');
      });
    });
  }

  function observeTable(table) {
    const body = table.querySelector('tbody');
    if (!body) return;

    const observer = new MutationObserver(() => annotateTable(table));
    observer.observe(body, { childList: true, subtree: true });
    annotateTable(table);
  }

  function init() {
    const tables = document.querySelectorAll('[data-mobile-table]');
    if (!tables.length) return;

    tables.forEach((table) => observeTable(table));

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const refreshLabels = () => tables.forEach((table) => annotateTable(table));

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', refreshLabels);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(refreshLabels);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
    return;
  }

  init();
})();
