// Suggested end-of-round score for each mission. Pure functions, no UI.
// The app never applies this silently: the End round sheet shows the breakdown
// and the player confirms or edits it.
(function () {
  const kindOf = id => String(id || '').replace(/-skirmish$/, '');

  function rules(mission) {
    const scoring = (mission && mission.scoring || []).join(' ');
    const special = (mission && mission.special) || '';
    const lead = special.match(/leads by (\d+)/i);
    return {
      kind: kindOf(mission && mission.id),
      // Marker VP start in the round the scoring text names; destroyed supply always scores.
      startRound: /start of the second round/i.test(scoring) ? 2 : 1,
      earlyWinLead: lead ? Number(lead[1]) : null,
      // Supply Drop: markers start inactive and switch on during the game.
      tracksActivation: ((mission && mission.parameters) || []).some(p => /all mission markers are deactivated/i.test(p)),
      // Hold Position / Gather the Resources score by the colour a marker belongs to.
      usesColour: ['hold-position', 'gather-the-resources'].includes(kindOf(mission && mission.id)),
      usesQuarters: kindOf(mission && mission.id) === 'divide-and-conquer',
      usesGather: kindOf(mission && mission.id) === 'gather-the-resources'
    };
  }

  // input: { mission, round, markers: [{ num, ctrl, prevCtrl, active, activatedRound, removed, colour }],
  //          enemyDestroyed, ownLost, quartersYou, quartersFoe, gathersYou, gathersFoe }
  // ctrl / prevCtrl / colour: 'you' | 'them' | 'neutral'
  function suggest(input) {
    const r = rules(input.mission);
    const you = [], foe = [], removed = [];
    const add = (list, label, vp, auto) => { if (vp > 0) list.push({ label, vp, auto: !!auto }); };
    const sideOf = who => (who === 'you' ? you : foe);
    const other = who => (who === 'you' ? 'them' : 'you');

    add(you, 'Enemy supply destroyed', input.enemyDestroyed || 0, false);
    add(foe, 'Your supply destroyed', input.ownLost || 0, true);

    const live = input.round >= r.startRound;
    const markers = (input.markers || []).filter(m => !m.removed);
    if (live) {
      markers.forEach(m => {
        if (!m.ctrl || m.ctrl === 'neutral') return;
        const tag = 'M' + m.num;
        const oppColour = m.colour === other(m.ctrl);
        switch (r.kind) {
          case 'frontlines': {
            const taken = m.prevCtrl === other(m.ctrl);
            add(sideOf(m.ctrl), tag + (taken ? ' held + taken this round' : ' held'), taken ? 3 : 1, true);
            break;
          }
          case 'supply-drop':
            if (!m.active) return;
            add(sideOf(m.ctrl), tag + ' (activated R' + (m.activatedRound || input.round) + '), then removed',
              m.activatedRound || input.round, true);
            removed.push(m.num);
            break;
          case 'hold-position':
            add(sideOf(m.ctrl), tag + (oppColour ? ' (opponent colour)' : ' held'), oppColour ? 2 : 1, true);
            break;
          case 'gather-the-resources':
            if (oppColour) add(sideOf(m.ctrl), tag + ' (opponent colour)', 2, true);
            break;
          case 'divide-and-conquer':
            if (String(m.num) === '5') add(sideOf(m.ctrl), 'M5 held', 2, true);
            break;
          default:
        }
      });
      if (r.usesQuarters) {
        add(you, 'Quarters won', input.quartersYou || 0, false);
        add(foe, 'Quarters won', input.quartersFoe || 0, false);
      }
    }
    if (r.usesGather) {
      add(you, 'Gather actions', input.gathersYou || 0, false);
      add(foe, 'Gather actions', input.gathersFoe || 0, false);
    }
    const sum = list => list.reduce((s, x) => s + x.vp, 0);
    return {
      rules: r, you, foe, youTotal: sum(you), foeTotal: sum(foe), removed,
      note: live ? '' : 'Markers score from round ' + r.startRound + ' in this mission.'
    };
  }

  // Marker numbers for the picked map, or the usual layout for the battle size.
  function markerNums(map, missionType) {
    if (map && map.markers && map.markers.length) return map.markers.map(m => m.num).sort((a, b) => a - b);
    return /skirmish/i.test(missionType || '') ? [1, 2, 5] : [1, 2, 3, 4, 5];
  }

  window.SCTMG_SCORE = { rules, suggest, markerNums };
})();
