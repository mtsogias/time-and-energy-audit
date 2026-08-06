'use strict';

/* ================= Storage ================= */
const LS = { days: 'tea_days', entries: 'tea_entries', acts: 'tea_acts', sel: 'tea_sel', raster: 'tea_raster' };
const load = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? fb : v; } catch { return fb; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* ================= Helpers ================= */
const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const dstr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtT = min => `${pad(Math.floor((min % 1440) / 60))}:${pad(min % 60)}`; // Uhrzeit, wrapt nach Mitternacht
const fmtDur = min => { const h = Math.floor(min / 60), m = min % 60; if (!h) return `${m}m`; return m ? `${h}h ${m}m` : `${h}h`; };
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const esc = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };

/* ================= State ================= */
// days:    { 'YYYY-MM-DD': { wake: Minuten seit 0:00, span: Stunden } }
// entries: { 'YYYY-MM-DD': [{ id, start, dur, activity, value (1-3), energy (1|-1) }] }
//          start/dur in Minuten, start darf > 1440 sein (nach Mitternacht, gleiche Tagesseite)
const DEFAULT_ACTS = ['Produktion', 'Mixing/Mastering', 'Content', 'Admin', 'Sales/Calls', 'Lernen', 'Sport', 'Essen', 'Pause', 'Haushalt'];
const DEFAULT_SPAN = 18;
const RASTER = 30; // Minuten, fest

let days = load(LS.days, {});
let entries = load(LS.entries, {});
let acts = load(LS.acts, DEFAULT_ACTS.slice());
let sel = load(LS.sel, { activity: acts[0] || null, value: 2, energy: 1 });
let viewDate = new Date();
if (viewDate.getHours() < 5) viewDate.setDate(viewDate.getDate() - 1); // Nacht gehoert zum Vortag
let view = 'log';
let range = 'day';
let activeStart = null; // aktuell ausgewaehlter Block-Start (Minuten) oder null
let scrollFlag = true;  // beim naechsten Render zum Jetzt-Block scrollen

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
  wr.innerHTML = `<span>Aufgewacht</span><strong>${fmtT(d.wake)}</strong><span class="wake-edit">aendern</span>`;
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

  for (let t = winStart(); t < winEnd(); t += RASTER) {
    if (t >= 1440 && !broke) {
      broke = true;
      const div = document.createElement('div');
      div.className = 'daybreak';
      div.textContent = 'Mitternacht';
      tl.appendChild(div);
    }

    const slot = document.createElement('div');
    slot.className = 'slot';

    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = fmtT(t);
    slot.appendChild(time);

    const covering = list.find(e => t >= e.start && t < e.start + e.dur);

    if (covering) {
      const isStart = covering.start === t;
      const sameNext = list.some(e => e.id === covering.id && t + RASTER >= e.start && t + RASTER < e.start + e.dur);
      slot.classList.add('filled', covering.energy > 0 ? 'pos' : 'neg');
      slot.classList.add(isStart ? (sameNext ? 'grp-start' : 'grp-single') : (sameNext ? 'grp-mid' : 'grp-end'));

      if (isStart) {
        const c = document.createElement('div');
        c.className = 'slot-content';
        const archived = !acts.includes(covering.activity);
        c.innerHTML =
          `<div class="slot-main">` +
            `<span class="slot-act${archived ? ' archived' : ''}">${esc(covering.activity)}</span>` +
            `<span class="slot-sub">${fmtT(covering.start)} \u2013 ${fmtT(covering.start + covering.dur)}</span>` +
          `</div>` +
          `<span class="slot-val">${covering.value ? '$'.repeat(covering.value) : '\u2013'}</span>`;
        slot.appendChild(c);
        const del = document.createElement('button');
        del.className = 'del';
        del.textContent = '\u00D7';
        del.setAttribute('aria-label', 'Eintrag loeschen');
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

    if (t === activeStart) slot.classList.add('active');

    if (isToday && nowMin >= t && nowMin < t + RASTER) {
      slot.classList.add('now');
      nowEl = slot;
    }

    slot.addEventListener('click', () => toggleActive(t));
    tl.appendChild(slot);
  }

  // Tag verlaengern
  const ext = document.createElement('button');
  ext.className = 'extend';
  ext.textContent = '+ 2 Stunden';
  ext.addEventListener('click', () => {
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
    `<span>Aufgewacht</span>` +
    `<input type="time" id="wake-edit-input" value="${fmtT(d.wake)}">` +
    `<button id="wake-edit-save" class="wake-edit-save">OK</button>` +
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
    `<h2>Wann bist du aufgewacht?</h2>` +
    `<div class="wake-input-row">` +
      `<input type="time" id="wake-input" value="${def}">` +
      `<button id="wake-save">${edit ? 'Speichern' : 'Tag starten'}</button>` +
    `</div>` +
    (edit
      ? `<button class="wake-cancel">Abbrechen</button>`
      : `<p class="wake-hint">Dein Tag baut sich ab hier auf.</p>`);
  tl.appendChild(card);

  $('#wake-save').addEventListener('click', () => {
    const v = $('#wake-input').value;
    if (!v) return;
    const [h, m] = v.split(':').map(Number);
    const prev = dayData();
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
function toggleActive(t) {
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
  save(LS.entries, entries);
  renderLog();
  renderDur();
}

function deleteEntry(id) {
  const k = key();
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
  p.textContent = '+ Neu';
  p.addEventListener('click', openNewActivity);
  w.appendChild(p);
}

let suppressClick = false;

function attachChip(el, name) {
  let timer = null;
  el.addEventListener('pointerdown', () => {
    suppressClick = false;
    timer = setTimeout(() => {
      timer = null;
      suppressClick = true;
      if (navigator.vibrate) navigator.vibrate(15);
      askDeleteChip(name);
    }, 500);
  });
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
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
  if (confirm('"' + name + '" aus der Schnellauswahl entfernen?\n\nVorhandene Eintraege bleiben erhalten und werden kursiv angezeigt. Neu hinzufuegen jederzeit ueber "+ Neu" mit gleichem Namen.')) {
    removeChip(name);
  }
}

function removeChip(name) {
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
    txt.textContent = 'Block antippen';
    minus.disabled = true; plus.disabled = true;
    return;
  }
  const e = activeEntry();
  if (!e) {
    txt.textContent = 'Leerer Block \u2013 Chip w\u00E4hlen';
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
    box.innerHTML = '<div class="card"><p class="hint">Noch keine Eintraege in diesem Zeitraum.</p></div>';
    return;
  }

  const total = list.reduce((s, e) => s + e.dur, 0);
  const neutral = list.filter(e => e.value === 0).reduce((s, e) => s + e.dur, 0);
  const rated = total - neutral;
  const needle = list.filter(e => e.value === 3).reduce((s, e) => s + e.dur, 0);
  const green = list.filter(e => e.energy > 0).reduce((s, e) => s + e.dur, 0);
  const red = total - green;
  const byVal = { 1: 0, 2: 0, 3: 0 };
  list.forEach(e => { if (e.value > 0) byVal[e.value] += e.dur; });
  const byAct = {};
  list.forEach(e => {
    const a = byAct[e.activity] || (byAct[e.activity] = { min: 0, g: 0, r: 0 });
    a.min += e.dur;
    if (e.energy > 0) a.g += e.dur; else a.r += e.dur;
  });

  // Needle Mover (nur bewertete Zeit)
  const needlePct = rated > 0 ? Math.round(needle / rated * 100) : 0;
  box.appendChild(card('Needle Mover',
    `<div class="needle-num">${needlePct}%</div>` +
    `<div class="hint">$$$-Zeit: ${fmtDur(needle)} von ${fmtDur(rated)} bewerteter Zeit` +
    (neutral > 0 ? ` \u00B7 ${fmtDur(neutral)} unbewertet` : '') + `</div>`));

  // Zeit pro Aktivitaet (Balken relativ zum Maximum, Farbe = Energie-Bilanz)
  const sorted = Object.entries(byAct).sort((a, b) => b[1].min - a[1].min);
  const max = sorted[0][1].min;
  box.appendChild(card('Zeit pro Aktivitaet',
    sorted.map(([n, a]) =>
      barRow(acts.includes(n) ? esc(n) : `<i>${esc(n)}</i>`, Math.round(a.min / max * 100), a.g >= a.r ? 'var(--green)' : 'var(--red)', fmtDur(a.min))
    ).join('') +
    `<div class="hint">Farbe = Energie-Bilanz der Aktivitaet</div>`));

  // $-Verteilung (Anteil an bewerteter Zeit)
  box.appendChild(card('$-Verteilung',
    [3, 2, 1].map(v =>
      barRow(`<span style="color:var(--amber);font-weight:700">${'$'.repeat(v)}</span>`,
        rated > 0 ? Math.round(byVal[v] / rated * 100) : 0, 'var(--amber)',
        `${fmtDur(byVal[v])} \u00B7 ${rated > 0 ? Math.round(byVal[v] / rated * 100) : 0}%`)
    ).join('') +
    (neutral > 0 ? barRow('<span style="color:var(--muted)">\u2013</span>',
      Math.round(neutral / total * 100), 'var(--muted-2)',
      `${fmtDur(neutral)} \u00B7 ${Math.round(neutral / total * 100)}%`) : '') +
    `<div class="hint">$ = Busywork \u00B7 $$ = wichtig \u00B7 $$$ = bewegt die Nadel \u00B7 \u2013 = unbewertet</div>`));

  // Energie-Bilanz
  box.appendChild(card('Energie-Bilanz',
    barRow('Gibt', Math.round(green / total * 100), 'var(--green)', fmtDur(green)) +
    barRow('Zieht', Math.round(red / total * 100), 'var(--red)', fmtDur(red))));

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
      box.appendChild(card('Aufwachzeit',
        `<div class="needle-num small">${fmtT(avg)}</div>` +
        `<div class="hint">\u00D8 der letzten ${wakes.length} Tage</div>`));
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
    ? 'Heute'
    : viewDate.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
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

function init() {
  $('#tab-log').addEventListener('click', () => switchView('log'));
  $('#tab-analyse').addEventListener('click', () => switchView('analyse'));

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

  refresh();
}

document.addEventListener('DOMContentLoaded', init);
