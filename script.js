// Дайвинг 05 — логика страницы: шапка, меню, глубиномер,
// появление секций, видео, куки-баннер.

(function () {
  'use strict';

  // --- Шапка: фон после прокрутки ---
  var header = document.getElementById('header');
  function onScrollHeader() {
    header.classList.toggle('header--solid', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  // --- Мобильное меню ---
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) header.classList.add('header--solid');
  });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Глубиномер: «глубина» растёт по мере прокрутки ---
  var depthFill = document.getElementById('depthFill');
  var depthLabel = document.getElementById('depthLabel');
  var MAX_DEPTH = 30; // метров «на дне» страницы
  function onScrollDepth() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var t = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    depthFill.style.height = (t * 100) + '%';
    depthLabel.textContent = Math.round(t * MAX_DEPTH) + ' м';
  }
  window.addEventListener('scroll', onScrollDepth, { passive: true });
  onScrollDepth();

  // --- Появление блоков при прокрутке ---
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

  // --- Видео: играть по клику ---
  var video = document.getElementById('diveVideo');
  var playBtn = document.getElementById('videoPlay');
  playBtn.addEventListener('click', function () {
    playBtn.classList.add('hidden');
    video.setAttribute('controls', '');
    video.play();
  });
  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) playBtn.classList.remove('hidden');
  });

  // --- Куки-баннер ---
  var KEY = 'diving05-cookie-consent-v1';
  var banner = document.getElementById('cookieBanner');
  var accept = document.getElementById('cookieAccept');
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* приватный режим */ }
  if (!saved) {
    setTimeout(function () { banner.hidden = false; }, 1200);
  }
  accept.addEventListener('click', function () {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        necessary: true,
        acceptedAt: new Date().toISOString(),
        version: 1
      }));
    } catch (e) { /* приватный режим — просто скрываем */ }
    banner.hidden = true;
  });
})();
