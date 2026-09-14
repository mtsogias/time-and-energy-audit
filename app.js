'use strict';

/* ================= Storage ================= */
const LS = { days: 'tea_days', entries: 'tea_entries', acts: 'tea_acts', sel: 'tea_sel', raster: 'tea_raster', lang: 'tea_lang', name: 'tea_name' };
const load = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? fb : v; } catch { return fb; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* ================= i18n ================= */
const LOCALES = { de: 'de-DE', en: 'en-US', fr: 'fr-FR' };
let lang = load(LS.lang, 'de');
const I18N = {
  de: {
    log: 'Log', analyse: 'Analyse', day: 'Tag', week: 'Woche', today: 'Heute', now: 'Jetzt',
    woke: 'Aufgewacht', change: 'ändern', midnight: 'Mitternacht', extend: '+ 2 Stunden',
    wakeQ: 'Wann bist du aufgewacht?', startDay: 'Tag starten', save: 'Speichern', cancel: 'Abbrechen',
    wakeHint: 'Dein Tag baut sich ab hier auf.', note: 'Notiz', delEntry: 'Eintrag löschen',
    shorter: 'Kürzer', longer: 'Länger', tapBlock: 'Block antippen',
    emptyBlock: 'Leerer Block \u2013 Chip wählen', newCat: '+ Neu', newAct: 'Neue Aktivität...',
    pickAct: 'Aktivität wählen',
    ok: 'OK', rename: 'Umbenennen', delete: 'Löschen', notePh: 'Notiz zu dieser Aktivität...',
    renameHint: 'Bestehende Einträge mit dieser Aktivität werden automatisch umbenannt.',
    confirmDelChip: '"{name}" wirklich löschen?\nVorhandene Einträge behalten diese Aktivität (kursiv).',
    noEntries: 'Noch keine Einträge in diesem Zeitraum.', needleMover: 'Needle Mover',
    needleTime: '$$$-Zeit: {needle} von {rated} bewerteter Zeit', unrated: 'unbewertet',
    timePerAct: 'Zeit pro Aktivität', energyColor: 'Farbe = Energie-Bilanz (Grün/Rot/Grau)',
    valDist: '$-Verteilung',
    valLegend: '$ = Busywork \u00B7 $$ = wichtig \u00B7 $$$ = bewegt die Nadel \u00B7 \u2013 = unbewertet',
    energyBal: 'Energie-Bilanz', gives: 'Gibt', drains: 'Zieht', neutralLbl: 'Neutral',
    wakeTime: 'Aufwachzeit', avgLast: '\u00D8 der letzten {n} Tage',
    settings: 'Einstellungen', language: 'Sprache', undo: 'Rückgängig',
    pdf: 'PDF', csv: 'CSV',
    custom: 'Zeitraum', rangeFrom: 'Von', rangeTo: 'Bis',
    daysOverview: 'Tage im Überblick',
    rangeHint: 'Von und Bis inklusive, maximal 90 Tage.',
    weekOverview: 'Woche im Überblick', noLog: 'kein Log',
    loggedDays: '{done} von {total} Tagen geloggt', weekNeedleHint: 'Pro Tag: Aufwachzeit \u00B7 Zeit \u00B7 Needle-%',
    logged: 'Geloggt',
    reportTitle: 'Time & Energy Audit', yourName: 'Name (für den Report)',
    namePh: 'z. B. Michael', backup: 'Daten-Backup',
    exportJson: 'Backup herunterladen', importJson: 'Backup einspielen',
    importOk: 'Backup eingespielt', importBad: 'Datei konnte nicht gelesen werden',
    confirmImport: 'Aktuelle Daten auf diesem Gerät werden ersetzt. Fortfahren?',
    daysWord: 'Tage',
    timeline: 'Ablauf', topAct: 'Top',
    valShort: { 0: '–', 1: '$', 2: '$$', 3: '$$$' },
  },
  en: {
    log: 'Log', analyse: 'Analysis', day: 'Day', week: 'Week', today: 'Today', now: 'Now',
    woke: 'Woke up', change: 'edit', midnight: 'Midnight', extend: '+ 2 hours',
    wakeQ: 'When did you wake up?', startDay: 'Start day', save: 'Save', cancel: 'Cancel',
    wakeHint: 'Your day builds from here.', note: 'Note', delEntry: 'Delete entry',
    shorter: 'Shorter', longer: 'Longer', tapBlock: 'Tap a block',
    emptyBlock: 'Empty block \u2013 pick a chip', newCat: '+ New', newAct: 'New activity...',
    pickAct: 'Pick activity',
    ok: 'OK', rename: 'Rename', delete: 'Delete', notePh: 'Note for this activity...',
    renameHint: 'Existing entries with this activity will be renamed automatically.',
    confirmDelChip: 'Delete "{name}"?\nExisting entries keep this activity (italic).',
    noEntries: 'No entries in this period yet.', needleMover: 'Needle Mover',
    needleTime: '$$$ time: {needle} of {rated} rated time', unrated: 'unrated',
    timePerAct: 'Time per activity', energyColor: 'Color = energy balance (green/red/grey)',
    valDist: '$ Distribution',
    valLegend: '$ = busywork \u00B7 $$ = important \u00B7 $$$ = moves the needle \u00B7 \u2013 = unrated',
    energyBal: 'Energy Balance', gives: 'Gives', drains: 'Drains', neutralLbl: 'Neutral',
    wakeTime: 'Wake time', avgLast: 'Avg of last {n} days',
    settings: 'Settings', language: 'Language', undo: 'Undo',
    pdf: 'PDF', csv: 'CSV',
    custom: 'Range', rangeFrom: 'From', rangeTo: 'To',
    daysOverview: 'Days at a glance',
    rangeHint: 'From and to are inclusive, 90 days max.',
    weekOverview: 'Week at a glance', noLog: 'no log',
    loggedDays: '{done} of {total} days logged', weekNeedleHint: 'Per day: wake \u00B7 time \u00B7 needle %',
    logged: 'Logged',
    reportTitle: 'Time & Energy Audit', yourName: 'Name (for the report)',
    namePh: 'e.g. Michael', backup: 'Data backup',
    exportJson: 'Download backup', importJson: 'Restore backup',
    importOk: 'Backup restored', importBad: 'Could not read that file',
    confirmImport: 'This will replace the data on this device. Continue?',
    daysWord: 'days',
    timeline: 'Timeline', topAct: 'Top',
    valShort: { 0: '–', 1: '$', 2: '$$', 3: '$$$' },
  },
  fr: {
    log: 'Journal', analyse: 'Analyse', day: 'Jour', week: 'Semaine', today: 'Aujourd\'hui', now: 'Maintenant',
    woke: 'Reveil', change: 'modifier', midnight: 'Minuit', extend: '+ 2 heures',
    wakeQ: 'Quand t\'es-tu reveille ?', startDay: 'Demarrer', save: 'Enregistrer', cancel: 'Annuler',
    wakeHint: 'Ta journee se construit ici.', note: 'Note', delEntry: 'Supprimer',
    shorter: 'Plus court', longer: 'Plus long', tapBlock: 'Toucher un bloc',
    emptyBlock: 'Bloc vide \u2013 choisir un chip', newCat: '+ Nouveau', newAct: 'Nouvelle activite...',
    pickAct: 'Choisir une activite',
    ok: 'OK', rename: 'Renommer', delete: 'Supprimer', notePh: 'Note pour cette activite...',
    renameHint: 'Les entrees existantes seront renommees automatiquement.',
    confirmDelChip: 'Supprimer "{name}" ?\nLes entrees existantes gardent cette activite (italique).',
    noEntries: 'Aucune entree sur cette periode.', needleMover: 'Needle Mover',
    needleTime: 'Temps $$$ : {needle} sur {rated} evalue', unrated: 'non evalue',
    timePerAct: 'Temps par activite', energyColor: 'Couleur = bilan d\'energie (vert/rouge/gris)',
    valDist: 'Distribution $',
    valLegend: '$ = peu utile \u00B7 $$ = important \u00B7 $$$ = fait avancer \u00B7 \u2013 = non evalue',
    energyBal: 'Bilan d\'energie', gives: 'Donne', drains: 'Pompe', neutralLbl: 'Neutre',
    wakeTime: 'Heure de reveil', avgLast: 'Moy. des {n} derniers jours',
    settings: 'Reglages', language: 'Langue', undo: 'Annuler',
    pdf: 'PDF', csv: 'CSV',
    custom: 'Periode', rangeFrom: 'Du', rangeTo: 'Au',
    daysOverview: 'Jours en un coup d\'oeil',
    rangeHint: 'Du et au inclus, 90 jours max.',
    weekOverview: 'Semaine en un coup d\'oeil', noLog: 'pas de journal',
    loggedDays: '{done} jours sur {total}', weekNeedleHint: 'Par jour : reveil \u00B7 temps \u00B7 needle %',
    logged: 'Journalise',
    reportTitle: 'Time & Energy Audit', yourName: 'Nom (pour le rapport)',
    namePh: 'ex. Michael', backup: 'Sauvegarde',
    exportJson: 'Telecharger la sauvegarde', importJson: 'Restaurer',
    importOk: 'Sauvegarde restauree', importBad: 'Fichier illisible',
    confirmImport: 'Les donnees de cet appareil seront remplacees. Continuer ?',
    daysWord: 'jours',
    timeline: 'Deroule', topAct: 'Top',
    valShort: { 0: '–', 1: '$', 2: '$$', 3: '$$$' },
  },
};
const t = (k, vars) => {
  let s = (I18N[lang] && I18N[lang][k]) || (I18N.de[k]) || k;
  if (typeof s !== 'string') return s;
  if (vars) for (const v in vars) s = s.replace(`{${v}}`, vars[v]);
  return s;
};
/* ================= Helpers ================= */
const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const dstr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtT = min => `${pad(Math.floor((min % 1440) / 60))}:${pad(min % 60)}`; // Uhrzeit, wrapt nach Mitternacht
const fmtDur = min => { const h = Math.floor(min / 60), m = min % 60; if (!h) return `${m}m`; return m ? `${h}h ${m}m` : `${h}h`; };
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const esc = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
const loc = () => LOCALES[lang] || 'de-DE';
const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
const startOfWeek = d => addDays(d, -((d.getDay() + 6) % 7)); // Montag
const weekDays = d => { const mon = startOfWeek(d); return Array.from({ length: 7 }, (_, i) => addDays(mon, i)); };
const parseKey = k => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(k || '');
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return dstr(d) === k ? d : null;
};
const daysBetween = (a, b) => Math.round((addDays(b, 0) - addDays(a, 0)) / 86400000);
const fmtRange = (a, b) => {
  const sameYear = a.getFullYear() === b.getFullYear();
  const opt = { day: 'numeric', month: 'short', year: sameYear ? undefined : 'numeric' };
  return `${a.toLocaleDateString(loc(), opt)} \u2013 ${b.toLocaleDateString(loc(), opt)}`;
};
const weekdayShort = d => d.toLocaleDateString(loc(), { weekday: 'short' }).replace(/\.$/, '');
const dayNum = d => d.toLocaleDateString(loc(), { day: 'numeric', month: 'numeric' });
const energyWord = n => n > 0 ? t('gives') : n < 0 ? t('drains') : t('neutralLbl');
const valLabel = v => (t('valShort') && t('valShort')[v]) || (v ? '$'.repeat(v) : '\u2013');
function setStampbarVisible(on) {
  $('#stampbar').classList.toggle('hidden', !on);
  document.body.classList.toggle('no-stamp', !on);
  if (!on) closeActMenu();
}

/* ================= Undo ================= */
function pushUndo() {
  undoStack.push({
    days: JSON.parse(JSON.stringify(days)),
    entries: JSON.parse(JSON.stringify(entries)),
    acts: acts.slice(),
  });
  if (undoStack.length > 50) undoStack.shift();
  $('#undo-btn').classList.remove('hidden');
}
function undo() {
  const snap = undoStack.pop();
  if (!snap) return;
  days = snap.days; entries = snap.entries; acts = snap.acts;
  save(LS.days, days); save(LS.entries, entries); save(LS.acts, acts);
  if (!undoStack.length) $('#undo-btn').classList.add('hidden');
  activeStart = null;
  refresh();
}

/* ================= State ================= */
// days:    { 'YYYY-MM-DD': { wake: Minuten seit 0:00, span: Stunden } }
// entries: { 'YYYY-MM-DD': [{ id, start, dur, activity, value (0-3), energy (-1|0|1), note }] }
//          start/dur in Minuten, start darf > 1440 sein (nach Mitternacht, gleiche Tagesseite)
const DEFAULT_ACTS = {
  de: ['Produktion', 'Content', 'Admin', 'Sales', 'Lernen', 'Sport', 'Essen', 'Pause', 'Haushalt'],
  en: ['Production', 'Content', 'Admin', 'Sales', 'Learning', 'Workout', 'Food', 'Break', 'Chores'],
  fr: ['Production', 'Contenu', 'Admin', 'Sales', 'Apprentissage', 'Sport', 'Repas', 'Pause', 'Menage'],
};
const defaultActs = () => DEFAULT_ACTS[lang] || DEFAULT_ACTS.de;
const DEFAULT_SPAN = 18;
const RASTER = 30; // Minuten, fest
const MAX_CUSTOM_DAYS = 90;

let days = load(LS.days, {});
let entries = load(LS.entries, {});
let acts = load(LS.acts, defaultActs().slice());
let sel = load(LS.sel, { activity: acts[0] || null, value: 2, energy: 1 });
let displayName = load(LS.name, '');
let viewDate = new Date();
if (viewDate.getHours() < 5) viewDate.setDate(viewDate.getDate() - 1); // Nacht gehoert zum Vortag
let view = 'log';
let range = 'day'; // 'day' | 'week' | 'custom'
let customFrom = null;
let customTo = null;
let activeStart = null; // aktuell ausgewaehlter Block-Start (Minuten) oder null
let scrollFlag = true;  // beim naechsten Render zum Jetzt-Block scrollen
let undoStack = [];     // Snapshots von {days, entries} fuer Rueckgaengig

const key = () => dstr(viewDate);
const dayData = () => days[key()] || null;
const dayEntries = () => entries[key()] || [];
function wakeStart() {
  return Math.floor((dayData()?.wake || 0) / RASTER) * RASTER;
}
function winStart() {
  const wake = wakeStart();
  const first = dayEntries().reduce((m, e) => Math.min(m, e.start), Infinity);
  const start = Number.isFinite(first) ? Math.min(wake, first) : wake;
  return Math.floor(start / RASTER) * RASTER;
}
function winEnd() {
  let end = wakeStart() + (dayData()?.span || DEFAULT_SPAN) * 60;
  const last = dayEntries().reduce((m, e) => Math.max(m, e.start + e.dur), 0);
  if (last > end) end = last;
  return Math.ceil(end / RASTER) * RASTER;
}

/* ================= Timeline ================= */
function renderLog() {
  const tl = $('#timeline');
  const keepScroll = !scrollFlag ? window.scrollY : 0;
  tl.innerHTML = '';
  const d = dayData();

  if (!d) {
    setStampbarVisible(false);
    renderWakePrompt(tl, false);
    window.scrollTo({ top: 0 });
    return;
  }

  setStampbarVisible(view === 'log');

  // Aufwach-Zeile
  const wr = document.createElement('button');
  wr.className = 'wake-row';
  wr.innerHTML = `<span>${t('woke')}</span><strong>${fmtT(d.wake)}</strong><span class="wake-edit">${t('change')}</span>`;
  wr.addEventListener('click', () => renderWakeEdit(tl, wr));
  tl.appendChild(wr);

  const list = dayEntries();
  const now = new Date();
  const isToday = key() === dstr(todayDate());
  // Vor 5 Uhr gehoert die Nacht zum Vortag: aktuelle Uhrzeit um 24h versetzen,
  // damit der Jetzt-Marker auf den Nachmittslots (Minuten > 1440) landet
  let nowMin = now.getHours() * 60 + now.getMinutes();
  if (now.getHours() < 5) nowMin += 1440;
  let nowEl = null;
  let broke = false;

  for (let ts = winStart(); ts < winEnd(); ts += RASTER) {
    if (ts >= 1440 && !broke) {
      broke = true;
      const div = document.createElement('div');
      div.className = 'daybreak';
      div.textContent = t('midnight');
      tl.appendChild(div);
    }

    const slot = document.createElement('div');
    slot.className = 'slot';

    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = fmtT(ts);
    slot.appendChild(time);

    const covering = list.find(e => ts >= e.start && ts < e.start + e.dur);

    if (covering) {
      const isStart = covering.start === ts;
      const sameNext = list.some(e => e.id === covering.id && ts + RASTER >= e.start && ts + RASTER < e.start + e.dur);
      slot.classList.add('filled', covering.energy > 0 ? 'pos' : (covering.energy < 0 ? 'neg' : 'neutral'));
      slot.classList.add(isStart ? (sameNext ? 'grp-start' : 'grp-single') : (sameNext ? 'grp-mid' : 'grp-end'));

      if (isStart) {
        const c = document.createElement('div');
        c.className = 'slot-content';
        const archived = !acts.includes(covering.activity);
        const noteHTML = covering.note ? `<span class="slot-note">${esc(covering.note)}</span>` : '';
        c.innerHTML =
          `<div class="slot-main">` +
            `<span class="slot-act${archived ? ' archived' : ''}">${esc(covering.activity)}</span>` +
            (noteHTML || `<span class="slot-sub">${fmtT(covering.start)} \u2013 ${fmtT(covering.start + covering.dur)}</span>`) +
          `</div>` +
          `<span class="slot-val">${covering.value ? '$'.repeat(covering.value) : '\u2013'}</span>`;
        slot.appendChild(c);
        const noteBtn = document.createElement('button');
        noteBtn.className = 'del note-btn';
        noteBtn.innerHTML = covering.note ? '\u270E' : '+';
        noteBtn.setAttribute('aria-label', t('note'));
        noteBtn.addEventListener('click', ev => { ev.stopPropagation(); editNote(covering.id); });
        slot.appendChild(noteBtn);
        const del = document.createElement('button');
        del.className = 'del';
        del.textContent = '\u00D7';
        del.setAttribute('aria-label', t('delEntry'));
        del.addEventListener('click', ev => { ev.stopPropagation(); deleteEntry(covering.id); });
        slot.appendChild(del);
      } else {
        slot.classList.add('cont');
      }
    } else {
      slot.classList.add('empty');
      const p = document.createElement('span');
      p.className = 'plus';
      p.textContent = '+';
      slot.appendChild(p);
    }

    if (covering ? covering.start === activeStart : ts === activeStart) slot.classList.add('active');

    if (isToday && nowMin >= ts && nowMin < ts + RASTER) {
      slot.classList.add('now');
      nowEl = slot;
    }

    slot.addEventListener('click', () => toggleActive(ts));
    tl.appendChild(slot);
  }

  // Tag verlaengern
  const ext = document.createElement('button');
  ext.className = 'extend';
  ext.textContent = t('extend');
  ext.addEventListener('click', () => {
    pushUndo();
    d.span = (d.span || DEFAULT_SPAN) + 2;
    save(LS.days, days);
    renderLog();
  });
  tl.appendChild(ext);

  if (scrollFlag) {
    scrollFlag = false;
    if (nowEl) nowEl.scrollIntoView({ block: 'center' });
    else window.scrollTo({ top: 0 });
  } else if (keepScroll) {
    window.scrollTo({ top: keepScroll });
  }
}

/* ================= Wake Edit (Inline, Bloecke bleiben sichtbar) ================= */
function renderWakeEdit(tl, wr) {
  const d = dayData();
  if (!d) return;

  const edit = document.createElement('div');
  edit.className = 'wake-row wake-edit-row';
  edit.innerHTML =
    `<span>${t('woke')}</span>` +
    `<input type="time" id="wake-edit-input" value="${fmtT(d.wake)}">` +
    `<button id="wake-edit-save" class="wake-edit-save">${t('ok')}</button>` +
    `<button id="wake-edit-cancel" class="wake-edit-cancel">x</button>`;
  wr.replaceWith(edit);

  const input = edit.querySelector('#wake-edit-input');
  input.focus();

  const finish = (commit) => {
    if (commit) {
      const val = input.value;
      if (val) {
        const [h, m] = val.split(':').map(Number);
        pushUndo();
        d.wake = h * 60 + m;
        save(LS.days, days);
      }
    }
    renderLog();
  };

  edit.querySelector('#wake-edit-save').addEventListener('click', () => finish(true));
  edit.querySelector('#wake-edit-cancel').addEventListener('click', () => finish(false));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') finish(true);
    if (e.key === 'Escape') finish(false);
  });
}

/* ================= Wake Prompt ================= */
function renderWakePrompt(tl, edit) {
  tl.innerHTML = '';
  const now = new Date();
  const isToday = key() === dstr(todayDate());
  const morning = now.getHours() >= 5;
  const def = edit && dayData()
    ? fmtT(dayData().wake)
    : (isToday && morning ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : '08:00');

  const card = document.createElement('div');
  card.className = 'wake-card';
  card.innerHTML =
    `<h2>${t('wakeQ')}</h2>` +
    `<div class="wake-input-row">` +
      `<input type="time" id="wake-input" value="${def}">` +
      `<button id="wake-save">${edit ? t('save') : t('startDay')}</button>` +
    `</div>` +
    (edit
      ? `<button class="wake-cancel">${t('cancel')}</button>`
      : `<p class="wake-hint">${t('wakeHint')}</p>`);
  tl.appendChild(card);

  $('#wake-save').addEventListener('click', () => {
    const v = $('#wake-input').value;
    if (!v) return;
    const [h, m] = v.split(':').map(Number);
    const prev = dayData();
    pushUndo();
    days[key()] = { wake: h * 60 + m, span: prev && prev.span ? prev.span : DEFAULT_SPAN };
    save(LS.days, days);
    scrollFlag = true;
    renderLog();
  });

  if (edit) {
    card.querySelector('.wake-cancel').addEventListener('click', () => renderLog());
  }
}

/* ================= Aktiver Block (Auswahl + Live-Bearbeitung) ================= */
function toggleActive(ts) {
  const list = dayEntries();
  // Slot innerhalb eines bestehenden Eintrags -> Eintrag-Start aktivieren
  const covering = list.find(e => ts >= e.start && ts < e.start + e.dur);
  if (covering) {
    activeStart = covering.start;
    renderLog(); updateBarFromActive();
    return;
  }
  activeStart = (activeStart === ts) ? null : ts;
  renderLog();
  updateBarFromActive();
}

function activeEntry() {
  if (activeStart == null) return null;
  return dayEntries().find(e => e.start === activeStart) || null;
}

// Leiste aus dem aktiven Block laden (oder Default, wenn leerer Block aktiv)
function updateBarFromActive() {
  const e = activeEntry();
  if (e) {
    sel.activity = e.activity; sel.value = e.value; sel.energy = e.energy;
    save(LS.sel, sel);
  }
  renderChips(); renderSel(); renderDur();
}

function sameStamp(a, b) {
  return a.activity === b.activity && a.value === b.value && a.energy === b.energy
    && (a.note || '') === (b.note || '');
}

// Leisten-Aktionen aendern den aktiven Block live
function applyToActive() {
  if (activeStart == null) return;
  const k = key();
  let list = dayEntries();
  const existing = list.find(e => e.start === activeStart);
  if (!existing && !sel.activity) return;
  const coverStart = activeStart;
  pushUndo();

  if (existing) {
    existing.activity = sel.activity || existing.activity;
    existing.value = sel.value;
    existing.energy = sel.energy;
  } else {
    list = list.filter(e => !(coverStart >= e.start && coverStart < e.start + e.dur));
    list.push({ id: uid(), start: coverStart, dur: RASTER, activity: sel.activity, value: sel.value, energy: sel.energy });
    entries[k] = list;
  }

  if (sel.activity) touchAct(sel.activity);
  entries[k] = mergeAdjacent(list).sort((a, b) => a.start - b.start);
  save(LS.entries, entries);
  const merged = entries[k].find(e => coverStart >= e.start && coverStart < e.start + e.dur);
  if (merged) activeStart = merged.start;
  renderLog();
  renderChips();
  renderDur();
}

function mergeAdjacent(list) {
  const out = [];
  const sorted = [...list].sort((a, b) => a.start - b.start);
  for (const e of sorted) {
    const prev = out[out.length - 1];
    if (prev && prev.start + prev.dur === e.start && sameStamp(prev, e)) {
      prev.dur += e.dur;
    } else {
      out.push({ ...e });
    }
  }
  return out;
}

function grow() {
  if (activeStart == null) return;
  const k = key();
  let list = dayEntries();
  const e = list.find(x => x.start === activeStart);
  if (!e) return;
  const end = e.start + e.dur;
  const blocker = list.find(x => x.id !== e.id && x.start < end + RASTER && x.start + x.dur > end);
  if (blocker) {
    if (blocker.start === end && sameStamp(e, blocker)) {
      pushUndo();
      e.dur += blocker.dur;
      entries[k] = list.filter(x => x.id !== blocker.id).sort((a, b) => a.start - b.start);
      save(LS.entries, entries);
      renderLog();
      renderDur();
    }
    return;
  }
  pushUndo();
  e.dur += RASTER;
  const d = dayData();
  if (d && e.start + e.dur > wakeStart() + (d.span || DEFAULT_SPAN) * 60) {
    d.span = Math.ceil((e.start + e.dur - wakeStart()) / 60);
    save(LS.days, days);
  }
  entries[k] = list.sort((a, b) => a.start - b.start);
  save(LS.entries, entries);
  renderLog();
  renderDur();
}

function shrink() {
  if (activeStart == null) return;
  const k = key();
  let list = dayEntries();
  const e = list.find(x => x.start === activeStart);
  if (!e || e.dur <= RASTER) return;
  pushUndo();
  e.dur -= RASTER;
  entries[k] = list.sort((a, b) => a.start - b.start);
  save(LS.entries, entries);
  renderLog();
  renderDur();
}

function deleteEntry(id) {
  const k = key();
  pushUndo();
  entries[k] = dayEntries().filter(x => x.id !== id);
  save(LS.entries, entries);
  if (activeStart != null && !dayEntries().some(e => e.start === activeStart)) activeStart = null;
  renderLog();
  updateBarFromActive();
}

function deleteActive() {
  const e = activeEntry();
  if (e) deleteEntry(e.id);
}

function editNote(id) {
  const e = dayEntries().find(x => x.id === id);
  if (!e) return;
  showModal(t('note'),
    `<textarea id="note-input" placeholder="${t('notePh')}">${esc(e.note || '')}</textarea>`,
    [
      { label: t('cancel'), class: 'btn-secondary' },
      { label: t('delete'), class: 'btn-danger', onClick: () => {
        pushUndo();
        e.note = '';
        save(LS.entries, entries);
        renderLog();
      }},
      { label: t('save'), class: 'btn-primary', onClick: (body) => {
        pushUndo();
        e.note = body.querySelector('#note-input').value.trim();
        save(LS.entries, entries);
        renderLog();
      }},
    ]
  );
  setTimeout(() => $('#note-input').focus(), 50);
}

/* ================= Modal ================= */
function showModal(title, bodyHTML, actions) {
  const overlay = $('#modal-overlay');
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = bodyHTML;
  const actsEl = $('#modal-actions');
  actsEl.innerHTML = '';
  actions.forEach(a => {
    const b = document.createElement('button');
    b.textContent = a.label;
    b.className = a.class || 'btn-secondary';
    b.addEventListener('click', () => {
      if (a.onClick) a.onClick($('#modal-body'));
      if (a.close !== false) closeModal();
    });
    actsEl.appendChild(b);
  });
  overlay.classList.remove('hidden');
}

function closeModal() {
  $('#modal-overlay').classList.add('hidden');
  $('#modal-title').textContent = '';
  $('#modal-body').innerHTML = '';
  $('#modal-actions').innerHTML = '';
}

/* ================= Chips / Stamp-Bar ================= */
function touchAct(name) {
  acts = [name, ...acts.filter(a => a !== name)];
  save(LS.acts, acts);
}

function actMenuOpen() {
  return !$('#act-menu').classList.contains('hidden');
}

function setActMenu(open) {
  const y = window.scrollY;
  $('#act-menu').classList.toggle('hidden', !open);
  $('#act-picker').classList.toggle('open', open);
  $('#act-backdrop').classList.toggle('hidden', !open);
  $('#act-trigger').setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) {
    const menu = $('#act-menu');
    const selItem = menu.querySelector('.act-item.sel');
    if (selItem) {
      const top = selItem.offsetTop - menu.clientHeight / 2 + selItem.clientHeight / 2;
      menu.scrollTop = Math.max(0, top);
    }
  }
  if (window.scrollY !== y) window.scrollTo(0, y);
}

function closeActMenu() { setActMenu(false); }

function toggleActMenu() { setActMenu(!actMenuOpen()); }

function renderChips() {
  const label = $('#act-trigger-label');
  if (sel.activity) {
    label.textContent = sel.activity;
    label.classList.remove('placeholder');
  } else {
    label.textContent = t('pickAct');
    label.classList.add('placeholder');
  }

  const w = $('#act-menu');
  w.innerHTML = '';
  const listed = acts.slice().sort((a, b) => a.localeCompare(b, loc(), { sensitivity: 'base' }));
  listed.forEach(a => {
    const c = document.createElement('div');
    c.className = 'act-item' + (a === sel.activity ? ' sel' : '');
    c.setAttribute('role', 'option');
    c.setAttribute('aria-selected', a === sel.activity ? 'true' : 'false');
    c.tabIndex = 0;
    c.textContent = a;
    attachChip(c, a);
    w.appendChild(c);
  });
}

let suppressClick = false;

function attachChip(el, name) {
  let timer = null;
  let sx = 0, sy = 0;
  el.addEventListener('pointerdown', (e) => {
    suppressClick = false;
    sx = e.clientX; sy = e.clientY;
    timer = setTimeout(() => {
      timer = null;
      suppressClick = true;
      if (navigator.vibrate) navigator.vibrate(15);
      askDeleteChip(name);
    }, 500);
  });
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
  el.addEventListener('pointermove', (e) => {
    if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) cancel();
  });
  el.addEventListener('pointerup', cancel);
  el.addEventListener('pointerleave', cancel);
  el.addEventListener('pointercancel', cancel);
  el.addEventListener('click', () => {
    if (suppressClick) { suppressClick = false; return; }
    selectChip(name);
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!suppressClick) selectChip(name);
    }
  });
}

function selectChip(name) {
  sel.activity = name;
  save(LS.sel, sel);
  closeActMenu();
  renderChips();
  applyToActive();
}

function askDeleteChip(name) {
  closeActMenu();
  showModal(name,
    `<input type="text" id="chip-rename" value="${esc(name)}" maxlength="30">
     <div class="modal-hint">${t('renameHint')}</div>`,
    [
      { label: t('rename'), class: 'btn-primary', onClick: (body) => {
        const newName = body.querySelector('#chip-rename').value.trim();
        if (newName && newName !== name) renameChip(name, newName);
      }},
      { label: t('delete'), class: 'btn-danger', onClick: () => {
        if (confirm(t('confirmDelChip', { name }))) removeChip(name);
      }},
      { label: t('cancel'), class: 'btn-secondary' },
    ]
  );
}

function renameChip(oldName, newName) {
  const i = acts.indexOf(oldName);
  if (i < 0) return;
  pushUndo();
  acts[i] = newName;
  save(LS.acts, acts);
  if (sel.activity === oldName) { sel.activity = newName; save(LS.sel, sel); }
  // Alle Eintraege systemweit umbenennen
  for (const k in entries) {
    let changed = false;
    for (const e of entries[k]) {
      if (e.activity === oldName) { e.activity = newName; changed = true; }
    }
    if (changed) save(LS.entries, entries);
  }
  renderChips();
  renderLog();
  if (view === 'analyse') renderAnalysis();
}

function removeChip(name) {
  pushUndo();
  acts = acts.filter(a => a !== name);
  save(LS.acts, acts);
  if (sel.activity === name) { sel.activity = acts[0] || null; save(LS.sel, sel); }
  renderChips();
  renderLog();
  if (view === 'analyse') renderAnalysis();
}

function openNewActivity() {
  closeActMenu();
  $('#new-activity-row').classList.remove('hidden');
  $('#new-activity-input').focus();
}

function addActivity() {
  const i = $('#new-activity-input');
  const name = i.value.trim();
  if (!name) return;
  touchAct(name);
  sel.activity = name;
  save(LS.sel, sel);
  i.value = '';
  $('#new-activity-row').classList.add('hidden');
  renderChips();
  applyToActive();
}

function renderSel() {
  document.querySelectorAll('#value-select button').forEach(b => b.classList.toggle('active', +b.dataset.v === sel.value));
  document.querySelectorAll('#energy-select button').forEach(b => b.classList.toggle('active', +b.dataset.e === sel.energy));
}

function renderDur() {
  const txt = $('#dur-text');
  const minus = $('#dur-minus');
  const plus = $('#dur-plus');
  if (activeStart == null) {
    txt.textContent = t('tapBlock');
    minus.disabled = true; plus.disabled = true;
    return;
  }
  const e = activeEntry();
  if (!e) {
    txt.textContent = t('emptyBlock');
    minus.disabled = true; plus.disabled = true;
    return;
  }
  txt.textContent = `${fmtT(e.start)} \u2013 ${fmtT(e.start + e.dur)} (${fmtDur(e.dur)})`;
  minus.disabled = e.dur <= RASTER;
  // Plus blockiert, wenn naechster Slot belegt (ausser identischer Nachbar zum Mergen)
  const end = e.start + e.dur;
  const blocker = dayEntries().find(x => x.id !== e.id && x.start < end + RASTER && x.start + x.dur > end);
  plus.disabled = !!(blocker && !(blocker.start === end && sameStamp(e, blocker)));
}

/* ================= Analyse ================= */
function ensureCustomRange() {
  if (customFrom && customTo) return;
  const week = weekDays(viewDate);
  customFrom = week[0];
  customTo = week[6];
}

function applyCustomRange(fromStr, toStr) {
  let from = parseKey(fromStr);
  let to = parseKey(toStr);
  if (!from || !to) return false;
  if (to < from) { const tmp = from; from = to; to = tmp; }
  if (daysBetween(from, to) + 1 > MAX_CUSTOM_DAYS) to = addDays(from, MAX_CUSTOM_DAYS - 1);
  customFrom = from;
  customTo = to;
  viewDate = to;
  return true;
}

function datesInRange(from, to) {
  const n = Math.max(0, daysBetween(from, to));
  return Array.from({ length: n + 1 }, (_, i) => addDays(from, i));
}

function periodDates() {
  if (range === 'week') return weekDays(viewDate);
  if (range === 'custom') {
    ensureCustomRange();
    return datesInRange(customFrom, customTo);
  }
  return [new Date(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate())];
}

function openCustomRangeModal() {
  ensureCustomRange();
  showModal(t('custom'),
    `<label class="range-field">${esc(t('rangeFrom'))}` +
      `<input type="date" id="range-from" value="${dstr(customFrom)}">` +
    `</label>` +
    `<label class="range-field">${esc(t('rangeTo'))}` +
      `<input type="date" id="range-to" value="${dstr(customTo)}">` +
    `</label>` +
    `<div class="modal-hint">${esc(t('rangeHint'))}</div>`,
    [
      { label: t('cancel'), class: 'btn-secondary' },
      { label: t('ok'), class: 'btn-primary', onClick: () => {
        applyCustomRange($('#range-from')?.value, $('#range-to')?.value);
        renderDayLabel();
        if (view === 'analyse') renderAnalysis();
      }},
    ]
  );
}

function collect() {
  const all = [];
  for (const d of periodDates()) all.push(...(entries[dstr(d)] || []));
  return all;
}

function statsFor(list) {
  const sum = (pred) => list.reduce((s, e) => s + (pred(e) ? e.dur : 0), 0);
  const total = sum(() => true);
  const needle = sum(e => e.value === 3);
  const rated = sum(e => e.value > 0);
  const neutral = sum(e => e.value === 0);
  const green = sum(e => e.energy > 0);
  const red = sum(e => e.energy < 0);
  const neutralEn = sum(e => e.energy === 0);
  const byVal = { 0: 0, 1: 0, 2: 0, 3: 0 };
  list.forEach(e => { byVal[e.value] = (byVal[e.value] || 0) + e.dur; });
  const byAct = {};
  list.forEach(e => {
    const a = byAct[e.activity] || (byAct[e.activity] = { min: 0, g: 0, r: 0, n: 0 });
    a.min += e.dur;
    if (e.energy > 0) a.g += e.dur; else if (e.energy < 0) a.r += e.dur; else a.n += e.dur;
  });
  const topAct = Object.entries(byAct).sort((a, b) => b[1].min - a[1].min)[0];
  return {
    total, needle, rated, neutral, green, red, neutralEn, byVal, byAct,
    needlePct: rated > 0 ? Math.round(needle / rated * 100) : null,
    topAct: topAct ? topAct[0] : null,
  };
}

function dayBundle(dateObj) {
  const k = dstr(dateObj);
  const list = entries[k] || [];
  const dd = days[k];
  return { key: k, date: dateObj, wake: dd ? dd.wake : null, started: !!dd, list, stats: statsFor(list) };
}

function card(title, inner) {
  const d = document.createElement('div');
  d.className = 'card';
  d.innerHTML = `<h2>${title}</h2>${inner}`;
  return d;
}

function barRow(label, pct, color, val) {
  return `<div class="bar-row">` +
    `<span class="bar-label">${label}</span>` +
    `<div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>` +
    `<span class="bar-val">${val}</span>` +
  `</div>`;
}

function kpi(label, num, extraClass) {
  return `<div class="kpi"><div class="kpi-n${extraClass ? ' ' + extraClass : ''}">${num}</div><div class="kpi-l">${label}</div></div>`;
}

function renderExportBar() {
  const bar = document.createElement('div');
  bar.className = 'export-bar';
  bar.innerHTML =
    `<button class="primary" data-ex="pdf">${t('pdf')}</button>` +
    `<button data-ex="csv">${t('csv')}</button>`;
  bar.addEventListener('click', ev => {
    const btn = ev.target.closest('button');
    if (!btn) return;
    if (btn.dataset.ex === 'pdf') exportPDF();
    if (btn.dataset.ex === 'csv') exportCSV();
  });
  return bar;
}

function renderWeekStrip(box, bundles) {
  const logged = bundles.filter(b => b.started || b.list.length).length;
  const rows = bundles.map(b => {
    const today = dstr(todayDate()) === b.key;
    if (!b.started && !b.list.length) {
      return `<button class="week-day empty${today ? ' today' : ''}" data-date="${b.key}">` +
        `<span class="wd-name">${esc(weekdayShort(b.date))}</span>` +
        `<span class="wd-date">${esc(dayNum(b.date))}</span>` +
        `<span class="wd-meta">${t('noLog')}</span>` +
        `<span class="wd-needle muted">\u2013</span>` +
      `</button>`;
    }
    const s = b.stats;
    const g = s.total ? Math.round(s.green / s.total * 100) : 0;
    const r = s.total ? Math.round(s.red / s.total * 100) : 0;
    const needle = s.needlePct == null ? '\u2013' : `${s.needlePct}%`;
    const meta = [b.wake != null ? fmtT(b.wake) : null, s.total ? fmtDur(s.total) : null].filter(Boolean).join(' \u00B7 ');
    const bar = `linear-gradient(to right, var(--green) 0 ${g}%, var(--red) ${g}% ${g + r}%, var(--neutral) ${g + r}% 100%)`;
    return `<button class="week-day${today ? ' today' : ''}" data-date="${b.key}">` +
      `<span class="wd-name">${esc(weekdayShort(b.date))}</span>` +
      `<span class="wd-date">${esc(dayNum(b.date))}</span>` +
      `<span class="wd-meta">${esc(meta)}</span>` +
      `<span class="energy-mini" aria-hidden="true" style="background:${bar}"></span>` +
      `<span class="wd-needle">${needle}</span>` +
    `</button>`;
  }).join('');

  const wrap = card(
    range === 'week' ? t('weekOverview') : t('daysOverview'),
    `<div class="hint" style="margin:0 0 10px">${t('loggedDays', { done: logged, total: bundles.length })} \u00B7 ${t('weekNeedleHint')}</div>` +
    `<div class="week-days">${rows}</div>`
  );
  wrap.querySelectorAll('.week-day').forEach(btn => {
    btn.addEventListener('click', () => {
      const [y, m, d] = btn.dataset.date.split('-').map(Number);
      viewDate = new Date(y, m - 1, d);
      scrollFlag = true;
      switchView('log');
      refresh();
    });
  });
  box.appendChild(wrap);
}

function renderAnalysis() {
  const box = $('#analysis');
  box.innerHTML = '';
  const dates = periodDates();
  const bundles = dates.map(dayBundle);
  const list = collect();
  const s = statsFor(list);

  if (list.length) box.appendChild(renderExportBar());

  if (range !== 'day') renderWeekStrip(box, bundles);

  if (!list.length) {
    box.insertAdjacentHTML('beforeend', `<div class="card"><p class="hint">${t('noEntries')}</p></div>`);
    return;
  }

  const wakes = bundles.filter(b => b.wake != null).map(b => b.wake);
  const avgWake = wakes.length ? Math.round(wakes.reduce((a, b) => a + b, 0) / wakes.length) : null;

  box.appendChild(card(t('needleMover'),
    `<div class="kpis">` +
      kpi(t('needleMover'), s.needlePct == null ? '\u2013' : `${s.needlePct}%`, 'amber') +
      kpi(t('logged'), fmtDur(s.total)) +
      kpi(t('gives') + ' / ' + t('drains'), `${fmtDur(s.green)} / ${fmtDur(s.red)}`) +
      kpi(t('wakeTime'), avgWake != null ? fmtT(avgWake) : '\u2013') +
    `</div>` +
    `<div class="hint">${t('needleTime', { needle: fmtDur(s.needle), rated: fmtDur(s.rated) })}` +
    (s.neutral > 0 ? ` \u00B7 ${fmtDur(s.neutral)} ${t('unrated')}` : '') +
    `</div>`));

  const sorted = Object.entries(s.byAct).sort((a, b) => b[1].min - a[1].min);
  const max = sorted[0][1].min;
  box.appendChild(card(t('timePerAct'),
    sorted.map(([n, a]) => {
      const color = a.g >= a.r && a.g >= a.n ? 'var(--green)' : a.r >= a.g && a.r >= a.n ? 'var(--red)' : 'var(--neutral)';
      return barRow(acts.includes(n) ? esc(n) : `<i>${esc(n)}</i>`, Math.round(a.min / max * 100), color, fmtDur(a.min));
    }).join('') +
    `<div class="hint">${t('energyColor')}</div>`));

  box.appendChild(card(t('valDist'),
    [3, 2, 1].map(v =>
      barRow(`<span style="color:var(--amber);font-weight:700">${'$'.repeat(v)}</span>`,
        s.rated > 0 ? Math.round(s.byVal[v] / s.rated * 100) : 0, 'var(--amber)',
        `${fmtDur(s.byVal[v] || 0)} \u00B7 ${s.rated > 0 ? Math.round((s.byVal[v] || 0) / s.rated * 100) : 0}%`)
    ).join('') +
    (s.neutral > 0
      ? `<div class="hint">${fmtDur(s.neutral)} ${t('unrated')}</div>`
      : '') +
    `<div class="hint">${t('valLegend')}</div>`));

  box.appendChild(card(t('energyBal'),
    barRow(t('gives'), s.total ? Math.round(s.green / s.total * 100) : 0, 'var(--green)', fmtDur(s.green)) +
    barRow(t('drains'), s.total ? Math.round(s.red / s.total * 100) : 0, 'var(--red)', fmtDur(s.red)) +
    (s.neutralEn > 0 ? barRow(t('neutralLbl'), Math.round(s.neutralEn / s.total * 100), 'var(--neutral)', fmtDur(s.neutralEn)) : '')));
}

/* ================= Report / Export ================= */
function reportMeta() {
  const dates = periodDates();
  const from = dstr(dates[0]);
  const to = dstr(dates[dates.length - 1]);
  const label = dates.length === 1
    ? dates[0].toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : fmtRange(dates[0], dates[dates.length - 1]);
  const filename = dates.length === 1 ? `TEA-${from}` : `TEA-${from}-${to}`;
  return { dates, from, to, label, filename, title: `${t('reportTitle')} \u00B7 ${label}` };
}

function buildReportModel() {
  const meta = reportMeta();
  const bundles = meta.dates.map(dayBundle);
  const list = collect();
  return { meta, bundles, list, stats: statsFor(list), name: (displayName || '').trim() };
}

function reportInnerHTML(model) {
  const { meta, bundles, list, stats: s, name } = model;
  const wakes = bundles.filter(b => b.wake != null).map(b => b.wake);
  const avgWake = wakes.length ? Math.round(wakes.reduce((a, b) => a + b, 0) / wakes.length) : null;
  const loggedN = bundles.filter(b => b.started || b.list.length).length;

  let html = `<section class="report-section report-hero">` +
    `<h1>${esc(t('reportTitle'))}</h1>` +
    `<div class="sub">${name ? esc(name) + ' \u00B7 ' : ''}${esc(meta.label)}</div>` +
    `<div class="kpis">` +
      `<div class="kpi"><div class="kpi-n amber">${s.needlePct == null ? '\u2013' : s.needlePct + '%'}</div><div class="kpi-l">${esc(t('needleMover'))}</div></div>` +
      `<div class="kpi"><div class="kpi-n">${esc(fmtDur(s.total))}</div><div class="kpi-l">${esc(t('logged'))}</div></div>` +
      `<div class="kpi"><div class="kpi-n">${esc(fmtDur(s.green))} / ${esc(fmtDur(s.red))}</div><div class="kpi-l">${esc(t('gives'))} / ${esc(t('drains'))}</div></div>` +
      `<div class="kpi"><div class="kpi-n">${avgWake != null ? fmtT(avgWake) : '\u2013'}</div><div class="kpi-l">${esc(t('wakeTime'))}</div></div>` +
    `</div>` +
  `</section>`;

  if (bundles.length > 1) {
    html += `<section class="report-section">` +
      `<h2>${esc(range === 'week' ? t('weekOverview') : t('daysOverview'))} \u00B7 ${esc(t('loggedDays', { done: loggedN, total: bundles.length }))}</h2>` +
      `<table class="overview"><thead><tr><th></th><th>${esc(t('wakeTime'))}</th><th>${esc(t('logged'))}</th><th>$$$</th><th>${esc(t('gives'))}</th><th>${esc(t('drains'))}</th><th>${esc(t('topAct'))}</th></tr></thead><tbody>` +
      bundles.map(b => {
        if (!b.started && !b.list.length) {
          return `<tr><td>${esc(weekdayShort(b.date))} ${esc(dayNum(b.date))}</td><td colspan="6" class="muted">${esc(t('noLog'))}</td></tr>`;
        }
        const st = b.stats;
        return `<tr>` +
          `<td>${esc(weekdayShort(b.date))} ${esc(dayNum(b.date))}</td>` +
          `<td class="nowrap">${b.wake != null ? fmtT(b.wake) : '\u2013'}</td>` +
          `<td class="nowrap">${st.total ? fmtDur(st.total) : '\u2013'}</td>` +
          `<td class="amber nowrap">${st.needlePct == null ? '\u2013' : st.needlePct + '%'}</td>` +
          `<td class="pos nowrap">${st.green ? fmtDur(st.green) : '\u2013'}</td>` +
          `<td class="neg nowrap">${st.red ? fmtDur(st.red) : '\u2013'}</td>` +
          `<td>${st.topAct ? esc(st.topAct) : '\u2013'}</td>` +
        `</tr>`;
      }).join('') +
      `</tbody></table></section>`;
  }

  if (list.length) {
    const sorted = Object.entries(s.byAct).sort((a, b) => b[1].min - a[1].min);
    html += `<section class="report-section">` +
      `<h2>${esc(t('timePerAct'))}</h2><table class="compact"><tbody>` +
      sorted.map(([n, a]) => `<tr><td>${esc(n)}</td><td class="nowrap">${fmtDur(a.min)}</td></tr>`).join('') +
      `</tbody></table></section>`;

    html += `<section class="report-section">` +
      `<h2>${esc(t('valDist'))}</h2><table class="compact"><tbody>` +
      [3, 2, 1].map(v => `<tr><td class="amber">${'$'.repeat(v)}</td><td class="nowrap">${fmtDur(s.byVal[v] || 0)}</td><td>${s.rated ? Math.round((s.byVal[v] || 0) / s.rated * 100) : 0}%</td></tr>`).join('') +
      `</tbody></table></section>`;
  }

  bundles.forEach(b => {
    if (!b.list.length && !b.started) return;
    const heading = `${weekdayShort(b.date)} ${b.date.toLocaleDateString(loc(), { day: 'numeric', month: 'long', year: 'numeric' })}` +
      (b.wake != null ? ` \u00B7 ${t('woke')} ${fmtT(b.wake)}` : '');
    html += `<section class="day-block"><table class="day-table">` +
      `<thead><tr><th class="day-h" colspan="5">${esc(heading)}</th></tr></thead>`;
    if (!b.list.length) {
      html += `<tbody><tr><td colspan="5" class="muted">${esc(t('noEntries'))}</td></tr></tbody></table></section>`;
      return;
    }
    const rows = [...b.list].sort((a, c) => a.start - c.start).map(e => {
      const enClass = e.energy > 0 ? 'pos' : e.energy < 0 ? 'neg' : 'muted';
      return `<tr>` +
        `<td class="time">${fmtT(e.start)}\u2013${fmtT(e.start + e.dur)}</td>` +
        `<td>${esc(e.activity)}</td>` +
        `<td class="amber nowrap">${esc(valLabel(e.value))}</td>` +
        `<td class="${enClass} nowrap">${esc(energyWord(e.energy))}</td>` +
        `<td class="note">${e.note ? esc(e.note) : ''}</td>` +
      `</tr>`;
    }).join('');
    html += `<tbody>${rows}</tbody></table></section>`;
  });

  return html;
}

function fillPrintReport() {
  $('#print-report').innerHTML = reportInnerHTML(buildReportModel());
}

function exportPDF() {
  fillPrintReport();
  window.print();
}

function csvEscape(v) {
  const x = String(v ?? '');
  if (/[",\n\r]/.test(x)) return `"${x.replace(/"/g, '""')}"`;
  return x;
}

function exportCSV() {
  const { meta, bundles } = buildReportModel();
  const rows = [['date', 'wake', 'start', 'end', 'duration_min', 'activity', 'value', 'energy', 'note']];
  bundles.forEach(b => {
    const wake = b.wake != null ? fmtT(b.wake) : '';
    if (!b.list.length) {
      if (b.started) rows.push([b.key, wake, '', '', '', '', '', '', '']);
      return;
    }
    [...b.list].sort((a, c) => a.start - c.start).forEach(e => {
      rows.push([b.key, wake, fmtT(e.start), fmtT(e.start + e.dur), e.dur, e.activity, e.value, e.energy, e.note || '']);
    });
  });
  const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');
  downloadBlob(`${meta.filename}.csv`, csv, 'text/csv;charset=utf-8');
}

function downloadBlob(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

let toastTimer = null;
function showToast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2200);
}

function exportBackup() {
  const data = { v: 1, days, entries, acts, sel, lang, name: displayName };
  downloadBlob(`tea-backup-${dstr(new Date())}.json`, JSON.stringify(data, null, 2), 'application/json');
}

function importBackupFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data !== 'object' || (!data.days && !data.entries)) throw new Error('bad');
      if (!confirm(t('confirmImport'))) return;
      pushUndo();
      if (data.days) days = data.days;
      if (data.entries) entries = data.entries;
      if (Array.isArray(data.acts)) acts = data.acts;
      if (data.sel) sel = data.sel;
      if (data.lang && I18N[data.lang]) { lang = data.lang; save(LS.lang, lang); }
      if (typeof data.name === 'string') { displayName = data.name; save(LS.name, displayName); }
      save(LS.days, days); save(LS.entries, entries); save(LS.acts, acts); save(LS.sel, sel);
      renderLang();
      refresh();
      showToast(t('importOk'));
    } catch {
      showToast(t('importBad'));
    }
  };
  reader.readAsText(file);
}

/* ================= Navigation / View ================= */
let logScroll = 0; // gemerkte Scroll-Position im Log

function switchView(v) {
  if (view === 'log' && v !== 'log') logScroll = window.scrollY;
  view = v;
  $('#tab-log').classList.toggle('active', v === 'log');
  $('#tab-analyse').classList.toggle('active', v === 'analyse');
  $('#log-view').classList.toggle('hidden', v !== 'log');
  $('#analyse-view').classList.toggle('hidden', v !== 'analyse');
  setStampbarVisible(v === 'log' && !!dayData());
  $('#range-toggle').classList.toggle('hidden', v !== 'analyse');
  renderDayLabel();
  if (v === 'log') {
    scrollFlag = false;
    renderLog();
    window.scrollTo({ top: logScroll });
  }
  if (v === 'analyse') renderAnalysis();
}

function renderDayLabel() {
  const label = $('#day-label');
  label.classList.toggle('pick-range', view === 'analyse' && range === 'custom');
  if (view === 'analyse' && range === 'week') {
    const ds = weekDays(viewDate);
    label.textContent = fmtRange(ds[0], ds[6]);
    return;
  }
  if (view === 'analyse' && range === 'custom') {
    ensureCustomRange();
    label.textContent = fmtRange(customFrom, customTo);
    return;
  }
  label.textContent = key() === dstr(todayDate())
    ? t('today')
    : viewDate.toLocaleDateString(loc(), { weekday: 'short', day: 'numeric', month: 'short' });
}

function dateStep() {
  if (view !== 'analyse') return 1;
  if (range === 'week') return 7;
  if (range === 'custom') {
    ensureCustomRange();
    return Math.max(1, daysBetween(customFrom, customTo) + 1);
  }
  return 1;
}

function shiftViewDate(dir) {
  const step = dateStep();
  if (view === 'analyse' && range === 'custom') {
    ensureCustomRange();
    customFrom = addDays(customFrom, dir * step);
    customTo = addDays(customTo, dir * step);
    viewDate = customTo;
    return;
  }
  viewDate = addDays(viewDate, dir * step);
}

function refresh() {
  renderDayLabel();
  renderChips();
  renderSel();
  renderDur();
  renderLog();
  if (view === 'analyse') renderAnalysis();
}

/* ================= Init ================= */
function todayDate() {
  const d = new Date();
  if (d.getHours() < 5) d.setDate(d.getDate() - 1); // vor 5 Uhr gehoert die Nacht zum Vortag
  return d;
}

function renderLang() {
  document.documentElement.lang = lang;
  $('#tab-log').textContent = t('log');
  $('#tab-analyse').textContent = t('analyse');
  document.querySelectorAll('#range-toggle button').forEach(b => {
    b.textContent = t(b.dataset.range === 'custom' ? 'custom' : b.dataset.range);
  });
  $('#now-text').textContent = t('now');
  $('#new-activity-input').placeholder = t('newAct');
  $('#add-activity-btn').textContent = t('ok');
  $('#dur-minus').setAttribute('aria-label', t('shorter'));
  $('#dur-plus').setAttribute('aria-label', t('longer'));
  $('#settings-btn').setAttribute('aria-label', t('settings'));
  $('#undo-btn').setAttribute('aria-label', t('undo'));
  $('#act-trigger').setAttribute('aria-label', t('pickAct'));
  $('#act-add').setAttribute('aria-label', t('newCat'));
}

function openSettings() {
  const seg = Object.keys(I18N).map(l =>
    `<button type="button" data-lang="${l}" class="${l === lang ? 'active' : ''}">${l.toUpperCase()}</button>`).join('');
  showModal(t('settings'),
    `<div class="settings-row"><span>${t('yourName')}</span></div>` +
    `<input type="text" id="set-name" maxlength="40" placeholder="${t('namePh')}" value="${esc(displayName)}">` +
    `<div class="settings-row"><span>${t('language')}</span><div class="seg lang-seg">${seg}</div></div>` +
    `<div class="modal-hint">${t('backup')}</div>` +
    `<div class="settings-backup">` +
      `<button type="button" id="btn-backup" class="btn-secondary">${t('exportJson')}</button>` +
      `<button type="button" id="btn-import" class="btn-secondary">${t('importJson')}</button>` +
    `</div>`,
    [{ label: t('ok'), class: 'btn-primary', onClick: () => {
      displayName = ($('#set-name')?.value || '').trim();
      save(LS.name, displayName);
    }}]
  );
  document.querySelectorAll('.lang-seg button').forEach(b =>
    b.addEventListener('click', () => {
      lang = b.dataset.lang;
      save(LS.lang, lang);
      const stored = load(LS.acts, null);
      if (!stored) { acts = defaultActs().slice(); save(LS.acts, acts); }
      document.querySelectorAll('.lang-seg button').forEach(x => x.classList.toggle('active', x === b));
      renderLang();
      refresh();
    }));
  $('#btn-backup').addEventListener('click', exportBackup);
  $('#btn-import').addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/json,.json';
    inp.addEventListener('change', () => { if (inp.files[0]) importBackupFile(inp.files[0]); });
    inp.click();
  });
}

function init() {
  renderLang();
  $('#tab-log').addEventListener('click', () => switchView('log'));
  $('#tab-analyse').addEventListener('click', () => switchView('analyse'));
  $('#settings-btn').addEventListener('click', openSettings);
  $('#undo-btn').addEventListener('click', undo);

  $('#prev-day').addEventListener('click', () => { shiftViewDate(-1); scrollFlag = true; refresh(); });
  $('#next-day').addEventListener('click', () => { shiftViewDate(1); scrollFlag = true; refresh(); });
  $('#day-label').addEventListener('click', () => {
    if (view === 'analyse' && range === 'custom') {
      openCustomRangeModal();
      return;
    }
    viewDate = todayDate();
    scrollFlag = true;
    refresh();
  });
  $('#now-btn').addEventListener('click', () => {
    viewDate = todayDate();
    scrollFlag = true;
    if (view !== 'log') switchView('log');
    refresh();
  });

  document.querySelectorAll('#range-toggle button').forEach(b => {
    b.addEventListener('click', () => {
      range = b.dataset.range;
      document.querySelectorAll('#range-toggle button').forEach(x => x.classList.toggle('active', x === b));
      if (range === 'custom') ensureCustomRange();
      renderDayLabel();
      renderAnalysis();
      if (range === 'custom') openCustomRangeModal();
    });
  });

  document.querySelectorAll('#value-select button').forEach(b =>
    b.addEventListener('click', () => { sel.value = +b.dataset.v; save(LS.sel, sel); renderSel(); applyToActive(); }));
  document.querySelectorAll('#energy-select button').forEach(b =>
    b.addEventListener('click', () => { sel.energy = +b.dataset.e; save(LS.sel, sel); renderSel(); applyToActive(); }));

  $('#dur-minus').addEventListener('click', shrink);
  $('#dur-plus').addEventListener('click', grow);

  $('#act-trigger').addEventListener('click', toggleActMenu);
  $('#act-add').addEventListener('click', openNewActivity);
  document.addEventListener('pointerdown', (e) => {
    const picker = $('#act-picker');
    if (!picker || !actMenuOpen()) return;
    if (!picker.contains(e.target)) closeActMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && actMenuOpen()) closeActMenu();
  });
  const stopBgScroll = (e) => {
    if (!actMenuOpen()) return;
    const menu = $('#act-menu');
    if (menu.contains(e.target)) {
      if (menu.scrollHeight <= menu.clientHeight + 1) e.preventDefault();
      else if (e.type === 'wheel') {
        const atTop = menu.scrollTop <= 0 && e.deltaY < 0;
        const atBottom = menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1 && e.deltaY > 0;
        if (atTop || atBottom) e.preventDefault();
      }
      return;
    }
    e.preventDefault();
  };
  document.addEventListener('touchmove', stopBgScroll, { passive: false });
  document.addEventListener('wheel', stopBgScroll, { passive: false });

  $('#add-activity-btn').addEventListener('click', addActivity);
  $('#new-activity-input').addEventListener('keydown', e => { if (e.key === 'Enter') addActivity(); });

  $('#modal-overlay').addEventListener('click', (e) => { if (e.target === $('#modal-overlay')) closeModal(); });
  window.addEventListener('beforeprint', fillPrintReport);

  refresh();
}

document.addEventListener('DOMContentLoaded', init);
