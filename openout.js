// In-app browsers (LINE, Facebook, Instagram) are not signed in to Google, so the
// "join the group" step fails there. LINE: reopen this page in the phone's normal
// browser (LINE's own openExternalBrowser=1 switch). Others on Android: open Google
// links in Chrome via an intent link, falling back to the plain link.
(function () {
  var ua = navigator.userAgent || '';
  if (/\bLine\//i.test(ua) && !/[?&]openExternalBrowser=1/.test(location.search)) {
    location.replace(location.href.replace(/#.*$/, '') + (location.search ? '&' : '?') + 'openExternalBrowser=1' + location.hash);
    return;
  }
  if (!/Android/i.test(ua) || !/\bLine\/|FBAN|FBAV|Instagram|Messenger/i.test(ua)) return;
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="https://groups.google.com/"]').forEach(function (a) {
      var u = a.href;
      a.href = 'intent://' + u.replace(/^https:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(u) + ';end';
    });
  });
})();
