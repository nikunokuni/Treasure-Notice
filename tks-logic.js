/* ═══════════════════════════════
   たからさがし — logic  v4
   ═══════════════════════════════ */

// ── 定数 ─────────────────────────────────
const PARENT_OPTS = ['パパ','ママ','ともだち','その他'];

const TYPES = [
  { id:'A', icon:'👀', name:'きづきタイプ',
    desc:'五感や気づきを大切に。「なんか気になった？」' },
  { id:'B', icon:'📚', name:'ちしきタイプ',
    desc:'言葉・知識の面白さを楽しむ。「実はね…」' },
  { id:'C', icon:'🔭', name:'そうぞうタイプ',
    desc:'見えない部分を想像する。「裏側はどうなってる？」' },
];

const ODAI_ALL = [
  {emoji:'☁️',name:'そら・くも',   label:'自然'},
  {emoji:'💧',name:'みず',         label:'自然'},
  {emoji:'🚗',name:'くるま',       label:'のりもの'},
  {emoji:'🌙',name:'よる・つき',   label:'自然'},
  {emoji:'🌳',name:'き',           label:'自然'},
  {emoji:'🔥',name:'ひ',           label:'自然'},
  {emoji:'🚂',name:'でんしゃ',     label:'のりもの'},
  {emoji:'🐝',name:'むし',         label:'いきもの'},
  {emoji:'🌊',name:'うみ',         label:'自然'},
  {emoji:'🌈',name:'にじ',         label:'自然'},
  {emoji:'⏳',name:'でんしゃまち', label:'まちの時間'},
  {emoji:'🚙',name:'じゅうたい',   label:'まちの時間'},
  {emoji:'🌧',name:'あめの日',     label:'お天気'},
  {emoji:'🌸',name:'はな',         label:'自然'},
  {emoji:'🍚',name:'ごはん',       label:'くらし'},
  {emoji:'🌬',name:'かぜ',         label:'自然'},
];

const LENSES = [
  {id:'ことば',   icon:'📖', name:'ことば',   desc:'言葉・表現・言い方',   cls:'lens-ことば'},
  {id:'かず',     icon:'🔢', name:'かず',     desc:'数・形・パターン',     cls:'lens-かず'},
  {id:'かがく',   icon:'🔬', name:'かがく',   desc:'しくみ・なぜ？を探る', cls:'lens-かがく'},
  {id:'しゃかい', icon:'🗺', name:'しゃかい', desc:'人・社会・つながり',   cls:'lens-しゃかい'},
  {id:'えいご',   icon:'🌍', name:'えいご',   desc:'英語で言うと？',       cls:'lens-えいご'},
  {id:'じぶん',   icon:'💛', name:'じぶん',   desc:'今どう感じてる？',     cls:'lens-じぶん'},
];

// ── State ────────────────────────────────
const S = {
  onboarded: false,
  step: 0,
  user: {
    name: '', type: 'A', likes: '',
    strengths: '', parentName: 'ママ',
  },
  tab:  'home',
  flow: 'home',
  odai: null,
  lens: null,
  randOdai: null,
  messages: [],
  speaker: 'child',
  isLoading: false,
  summaryItems: [],
  summaryOpinion: '',
  opinionOpen: false,
  showOpinion: true,
  bookmarked: false,
  calYear:  null,
  calMonth: null,
  dayModal: null,
  records: [],
  streak: 0,
  _lastPlayDate: null,
  _savedThisSession: false,
};

// ── ヘルパー ──────────────────────────────
const $id = id => document.getElementById(id);

function isSmallKid() { return S.user.type === 'A'; }
function opinionMaxChars() {
  return S.user.type==='A' ? 60 : S.user.type==='B' ? 100 : 150;
}

// ── API（Vercel Edge Function経由） ───────
async function callClaude(messages, system) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data.text;
}

async function analyzePhoto(b64, mime) {
  const res = await fetch('/api/photo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ b64, mime }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data; // { name, emoji, label }
}

// ── プロンプト ────────────────────────────
function chatSystem() {
  const u = S.user;

  const base = `あなたは「たからちゃん」です。
子どもが日常で見つけたものについて、一緒に考える案内役です。

【基本ルール】
- 子どもの答えをまず受け止めてから次の問いへ
- 1回の返答は2〜3文以内
- 絵文字を1つだけ使う
- 「なんとなく」も大切に受け取る
- 答えが出なくても「それでいいよ」と安心させる
- ${u.parentName}にも時々「${u.parentName}はどう思う？」と聞く
- 3往復ほどで「そろそろまとめようか」と提案する

【子どもの情報】
- 呼び方: ${u.name || 'お子さん'}
- 好きなもの: ${u.likes || '特になし'}
- 得意なこと: ${u.strengths || '特になし'}

【今回のお題】「${S.odai?.name}」`;

  const lensPrompts = {
    ことば: `【ことばレンズ】
このものを言葉で表現することに注目します。
- 「他の言い方をするとしたら？」と表現を広げる
- オノマトペ（ふわふわ・ざらざら）を使って表現を楽しむ`,

    かず: `【かずレンズ】
数・量・形・比較の視点で見ることに注目します。
- 「いくつある？」「どのくらいの大きさ？」と数量を意識させる
- 「〇〇と比べると？」と比較する視点を引き出す
- 形やパターンの規則性に気づかせる`,

    かがく: `【かがくレンズ】
なぜ？どうして？という仕組みの視点で見ることに注目します。
- 「なんでそうなってると思う？」と原因・理由を引き出す
- 「触ったらどんな感じ？」「濡れたらどうなる？」と変化を想像させる
- 「もし〇〇だったら？」と仮説を立てる楽しさを伝える`,

    しゃかい: `【しゃかいレンズ】
人・社会・つながりの視点で見ることに注目します。
- 「これは誰が作ったんだろう？」と人の役割に気づかせる
- 「どこから来たんだろう？」とものの流れ・背景を想像させる
- 「これがなかったらどうなる？」と社会とのつながりを考えさせる`,

    えいご: `【えいごレンズ】
英語で言うとどうなる？という視点で楽しみます。
- 英語の単語を教えるときはカタカナ読みも添える
- 「英語で言うと〇〇（カタカナ）だよ、言ってみよう！」と発話を促す
- 簡単な英語フレーズを会話に自然に混ぜる`,

    じぶん: `【じぶんレンズ】
自分の気持ち・感覚・経験に注目します。
- 「好き？嫌い？なんで？」と自分の感情を言語化させる
- 「前に似たようなこと経験したことある？」と記憶とつなげる
- 「${u.name||'きみ'}だったらどうする？」と自分ごととして考えさせる
- 色や形などの描写に対して「それを見てどんな気持ち？」と感情を見つめさせる`,
  };

  const typePrompts = {
    A: `【きづきタイプ】
口調：やさしく、ゆっくり。ひらがな多め。短い文。
- 五感をフル活用した問いかけを中心にする
- 「なんか気になった？」「どんな感じがした？」と感覚ベースで進める
- 難しい言葉は使わず、子どもが感じたことをそのまま受け取る`,

    B: `【ちしきタイプ】
口調：少し知的でわくわくする感じ。「実はね」をよく使う。
- 言葉の由来や豆知識を会話に自然に混ぜる
- 「なんでだと思う？」と理由を考えさせてから答えに近づける
- 「実はこれ、〇〇っていう名前らしいよ」など受け入れやすい表現で知識を伝える
- 知的好奇心を刺激する問いかけを意識する`,

    C: `【そうぞうタイプ】
口調：一緒に冒険するような、わくわくした感じ。
- 「裏側はどうなってるんだろう？」と見えない部分を想像させる
- 「もし〇〇だったら？」と仮説・空想を広げる
- 「誰が・どこで・どうやって作ったんだろう？」と背景を想像させる
- 正解がない問いを大切にする`,
  };

  return [base, lensPrompts[S.lens]||'', typePrompts[u.type]||''].join('\n\n');
}

function summarySystem() {
  // 実際の会話内容をもとにまとめを生成
  const conv = S.messages.map(m => {
    const who = m.role==='ai' ? 'たからちゃん' : m.role==='child' ? S.user.name||'子ども' : S.user.parentName;
    return `[${who}] ${m.text}`;
  }).join('\n');
  const max = opinionMaxChars();

  return `あなたは「たからちゃん」です。以下の会話をもとにまとめを作ってください。

お題: ${S.odai?.name}　レンズ: ${S.lens}

【会話記録】
${conv}

【重要】findingsは必ず上記の会話の中で実際に出た言葉・気づき・発見をもとにしてください。会話にない内容を創作しないでください。

【出力形式】JSONのみ（Markdownなし）:
{
  "findings": ["会話に出た発見1（子どもの言葉を活かした短い文）","発見2","発見3"],
  "opinion": "子どもの答えを受け止めてから補足する意見。${max}文字以内。2〜3段落に分け\\nで改行。押しつけがましくない。${isSmallKid()?'ひらがな多め。':''}"
}`;
}

// ── Render ────────────────────────────────
function render() {
  const root = $id('screen-root');
  const tw   = $id('tabs-wrap');

  if (!S.onboarded) {
    tw.style.display  = 'none';
    root.innerHTML    = renderOnboard();
    bindEvents();
    return;
  }

  const inFlow = ['lens','chat','summary'].includes(S.flow);
  if (inFlow) {
    tw.style.display = 'none';
    let content = '';
    if (S.flow==='lens')    content = renderLens();
    if (S.flow==='chat')    content = renderChat();
    if (S.flow==='summary') content = renderSummary();
    root.innerHTML = renderChatHeader() + content;
  } else {
    tw.style.display = 'block';
    tw.innerHTML     = renderTabs();
    const map = {
      home: renderHome,
      cal:  renderCal,
      box:  renderBox,
      fav:  renderFav,
      set:  renderSettings,
    };
    root.innerHTML = (map[S.tab]||renderHome)();
  }
  bindEvents();
}

// ── イベントバインド ──────────────────────
function bindEvents() {
  const ci = $id('chat-in');
  if (ci) ci.addEventListener('keydown', e => { if(e.key==='Enter') App.sendChat(); });

  const fi = $id('free-in');
  if (fi) fi.addEventListener('keydown', e => { if(e.key==='Enter') App.submitFree(); });

  const fg = $id('free-go-btn');
  if (fg) fg.addEventListener('click', () => App.submitFree());

  const rr = $id('reroll-btn');
  if (rr) rr.addEventListener('click', e => {
    e.stopPropagation();
    S.randOdai = pickRand();
    render();
  });

  const rc = $id('rand-card');
  if (rc) rc.addEventListener('click', () => App.goToLens(S.randOdai));

  const pi = $id('photo-input');
  if (pi) {
    pi.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async ev => {
        const b64 = ev.target.result.split(',')[1];
        $id('screen-root').innerHTML = `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:32px">
            <img src="data:${file.type};base64,${b64}"
                 style="width:100%;max-height:200px;object-fit:cover;border-radius:16px">
            <div class="spinner"></div>
            <div style="font-size:13px;color:rgba(45,27,0,0.5)">写真をよんでいるよ…</div>
          </div>`;
        try {
          const result = await analyzePhoto(b64, file.type);
          App.goToLens(result);
        } catch(err) {
          console.error('photo error:', err);
          // フォールバックせず、エラーを表示
          $id('screen-root').innerHTML = `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:32px;text-align:center">
              <div style="font-size:36px">📷</div>
              <div style="font-size:13px;color:rgba(45,27,0,0.5)">写真の読み取りに失敗したよ<br>もう一度試してみてね</div>
              <button class="btn-secondary" onclick="App.closeChatFlow()" style="width:auto;padding:8px 20px">もどる</button>
            </div>`;
        }
      };
      reader.readAsDataURL(file);
    });
  }
}

function scrollChat() {
  setTimeout(() => {
    const el = $id('chat-area');
    if (el) el.scrollTop = el.scrollHeight;
  }, 80);
}

// ── カレンダー演出 ────────────────────────
function burstCalAnimation() {
  // レンズごとのアイコンを集計
  const lensCount = {};
  S.records.forEach(r => {
    if (r.lens) lensCount[r.lens] = (lensCount[r.lens]||0) + 1;
  });

  const items = [];
  LENSES.forEach(l => {
    const count = lensCount[l.id] || 0;
    for (let i = 0; i < count; i++) items.push(l.icon);
  });

  if (items.length === 0) return;

  const wrap = document.createElement('div');
  wrap.className = 'cal-burst-wrap';
  document.body.appendChild(wrap);

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  items.forEach((icon, i) => {
    const el = document.createElement('div');
    el.className = 'cal-burst-item';
    el.textContent = icon;
    const angle = (i / items.length) * 360;
    const dist  = 80 + Math.random() * 80;
    const rad   = angle * Math.PI / 180;
    const tx    = Math.cos(rad) * dist;
    const ty    = Math.sin(rad) * dist;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');
    el.style.animationDelay = (i * 0.05) + 's';
    wrap.appendChild(el);
  });

  setTimeout(() => wrap.remove(), 2000);
}

// ── App ───────────────────────────────────
const App = {

  switchTab(tab) {
    const prev = S.tab;
    S.tab  = tab;
    S.flow = 'home';
    render();
    // カレンダーを開いた瞬間に演出
    if (tab === 'cal' && prev !== 'cal') {
      setTimeout(burstCalAnimation, 100);
    }
  },

  closeChatFlow() {
    S.flow = 'home';
    S.tab  = 'home';
    render();
  },

  // ── オンボーディング ──
  obNext() {
    if (S.step === 0) {
      const name = $id('ob-name')?.value?.trim();
      if (!name) {
        const err = $id('ob-name-err');
        const inp = $id('ob-name');
        if (err) err.classList.add('show');
        if (inp) inp.classList.add('error');
        return;
      }
      S.user.name = name;
    } else if (S.step === 1) {
      S.user.likes     = $id('ob-likes')?.value?.trim() || '';
      S.user.strengths = $id('ob-str')?.value?.trim()   || '';
    } else {
      S.onboarded = true;
      S.tab  = 'home';
      S.flow = 'home';
      render();
      return;
    }
    S.step++;
    render();
  },

  obBack() { if(S.step>0){ S.step--; render(); } },
  setType(t)   { S.user.type       = t; render(); },
  setParent(p) { S.user.parentName = p; render(); },

  // ── お題→レンズへ ──
  goToLens(o) {
    S.odai = o;
    S.lens = null;
    S.flow = 'lens';
    S._savedThisSession = false;
    render();
  },
  replayOdai(o) { App.goToLens(o); },

  async submitFree() {
    const txt = $id('free-in')?.value?.trim();
    if (!txt) return;
    try {
      const res = await callClaude(
        [{ role:'user', content:`子どもが「${txt}」と言いました。JSONのみ: {"name":"ひらがな短い単語","emoji":"絵文字","label":"カテゴリ"}` }],
        'JSONのみ返してください（Markdownなし）。'
      );
      App.goToLens(JSON.parse(res.replace(/```json|```/g,'').trim()));
    } catch {
      App.goToLens({ emoji:'✨', name:txt.slice(0,10), label:'きになること' });
    }
  },

  selectLens(id) {
    S.lens = S.lens===id ? null : id;
    render();
  },

  // ── チャット開始 ──
  async startChat() {
    if (!S.lens) return;
    S.messages  = [];
    S.flow      = 'chat';
    S.isLoading = true;
    render();
    try {
      const text = await callClaude(
        [{ role:'user', content:'最初の問いかけを1つだけ。' }],
        chatSystem()
      );
      S.messages.push({ role:'ai', text });
    } catch(err) {
      console.error('chat error:', err);
      S.messages.push({ role:'ai', text:`${S.odai?.name}について、どんなことを知ってる？🔍` });
    }
    S.isLoading = false;
    render();
    scrollChat();
  },

  setSpeaker(sp) { S.speaker = sp; render(); },

  // ── メッセージ送信 ──
  async sendChat() {
    const inp = $id('chat-in');
    const txt = inp?.value?.trim();
    if (!txt || S.isLoading) return;

    S.messages.push({ role:S.speaker, text:txt });
    S.isLoading = true;
    render();
    scrollChat();

    // API用メッセージ配列
    const apiMsgs = [];
    for (const m of S.messages) {
      if (m.role==='ai') {
        apiMsgs.push({ role:'assistant', content:m.text });
      } else {
        const label = m.role==='child' ? S.user.name||'こども' : S.user.parentName;
        apiMsgs.push({ role:'user', content:`[${label}] ${m.text}` });
      }
    }
    if (apiMsgs[0]?.role==='assistant') {
      apiMsgs.unshift({ role:'user', content:'はじめてください' });
    }

    try {
      const text = await callClaude(apiMsgs, chatSystem());
      S.messages.push({ role:'ai', text });
    } catch(err) {
      console.error('chat error:', err);
      S.messages.push({ role:'ai', text:'うーん、もう少し教えてくれる？🌟' });
    }
    S.isLoading = false;
    render();
    scrollChat();
  },

  // ── サマリー生成（＝ここで自動保存） ──
  async goSummary() {
    S.flow           = 'summary';
    S.summaryItems   = [];
    S.summaryOpinion = '';
    S.opinionOpen    = false;
    S.bookmarked     = false;
    render();

    try {
      const res  = await callClaude(
        [{ role:'user', content:'まとめてください。' }],
        summarySystem()
      );
      const data = JSON.parse(res.replace(/```json|```/g,'').trim());
      S.summaryItems   = data.findings || [];
      S.summaryOpinion = data.opinion  || '';
    } catch(err) {
      console.error('summary error:', err);
      S.summaryItems   = ['いっぱい考えた！','気になることが見つかった'];
      S.summaryOpinion = 'ふたりとも、すごい発見だったね！';
    }

    // ── 自動保存（まとめ表示時に1回だけ） ──
    App._saveRecord();
    render();
  },

  // きろくに保存（重複防止）
  _saveRecord() {
    if (S._savedThisSession) return;
    S._savedThisSession = true;

    const entry = {
      odai:       { ...S.odai },
      lens:       S.lens,
      date:       new Date().toISOString(),
      findings:   [...S.summaryItems],
      bookmarked: false,
    };
    S.records.push(entry);

    // 連続日数を更新
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now()-86400000).toDateString();
    if (S._lastPlayDate !== today) {
      S.streak       = S._lastPlayDate===yesterday ? S.streak+1 : 1;
      S._lastPlayDate = today;
    }
  },

  // 「別のレンズで」→保存済みのままレンズ選択へ
  doAgain() {
    S.lens = null;
    S.flow = 'lens';
    S._savedThisSession = false; // 別レンズの新しいセッションは再保存可
    render();
  },

  // 「つぎのお題」→ホームへ
  nextOdai() {
    S.flow     = 'home';
    S.tab      = 'home';
    S.randOdai = null;
    render();
  },

  // サマリーのブックマーク
  toggleBookmark() {
    S.bookmarked = !S.bookmarked;
    // 最後に追加されたきろくに反映
    const last = S.records[S.records.length-1];
    if (last) last.bookmarked = S.bookmarked;
    render();
  },

  // たからばこ内の🔖トグル
  toggleRecordFav(idx) {
    if (S.records[idx]) {
      S.records[idx].bookmarked = !S.records[idx].bookmarked;
      render();
    }
  },

  // カレンダー日付クリック
  showDayTakara(year, month, day) {
    S.dayModal = { year, month, day };
    render();
  },
  closeDayModal() {
    S.dayModal = null;
    render();
  },

  calPrev() {
    const now = new Date();
    let y = S.calYear  ?? now.getFullYear();
    let m = S.calMonth ?? now.getMonth();
    if (--m < 0) { m=11; y--; }
    S.calYear=y; S.calMonth=m; render();
  },
  calNext() {
    const now = new Date();
    let y = S.calYear  ?? now.getFullYear();
    let m = S.calMonth ?? now.getMonth();
    if (++m > 11) { m=0; y++; }
    S.calYear=y; S.calMonth=m; render();
  },

  toggleOpinion()     { S.opinionOpen  = !S.opinionOpen;  render(); },
  toggleShowOpinion() { S.showOpinion  = !S.showOpinion;  render(); },

  saveSettings() {
    const name = $id('s-name')?.value?.trim();
    if (!name) {
      const err = $id('s-name-err');
      const inp = $id('s-name');
      if (err) err.classList.add('show');
      if (inp) inp.classList.add('error');
      return;
    }
    S.user.name      = name;
    S.user.likes     = $id('s-likes')?.value?.trim() || '';
    S.user.strengths = $id('s-str')?.value?.trim()   || '';
    App.switchTab('home');
  },
};

// ── 時計 ─────────────────────────────────
function tick() {
  const el = $id('clock');
  if (!el) return;
  const n = new Date();
  el.textContent = `${n.getHours()}:${String(n.getMinutes()).padStart(2,'0')}`;
}
setInterval(tick, 10000);
tick();

// ── 起動 ─────────────────────────────────
render();
