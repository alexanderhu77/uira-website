(function () {
  'use strict';

  /* Chronological order (earliest first). Index matches embeds/album-0 … album-5. */
  var EVENTS = [
    { title: 'First Poster Day', date: 'May 2024', albumUrl: 'https://photos.app.goo.gl/HfHtHXT8jaWCyt9f6' },
    { title: 'Routes to Research', date: 'Nov 2024', albumUrl: 'https://photos.app.goo.gl/HNBGiexuvRjoDZHDA' },
    { title: 'Lightning Talks', date: 'Mar 2025', albumUrl: 'https://photos.app.goo.gl/sp9jomFerB2taL9b7' },
    { title: 'Poster Day', date: 'May 2025', albumUrl: 'https://photos.app.goo.gl/KY988Nd3q1KomEzn8' },
    { title: 'Routes to Research', date: 'Jan 2026', albumUrl: 'https://photos.app.goo.gl/Qpkd84Y32MwZLiER7' },
    { title: 'Bites & Breakthroughs', date: 'Mar 2026', albumUrl: 'https://photos.app.goo.gl/QhSXKxDpvM2N38QLA' }
  ];

  /* x/y coordinates place badges on the route. 6 stops across 1280px canvas. */
  var STOP_POSITIONS = [
    { x: 110, y: 200, cardSide: 'above' },
    { x: 310, y: 200, cardSide: 'below' },
    { x: 510, y: 200, cardSide: 'above' },
    { x: 710, y: 200, cardSide: 'below' },
    { x: 910, y: 200, cardSide: 'above' },
    { x: 1110, y: 200, cardSide: 'below' }
  ];

  var PAW_PRINTS = [
    { left: '7%', top: '12%', rotate: -18, scale: 1.0 },
    { left: '17%', top: '72%', rotate: 12, scale: 1.1 },
    { left: '24%', top: '28%', rotate: -6, scale: 0.88 },
    { left: '33%', top: '8%', rotate: 20, scale: 1.15 },
    { left: '54%', top: '76%', rotate: -10, scale: 0.95 },
    { left: '55%', top: '22%', rotate: 14, scale: 1.08 },
    { left: '64%', top: '64%', rotate: -15, scale: 0.9 },
    { left: '76%', top: '14%', rotate: 9, scale: 1.05 },
    { left: '84%', top: '70%', rotate: -8, scale: 0.84 },
    { left: '92%', top: '30%', rotate: 16, scale: 1.18 }
  ];

  /* SVG path passes through STOP_POSITIONS x-coords; control points align with 6-stop wave. */
  var ROUTE_PATH_D = 'M 70 205 C 110 205, 270 165, 310 205 C 350 245, 470 245, 510 205 C 550 165, 670 165, 710 205 C 750 245, 870 245, 910 205 C 950 165, 1070 165, 1110 205 C 1140 185, 1230 185, 1260 205';

  var roadmapEl = document.getElementById('events-roadmap');
  var modal = document.getElementById('album-modal');
  var modalTitle = document.getElementById('modal-title');
  var overlay = modal && modal.querySelector('.album-modal-overlay');
  var closeBtn = modal && modal.querySelector('.album-modal-close');
  var widgetContainer = document.getElementById('album-widget-container');
  var previousActiveElement = null;
  var mapScrollEl = null;
  var activeIndex = -1;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PUBLICALBUM_SCRIPT = 'https://cdn.jsdelivr.net/npm/publicalbum@latest/embed-ui.min.js';

  function loadPublicAlbumWidget(index, link, title) {
    if (!widgetContainer) return;
    widgetContainer.innerHTML = '';
    var embedPath = 'embeds/album-' + index + '.html';

    function injectAndLoadScript(html) {
      if (html && html.trim()) {
        widgetContainer.innerHTML = html;
      } else {
        var div = document.createElement('div');
        div.className = 'pa-gallery-player-widget';
        div.setAttribute('data-link', link);
        div.setAttribute('data-title', title || '');
        div.style.width = '100%';
        div.style.height = '480px';
        div.style.display = 'none';
        div.style.margin = '0 auto';
        widgetContainer.appendChild(div);
      }
      var script = document.createElement('script');
      script.src = PUBLICALBUM_SCRIPT + '?t=' + Date.now();
      script.async = true;
      document.body.appendChild(script);
    }

    fetch(embedPath)
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(injectAndLoadScript)
      .catch(function () { injectAndLoadScript(''); });
  }

  function createEl(tag, className) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attrs).forEach(function (k) {
      el.setAttribute(k, attrs[k]);
    });
    return el;
  }

  function PlaceholderBadge(event, index) {
    var badge = createEl('button', 'placeholder-badge');
    badge.type = 'button';
    badge.setAttribute('data-event-index', String(index));
    badge.setAttribute('aria-label', 'Select event: ' + event.title + ', ' + event.date);
    return badge;
  }

  function RouteSVG() {
    var svg = svgEl('svg', {
      class: 'events-route-svg',
      viewBox: '0 0 1280 390',
      preserveAspectRatio: 'none',
      'aria-hidden': 'true'
    });
    var path = svgEl('path', {
      class: 'events-route-line',
      d: ROUTE_PATH_D
    });
    svg.appendChild(path);
    return svg;
  }

  function createPawPrintNode(config) {
    var paw = createEl('div', 'paw-print');
    paw.style.left = config.left;
    paw.style.top = config.top;
    paw.style.transform = 'rotate(' + config.rotate + 'deg) scale(' + config.scale + ')';
    var img = document.createElement('img');
    img.src = 'images/assets/paw.png';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    paw.appendChild(img);
    return paw;
  }

  function EventStop(event, index, pos) {
    var stop = createEl('div', 'event-stop ' + pos.cardSide);
    stop.style.left = pos.x + 'px';
    stop.style.top = pos.y + 'px';
    stop.setAttribute('data-stop-index', String(index));

    var badge = PlaceholderBadge(event, index);
    stop.appendChild(badge);

    var card = createEl('div', 'event-card');
    var title = createEl('h3', 'event-title');
    title.textContent = event.title;
    var date = createEl('p', 'event-date');
    date.textContent = event.date;
    card.appendChild(title);
    card.appendChild(date);
    stop.appendChild(card);
    return stop;
  }

  function centerStop(index) {
    if (!mapScrollEl) return;
    var stop = roadmapEl.querySelector('.event-stop[data-stop-index="' + index + '"]');
    if (!stop) return;
    var targetLeft = stop.offsetLeft - (mapScrollEl.clientWidth / 2) + (stop.clientWidth / 2);
    mapScrollEl.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  function updateActive(index) {
    activeIndex = index;
    var stops = roadmapEl.querySelectorAll('.event-stop');
    Array.prototype.forEach.call(stops, function (stop, stopIndex) {
      stop.classList.toggle('is-active', stopIndex === index);
    });
    if (index >= 0) centerStop(index);
  }

  function setupParallax() {
    if (prefersReducedMotion || !mapScrollEl || !roadmapEl) return;
    var ticking = false;
    function update() {
      ticking = false;
      roadmapEl.style.setProperty('--paw-parallax-x', String(-mapScrollEl.scrollLeft * 0.12) + 'px');
    }
    mapScrollEl.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function setupDragScroll() {
    if (!mapScrollEl) return;
    var isDragging = false;
    var startX = 0;
    var startLeft = 0;

    mapScrollEl.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.pageX;
      startLeft = mapScrollEl.scrollLeft;
      mapScrollEl.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var dx = e.pageX - startX;
      mapScrollEl.scrollLeft = startLeft - dx;
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
      mapScrollEl.classList.remove('is-dragging');
    });
  }

  function EventRouteMap() {
    if (!roadmapEl) return;
    roadmapEl.innerHTML = '';
    roadmapEl.className = 'events-roadmap events-map';

    var shell = createEl('div', 'events-map-shell');
    mapScrollEl = createEl('div', 'events-map-scroll');
    mapScrollEl.setAttribute('role', 'region');
    mapScrollEl.setAttribute('aria-label', 'Event photos route map');
    var canvas = createEl('div', 'events-map-canvas');
    var textureLayer = createEl('div', 'events-paper-texture');
    var pawLayer = createEl('div', 'events-paw-layer');

    PAW_PRINTS.forEach(function (p) {
      pawLayer.appendChild(createPawPrintNode(p));
    });

    canvas.appendChild(textureLayer);
    canvas.appendChild(pawLayer);
    canvas.appendChild(RouteSVG());

    EVENTS.forEach(function (event, index) {
      canvas.appendChild(EventStop(event, index, STOP_POSITIONS[index]));
    });

    mapScrollEl.appendChild(canvas);
    shell.appendChild(mapScrollEl);
    roadmapEl.appendChild(shell);

    setupDragScroll();
    setupParallax();
    updateActive(-1);
  }

  function getFocusables(container) {
    var selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    var nodes = container.querySelectorAll(selector);
    return Array.prototype.filter.call(nodes, function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
  }

  function trapFocus(e) {
    if (e.key !== 'Tab' || !modal || modal.hidden) return;
    var focusables = getFocusables(modal);
    if (focusables.length === 0) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openModal(index) {
    if (!modal || index < 0 || index >= EVENTS.length) return;
    previousActiveElement = document.activeElement;
    var ev = EVENTS[index];
    modalTitle.textContent = ev.title + (ev.date ? ' · ' + ev.date : '');
    loadPublicAlbumWidget(index, ev.albumUrl || '#', ev.title);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', trapFocus);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }

  function handleKeydown(e) {
    if (e.key !== 'Escape' || !modal || modal.hidden) return;
    closeModal();
  }

  function init() {
    EventRouteMap();

    if (overlay) overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleKeydown);

    roadmapEl.addEventListener('click', function (e) {
      var stop = e.target.closest('.event-stop[data-stop-index]');
      if (stop) {
        var index = parseInt(stop.getAttribute('data-stop-index'), 10);
        if (!isNaN(index)) {
          if (index === activeIndex) {
            updateActive(-1);
          } else {
            updateActive(index);
            openModal(index);
          }
        }
        return;
      }
      if (activeIndex >= 0) updateActive(-1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
