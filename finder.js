/* AI Tools Hub · finder.js — task search + AI Tool Finder (pure functions, no DOM)
   One deterministic, explainable matcher shared by the hero search, the ⌘K palette, the directory and the Tool Finder.

   How a tool is scored (all weights below, nothing random):
     - the query is lower-cased, split into words, stop-words dropped, and lightly stemmed ("captions" -> "caption")
     - each word is expanded with a hand-written synonym map (e.g. "instagram" -> social, reels, caption, hashtag)
       original words weigh 1, synonyms 0.55
     - a word scores where it is found: name 12, category 7, highlights 4, description 3, website 2
       (prefix matches on the name count while typing, so "chatg" finds ChatGPT)
     - task phrases map to categories (e.g. "invoice" -> Business, Data & Sheets) for +5
     - coverage = share of the user's own words that matched; the score is multiplied by (0.4 + coverage)
     - Finder preferences add transparent boosts/filters: pricing model, budget (mapped to pricing models only,
       because the directory has no INR prices), required features, Verified for India facts
   Every point of score is recorded as a human-readable reason, which the UI shows as "Why it matches".

   Future LLM integration: call AITHFinder.setEngine(async function (query, prefs, tools) { ... return [{ tool, score, reasons }] })
   and use AITHFinder.recommendAsync(). With no engine set, recommendAsync() falls back to this deterministic recommend(). */
(function (root) {
  "use strict";

  var STOP = toSet("a an and are as at be best by can do for from get good help i in into is it its me my need of on or our some that the this to tool tools ai use using want what which with without you your under below less than upto up budget rs inr rupees month monthly per app apps software platform please find like make makes making".split(" "));

  // task word -> related words (all stemmed at load). Keep entries short and literal.
  var SYN = {
    instagram: "social reel caption hashtag post influencer creator story",
    insta: "instagram social reel caption hashtag",
    reel: "video short instagram social tiktok youtube",
    short: "video reel clip youtube",
    youtube: "video thumbnail script short creator",
    tiktok: "video short reel social",
    social: "instagram post schedule caption hashtag linkedin facebook",
    linkedin: "social post professional resume",
    facebook: "social ads meta",
    caption: "subtitle social instagram",
    subtitle: "caption transcription translation",
    hashtag: "social instagram",
    whatsapp: "chat message broadcast chatbot",
    chatbot: "chat assistant support bot",
    bot: "chatbot assistant support",
    support: "customer helpdesk chatbot ticket",
    customer: "support crm helpdesk",
    marketing: "ads campaign seo social email",
    ads: "ad advertising creative campaign marketing",
    ad: "ads advertising creative",
    seo: "keyword blog rank search marketing",
    blog: "writing article seo content",
    email: "mail newsletter inbox outreach",
    newsletter: "email",
    copy: "writing copywriting ads",
    copywriting: "writing copy ads",
    content: "writing blog social post",
    write: "writing writer",
    writing: "write writer grammar blog copy",
    essay: "writing study",
    grammar: "writing proofread",
    gst: "invoice tax accounting billing",
    invoice: "billing accounting gst",
    invoicing: "invoice billing accounting gst",
    billing: "invoice accounting",
    accounting: "bookkeeping invoice tax finance",
    tax: "gst accounting",
    excel: "spreadsheet sheet formula data",
    spreadsheet: "excel sheet formula data",
    sheet: "spreadsheet excel",
    data: "analysis dashboard spreadsheet chart",
    dashboard: "data chart analytics",
    photo: "image picture edit background product",
    picture: "image photo",
    product: "ecommerce catalog photo listing",
    background: "remove photo edit",
    logo: "design brand",
    design: "graphic logo poster banner",
    poster: "design banner flyer",
    banner: "design poster ads",
    thumbnail: "youtube image design",
    image: "picture photo art generate",
    art: "image illustration",
    video: "edit clip reel film",
    edit: "editing editor",
    editing: "edit editor",
    voice: "audio speech voiceover tts",
    voiceover: "voice audio tts",
    tts: "voice speech audio",
    speech: "voice audio transcription",
    podcast: "audio transcription",
    music: "song audio jingle",
    song: "music",
    jingle: "music audio",
    meeting: "notes transcription call summary",
    notes: "note summary meeting",
    summary: "summarize notes",
    summarize: "summary",
    transcribe: "transcription speech caption",
    transcription: "transcribe caption meeting",
    translate: "translation language",
    translation: "translate language",
    hindi: "indian language translation",
    telugu: "indian language translation",
    tamil: "indian language translation",
    indian: "india language",
    language: "translation multilingual",
    resume: "cv job interview",
    cv: "resume",
    job: "resume interview career",
    interview: "job resume",
    presentation: "slides deck ppt",
    ppt: "presentation slides deck",
    slides: "presentation deck ppt",
    deck: "presentation slides pitch",
    code: "coding programming developer",
    coding: "code programming developer",
    website: "web site builder landing",
    app: "build no-code",
    automation: "automate workflow integration",
    automate: "automation workflow",
    workflow: "automation",
    research: "paper study source",
    study: "learn exam homework student",
    student: "study learn exam",
    homework: "study student",
    exam: "study student",
    learn: "course study tutorial",
    shop: "store ecommerce retail",
    store: "shop ecommerce",
    ecommerce: "store shop product d2c",
    d2c: "ecommerce shopify brand",
    shopify: "ecommerce store",
    amazon: "ecommerce listing seller",
    listing: "product ecommerce",
    cod: "rto checkout ecommerce shipping",
    rto: "cod shipping",
    shipping: "logistics delivery",
    restaurant: "food menu",
    sales: "crm lead outreach",
    crm: "sales customer",
    lead: "sales outreach",
    avatar: "talking head presenter video",
    "3d": "model game",
    game: "gaming 3d",
    health: "fitness diet",
    fitness: "health workout",
    travel: "trip itinerary",
    prompt: "prompting chatgpt",
    browser: "extension search",
    search: "browser answer"
  };

  // task word -> categories it signals
  var CAT_HINT = {
    instagram: ["Marketing", "Video", "Design"], social: ["Marketing"], reel: ["Video"], youtube: ["Video"], marketing: ["Marketing"], ads: ["Marketing", "Design"],
    seo: ["Marketing", "Writing"], blog: ["Writing"], email: ["Productivity", "Marketing"], writing: ["Writing"], write: ["Writing"], copy: ["Writing"],
    gst: ["Business"], invoice: ["Business"], accounting: ["Business", "Data & Sheets"], excel: ["Data & Sheets"], spreadsheet: ["Data & Sheets"], data: ["Data & Sheets"],
    photo: ["Photo Edit", "Image"], background: ["Photo Edit"], product: ["Photo Edit"], image: ["Image"], logo: ["Design"], design: ["Design"], poster: ["Design"],
    video: ["Video"], voice: ["Audio"], music: ["Music"], podcast: ["Audio", "Transcription"], meeting: ["Transcription", "Productivity"], transcribe: ["Transcription"],
    translate: ["Translation"], translation: ["Translation"], hindi: ["Translation"], resume: ["Resume & Jobs"], job: ["Resume & Jobs"], interview: ["Resume & Jobs"],
    presentation: ["PPT"], ppt: ["PPT"], slides: ["PPT"], code: ["Coding"], coding: ["Coding"], website: ["No-Code"], automation: ["Automation"], workflow: ["Automation"],
    research: ["Research"], study: ["Study"], student: ["Study"], chatbot: ["Chatbots", "Business"], support: ["Business"], whatsapp: ["Business", "Marketing"],
    sales: ["Business"], avatar: ["Avatar"], "3d": ["3D & Gaming"], game: ["3D & Gaming"], health: ["Health & Life"], fitness: ["Health & Life"], travel: ["Health & Life"],
    prompt: ["Prompts & Learning AI"], learn: ["Prompts & Learning AI", "Study"], browser: ["Browser & Search"], search: ["Browser & Search"]
  };

  // Finder "required features": each is checked only against data we actually hold.
  var FEATURES = {
    free_plan: { label: "Free plan", test: function (t) { return t.p === "Free" || t.p === "Freemium"; }, why: function (t) { return t.p === "Free" ? "Free to use (listed as Free)" : "Has a free plan (listed as Freemium)"; } },
    india_verified: { label: "Verified for India (INR, UPI, GST or language)", test: function (t, x) { return !!(x.india && x.india.labels.length); }, why: function (t, x) { return "Verified: " + x.india.labels.join(", "); } },
    indian_languages: { label: "Indian languages", test: function (t, x) { return !!(x.india && x.india.lang) || /\b(hindi|indian languages?|indic|tamil|telugu|bengali|marathi|kannada|malayalam)\b/i.test(x.text); }, why: function (t, x) { return x.india && x.india.lang ? "Indian-language support verified on official page" : "Description mentions Indian languages (not verified)"; } },
    whatsapp: { label: "WhatsApp", test: function (t, x) { return /whatsapp/i.test(x.text); }, why: function () { return "Description mentions WhatsApp"; } },
    team: { label: "Team collaboration", test: function (t, x) { return /\b(team|teams|collaborat\w*|shared workspace|multiplayer)\b/i.test(x.text); }, why: function () { return "Description mentions team or collaboration"; } },
    integrations: { label: "API or integrations", test: function (t, x) { return /\b(api|integrat\w*|zapier|connects?|plugins?|extensions?)\b/i.test(x.text); }, why: function () { return "Description mentions an API, integrations or extensions"; } }
  };

  // Budget is mapped to pricing models only: data.js has no INR prices.
  var BUDGETS = {
    "": { label: "Any budget", allow: { Free: 1, Freemium: 1, Paid: 1 }, boost: {} },
    "0": { label: "₹0 — free only", allow: { Free: 1, Freemium: 1 }, boost: { Free: 6, Freemium: 3 } },
    "1000": { label: "Up to ₹1,000 / month", allow: { Free: 1, Freemium: 1, Paid: 1 }, boost: { Free: 4, Freemium: 4, Paid: -4 } },
    "5000": { label: "Up to ₹5,000 / month", allow: { Free: 1, Freemium: 1, Paid: 1 }, boost: { Freemium: 2 } },
    "any": { label: "No fixed limit", allow: { Free: 1, Freemium: 1, Paid: 1 }, boost: {} }
  };

  function toSet(a) { var o = {}; for (var i = 0; i < a.length; i++) o[a[i]] = 1; return o; }
  function stem(w) {
    if (w.length > 5 && /ies$/.test(w)) return w.slice(0, -3) + "y";
    if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 4 && /(ches|shes|xes|sses)$/.test(w)) return w.slice(0, -2);
    if (w.length > 4 && /ed$/.test(w) && !/eed$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
    return w;
  }
  function words(s) {
    return String(s || "").toLowerCase().replace(/[’']/g, "").replace(/&/g, " and ").split(/[^a-z0-9₹]+/).filter(Boolean);
  }
  function terms(s) { return words(s).map(stem); }
  function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }

  var SYN_S = {}, HINT_S = {};
  Object.keys(SYN).forEach(function (k) { SYN_S[stem(k)] = terms(SYN[k]); });
  Object.keys(CAT_HINT).forEach(function (k) { HINT_S[stem(k)] = CAT_HINT[k]; });

  /** Build a search index. tools: [{n,u,c,p,d?,b?}] (+ any extra fields). india: { name: {l:{inr,upi,gst,lang}, m:1} } */
  function createIndex(tools, india) {
    india = india || {};
    var LBL = { inr: "INR pricing", upi: "UPI payments", gst: "GST invoices", lang: "Indian-language support" };
    var items = tools.map(function (t, i) {
      var host = "";
      try { host = new URL(t.u).hostname.replace(/^www\./, ""); } catch (e) { host = ""; }
      var b = t.b || [], d = t.d || "";
      var ind = india[t.n], labels = [];
      if (ind && ind.l) Object.keys(ind.l).forEach(function (k) { if (LBL[k]) labels.push(LBL[k]); });
      return {
        t: t, i: i, n: norm(t.n),
        name: toSet(terms(t.n)), nameList: terms(t.n), cat: toSet(terms(t.c)), bul: toSet(terms(b.join(" "))), desc: toSet(terms(d)), host: toSet(terms(host.replace(/\.[a-z]+$/, ""))),
        text: (t.n + " " + d + " " + b.join(" ")).toLowerCase(),
        india: ind ? { labels: labels, lang: !!(ind.l && ind.l.lang), made: !!ind.m, verified: labels.length > 0 || !!ind.m } : null
      };
    });
    return { items: items, byName: items.reduce(function (o, x) { o[x.t.n] = x; return o; }, {}) };
  }

  /** Parse free text: pull out a budget ("under ₹1,000", "free") so the Finder can use it. Pure. */
  function parseQuery(q) {
    var s = String(q || "").toLowerCase(), budget = null;
    var m = s.match(/(?:under|below|less than|upto|up to|within|max|<)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(k)?/) || s.match(/(?:₹|rs\.?|inr)\s*([\d,]+)\s*(k)?/);
    if (m) { var v = parseInt(m[1].replace(/,/g, ""), 10) * (m[2] ? 1000 : 1); budget = v <= 0 ? "0" : v <= 1000 ? "1000" : v <= 5000 ? "5000" : "any"; }
    if (/\bfree( only)?\b|\bno budget\b|\bzero budget\b|₹ ?0\b/.test(s) && !m) budget = "0";
    return { text: s.replace(/(?:under|below|less than|upto|up to|within|max)\s*(?:₹|rs\.?|inr)?\s*[\d,]+\s*k?/g, " ").replace(/(?:₹|rs\.?|inr)\s*[\d,]+\s*k?/g, " "), budget: budget };
  }

  function expand(q) {
    var own = [], seen = {}, shown = {};
    words(q).forEach(function (raw) { var w = stem(raw); if (!STOP[w] && !STOP[raw] && w.length > 1 && !seen[w]) { seen[w] = 1; own.push(w); shown[w] = raw; } });
    var all = own.map(function (w) { return { w: w, k: 1, from: w, show: shown[w] }; });
    var ownSet = toSet(own);
    own.forEach(function (w) { (SYN_S[w] || []).forEach(function (s) {
      if (ownSet[s]) all.push({ w: s, k: 0, from: w, show: shown[w] }); /* already a typed word: counts for coverage only */
      else if (!seen[s]) { seen[s] = 1; all.push({ w: s, k: 0.55, from: w, show: shown[w] }); }
    }); });
    return { own: own, all: all, shown: shown };
  }

  function prefixHit(list, w) { for (var i = 0; i < list.length; i++) if (list[i].length > w.length && list[i].indexOf(w) === 0) return true; return false; }
  function quoteWord(w) { return "\u201c" + w + "\u201d"; }

  /** Score one indexed item against an expanded query. Returns { score, coverage, reasons[] }. */
  function scoreItem(x, ex, rawNorm) {
    var score = 0, list = [], hitOwn = {}, R = {};
    function add(key, pts, text) { score += pts; if (!R[key]) { R[key] = 1; list.push([pts, list.length, text]); } }
    if (rawNorm && rawNorm.length > 1) {
      if (x.n === rawNorm) add("exact", 100, "Name matches your search");
      else if (x.n.indexOf(rawNorm) === 0) add("starts", 40, "Name starts with your search");
    }
    ex.all.forEach(function (q) {
      var w = q.w, k = q.k, hit = false, syn = k < 1;
      if (k === 0) { if (x.name[w] || x.cat[w] || x.bul[w] || x.desc[w]) hitOwn[q.from] = 1; return; }
      var label = syn ? quoteWord(q.show) + " (related: " + w + ")" : quoteWord(q.show);
      if (x.name[w]) { add("n:" + w, 12 * k, "Name matches " + label); hit = true; }
      else if (!syn && w.length >= 2 && prefixHit(x.nameList, w)) { add("np:" + w, 8, "Name starts with " + quoteWord(q.show)); hit = true; }
      if (x.cat[w]) { add("c:" + q.from, 7 * k, "In " + x.t.c + ", matches " + label); hit = true; }
      if (x.bul[w]) { add("b:" + q.from, 4 * k, "Highlights mention " + label); hit = true; }
      if (x.desc[w]) { add("d:" + q.from, 3 * k, "Description mentions " + label); hit = true; }
      if (x.host[w]) { add("h:" + w, 2 * k, "Website matches " + quoteWord(w)); hit = true; }
      var hint = HINT_S[w];
      if (hint && hint.indexOf(x.t.c) > -1 && !x.cat[w]) add("ch:" + x.t.c, 5 * k, x.t.c + " is a fit for " + quoteWord(q.show));
      if (hit) hitOwn[q.from] = 1;
    });
    var cov = ex.own.length ? Object.keys(hitOwn).length / ex.own.length : 0;
    if (score > 0) score = score * (0.4 + cov);
    list.sort(function (a, b) { return b[0] - a[0] || a[1] - b[1]; });
    return { score: Math.round(score * 10) / 10, coverage: cov, reasons: list.map(function (r) { return r[2]; }) };
  }

  /** Real-time search. Returns [{ tool, score, reasons, i }] sorted by score, ties in curated (data.js) order. */
  function search(index, query, opts) {
    opts = opts || {};
    var ex = expand(query), rawNorm = norm(query);
    if (!ex.own.length && !rawNorm) return index.items.map(function (x) { return { tool: x.t, score: 0, reasons: [], i: x.i }; });
    var need = ex.own.length <= 2 ? 1 : 0.6, out = [];
    index.items.forEach(function (x) {
      var r = scoreItem(x, ex, rawNorm);
      if (r.score <= 0) return;
      if (r.coverage < need && r.score < 40) return;
      out.push({ tool: x.t, score: r.score, reasons: r.reasons, i: x.i });
    });
    out.sort(function (a, b) { return b.score - a.score || a.i - b.i; });
    return opts.limit ? out.slice(0, opts.limit) : out;
  }

  /** Tool Finder. prefs: { task, budget: ""|"0"|"1000"|"5000"|"any", pricing: ""|"Free"|"Freemium"|"Paid", features: [keys of FEATURES], category, limit }
      Returns { results: [{ tool, score, reasons, i }], budget, notes[] }. Deterministic: same input, same output. */
  function recommend(index, prefs) {
    prefs = prefs || {};
    var parsed = parseQuery(prefs.task || ""), budgetKey = prefs.budget || parsed.budget || "", B = BUDGETS[budgetKey] || BUDGETS[""];
    var feats = (prefs.features || []).filter(function (f) { return FEATURES[f]; });
    var ex = expand(parsed.text), notes = [];
    if (budgetKey && budgetKey !== "any") notes.push("Budget is matched to pricing models only (" + B.label + "). The directory does not hold INR prices, so check each official site for current plans.");
    var out = [];
    index.items.forEach(function (x) {
      var t = x.t, reasons = [], score = 0;
      if (!B.allow[t.p]) return;
      if (prefs.pricing && t.p !== prefs.pricing) return;
      if (prefs.category && t.c !== prefs.category) return;
      for (var i = 0; i < feats.length; i++) if (!FEATURES[feats[i]].test(t, x)) return;
      if (ex.own.length) {
        var r = scoreItem(x, ex, "");
        if (r.score <= 0 || r.coverage < (ex.own.length > 2 ? 0.34 : 0.5)) return;
        score += r.score; reasons = reasons.concat(r.reasons);
      }
      feats.forEach(function (f) { score += 6; reasons.push(FEATURES[f].why(t, x)); });
      if (B.boost[t.p]) { score += B.boost[t.p]; if (B.boost[t.p] > 0) reasons.push(t.p === "Paid" ? "Paid plan" : (t.p === "Free" ? "Free to use" : "Has a free plan") + " — fits " + B.label); }
      if (budgetKey && budgetKey !== "any" && t.p === "Paid") reasons.push("Paid: no INR price in our data, check the official site");
      if (prefs.pricing) reasons.push("Pricing model: " + t.p);
      if (x.india && x.india.verified) { score += 2; if (feats.indexOf("india_verified") < 0) reasons.push(x.india.labels.length ? "India facts verified: " + x.india.labels.join(", ") : "Made in India (verified)"); }
      if (!ex.own.length && !feats.length && !prefs.pricing && !prefs.category && !budgetKey) return;
      out.push({ tool: t, score: Math.round(score * 10) / 10, reasons: dedupe(reasons), i: x.i });
    });
    out.sort(function (a, b) { return b.score - a.score || a.i - b.i; });
    return { results: out.slice(0, prefs.limit || 6), total: out.length, budget: budgetKey, notes: notes };
  }

  /** Similar tools across categories: shared highlight/description words, same category counts more. */
  function similar(index, name, limit) {
    var x = index.byName[name]; if (!x) return [];
    var base = Object.keys(x.bul).concat(Object.keys(x.desc)).filter(function (w) { return !STOP[w] && w.length > 3; });
    var out = [];
    index.items.forEach(function (y) {
      if (y === x) return;
      var s = 0;
      base.forEach(function (w) { if (y.bul[w]) s += 2; else if (y.desc[w]) s += 1; });
      if (y.t.c === x.t.c) s += 2;
      if (s > 2) out.push({ tool: y.t, score: s, i: y.i });
    });
    out.sort(function (a, b) { return b.score - a.score || a.i - b.i; });
    return out.slice(0, limit || 4);
  }

  function dedupe(a) { var s = {}, o = []; a.forEach(function (r) { if (!s[r]) { s[r] = 1; o.push(r); } }); return o; }

  var engine = null;
  var api = {
    version: "3.0", FEATURES: FEATURES, BUDGETS: BUDGETS, SYNONYMS: SYN,
    createIndex: createIndex, parseQuery: parseQuery, expand: expand, search: search, recommend: recommend, similar: similar, stem: stem,
    setEngine: function (fn) { engine = typeof fn === "function" ? fn : null; },
    hasEngine: function () { return !!engine; },
    recommendAsync: function (index, prefs) {
      if (!engine) return Promise.resolve(recommend(index, prefs));
      return Promise.resolve(engine(prefs.task || "", prefs, index.items.map(function (x) { return x.t; })))
        .then(function (r) { return { results: r, total: r.length, budget: prefs.budget || "", notes: ["Ranked by external engine"] }; })
        .catch(function () { return recommend(index, prefs); });
    }
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.AITHFinder = api;
})(typeof window !== "undefined" ? window : globalThis);
