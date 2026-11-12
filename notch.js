/* Scroll "notch" feedback for Library and Tactics: a tiny vibration (Android only; iPhones
 * don't allow web vibration) and a soft, low click as each card passes the section heading.
 * Browsers only allow sound after the first tap, so the audio unlocks on the first touch. */
(function () {
  var ctx = null, last = 0;
  function unlock() {
    try {
      if (!ctx) { var A = window.AudioContext || window.webkitAudioContext; if (A) ctx = new A(); }
      if (ctx && ctx.state === 'suspended') ctx.resume();
    } catch (e) {}
  }
  ['pointerdown', 'touchstart', 'touchend', 'keydown'].forEach(function (t) { window.addEventListener(t, unlock, { passive: true }); });
  function click() {
    if (!ctx || ctx.state !== 'running') return;
    try {
      var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(240, t);
      o.frequency.exponentialRampToValueAtTime(130, t + 0.05);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.07);
    } catch (e) {}
  }
  window.SCTMG_NOTCH = {
    tick: function () {
      var n = Date.now();
      if (n - last < 70) return;
      last = n;
      try { if (navigator.vibrate) navigator.vibrate(6); } catch (e) {}
      click();
    }
  };
})();
