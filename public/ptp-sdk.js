/* PlaytestPilot SDK v0.2 - add <script src="https://playtestpilot.vercel.app/ptp-sdk.js"></script> to your game.
   Lets the in-browser tester send key presses into the game and receive its errors, even cross-origin. */
(function(){
  var parentWin = window.parent !== window ? window.parent : null;
  function send(m){ if(parentWin) parentWin.postMessage(Object.assign({ptp:'report'}, m), '*'); }
  window.addEventListener('error', function(e){ send({type:'error', msg: String(e.message || e)}); });
  window.addEventListener('unhandledrejection', function(e){ send({type:'error', msg: 'unhandled promise: ' + String(e.reason)}); });
  var codes = {' ':'Space', Enter:'Enter', z:'KeyZ', x:'KeyX', w:'KeyW', a:'KeyA', s:'KeyS', d:'KeyD'};
  window.addEventListener('message', function(e){
    var d = e.data; if(!d || d.ptp !== 'key') return;
    var opts = {key:d.key, code: codes[d.key] || d.key, bubbles:true};
    var t = document.activeElement || document.body;
    t.dispatchEvent(new KeyboardEvent('keydown', opts));
    setTimeout(function(){ t.dispatchEvent(new KeyboardEvent('keyup', opts)); }, 120);
  });
  var last = Date.now(); (function tick(){ last = Date.now(); requestAnimationFrame(tick); })();
  setInterval(function(){ send({type:'heartbeat', frameAgeMs: Date.now() - last}); }, 1000);
  send({type:'hello'});
})();
