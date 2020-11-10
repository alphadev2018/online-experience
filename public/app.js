window.onresize = function() {
    if (((/Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /iPhone/.test(navigator.platform)) && !(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && window.matchMedia("(orientation: landscape)").matches) {
      document.getElementById("root").style.display = "none";
      document.getElementById("warning").style.display = "block";
    } else {
      document.getElementById("root").style.display = "block";
      document.getElementById("warning").style.display = "none";
    }
};
window.onresize();
function cancelFullScreen() {
      var el = document;
      var requestMethod = el.cancelFullScreen||el.webkitCancelFullScreen||el.mozCancelFullScreen||el.exitFullscreen||el.webkitExitFullscreen;
      if (requestMethod) { // cancel full screen.
          requestMethod.call(el);
      } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
          var wscript = new ActiveXObject("WScript.Shell");
          if (wscript !== null) {
              wscript.SendKeys("{F11}");
          }
      }
}

function requestFullScreen(el) {
      // Supports most browsers and their versions.
      var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;

      if (requestMethod) { // Native full screen.
          requestMethod.call(el);
      } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
          var wscript = new ActiveXObject("WScript.Shell");
          if (wscript !== null) {
              wscript.SendKeys("{F11}");
          }
      }
      return false
}

function toggleFullScreen(el) {
      if (!el) {
          el = document.body; // Make the body go full screen.
      }
      var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);

      if (isInFullScreen) {
          cancelFullScreen();
      } else {
          requestFullScreen(el);
      }
      return false;
} 

var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
      var now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
}, false);
document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
}, false);
    
function analytics(island) {
    const names = {
        "home0": "EMEA",
        "home1": "APAC",
        "home2": "AMER",
        "media": "Product Island",
        "game": "Game Island"
    };
    
    console.log('analytics '+names[island]);
    plausible('Visit '+names[island]);
}