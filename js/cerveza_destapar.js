// Sonido de destapar cerveza, sintetizado con Web Audio (sin archivos externos)
let ctx;
function ruido(seg) {
  const b = ctx.createBuffer(1, ctx.sampleRate * seg, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function destapar() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  const t = ctx.currentTime;

  // 1) "Clac" metálico de la tapa
  const clic = ctx.createBufferSource(); clic.buffer = ruido(0.05);
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 4;
  const gc = ctx.createGain();
  gc.gain.setValueAtTime(1.2, t); gc.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  clic.connect(bp).connect(gc).connect(ctx.destination); clic.start(t);

  // 2) "Pop" del gas
  const pop = ctx.createOscillator(); pop.type = 'sine';
  pop.frequency.setValueAtTime(420, t + 0.01); pop.frequency.exponentialRampToValueAtTime(90, t + 0.09);
  const gp = ctx.createGain();
  gp.gain.setValueAtTime(0.0001, t); gp.gain.exponentialRampToValueAtTime(0.8, t + 0.015);
  gp.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  pop.connect(gp).connect(ctx.destination); pop.start(t); pop.stop(t + 0.15);

  // 3) "Psssst" del gas escapando
  const ps = ctx.createBufferSource(); ps.buffer = ruido(0.9);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500;
  const gs = ctx.createGain();
  gs.gain.setValueAtTime(0.0001, t + 0.02); gs.gain.exponentialRampToValueAtTime(0.5, t + 0.06);
  gs.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
  ps.connect(hp).connect(gs).connect(ctx.destination); ps.start(t + 0.02);
}
document.addEventListener('mousedown', destapar);