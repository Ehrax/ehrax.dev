(() => {
  try {
    const stored = localStorage.getItem("theme-preference");
    if (stored === "light" || stored === "dark") {
      document.documentElement.dataset.theme = stored;
    }
  } catch {}
})();
