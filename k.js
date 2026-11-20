/* عدّاد صفحات كريم الأسواني — Kareem Elaswany */
(function () {
  var API = 'https://aswany-bot.nfcgit.workers.dev/h';
  var BOT = 'AswanyAssist_bot';
  var host = location.hostname;
  var path = location.pathname.replace(/\/index\.html$/, '').replace(/^\/+|\/+$/g, '');
  var page = host.indexOf('bot504') === 0 ? 'me' : (path.toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9_-]/g, '') || 'home');
  var qs = new URLSearchParams(location.search);
  // مصدر الزيارة: t تاج، q كيو آر، fb فيسبوك، tt تيك توك، ig إنستجرام، g جروبات، y يافطة، w واتساب
  var SRCS = ['t', 'q', 'fb', 'tt', 'ig', 'g', 'y', 'w'];
  var sv = (qs.get('s') || '').toLowerCase();
  var src = SRCS.indexOf(sv) > -1 ? sv : 'd';

  function send(o) {
    o.p = page;
    var body = JSON.stringify(o);
    try { if (navigator.sendBeacon && navigator.sendBeacon(API, body)) return; } catch (e) {}
    try { fetch(API, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' }); } catch (e) {}
  }

  // زيارة واحدة لكل جلسة
  var key = 'kh_' + page, seen = false;
  try { seen = sessionStorage.getItem(key); sessionStorage.setItem(key, '1'); } catch (e) {}
  if (!seen) send({ s: src });

  // شيل ?s= من اللينك عشان المشاركة والكيو آر يفضلوا نضاف
  if (qs.has('s') && history.replaceState) { qs.delete('s'); var q = qs.toString(); history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); }

  function label(a) {
    if (a.getAttribute('data-k')) return a.getAttribute('data-k');
    var h = (a.getAttribute('href') || '').toLowerCase();
    if (h.indexOf('wa.me') > -1 || h.indexOf('whatsapp') > -1) return 'واتساب';
    if (h.indexOf('tel:') === 0) return 'اتصال';
    if (h.indexOf('t.me') > -1) return 'تليجرام';
    if (h.indexOf('instagram') > -1) return 'إنستجرام';
    if (h.indexOf('tiktok') > -1) return 'تيك توك';
    if (h.indexOf('facebook') > -1 || h.indexOf('fb.') > -1) return 'فيسبوك';
    if (h.indexOf('mailto:') === 0) return 'إيميل';
    if (h.indexOf('maps') > -1 || h.indexOf('goo.gl') > -1) return 'اللوكيشن';
    if (h.indexOf('youtube') > -1 || h.indexOf('youtu.be') > -1) return 'يوتيوب';
    return '';
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a,button,[data-k]');
    if (!a) return;
    var b = a.tagName === 'A' ? label(a) : (a.getAttribute('data-k') || '');
    if (!b && /vcf|حفظ|save/i.test((a.getAttribute('onclick') || '') + a.textContent)) b = 'حفظ الرقم';
    if (b) send({ b: b });
  }, true);

  // سطر «من تصميم Kareem Elaswany» يفتح بوت كريم
  function credit() {
    if (page === 'me') return;
    var links = document.querySelectorAll('.credit a, a[data-credit]');
    for (var i = 0; i < links.length; i++) {
      links[i].href = 'https://t.me/' + BOT + '?start=p_' + page;
      links[i].setAttribute('data-app', 'tg://resolve?domain=' + BOT + '&start=p_' + page);
      links[i].setAttribute('data-k', 'سطر كريم');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', credit); else credit();
})();
