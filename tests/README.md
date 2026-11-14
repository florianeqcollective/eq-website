# Tests für die EQ-Website

Alles läuft mit Node 22 und Playwright (Chromium). Keine weiteren Pakete.

- `npm run test:static` prüft die Dateien selbst (Titel, Beschreibungen, canonical, Sitemap, Links, Datenschutz, Stimme, Kontaktdaten). Dauert Sekunden.
- `npm run test:browser` startet die Seite lokal und prüft sie in Chromium (JavaScript-Fehler, Umbrüche, Überlauf auf dem Handy, Cookie-Banner, keine Fremdanfragen vor Einwilligung). Dauert etwa zwei Minuten.
- `npm run test:live` prüft die veröffentlichte Seite (Sitemap-Adressen, Weiterleitungen, Backend). Läuft in CI nach jedem Deploy und täglich.

Bekannte, bewusst offene Punkte stehen in `known-issues.json`, jeweils mit Begründung. Ein neuer Fehler ist rot, ein bekannter bleibt sichtbar, aber blockiert nicht.

Neue Seite hinzufügen: HTML-Datei, Eintrag in `sitemap.xml` (oder `noindex`), Cache-Parameter `?v=` passend. Die Tests melden alles, was fehlt.
