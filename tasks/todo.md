# Time & Energy Audit — Plan

## Konzept (mit Michael final abgestimmt)
- Mobile-First Web-App, Vanilla HTML/CSS/JS, kein Build-Step, Daten in localStorage, Vercel Static (zero-config)
- Tag beginnt mit **Aufwachzeit** → Blöcke bauen sich ab dann auf, 18h-Fenster, per "+ 2 Stunden"-Button verlängerbar, läuft über Mitternacht hinaus auf derselben Seite
- **Stempel-Leiste** (fixiert unten, kein Sheet): Aktivitäts-Chips (einmal eintippen, dann antippen, nach Recency sortiert), $/$$/$$$, Energie Gibt/Zieht, Dauer (1 Block / 1h / 2h / 3h, resettet nach Stempel auf 1 Block)
- Gleiche benachbarte Einträge **verschmelzen** zu einem Von–bis-Block (Text nur einmal, Range-Anzeige "13:00 – 15:00")
- Schlaf wird NICHT geloggt — Aufwachzeit ist das Schlaf-Logging, Lücke = Schlaf
- Raster-Toggle 15/30 Min (Default 30), Jetzt-Button springt zum aktuellen Block
- Analyse-Tab (Tag/7 Tage): Needle-Mover-% ($$$-Anteil), Zeit pro Aktivität (Farbe = Energie-Bilanz), $-Verteilung, Energie-Bilanz, Ø Aufwachzeit (nur Woche)
- Starter-Chips: Produktion, Mixing/Mastering, Content, Admin, Sales/Calls, Lernen, Sport, Essen, Pause, Haushalt

## Todos
- [x] tasks/todo.md Plan anlegen
- [x] index.html — Struktur (Header mit Tabs/Nav, Timeline, Stamp-Bar, Analyse)
- [x] styles.css — Dark Mobile Theme
- [x] app.js — State/Storage + Wake-Flow + Timeline-Rendering
- [x] app.js — Stempeln (Split bei Überschreiben, Merge bei gleichen Nachbarn), Chips, Dauer, Raster
- [x] app.js — Analyse-View
- [x] Test: Syntax-Check, Playwright-Durchklick-Test (Wake setzen, stempeln, mergen, Analyse), 4 Screenshots verifiziert
- [x] Review-Sektion ausfüllen

## Review
**Gebaut:** 3 Dateien (index.html, styles.css, app.js), Vanilla JS, ~700 Zeilen gesamt, keine Dependencies, kein Build-Step.

**Getestet mit Playwright (iPhone-Viewport 390x844):**
- Wake-Prompt → Tag starten → Timeline baut sich ab Aufwachzeit auf ✓
- Stempeln: 08:00 + 08:30 Produktion $$$ → verschmilzt korrekt zu einem Eintrag (start 480, dur 60) ✓
- Dauer-Chip 2h → ein Tap füllt 10:00–12:00 ✓
- Energie-Farbstreifen (grün/rot), $$$-Anzeige, Von–bis-Subtitel, Löschen-× ✓
- Auto-Scroll zum Jetzt-Block (gold), Mitternachts-Trenner, Chips-Recency-Sortierung ✓
- Analyse: Needle 29%, Aktivitäts-Balken, $-Verteilung, Energie-Bilanz — alles korrekt gerechnet ✓
- Keine JS-Fehler (einziges 404 = favicon, harmlos)

**Datenmodell (localStorage):** `tea_days` (Wake/Span pro Tag), `tea_entries` (Einträge pro Tag), `tea_acts` (Chips), `tea_sel` (letzte Stempel-Auswahl), `tea_raster`.

**Bekannte Grenzen / v2-Ideen:** Daten nur auf dem Gerät (kein Sync/Export), keine Push-Erinnerungen, keine Notiz pro Block, keine Schlafdauer-Analyse.
