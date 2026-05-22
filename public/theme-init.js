(() => {
  try {
    localStorage.setItem("theme-preference", "dark");
    document.documentElement.dataset.theme = "dark";
  } catch {}
})();
