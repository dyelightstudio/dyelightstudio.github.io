// Dyelight Realm library: search + filters over window.LIB (library/data.js, generated from the game data).
// Thai / English follows the page language (lang.js sets <html lang>). No network, no tracking.
(function () {
  const L = window.LIB;
  const $ = (q) => document.querySelector(q);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const en = () => document.documentElement.lang === "en";
  const t = (th, e) => (en() && e ? e : th);
  const ORG = Object.fromEntries(L.dna.map((o) => [o.id, o]));          // the DNA kinds
  const TRIBE = Object.fromEntries(L.tribes.map((x) => [x.id, x]));
  const ELEM = Object.fromEntries(L.elems.map((x) => [x.th, x.en]));
  const ic = (n, cls = "ic sm") => `<img class="${cls}" src="../img/icons/${n}.png" alt="" loading="lazy" width="26" height="26">`;
  const TABS = {
    cards: { f: ["tribe", "el", "kind", "slot"] },
    dna: { f: ["el", "slot"] },
    genes: { f: ["tier"] }, runes: { f: [] }, status: { f: [] },
  };
  let tab = (location.hash.slice(1) in TABS) ? location.hash.slice(1) : "cards";

  function opts(sel, all, list) {
    const cur = sel.value;
    sel.innerHTML = `<option value="">${esc(all)}</option>` + list.map(([v, label]) => `<option value="${esc(v)}">${esc(label)}</option>`).join("");
    sel.value = list.some(([v]) => v === cur) ? cur : "";
  }
  function fillFilters() {
    opts($("#f-tribe"), t("ทุกเผ่า", "All tribes"), [...L.tribes.map((x) => [x.id, t(x.th, x.en)]), ["none", t("ไม่ใช้ DNA ลำตัว", "No body DNA")]]);
    opts($("#f-el"), t("ทุกธาตุ", "All elements"), L.elems.map((x) => [x.th, t(x.th, x.en)]));
    opts($("#f-kind"), t("ทุกประเภท", "All kinds"), L.kinds.map((x) => [x.k, t(x.k, x.en)]));
    opts($("#f-slot"), t("ทุกสาย DNA", "All DNA strands"), L.slots.map((x) => [x.id, t(x.th, x.en)]));
    opts($("#f-tier"), t("ทุกระดับ", "All tiers"), L.tiers.map((x) => [x, x]));
    for (const k of ["tribe", "el", "kind", "slot", "tier"]) $("#f-" + k).hidden = !TABS[tab].f.includes(k);
    $("#q").placeholder = t("ค้นหาชื่อหรือข้อความ…", "Search names or text…");
  }
  const has = (q, ...xs) => !q || xs.some((x) => x && String(x).toLowerCase().includes(q));
  const orgName = (id) => (ORG[id] ? t(ORG[id].th, ORG[id].en) : id);
  const elText = (els) => els.map((x) => t(x, ELEM[x])).join(" + ");

  const VIEW = {
    cards(q, f) {
      return L.cards.filter((c) => (!f.tribe || (f.tribe === "none" ? !c.tribe : c.tribe === f.tribe)) && (!f.el || c.el.includes(f.el)) &&
          (!f.kind || c.kind === f.kind) && (!f.slot || ORG[c.a].slot === f.slot || ORG[c.b].slot === f.slot) &&
          has(q, c.th, c.en, c.desc, c.desc_en, ORG[c.a].th, ORG[c.a].en, ORG[c.b].th, ORG[c.b].en, c.code))
        .map((c) => `<article class="lc card">
  <img class="cimg" src="../img/cards_s/${c.code}.webp" alt="" loading="lazy" width="240" height="320">
  <div><h3>${esc(t(c.th, c.en))}</h3>
  <p class="chips">${ic(c.ki)}${esc(t(c.kind, c.kind_en))}${c.tribe ? ` · ${ic(TRIBE[c.tribe].ic)}${esc(t(TRIBE[c.tribe].th, TRIBE[c.tribe].en))}` : ""}${c.el.length ? ` · ${esc(elText(c.el))}` : ""}</p>
  <p class="chips">${esc(orgName(c.a))} + ${esc(orgName(c.b))} · ${esc(t(c.r, c.r_en))}</p>
  <p>${esc(t(c.desc, c.desc_en))}</p></div></article>`);
    },
    dna(q, f) {
      const slot = (id) => L.slots.find((x) => x.id === id);
      return L.dna.filter((o) => (!f.slot || o.slot === f.slot) && (!f.el || o.el.includes(f.el)) && has(q, o.th, o.en, o.id))
        .map((o) => `<article class="lc row">${o.pic ? `<img class="dy sm" src="../img/dy/${o.pic}.webp" alt="" loading="lazy">` : ic(slot(o.slot).ic, "ic big")}
  <div><h3>${esc(t(o.th, o.en))}</h3><p class="chips">${esc(t(slot(o.slot).th, slot(o.slot).en))}
  · ${esc(t("เด่น", "Strong in"))} ${esc(o.focus.map((x) => (x === "ALL" ? t("ทุกค่า", "all stats") : x)).join(", "))}${o.el.length ? " · " + esc(elText(o.el)) : ""}</p>
  <p><a href="#cards" data-dna="${o.id}">${esc(t(`อยู่ในการ์ด ${o.n} ใบ`, `In ${o.n} cards`))} →</a></p></div></article>`);
    },
    genes(q, f) {
      return L.genes.filter((g) => (!f.tier || g.tier === f.tier) && has(q, g.th, g.en, g.effect, g.effect_en, g.group, g.group_en, g.code))
        .map((g) => `<article class="lc row"><span class="gt t${g.tier}">${g.tier}</span><div><h3>${esc(t(g.th, g.en))}${g.gamble ? ` <small>${esc(t("เสี่ยงดวง", "gamble"))}</small>` : ""}</h3>
  <p class="chips">${esc(t(g.group, g.group_en))} · ${g.code}</p><p>${esc(en() ? g.effect_en || "" : g.effect)}</p>
  ${g.down && (!en() || g.down_en) ? `<p class="chips">${esc(t("ข้อเสีย: ", "Downside: "))}${esc(t(g.down, g.down_en))}</p>` : ""}</div></article>`);
    },
    runes(q) {
      return L.runes.filter((r) => has(q, r.th, r.en, r.effect, r.effect_en, r.group, r.group_en))
        .map((r) => {
          const fx = en() ? r.effect_en : r.effect;
          const vals = Object.entries(r.v).map(([k, v]) => `${k} ${v}`).join(" · ");
          return `<article class="lc row"><div><h3>${esc(t(r.th, r.en))}</h3><p class="chips">${esc(t(r.group, r.group_en) || "")} · ${esc(t(r.mode, r.mode_en) || "")}</p>
  ${fx ? `<p>${esc(fx)}</p>` : ""}<p class="chips">{v}: ${esc(vals)}${r.cap && (!en() || r.cap_en) ? " · " + esc(t(r.cap, r.cap_en)) : ""}</p></div></article>`;
        });
    },
    status(q) {
      return L.status.filter((s) => has(q, s.th, s.en, s.do, s.do_en))
        .map((s) => `<article class="lc row"><span class="emo">${esc(s.ic)}</span><div><h3>${esc(t(s.th, s.en))}</h3><p>${esc(t(s.do, s.do_en))}</p></div></article>`);
    },
  };

  function render() {
    fillFilters();
    document.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === tab ? "true" : "false"));
    const q = $("#q").value.trim().toLowerCase();
    const f = { tribe: $("#f-tribe").value, el: $("#f-el").value, kind: $("#f-kind").value, slot: $("#f-slot").value, tier: $("#f-tier").value };
    let rows = VIEW[tab](q, f);
    $("#count").textContent = t(`พบ ${rows.length} รายการ`, `${rows.length} found`);
    $("#list").className = "list " + tab;
    $("#list").innerHTML = rows.join("") || `<p>${esc(t("ไม่พบ ลองคำอื่น", "Nothing found, try another word"))}</p>`;
  }
  function go(tb) { tab = tb; history.replaceState(null, "", "#" + tb); render(); }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => go(b.dataset.tab)));
    ["q", "f-tribe", "f-el", "f-kind", "f-slot", "f-tier"].forEach((id) => $("#" + id).addEventListener("input", render));
    $("#list").addEventListener("click", (ev) => {     // "in N cards" on a DNA kind: show those cards
      const a = ev.target.closest("[data-dna]");
      if (!a) return;
      ev.preventDefault();
      const o = ORG[a.dataset.dna];
      $("#q").value = t(o.th, o.en);
      go("cards");
    });
    window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h in TABS && h !== tab) go(h); });
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    render();
  });
})();
