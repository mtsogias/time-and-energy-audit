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

let days = load(LS.days, {});
let entries = load(LS.entries, {});
let acts = load(LS.acts, DEFAULT_ACTS.slice());
let sel = load(LS.sel, { activity: acts[0] || null, value: 2, energy: 1 });
let raster = load(LS.raster, 30);
let viewDate = new Date();
let view = 'log';          // 'log' | 'analyse'
let range = 'day';         // 'day' | 'week'
let durSel = 0;            // 0 = 1 Block, sonst Minuten
let scrollFlag = true;     // beim naechsten Timeline-Render zum Jetzt-Block scrollen

const key = () => dstr(viewDate);
const dayData = () => days[key()] || null;
const dayEntries = () => entries[key()] || [];
const winStart = () => Math.floor(dayData().wake / raster) * raster;
const winEnd = () => winStart() + (dayData().span || DEFAULT_SPAN) * 60;

/* ================= Timeline ================= */
function renderLog() {
  const tl = $('#timeline');
  tl.innerHTML = '';
  const d = dayData();

  if (!d) {
    renderWakePrompt(tl, false);
    window.scrollTo({ top: 0 });
    return;
  }

  // Aufwach-Zeile
  const wr = document.createElement('button');
  wr.className = 'wake-row';
  wr.innerHTML = `<span>Aufgewacht</span><strong>${fmtT(d.wake)}</strong><span class="wake-edit">aendern</span>`;
  wr.addEventListener('click', () => renderWakePrompt(tl, true));
  tl.appendChild(wr);

  const list = dayEntries();
  const now = new Date();
  const isToday = key() === dstr(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let nowEl = null;
  let broke = false;

  for (let t = winStart(); t < winEnd(); t += raster) {
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
      const sameNext = list.some(e => e.id === covering.id && t + raster >= e.start && t + raster < e.start + e.dur);
      slot.classList.add('filled', covering.energy > 0 ? 'pos' : 'neg');
      slot.classList.add(isStart ? (sameNext ? 'grp-start' : 'grp-single') : (sameNext ? 'grp-mid' : 'grp-end'));

      if (isStart) {
        const c = document.createElement('div');
        c.className = 'slot-content';
        c.innerHTML =
          `<div class="slot-main">` +
            `<span class="slot-act">${esc(covering.activity)}</span>` +
            `<span class="slot-sub">${fmtT(covering.start)} \u2013 ${fmtT(covering.start + covering.dur)}</span>` +
          `</div>` +
          `<span class="slot-val">${'$'.repeat(covering.value)}</span>`;
        slot.appendChild(c);
        const del = document.createElement('button');
        del.className = 'del';
        del.textContent = '\u00D7';
        del.setAttribute('aria-label', 'Eintrag loeschen');
        del.addEventListener('click', ev => { ev.stopPropagation(); removeEntry(covering.id); });
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

    if (isToday && nowMin >= t && nowMin < t + raster) {
      slot.classList.add('now');
      nowEl = slot;
    }

    slot.addEventListener('click', () => stamp(t));
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
  }
}

/* ================= Wake Prompt ================= */
function renderWakePrompt(tl, edit) {
  tl.innerHTML = '';
  const now = new Date();
  const isToday = key() === dstr(now);
  const def = edit && dayData()
    ? fmtT(dayData().wake)
    : (isToday ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : '08:00');

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

/* ================= Stempeln ================= */
function stamp(t) {
  if (!sel.activity) { openNewActivity(); return; }
  const D = durSel || raster;
  const k = key();
  const out = [];

  // Ueberlappungen mit [t, t+D) entfernen bzw. aufteilen
  for (const e of dayEntries()) {
    const s = e.start, en = e.start + e.dur;
    if (en <= t || s >= t + D) { out.push(e); continue; }
    if (s < t) out.push({ ...e, id: uid(), dur: t - s });
    if (en > t + D) out.push({ ...e, id: uid(), start: t + D, dur: en - (t + D) });
  }

  // Mit gleichen Nachbarn verschmelzen
  const same = e => e.activity === sel.activity && e.value === sel.value && e.energy === sel.energy;
  const prev = out.find(e => e.start + e.dur === t && same(e));
  const next = out.find(e => e.start === t + D && same(e));
  if (prev && next) { prev.dur += D + next.dur; out.splice(out.indexOf(next), 1); }
  else if (prev) { prev.dur += D; }
  else if (next) { next.start = t; next.dur += D; }
  else out.push({ id: uid(), start: t, dur: D, activity: sel.activity, value: sel.value, energy: sel.energy });

  entries[k] = out.sort((a, b) => a.start - b.start);
  save(LS.entries, entries);
  touchAct(sel.activity);

  durSel = 0;
  renderChips();
  renderDur();
  renderLog();
  if (navigator.vibrate) navigator.vibrate(8);
}

function removeEntry(id) {
  entries[key()] = dayEntries().filter(e => e.id !== id);
  save(LS.entries, entries);
  renderLog();
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
    c.addEventListener('click', () => { sel.activity = a; save(LS.sel, sel); renderChips(); });
    w.appendChild(c);
  });
  const p = document.createElement('button');
  p.className = 'chip plus';
  p.textContent = '+ Neu';
  p.addEventListener('click', openNewActivity);
  w.appendChild(p);
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
  document.querySelectorAll('#dur-select button').forEach(b => b.classList.toggle('active', +b.dataset.d === durSel));
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
  const needle = list.filter(e => e.value === 3).reduce((s, e) => s + e.dur, 0);
  const green = list.filter(e => e.energy > 0).reduce((s, e) => s + e.dur, 0);
  const red = total - green;
  const byVal = { 1: 0, 2: 0, 3: 0 };
  list.forEach(e => { byVal[e.value] += e.dur; });
  const byAct = {};
  list.forEach(e => {
    const a = byAct[e.activity] || (byAct[e.activity] = { min: 0, g: 0, r: 0 });
    a.min += e.dur;
    if (e.energy > 0) a.g += e.dur; else a.r += e.dur;
  });

  // Needle Mover
  box.appendChild(card('Needle Mover',
    `<div class="needle-num">${Math.round(needle / total * 100)}%</div>` +
    `<div class="hint">$$$-Zeit: ${fmtDur(needle)} von ${fmtDur(total)} geloggt</div>`));

  // Zeit pro Aktivitaet (Balken relativ zum Maximum, Farbe = Energie-Bilanz)
  const sorted = Object.entries(byAct).sort((a, b) => b[1].min - a[1].min);
  const max = sorted[0][1].min;
  box.appendChild(card('Zeit pro Aktivitaet',
    sorted.map(([n, a]) =>
      barRow(esc(n), Math.round(a.min / max * 100), a.g >= a.r ? 'var(--green)' : 'var(--red)', fmtDur(a.min))
    ).join('') +
    `<div class="hint">Farbe = Energie-Bilanz der Aktivitaet</div>`));

  // $-Verteilung (Anteil an geloggter Zeit)
  box.appendChild(card('$-Verteilung',
    [3, 2, 1].map(v =>
      barRow(`<span style="color:var(--gold);font-weight:700">${'$'.repeat(v)}</span>`,
        Math.round(byVal[v] / total * 100), 'var(--gold)',
        `${fmtDur(byVal[v])} \u00B7 ${Math.round(byVal[v] / total * 100)}%`)
    ).join('') +
    `<div class="hint">$ = Busywork \u00B7 $$ = wichtig \u00B7 $$$ = bewegt die Nadel</div>`));

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
  $('#raster-toggle').classList.toggle('hidden', v !== 'log');
  $('#range-toggle').classList.toggle('hidden', v !== 'analyse');
  if (v === 'analyse') renderAnalysis();
}

function renderDayLabel() {
  $('#day-label').textContent = key() === dstr(new Date())
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
function init() {
  $('#tab-log').addEventListener('click', () => switchView('log'));
  $('#tab-analyse').addEventListener('click', () => switchView('analyse'));

  $('#prev-day').addEventListener('click', () => { viewDate.setDate(viewDate.getDate() - 1); scrollFlag = true; refresh(); });
  $('#next-day').addEventListener('click', () => { viewDate.setDate(viewDate.getDate() + 1); scrollFlag = true; refresh(); });
  $('#day-label').addEventListener('click', () => { viewDate = new Date(); scrollFlag = true; refresh(); });
  $('#now-btn').addEventListener('click', () => {
    viewDate = new Date();
    scrollFlag = true;
    if (view !== 'log') switchView('log');
    refresh();
  });

  document.querySelectorAll('#raster-toggle button').forEach(b => {
    b.classList.toggle('active', +b.dataset.raster === raster);
    b.addEventListener('click', () => {
      raster = +b.dataset.raster;
      save(LS.raster, raster);
      document.querySelectorAll('#raster-toggle button').forEach(x => x.classList.toggle('active', x === b));
      renderLog();
    });
  });

  document.querySelectorAll('#range-toggle button').forEach(b => {
    b.addEventListener('click', () => {
      range = b.dataset.range;
      document.querySelectorAll('#range-toggle button').forEach(x => x.classList.toggle('active', x === b));
      renderAnalysis();
    });
  });

  document.querySelectorAll('#value-select button').forEach(b =>
    b.addEventListener('click', () => { sel.value = +b.dataset.v; save(LS.sel, sel); renderSel(); }));
  document.querySelectorAll('#energy-select button').forEach(b =>
    b.addEventListener('click', () => { sel.energy = +b.dataset.e; save(LS.sel, sel); renderSel(); }));
  document.querySelectorAll('#dur-select button').forEach(b =>
    b.addEventListener('click', () => { durSel = +b.dataset.d; renderDur(); }));

  $('#add-activity-btn').addEventListener('click', addActivity);
  $('#new-activity-input').addEventListener('keydown', e => { if (e.key === 'Enter') addActivity(); });

  refresh();
}

document.addEventListener('DOMContentLoaded', init);
