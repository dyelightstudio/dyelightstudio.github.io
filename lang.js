// Language switch for the Dyelight Realm website (TH / EN). No tracking, no network.
// Picks ?lang=, then the saved choice, then the browser language. Without JS both languages show.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  function saved() { try { return localStorage.getItem('dr_site_lang'); } catch (e) { return null; } }
  function save(l) { try { localStorage.setItem('dr_site_lang', l); } catch (e) {} }
  var q = (location.search.match(/[?&]lang=(th|en)/) || [])[1];
  var lang = q || saved() || ((navigator.language || 'th').toLowerCase().indexOf('th') === 0 ? 'th' : 'en');
  function apply(l) {
    lang = l;
    root.lang = l;
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.classList.toggle('on', el.getAttribute('data-lang') === l);
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-set') === l ? 'true' : 'false');
    });
    var t = document.querySelector('meta[name="title-' + l + '"]');
    if (t) document.title = t.content;
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { save(b.getAttribute('data-set')); apply(b.getAttribute('data-set')); });
    });
    apply(lang);
  });
})();
