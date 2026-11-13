// Army share codes: a short, versioned text code for an army (faction, faction card,
// units with tier and upgrades, tactical cards) that fits in a link and a QR code.
// No server: the code travels in the link (Vs.dc.html#army=CODE) or is pasted in.
// Units use their ids; upgrades are indexes into the unit's upgrade list.
(function () {
  const DATA = { zerg: 'SCTMG_ZERG', terran: 'SCTMG_TERRAN', protoss: 'SCTMG_PROTOSS' };
  const LETTER = { zerg: 'z', terran: 't', protoss: 'p' };
  const FROM_LETTER = { z: 'zerg', t: 'terran', p: 'protoss' };
  const VERSION = 1;

  const upgList = u => Object.values(u.upgrades || {}).flat();
  const toB64u = s => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const fromB64u = s => {
    const b = atob(String(s).replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
    return new TextDecoder().decode(Uint8Array.from(b, c => c.charCodeAt(0)));
  };

  // army: { army: [{ unitId, tierIdx, upgs }], factionId, tactical: [ids] }
  function encode(faction, army) {
    const D = window[DATA[faction]];
    if (!D) throw new Error('Unknown faction ' + faction);
    const units = (army.army || []).map(e => {
      const u = D.UNITS.find(x => x.id === e.unitId); if (!u) return null;
      const names = upgList(u).map(x => x.name);
      const ups = (e.upgs || []).map(n => names.indexOf(n)).filter(i => i >= 0);
      return [e.unitId, e.tierIdx || 0, ...ups];
    }).filter(Boolean);
    return toB64u(JSON.stringify([VERSION, LETTER[faction], army.factionId || '', units, army.tactical || []]));
  }

  // Returns { faction, factionId, army: [{ unitId, tierIdx, upgs }], tactical, skipped: [ids] } or throws.
  function decode(code) {
    const raw = String(code || '').trim().replace(/^.*[#&?]army=/, '').replace(/[&#].*$/, '');
    let p;
    try { p = JSON.parse(fromB64u(raw)); } catch (e) { throw new Error('That code could not be read.'); }
    if (!Array.isArray(p) || p[0] !== VERSION) throw new Error('That code is from a different version of the app.');
    const faction = FROM_LETTER[p[1]], D = faction && window[DATA[faction]];
    if (!D) throw new Error('That code has an unknown faction.');
    const skipped = [];
    const army = (p[3] || []).map(row => {
      const [unitId, tierIdx, ...ups] = row;
      const u = D.UNITS.find(x => x.id === unitId);
      if (!u || !u.tiers[tierIdx]) { skipped.push(unitId); return null; }
      const list = upgList(u);
      return { unitId, tierIdx, upgs: ups.map(i => list[i] && list[i].name).filter(Boolean) };
    }).filter(Boolean);
    const tactical = (p[4] || []).filter(id => { const ok = D.TACTICAL_CARDS.some(c => c.id === id); if (!ok) skipped.push(id); return ok; });
    const factionId = D.FACTION_CARDS.some(c => c.id === p[2]) ? p[2] : (D.FACTION_CARDS[0] || {}).id || null;
    return { faction, factionId, army, tactical, skipped };
  }

  // A short line for prompts: faction card name, unit count and minerals.
  function summary(data) {
    const D = window[DATA[data.faction]];
    const card = D.FACTION_CARDS.find(c => c.id === data.factionId) || D.FACTION_CARDS[0];
    const minerals = data.army.reduce((t, e) => {
      const u = D.UNITS.find(x => x.id === e.unitId), tier = u && u.tiers[e.tierIdx];
      return t + ((tier && tier.cost) || 0);
    }, 0);
    return { name: card ? card.name : data.faction, units: data.army.length, minerals,
      line: data.army.length + (data.army.length === 1 ? ' unit' : ' units') + (data.tactical.length ? ' · ' + data.tactical.length + ' tactical' : '') };
  }

  function link(code) {
    const base = location.href.replace(/[#?].*$/, '').replace(/[^/]*$/, '');
    return base + 'Vs.dc.html#army=' + code;
  }

  // QR as an image data URL (qrcode-generator, vendor/qrcode.js).
  function qrDataUrl(text) {
    if (!window.qrcode) return '';
    const q = window.qrcode(0, 'M'); q.addData(text); q.make();
    return q.createDataURL(6, 2);
  }

  window.SCTMG_SHARE = { encode, decode, summary, link, qrDataUrl, VERSION };
})();
