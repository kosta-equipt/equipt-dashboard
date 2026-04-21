/**
 * Inline script that runs before React hydrates — sets the initial theme
 * class on <html> so we never flash the wrong palette on first paint.
 */
export function ThemeScript() {
  const code = `(() => {
    try {
      const stored = localStorage.getItem('equipt-theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored || (prefersDark ? 'dark' : 'light');
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch (_) {}
  })();`
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
