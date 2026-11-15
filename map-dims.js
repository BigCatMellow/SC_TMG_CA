// Measurements to draw on a deployment map, worked out from its zones and markers (inches).
// The War Room draws these as lines with arrows, like the printed cards:
//   - outside the board: how far each deployment zone runs along the edge it touches
//   - inside each zone: how deep it is
//   - from each marker: the distance to the nearest side edge and to the nearest top/bottom edge
//   - the table: its width along the bottom and its height down the left
// A marker on a centre line gets no number for that axis: the dotted centre line shows it.
(function () {
  const near = (a, b) => Math.abs(a - b) < 0.01;

  // Contiguous runs of one colour along one board edge: [{from, to, rects}]
  function runs(rects, touches, along) {
    const segs = rects.filter(touches).map(r => [...along(r), r]).sort((a, b) => a[0] - b[0]);
    const out = [];
    segs.forEach(([a, b, r]) => {
      const last = out[out.length - 1];
      if (last && a <= last.to + 0.01) { last.to = Math.max(last.to, b); last.rects.push(r); } else out.push({ from: a, to: b, rects: [r] });
    });
    return out;
  }
  // Is a rectangle laid along the top/bottom edges (true) or the side edges (false)?
  const lies = (r, W, H) => {
    const tb = near(r.y, 0) || near(r.y + r.h, H), lr = near(r.x, 0) || near(r.x + r.w, W);
    return tb && (!lr || r.w > r.h);
  };

  function dims(map) {
    const W = map.width, H = map.height, out = [];
    // Markers: one line to the nearest side edge, one to the nearest top/bottom edge.
    const markers = map.markers || [], R = 2; // marker radius in inches
    const blocked = (m, horiz, to) => markers.some(o => o !== m && (horiz
      ? Math.abs(o.y - m.y) < 2.5 && o.x > Math.min(m.x, to) && o.x < Math.max(m.x, to)
      : Math.abs(o.x - m.x) < 2.5 && o.y > Math.min(m.y, to) && o.y < Math.max(m.y, to)));
    markers.forEach(m => {
      if (!near(m.x, W / 2)) {
        const to = m.x < W / 2 ? 0 : W;
        if (!blocked(m, true, to)) out.push({ x1: m.x + (to ? R : -R), y1: m.y, x2: to, y2: m.y, label: Math.abs(to - m.x), colour: 'marker' });
      }
      if (!near(m.y, H / 2)) {
        const to = m.y < H / 2 ? 0 : H;
        if (!blocked(m, false, to)) out.push({ x1: m.x, y1: m.y + (to ? R : -R), x2: m.x, y2: to, label: Math.abs(to - m.y), colour: 'marker' });
      }
    });
    const markerLines = out.slice();
    const sides = [['red', map.redZones || []], ['blue', map.blueZones || []]];
    // Zone length along each edge, drawn just outside the board (2" out).
    sides.forEach(([colour, rects]) => {
      const edges = [
        ['top', r => near(r.y, 0), r => [r.x, r.x + r.w], W],
        ['bottom', r => near(r.y + r.h, H), r => [r.x, r.x + r.w], W],
        ['left', r => near(r.x, 0), r => [r.y, r.y + r.h], H],
        ['right', r => near(r.x + r.w, W), r => [r.y, r.y + r.h], H]
      ];
      edges.forEach(([edge, touches, along, full]) => {
        const horiz = edge === 'top' || edge === 'bottom';
        runs(rects, touches, along).forEach(({ from, to, rects: rs }) => {
          if (near(to - from, full)) return; // the whole edge: nothing to measure
          // Only the end of a strip that runs along the other way: its depth already says it.
          if (rs.length === 1 && lies(rs[0], W, H) !== horiz) return;
          const o = edge === 'top' || edge === 'left' ? -2 : (horiz ? H : W) + 2;
          const push = (a, b, c) => out.push(horiz ? { x1: a, y1: o, x2: b, y2: o, label: c, colour, outside: true }
                                                   : { x1: o, y1: a, x2: o, y2: b, label: c, colour, outside: true });
          push(from, to, to - from);
          // A zone that starts away from a corner and isn't centred: say where it starts.
          const centred = near(from, full - to);
          if (!centred && from > 0.01 && full - to > 0.01) push(0, from, from);
        });
      });
      // Depth of each zone rectangle, measured away from the edge it sits on.
      rects.forEach(r => {
        const left = near(r.x, 0), right = near(r.x + r.w, W);
        // Put the depth arrow where no marker line runs through the zone (middle if possible).
        const spot = (start, len, vertical) => {
          const clear = v => markerLines.every(d => vertical
            ? !(near(d.x1, d.x2) && Math.abs(d.x1 - v) < 4.5 && Math.max(d.y1, d.y2) > r.y && Math.min(d.y1, d.y2) < r.y + r.h)
            : !(near(d.y1, d.y2) && Math.abs(d.y1 - v) < 4.5 && Math.max(d.x1, d.x2) > r.x && Math.min(d.x1, d.x2) < r.x + r.w));
          const at = [0.5, 0.3, 0.7, 0.15, 0.85].map(f => start + len * f).find(clear);
          return at == null ? start + len / 2 : at;
        };
        if (lies(r, W, H)) {
          const x = spot(r.x, r.w, true);
          out.push({ x1: x, y1: r.y, x2: x, y2: r.y + r.h, label: r.h, colour });
        } else if (left || right) {
          const y = spot(r.y, r.h, false);
          out.push({ x1: r.x, y1: y, x2: r.x + r.w, y2: y, label: r.w, colour });
        }
      });
    });
    // The table itself: full width under the board, full height on the left, outside the zone lines.
    out.push({ x1: 0, y1: H + 4.5, x2: W, y2: H + 4.5, label: W, colour: 'table', outside: true });
    // Keep this label clear of the zone measurements on the same edge: middle if free, else the first free spot.
    const leftLabels = out.filter(d => d.outside && d.x1 < 0 && d.colour !== 'table').map(d => (d.y1 + d.y2) / 2);
    const at = [0.5, 0.88, 0.12, 0.3, 0.7].find(f => leftLabels.every(y => Math.abs(y - H * f) > 4)) ?? 0.5;
    out.push({ x1: -4.5, y1: 0, x2: -4.5, y2: H, label: H, colour: 'table', outside: true, at });
    return out;
  }

  // Printed colour of a marker: 1 and 3 Red, 2 and 4 Blue, 5 Neutral.
  const markerColour = n => (n === 5 ? 'neutral' : n % 2 ? 'red' : 'blue');

  window.SCTMG_MAP_DIMS = { dims, markerColour };
})();
