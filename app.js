'use strict';

/* ================= Storage ================= */
const LS = { days: 'tea_days', entries: 'tea_entries', acts: 'tea_acts', sel: 'tea_sel', raster: 'tea_raster', lang: 'tea_lang' };
const load = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? fb : v; } catch { return fb; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* ================= i18n ================= */
const LOCALES = { de: 'de-DE', en: 'en-US', fr: 'fr-FR' };
let lang = load(LS.lang, 'en');
const I18N = {
  de: {
    log: 'Log', analyse: 'Analyse', day: 'Tag', week: '7 Tage', today: 'Heute', now: 'Jetzt',
    woke: 'Aufgewacht', change: 'aendern', midnight: 'Mitternacht', extend: '+ 2 Stunden',
    wakeQ: 'Wann bist du aufgewacht?', startDay: 'Tag starten', save: 'Speichern', cancel: 'Abbrechen',
    wakeHint: 'Dein Tag baut sich ab hier auf.', note: 'Notiz', delEntry: 'Eintrag loeschen',
    shorter: 'Kuerzer', longer: 'Laenger', tapBlock: 'Block antippen',
    emptyBlock: 'Leerer Block \u2013 Chip w\u00E4hlen', newCat: '+ Neu', newAct: 'Neue Aktivitaet...',
    ok: 'OK', rename: 'Umbenennen', delete: 'Loeschen', notePh: 'Notiz zu dieser Aktivitaet...',
    renameHint: 'Bestehende Eintraege mit dieser Aktivitaet werden automatisch umbenannt.',
    confirmDelChip: '"{name}" wirklich loeschen?\nVorhandene Eintraege behalten diese Aktivitaet (kursiv).',
    noEntries: 'Noch keine Eintraege in diesem Zeitraum.', needleMover: 'Needle Mover',
    needleTime: '$$$-Zeit: {needle} von {rated} bewerteter Zeit', unrated: 'unbewertet',
    timePerAct: 'Zeit pro Aktivitaet', energyColor: 'Farbe = Energie-Bilanz (Gruen/Rot/Grau)',
    valDist: '$-Verteilung',
    valLegend: '$ = Busywork \u00B7 $$ = wichtig \u00B7 $$$ = bewegt die Nadel \u00B7 \u2013 = unbewertet',
    energyBal: 'Energie-Bilanz', gives: 'Gibt', drains: 'Zieht', neutralLbl: 'Neutral',
    wakeTime: 'Aufwachzeit', avgLast: '\u00D8 der letzten {n} Tage',
    settings: 'Einstellungen', language: 'Sprache', undo: 'Rueckgaengig',
  },
  en: {
    log: 'Log', analyse: 'Analysis', day: 'Day', week: '7 Days', today: 'Today', now: 'Now',
    woke: 'Woke up', change: 'edit', midnight: 'Midnight', extend: '+ 2 hours',
    wakeQ: 'When did you wake up?', startDay: 'Start day', save: 'Save', cancel: 'Cancel',
    wakeHint: 'Your day builds from here.', note: 'Note', delEntry: 'Delete entry',
    shorter: 'Shorter', longer: 'Longer', tapBlock: 'Tap a block',
    emptyBlock: 'Empty block \u2013 pick a chip', newCat: '+ New', newAct: 'New activity...',
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
  },
  fr: {
    log: 'Journal', analyse: 'Analyse', day: 'Jour', week: '7 Jours', today: 'Aujourd\'hui', now: 'Maintenant',
    woke: 'Reveil', change: 'modifier', midnight: 'Minuit', extend: '+ 2 heures',
    wakeQ: 'Quand t\'es-tu reveille ?', startDay: 'Demarrer', save: 'Enregistrer', cancel: 'Annuler',
    wakeHint: 'Ta journee se construit ici.', note: 'Note', delEntry: 'Supprimer',
    shorter: 'Plus court', longer: 'Plus long', tapBlock: 'Toucher un bloc',
    emptyBlock: 'Bloc vide \u2013 choisir un chip', newCat: '+ Nouveau', newAct: 'Nouvelle activite...',
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
  },
};
const t = (k, vars) => {
  let s = (I18N[lang] && I18N[lang][k]) || (I18N.de[k]) || k;
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

/* ================= Undo ================= */
function pushUndo() {
  undoStack.push({ days: JSON.parse(JSON.stringify(days)), entries: JSON.parse(JSON.stringify(entries)) });
  if (undoStack.length > 50) undoStack.shift();
  $('#undo-btn').classList.remove('hidden');
}
function undo() {
  const snap = undoStack.pop();
  if (!snap) return;
  days = snap.days; entries = snap.entries;
  save(LS.days, days); save(LS.entries, entries);
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

let days = load(LS.days, {});
let entries = load(LS.entries, {});
let acts = load(LS.acts, defaultActs().slice());
let sel = load(LS.sel, { activity: acts[0] || null, value: 2, energy: 1 });
let viewDate = new Date();
if (viewDate.getHours() < 5) viewDate.setDate(viewDate.getDate() - 1); // Nacht gehoert zum Vortag
let view = 'log';
let range = 'day';
let activeStart = null; // aktuell ausgewaehlter Block-Start (Minuten) oder null
let scrollFlag = true;  // beim naechsten Render zum Jetzt-Block scrollen
let undoStack = [];     // Snapshots von {days, entries} fuer Rueckgaengig

const key = () => dstr(viewDate);
const dayData = () => days[key()] || null;
const dayEntries = () => entries[key()] || [];
const winStart = () => Math.floor(dayData().wake / RASTER) * RASTER;
const winEnd = () => winStart() + (dayData().span || DEFAULT_SPAN) * 60;

/* ================= Timeline ================= */
function renderLog() {
  const tl = $('#timeline');
  const keepScroll = !scrollFlag ? window.scrollY : 0;
  tl.innerHTML = '';
  const d = dayData();

  if (!d) {
    renderWakePrompt(tl, false);
    window.scrollTo({ top: 0 });
    return;
  }

  $('#stampbar').classList.remove('hidden');

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

    if (covering && covering.activity) {
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

    if (ts === activeStart) slot.classList.add('active');

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
    d.span = (d.span || DEFAULT_SPAN) + 2;
    pushUndo();
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
        d.wake = h * 60 + m;
        pushUndo();
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
    days[key()] = { wake: h * 60 + m, span: prev && prev.span ? prev.span : DEFAULT_SPAN };
    pushUndo();
    save(LS.days, days);
    scrollFlag = true;
    renderLog();
  });

  if (edit) {
    card.querySelector('.wake-cancel').addEventListener('click', () => renderLog());
  }
}

/* ================= Aktiver Block (Auswahl + Live-Bearbeitung) ================= */
function toggleActive(t) {
  const list = dayEntries();
  // Slot innerhalb eines bestehenden Eintrags
  const covering = list.find(e => t >= e.start && t < e.start + e.dur);
  if (covering) {
    // Klick in die Mitte des Blocks -> Block an dieser Stelle teilen,
    // damit man den Teil ab hier separat mit einem anderen Chip fuellen kann
    if (t !== covering.start) {
      const k = key();
      const first = { ...covering, dur: t - covering.start };
      const second = { id: uid(), start: t, dur: covering.start + covering.dur - t, activity: null, value: 0, energy: 0 };
      entries[k] = list.filter(e => e.id !== covering.id).concat([first, second]).sort((a, b) => a.start - b.start);
      pushUndo();
      save(LS.entries, entries);
      activeStart = t;
      renderLog(); updateBarFromActive();
      return;
    }
    activeStart = covering.start;
    renderLog(); updateBarFromActive();
    return;
  }
  activeStart = (activeStart === t) ? null : t;
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

// Leisten-Aktionen aendern den aktiven Block live
function applyToActive() {
  if (activeStart == null) return;
  const k = key();
  let list = dayEntries();
  const existing = list.find(e => e.start === activeStart);

  if (existing) {
    // Werte ueberschreiben (Dauer bleibt)
    existing.activity = sel.activity;
    existing.value = sel.value;
    existing.energy = sel.energy;
  } else if (sel.activity) {
    // Leer -> neu anlegen (1 Raster-Slot)
    list = list.filter(e => !(activeStart >= e.start && activeStart < e.start + e.dur));
    list.push({ id: uid(), start: activeStart, dur: RASTER, activity: sel.activity, value: sel.value, energy: sel.energy });
    entries[k] = list;
  }

  // Gleiche Nachbarn verschmelzen
  entries[k] = mergeAdjacent(list).sort((a, b) => a.start - b.start);
  pushUndo();
  save(LS.entries, entries);
  if (existing) touchAct(sel.activity);
  renderLog();
  renderChips();
  renderDur();
}

function mergeAdjacent(list) {
  const out = [];
  const sorted = [...list].sort((a, b) => a.start - b.start);
  for (const e of sorted) {
    const prev = out[out.length - 1];
    if (prev && prev.start + prev.dur === e.start &&
        prev.activity === e.activity && prev.value === e.value && prev.energy === e.energy) {
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
  // Blockiert, wenn naechster Slot belegt ist
  const end = e.start + e.dur;
  if (list.some(x => x.id !== e.id && x.start >= end && x.start < end + RASTER)) return;
  e.dur += RASTER;
  entries[k] = list.sort((a, b) => a.start - b.start);
  pushUndo();
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
  e.dur -= RASTER;
  entries[k] = list.sort((a, b) => a.start - b.start);
  pushUndo();
  save(LS.entries, entries);
  renderLog();
  renderDur();
}

function deleteEntry(id) {
  const k = key();
  entries[k] = dayEntries().filter(x => x.id !== id);
  pushUndo();
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
      { label: t('save'), class: 'btn-primary', onClick: (body) => {
        e.note = body.querySelector('#note-input').value.trim();
        pushUndo();
        save(LS.entries, entries);
        renderLog();
      }},
      { label: t('delete'), class: 'btn-danger', onClick: () => {
        e.note = '';
        pushUndo();
        save(LS.entries, entries);
        renderLog();
      }, close: false },
      { label: t('cancel'), class: 'btn-secondary' },
    ]
  );
  setTimeout(() => $('#note-input').focus(), 50);
}

/* ================= Modal ================= */
function showModal(title, bodyHTML, actions) {
  const overlay = $('#modal-overlay');
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = bodyHTML;
  const acts = $('#modal-actions');
  acts.innerHTML = '';
  actions.forEach(a => {
    const b = document.createElement('button');
    b.textContent = a.label;
    b.className = a.class || 'btn-secondary';
    b.addEventListener('click', () => {
      if (a.onClick) a.onClick($('#modal-body'));
      if (a.close !== false) closeModal();
    });
    acts.appendChild(b);
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
  acts = [name, ...acts.filter(a => a !== name)].slice(0, 12);
  save(LS.acts, acts);
}

function renderChips() {
  const w = $('#activity-chips');
  w.innerHTML = '';
  acts.forEach(a => {
    const c = document.createElement('button');
    c.className = 'chip' + (a === sel.activity ? ' sel' : '');
    c.textContent = a;
    attachChip(c, a);
    w.appendChild(c);
  });
  const p = document.createElement('button');
  p.className = 'chip plus';
  p.textContent = t('newCat');
  p.addEventListener('click', openNewActivity);
  w.appendChild(p);
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
}

function selectChip(name) {
  sel.activity = name;
  save(LS.sel, sel);
  renderChips();
  applyToActive();
}

function askDeleteChip(name) {
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
    minus.disabled = true; plus.disabled = false;
    return;
  }
  txt.textContent = `${fmtT(e.start)} \u2013 ${fmtT(e.start + e.dur)} (${fmtDur(e.dur)})`;
  minus.disabled = e.dur <= RASTER;
  // Plus blockiert, wenn naechster Slot belegt
  const end = e.start + e.dur;
  const blocked = dayEntries().some(x => x.id !== e.id && x.start >= end && x.start < end + RASTER);
  plus.disabled = blocked;
}

/* ================= Analyse ================= */
function collect() {
  if (range === 'day') return dayEntries();
  const all = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(viewDate);
    d.setDate(d.getDate() - i);
    all.push(...(entries[dstr(d)] || []));
  }
  return all;
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

function renderAnalysis() {
  const box = $('#analysis');
  box.innerHTML = '';
  const list = collect();

  if (!list.length) {
    box.innerHTML = `<div class="card"><p class="hint">${t('noEntries')}</p></div>`;
    return;
  }

  const total = list.reduce((s, e) => s + e.dur, 0);
  const neutral = list.filter(e => e.value === 0).reduce((s, e) => s + e.dur, 0);
  const rated = total - neutral;
  const needle = list.filter(e => e.value === 3).reduce((s, e) => s + e.dur, 0);
  const green = list.filter(e => e.energy > 0).reduce((s, e) => s + e.dur, 0);
  const red = list.filter(e => e.energy < 0).reduce((s, e) => s + e.dur, 0);
  const neutralEn = list.filter(e => e.energy === 0).reduce((s, e) => s + e.dur, 0);
  const byVal = { 1: 0, 2: 0, 3: 0 };
  list.forEach(e => { if (e.value > 0) byVal[e.value] += e.dur; });
  const byAct = {};
  list.forEach(e => {
    const a = byAct[e.activity] || (byAct[e.activity] = { min: 0, g: 0, r: 0, n: 0 });
    a.min += e.dur;
    if (e.energy > 0) a.g += e.dur; else if (e.energy < 0) a.r += e.dur; else a.n += e.dur;
  });

  // Needle Mover (nur bewertete Zeit)
  const needlePct = rated > 0 ? Math.round(needle / rated * 100) : 0;
  box.appendChild(card(t('needleMover'),
    `<div class="needle-num">${needlePct}%</div>` +
    `<div class="hint">${t('needleTime', { needle: fmtDur(needle), rated: fmtDur(rated) })}` +
    (neutral > 0 ? ` \u00B7 ${fmtDur(neutral)} ${t('unrated')}` : '') + `</div>`));

  // Zeit pro Aktivitaet (Balken relativ zum Maximum, Farbe = Energie-Bilanz)
  const sorted = Object.entries(byAct).sort((a, b) => b[1].min - a[1].min);
  const max = sorted[0][1].min;
  box.appendChild(card(t('timePerAct'),
    sorted.map(([n, a]) => {
      const color = a.g >= a.r && a.g >= a.n ? 'var(--green)' : a.r >= a.g && a.r >= a.n ? 'var(--red)' : 'var(--neutral)';
      return barRow(acts.includes(n) ? esc(n) : `<i>${esc(n)}</i>`, Math.round(a.min / max * 100), color, fmtDur(a.min));
    }).join('') +
    `<div class="hint">${t('energyColor')}</div>`));

  // $-Verteilung (Anteil an bewerteter Zeit)
  box.appendChild(card(t('valDist'),
    [3, 2, 1].map(v =>
      barRow(`<span style="color:var(--amber);font-weight:700">${'$'.repeat(v)}</span>`,
        rated > 0 ? Math.round(byVal[v] / rated * 100) : 0, 'var(--amber)',
        `${fmtDur(byVal[v])} \u00B7 ${rated > 0 ? Math.round(byVal[v] / rated * 100) : 0}%`)
    ).join('') +
    (neutral > 0 ? barRow('<span style="color:var(--muted)">\u2013</span>',
      Math.round(neutral / total * 100), 'var(--muted-2)',
      `${fmtDur(neutral)} \u00B7 ${Math.round(neutral / total * 100)}%`) : '') +
    `<div class="hint">${t('valLegend')}</div>`));

  // Energie-Bilanz
  box.appendChild(card(t('energyBal'),
    barRow(t('gives'), Math.round(green / total * 100), 'var(--green)', fmtDur(green)) +
    barRow(t('drains'), Math.round(red / total * 100), 'var(--red)', fmtDur(red)) +
    (neutralEn > 0 ? barRow(t('neutralLbl'), Math.round(neutralEn / total * 100), 'var(--neutral)', fmtDur(neutralEn)) : '')));

  // Ø Aufwachzeit (nur Woche)
  if (range === 'week') {
    const wakes = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(viewDate);
      d.setDate(d.getDate() - i);
      const dd = days[dstr(d)];
      if (dd && dd.wake != null) wakes.push(dd.wake);
    }
    if (wakes.length) {
      const avg = Math.round(wakes.reduce((s, w) => s + w, 0) / wakes.length);
      box.appendChild(card(t('wakeTime'),
        `<div class="needle-num small">${fmtT(avg)}</div>` +
        `<div class="hint">${t('avgLast', { n: wakes.length })}</div>`));
    }
  }
}

/* ================= Navigation / View ================= */
function switchView(v) {
  view = v;
  $('#tab-log').classList.toggle('active', v === 'log');
  $('#tab-analyse').classList.toggle('active', v === 'analyse');
  $('#log-view').classList.toggle('hidden', v !== 'log');
  $('#analyse-view').classList.toggle('hidden', v !== 'analyse');
  $('#stampbar').classList.toggle('hidden', v !== 'log');
  $('#range-toggle').classList.toggle('hidden', v !== 'analyse');
  if (v === 'analyse') renderAnalysis();
}

function renderDayLabel() {
  $('#day-label').textContent = key() === dstr(todayDate())
    ? t('today')
    : viewDate.toLocaleDateString(LOCALES[lang] || 'de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
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
  $('#tab-log').textContent = t('log');
  $('#tab-analyse').textContent = t('analyse');
  document.querySelectorAll('#range-toggle button').forEach(b => {
    b.textContent = b.dataset.range === 'day' ? t('day') : t('week');
  });
  $('#now-text').textContent = t('now');
  $('#new-activity-input').placeholder = t('newAct');
  $('#add-activity-btn').textContent = t('ok');
  $('#dur-minus').setAttribute('aria-label', t('shorter'));
  $('#dur-plus').setAttribute('aria-label', t('longer'));
  $('#settings-btn').setAttribute('aria-label', t('settings'));
  $('#undo-btn').setAttribute('aria-label', t('undo'));
}

function openSettings() {
  const seg = Object.keys(I18N).map(l =>
    `<button data-lang="${l}" class="${l === lang ? 'active' : ''}">${l.toUpperCase()}</button>`).join('');
  showModal(t('settings'),
    `<div class="settings-row"><span>${t('language')}</span><div class="seg lang-seg">${seg}</div></div>`,
    [{ label: t('ok'), class: 'btn-primary' }]
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
}

function init() {
  renderLang();
  $('#tab-log').addEventListener('click', () => switchView('log'));
  $('#tab-analyse').addEventListener('click', () => switchView('analyse'));
  $('#settings-btn').addEventListener('click', openSettings);
  $('#undo-btn').addEventListener('click', undo);

  $('#prev-day').addEventListener('click', () => { viewDate.setDate(viewDate.getDate() - 1); scrollFlag = true; refresh(); });
  $('#next-day').addEventListener('click', () => { viewDate.setDate(viewDate.getDate() + 1); scrollFlag = true; refresh(); });
  $('#day-label').addEventListener('click', () => { viewDate = todayDate(); scrollFlag = true; refresh(); });
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
      renderAnalysis();
    });
  });

  document.querySelectorAll('#value-select button').forEach(b =>
    b.addEventListener('click', () => { sel.value = +b.dataset.v; save(LS.sel, sel); renderSel(); applyToActive(); }));
  document.querySelectorAll('#energy-select button').forEach(b =>
    b.addEventListener('click', () => { sel.energy = +b.dataset.e; save(LS.sel, sel); renderSel(); applyToActive(); }));

  $('#dur-minus').addEventListener('click', shrink);
  $('#dur-plus').addEventListener('click', grow);

  $('#add-activity-btn').addEventListener('click', addActivity);
  $('#new-activity-input').addEventListener('keydown', e => { if (e.key === 'Enter') addActivity(); });

  $('#modal-overlay').addEventListener('click', (e) => { if (e.target === $('#modal-overlay')) closeModal(); });

  refresh();
}

document.addEventListener('DOMContentLoaded', init);
