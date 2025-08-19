(function() {
  'use strict';

  // Countdown
  function startCountdown() {
    var countdown = document.querySelector('.countdown');
    if (!countdown) return;
    var target = countdown.getAttribute('data-target');
    var targetDate = target ? new Date(target) : null;
    if (!targetDate || isNaN(targetDate)) return;

    function update() {
      var now = new Date();
      var diff = targetDate - now;
      if (diff < 0) diff = 0;
      var seconds = Math.floor(diff / 1000);
      var days = Math.floor(seconds / 86400);
      seconds -= days * 86400;
      var hours = Math.floor(seconds / 3600);
      seconds -= hours * 3600;
      var mins = Math.floor(seconds / 60);
      seconds -= mins * 60;
      document.getElementById('cd-days').textContent = days;
      document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
      document.getElementById('cd-secs').textContent = String(seconds).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
  }

  // Lightbox
  function initLightbox() {
    if (typeof GLightbox === 'function') {
      GLightbox({ selector: '.glightbox' });
    }
  }

  // Music toggle
  function initMusic() {
    var btn = document.getElementById('music-toggle');
    var audio = document.getElementById('bg-music');
    if (!btn || !audio) return;
    btn.addEventListener('click', function() {
      if (!audio.src) {
        // Set your music file path here if available
        // audio.src = 'assets/music/song.mp3';
      }
      if (audio.paused) {
        audio.play().then(function() { btn.classList.add('playing'); }).catch(function(){});
      } else {
        audio.pause();
        btn.classList.remove('playing');
      }
    });
  }

  // Share links
  function initShare() {
    var shareLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
    shareLinks.forEach(function(link) {
      var text = document.title + ' - ' + window.location.href;
      link.href = 'https://wa.me/?text=' + encodeURIComponent(text);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    startCountdown();
    initLightbox();
    initMusic();
    initShare();
  });
})();

