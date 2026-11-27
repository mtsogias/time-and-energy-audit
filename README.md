# Time & Energy Audit

Wofür geht mein Tag drauf – und was gibt mir Energie, was zieht sie? Eine schnelle Handy-App, um den eigenen Tag in 30-Minuten-Blöcken zu erfassen und auszuwerten.

**Live:** https://time-and-energy-audit.vercel.app

## Was die App kann
- **Tag ab Aufwachzeit**: Die Zeitleiste baut sich ab dem Aufstehen auf, auch über Mitternacht hinaus.
- **Stempeln mit einem Tipp**: Aktivität wählen, Wert einschätzen ($ / $$ / $$$) und Energie markieren (gibt / zieht).
- **Blöcke bearbeiten**: Block antippen, Werte live ändern, mit +/− verlängern; gleiche Einträge verschmelzen automatisch.
- **Auswertung** für Tag und Woche: Anteil der wirklich wichtigen Arbeit, Zeit pro Aktivität, Energie-Bilanz, durchschnittliche Aufwachzeit.

## Technik
- Vanilla HTML, CSS und JavaScript, kein Build-Step, Mobile-First
- Daten bleiben lokal im Browser (localStorage)
- Gehostet auf Vercel
