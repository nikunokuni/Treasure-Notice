/* ═══════════════════════════════
   たからさがし — logic  v5
   ═══════════════════════════════ */

// ── 定数 ──
const PARENT_OPTS = ['パパ','ママ','ともだち','その他'];

const TYPES = [
  { id:'A', icon:'👀', name:'はっけん',
    desc:'じっくり観察する。「あ、これ見て！」' },
  { id:'B', icon:'📚', name:'しらべる',
    desc:'正しい知識が好き。「ほんとうは何？」' },
  { id:'C', icon:'🔭', name:'そうぞう',
    desc:'見えない部分を推理する。「もしかして〜かな？」' },
];

const agePrompts = [
  { id:'young',  label:'3〜5さい',  icon:'🐣', desc:'ひらがなメイン・短い文・五感中心' },
  { id:'middle', label:'6〜8さい',  icon:'🌱', desc:'すこし複雑な問いかけも楽しめる' },
  { id:'older',  label:'9〜12さい', icon:'🌳', desc:'論理的な思考・深い考察も可能' },
];

// 日常的に触れそうなお題（大幅拡張）
const ODAI_ALL = [
  // 空・気象
  {emoji:'☁️',name:'くも',         label:'そら'},
  {emoji:'💧',name:'みず',         label:'自然'},
  {emoji:'🌙',name:'つき',         label:'そら'},
  {emoji:'🌈',name:'にじ',         label:'そら'},
  {emoji:'🌧',name:'あめ',         label:'お天気'},
  {emoji:'🌬',name:'かぜ',         label:'自然'},
  {emoji:'☀️',name:'たいよう',     label:'そら'},
  {emoji:'⛅',name:'くもりそら',   label:'そら'},
  {emoji:'❄️',name:'ゆき',         label:'お天気'},
  {emoji:'🌫',name:'きり',         label:'お天気'},
  // 乗り物・まち
  {emoji:'🚗',name:'くるま',       label:'のりもの'},
  {emoji:'🚂',name:'でんしゃ',     label:'のりもの'},
  {emoji:'🚌',name:'バス',         label:'のりもの'},
  {emoji:'🚲',name:'じてんしゃ',   label:'のりもの'},
  {emoji:'✈️',name:'ひこうき',     label:'のりもの'},
  {emoji:'🚑',name:'きゅうきゅうしゃ',label:'のりもの'},
  {emoji:'🚒',name:'しょうぼうしゃ',label:'のりもの'},
  {emoji:'🏗',name:'クレーン',     label:'まち'},
  {emoji:'🚦',name:'しんごう',     label:'まち'},
  {emoji:'🏪',name:'コンビニ',     label:'まち'},
  {emoji:'📮',name:'ポスト',       label:'まち'},
  {emoji:'🕳',name:'マンホール',   label:'まち'},
  // 自然・いきもの
  {emoji:'🌳',name:'き',           label:'自然'},
  {emoji:'🌸',name:'さくら',       label:'自然'},
  {emoji:'🍂',name:'おちば',       label:'自然'},
  {emoji:'🌿',name:'くさ',         label:'自然'},
  {emoji:'🐝',name:'みつばち',     label:'いきもの'},
  {emoji:'🐛',name:'いもむし',     label:'いきもの'},
  {emoji:'🐜',name:'あり',         label:'いきもの'},
  {emoji:'🐦',name:'とり',         label:'いきもの'},
  {emoji:'🐟',name:'さかな',       label:'いきもの'},
  {emoji:'🦋',name:'ちょうちょ',   label:'いきもの'},
  {emoji:'🐌',name:'かたつむり',   label:'いきもの'},
  {emoji:'🌻',name:'ひまわり',     label:'自然'},
  {emoji:'🍄',name:'きのこ',       label:'自然'},
  // 食べもの・くらし
  {emoji:'🍚',name:'ごはん',       label:'たべもの'},
  {emoji:'🍞',name:'パン',         label:'たべもの'},
  {emoji:'🥚',name:'たまご',       label:'たべもの'},
  {emoji:'🥛',name:'ぎゅうにゅう', label:'たべもの'},
  {emoji:'🧅',name:'たまねぎ',     label:'たべもの'},
  {emoji:'🍎',name:'りんご',       label:'たべもの'},
  {emoji:'🥦',name:'ブロッコリー', label:'たべもの'},
  {emoji:'🥕',name:'にんじん',     label:'たべもの'},
  // 家のなか
  {emoji:'🪞',name:'かがみ',       label:'いえのなか'},
  {emoji:'💡',name:'でんきゅう',   label:'いえのなか'},
  {emoji:'🚿',name:'シャワー',     label:'いえのなか'},
  {emoji:'🪥',name:'はぶらし',     label:'いえのなか'},
  {emoji:'📺',name:'テレビ',       label:'いえのなか'},
  {emoji:'🧲',name:'じしゃく',     label:'いえのなか'},
  {emoji:'🔦',name:'かいちゅうでんとう',label:'いえのなか'},
  // 体・感覚
  {emoji:'🤲',name:'て',           label:'からだ'},
  {emoji:'👣',name:'あしあと',     label:'からだ'},
  {emoji:'💨',name:'いき',         label:'からだ'},
  {emoji:'❤️',name:'しんぞう',     label:'からだ'},
  // 学校・公園
  {emoji:'📏',name:'ものさし',     label:'がっこう'},
  {emoji:'✏️',name:'えんぴつ',     label:'がっこう'},
  {emoji:'📚',name:'ほん',         label:'がっこう'},
  {emoji:'🎒',name:'ランドセル',   label:'がっこう'},
  {emoji:'🛝',name:'すべりだい',   label:'こうえん'},
  {emoji:'🌰',name:'どんぐり',     label:'こうえん'},
  {emoji:'🪨',name:'いし',         label:'こうえん'},
];

const LENSES = [
  {id:'ことば',   icon:'📖', name:'ことば',
   desc:'言葉・表現・言い方',
   kidDesc:'どんなことばでいえるかな？ ことばあそびもしよう！',
   cls:'lens-ことば'},
  {id:'かず',     icon:'🔢', name:'かず',
   desc:'数・形・パターン',
   kidDesc:'かずや かたち・おおきさを くらべてみよう！',
   cls:'lens-かず'},
  {id:'かがく',   icon:'🔬', name:'かがく',
   desc:'しくみ・なぜ？を探る',
   kidDesc:'なんで？どうして？を いっしょに かんがえよう！',
   cls:'lens-かがく'},
  {id:'しゃかい', icon:'🗺', name:'しゃかい',
   desc:'人・社会・つながり',
   kidDesc:'だれが つくったの？どこから きたの？',
   cls:'lens-しゃかい'},
  {id:'えいご',   icon:'🌍', name:'えいご',
   desc:'英語で言うと？',
   kidDesc:'えいごでいうと なんていうんだろう？',
   cls:'lens-えいご'},
  {id:'じぶん',   icon:'💛', name:'じぶん',
   desc:'今どう感じてる？',
   kidDesc:'きみはどう おもった？ すき？きらい？なんで？',
   cls:'lens-じぶん'},
];

// ── ユーティリティ（render.jsから参照されるためここで定義） ──
function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth()+1}月${d.getDate()}日`;
}
function pickRand() {
  return ODAI_ALL[Math.floor(Math.random() * ODAI_ALL.length)];
}

// ── State ──
const S = {
  onboarded: false,
  step: 0,
  user: { name:'', type:'A', ageGroup:'young', likes:'', strengths:'', parentName:'ママ' },
  tab:  'home',
  flow: 'home',
  odai: null,
  lens: null,
  randOdai: null,
  odaiGenerating: false,
  messages: [],
  speaker: 'child',
  isLoading: false,
  lastError: false,
  lastSendPayload: null, // リトライ用
  summaryItems: [],
  summaryOpinion: '',
  opinionOpen: false,
  showOpinion: true,
  bookmarked: false,
  currentNote: '',
  calYear:  null,
  calMonth: null,
  dayModal: null,
  records: [],
  streak: 0,
  _lastPlayDate: null,
  _savedThisSession: false,
  fontSize: 'medium',
  weeklyReport: '',
  reportLoading: false,
};

// ── localStorage 永続化 ──
const STORAGE_KEY = 'tks_v6_state';
const STORAGE_KEY_OLD = 'tks_v5_state'; // マイグレーション用

function persistSave() {
  try {
    const toSave = {
      onboarded:     S.onboarded,
      user:          S.user,
      records:       S.records,
      streak:        S.streak,
      _lastPlayDate: S._lastPlayDate,
      showOpinion:   S.showOpinion,
      fontSize:      S.fontSize,
      weeklyReport:  S.weeklyReport,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch(e) { console.warn('save failed:', e); }
}

function persistLoad() {
  try {
    // v5→v6 マイグレーション
    const oldRaw = localStorage.getItem(STORAGE_KEY_OLD);
    if (oldRaw && !localStorage.getItem(STORAGE_KEY)) {
      const old = JSON.parse(oldRaw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(old));
      localStorage.removeItem(STORAGE_KEY_OLD);
      console.info('tks: migrated v5→v6');
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.assign(S, {
      onboarded:     saved.onboarded     ?? false,
      user:          { ...S.user, ...(saved.user || {}) },
      records:       saved.records       ?? [],
      streak:        saved.streak        ?? 0,
      _lastPlayDate: saved._lastPlayDate ?? null,
      showOpinion:   saved.showOpinion   ?? true,
      fontSize:      saved.fontSize      ?? 'medium',
      weeklyReport:  saved.weeklyReport  ?? '',
    });
  } catch(e) { console.warn('load failed:', e); }
}

// ── ヘルパー ──
const $id = id => document.getElementById(id);

function isSmallKid() { return S.user.ageGroup === 'young'; }
function opinionMaxChars() {
  return S.user.ageGroup==='young' ? 60 : S.user.ageGroup==='middle' ? 100 : 150;
}

function applyFontSize() {
  document.body.classList.toggle('fs-large', S.fontSize === 'large');
}

// ── API ──
async function callAI(messages, system) {
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
  return data;
}

// ── プロンプト ──
function chatSystem() {
  const u = S.user;

  // ── 年齢レイヤー ──
  const agePrompts = {
    young: `【年齢レイヤー：3〜5さい】
- 全文ひらがな・カタカナのみ。漢字は使わない
- 1文は10〜15文字以内。短く、テンポよく
- 「〜だね！」「〜してみて！」など明るく語りかける
- 抽象的な概念は使わず、五感（見る・触る・聞く・におい・味）で表現する
- 否定・訂正をしない。必ず全肯定してから次の問いへ
- 難しい言葉が出たらすぐやさしい言い換えをする`,
    middle: `【年齢レイヤー：6〜8さい】
- ひらがな中心だが、簡単な漢字（小1〜2レベル）は使ってよい
- 1文は20文字前後。テンポ感を保ちつつ少し情報を増やせる
- 「なぜだろう？」「どう思う？」と自分の考えを引き出す問いを積極的に使う
- 豆知識を1つ混ぜるとわくわく感が増す
- 答えが出なくても「それでいいよ」と安心させる`,
    older: `【年齢レイヤー：9〜12さい】
- 漢字・熟語も適切に使用可。ただし難しすぎる単語はふりがな付きで
- 1文は30文字前後まで可。論理的なつながりを意識した文章
- 「もし〇〇だったら？」「他にどんな例があるかな？」と仮説・応用を促す
- 子どもの意見に軽く反論したり別の視点を提示してもよい（思考を深めるため）
- 「なぜそう思う？」と根拠を言語化させることを重視する`,
  };

  // ── タイプレイヤー ──
  const typePrompts = {
    A: `【はっけんタイプ】
- 口調：ゆっくり、やさしく。「あ、ほんとだ！」「すごい、気づいたね！」を使う
- 観察を深める問いを中心にする：「色は？」「さわったらどんな感じ？」「においは？」
- 1つのものをじっくり多角的に観察させる。次のお題へ急がない
- 発見した事実をそのまま大切にする。「正解・不正解」を意識させない`,
    B: `【しらべるタイプ】
- 口調：少し知的でわくわくする感じ。「実はね…」「知ってた？」をよく使う
- 言葉の由来・豆知識・分類・比較を会話に自然に混ぜる
- 「正式な名前は〇〇というんだよ」と知識の精度を上げる方向へ誘う
- 「他にも同じ仲間はいるかな？」と知識を広げる問いを使う
- 事実確認を楽しむ姿勢を引き出す`,
    C: `【そうぞうタイプ】
- 口調：一緒に冒険するような、わくわくした探偵スタイル
- 見えない部分・中の構造・なぜそうなっているか、を推理させる
- 「背景はどうなってると思う？」「もしこれがなかったら？」と想像・仮説を引き出す
- 「もしかして〜かもしれない」という推論を全力で受け止め、さらに深める
- 答えが合っていなくても「いい仮説だね！」と思考プロセスを褒める`,
  };

  // ── レンズレイヤー ──
  const lensPrompts = {
    ことば: `【ことばレンズ】
- 「他の言い方をするとしたら？」と表現の幅を広げる
- オノマトペ（ふわふわ・ざらざら・ぴかぴかなど）を積極的に使い表現を楽しむ
- 「この気持ちを1つの言葉で言うと？」と語彙を引き出す
- 比喩・たとえ話を一緒に作る（「まるで〇〇みたい、というのはどう？」）`,
    かず: `【かずレンズ】
- 「いくつある？」「どのくらいの大きさ？」と数量・サイズを意識させる
- 「〇〇と比べると大きい？小さい？」と比較の視点を引き出す
- 形・対称性・パターン・規則性に気づかせる問いを混ぜる
- 「もし10倍の大きさだったら？」と数の感覚を遊びながら広げる`,
    かがく: `【かがくレンズ】
- 「なんでそうなってると思う？」と原因・仕組みを引き出す
- 「触ったらどんな感じ？固い？やわらかい？冷たい？」と物質の性質に気づかせる
- 「もし雨が降ったらどうなる？」など条件を変えた変化を想像させる
- 子どもの仮説を「実験したらわかるね！」と次の行動につなげる`,
    しゃかい: `【しゃかいレンズ】
- 「これは誰が作ったんだろう？」「どんな人が使うんだろう？」と人の役割に気づかせる
- 「どこから来たんだろう？」「次にどこへ行くんだろう？」とものの流れを想像させる
- 「これがなかった昔はどうしてたんだろう？」と歴史・変化の視点を入れる
- 「みんなのためにあるルールってなんだろう？」と社会のつながりを考えさせる`,
    えいご: `【えいごレンズ】
- 3〜5歳の場合はカタカナ読みのみ。アルファベット表記は最小限にする
- 英語の単語を教えるときは必ずカタカナ読みも添える（例：dog＝ドッグ）
- 「英語で言うと〇〇（カタカナ）だよ、言ってみて！」と発話を楽しく促す
- 簡単な英語フレーズ（What is this? / I like 〇〇!）を会話に自然に挟む
- 英語の語源や面白い語呂合わせがあれば紹介して記憶の助けにする
- 正確な発音より「言ってみること」を全力で褒める`,
    じぶん: `【じぶんレンズ】
- 「好き？嫌い？なんで？」と自分の感情を言語化させることを最優先にする
- 「前に似たようなこと経験したことある？」と記憶・体験とつなげる
- 「${u.name||'きみ'}だったらどうする？」と自分ごととして考えさせる
- 「正解はないよ。きみはどう感じた？それが一番大事」と自己肯定感を育む
- 親に「${u.parentName}は子どもの頃どうだったと思う？」と橋渡しする`,
  };

  const base = `あなたは「たからちゃん」です。
子どもが日常で見つけたものについて、一緒に考える案内役です。

【レイヤー優先順位】
指示が矛盾する場合は「年齢レイヤー ＞ タイプレイヤー ＞ レンズレイヤー」の順で優先し、年齢に合った言葉・トーンに調整すること。

【登場人物と話しかけのルール】
この会話には2人が参加している。
- [${u.name || 'こども'}]：子ども。メインの対話相手。基本的には子どもに向けて問いかける
- [${u.parentName}]：保護者。ときどき（3〜4往復に1回程度）話しかけてよい
必ず1人だけに向けて問いかけること。子どもと大人に同時に問いかけない。
[${u.parentName}]への問いかけは「${u.parentName}はどう思う？」「${u.parentName}は子どもの頃どうだった？」など親子の対話を引き出す内容にする。

【基本ルール】
- 子どもの答えをまず受け止めてから次の問いへ
- 1回の返答は2〜3文以内
- 絵文字を1つだけ使う
- 「なんとなく」「わからない」も大切に受け取る
- 答えが出なくても「それでいいよ」と安心させてから別の角度で問いかける
- 押しつけや説教はしない。答えを先に言わない
- まとめの提案はしない。対話はおしまいボタンが押されるまで続ける
- ${u.strengths ? `${u.name||'この子'}の得意なこと（${u.strengths}）を活かせるような問いかけを自然に混ぜる` : '得意なことが登録されたら、それを活かす問いかけをする'}

【好きなものの活用】
${u.likes ? `「${u.likes}」が好き。対話の中で1回は、お題「${S.odai?.name}」と好きなものを自然に絡めた問いかけをする（例：「${u.likes}と比べてどう？」「${u.likes}みたいなところはある？」）` : '好きなものが登録されたら、お題と絡めた問いかけをする'}

【子どもの情報】
- 呼び方: ${u.name || 'お子さん'}
- 好きなもの: ${u.likes || '未登録'}
- 得意なこと: ${u.strengths || '未登録'}

【今回のお題】「${S.odai?.name}」`;

  return [
    base,
    agePrompts[u.ageGroup] || agePrompts.young,
    typePrompts[u.type] || typePrompts.A,
    lensPrompts[S.lens] || '',
  ].join('\n\n');
}

function summarySystem() {
  const conv = S.messages.map(m => {
    const who = m.role==='ai' ? 'たからちゃん' : m.role==='child' ? S.user.name||'子ども' : S.user.parentName;
    return `[${who}] ${m.text}`;
  }).join('\n');
  const max = opinionMaxChars();

  return `あなたは「たからちゃん」です。以下の会話をもとにまとめを作ってください。

お題: ${S.odai?.name}　レンズ: ${S.lens}

【会話記録】
${conv}

【重要】findingsは必ず上記の会話の中で実際に出た言葉・気づき・発見をもとにしてください。

【出力形式】JSONのみ（Markdownなし）:
{
  "findings": ["会話に出た発見1（子どもの言葉を活かした短い文）","発見2","発見3"],
  "opinion": "保護者向けの温かいコメント。${max}文字以内。2〜3段落に分け、段落の区切りは必ず \\n（バックスラッシュn）で表現すること（生の改行は使わない）。押しつけがましくない。${S.user.ageGroup==='young'?'ひらがな多め。':''}"
}`;
}

function weeklyReportSystem() {
  const u = S.user;
  const oneWeekAgo = Date.now() - 7 * 86400000;
  const weekRecs = S.records.filter(r => new Date(r.date).getTime() > oneWeekAgo);
  if (weekRecs.length === 0) return null;

  const summary = weekRecs.map(r =>
    `【${r.lens}レンズ】${r.odai.name}：${(r.findings||[]).join('、')}`
  ).join('\n');

  return `あなたは子どもの学びを見守るアドバイザーです。
以下は${u.name}さん（${AGE_GROUPS.find(a=>a.id===u.ageGroup)?.label||''}）の今週（7日間）のたからさがしの記録です。

${summary}

${u.parentName}向けに、以下を含む200字程度のレポートをJSONで返してください。
文体は丁寧で温かみのある日本語とし、専門用語は使わないこと。
JSONのみ（Markdownなし）:
{
  "highlight": "今週いちばん印象的だった気づきや成長（1〜2文）",
  "growth": "子どもがどんな力を伸ばしているか（1〜2文）",
  "next": "来週試してみると良いこと・声かけのヒント（1〜2文）"
}`;
}

// ── Render ──
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
      note: renderNote,
      fav:  renderFav,
      set:  renderSettings,
    };
    root.innerHTML = (map[S.tab]||renderHome)();
  }
  bindEvents();
}

// ── イベントバインド ──
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
    S.odaiGenerating = true;
    render();
    App._generateAiOdai();
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
        const safeType = /^image\/(jpeg|png|gif|webp)$/.test(file.type) ? file.type : 'image/jpeg';
        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:32px';
        const img = document.createElement('img');
        img.src = `data:${safeType};base64,${b64}`;
        img.style.cssText = 'width:100%;max-height:200px;object-fit:cover;border-radius:16px';
        const sp = document.createElement('div'); sp.className = 'spinner';
        const tx = document.createElement('div');
        tx.style.cssText = 'font-size:13px;color:rgba(45,27,0,0.5)';
        tx.textContent = 'しゃしんをよんでいるよ…';
        loadingDiv.append(img, sp, tx);
        root.innerHTML = '';
        root.appendChild(loadingDiv);
        try {
          const result = await analyzePhoto(b64, file.type);
          App.goToLens(result);
        } catch(err) {
          console.error('photo error:', err);
          root.innerHTML = `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:32px;text-align:center">
              <div style="font-size:36px">📷</div>
              <div style="font-size:13px;color:rgba(45,27,0,0.5)">よみとりに失敗したよ<br>もう一度ためしてみてね</div>
              <button class="btn-secondary" onclick="App.closeChatFlow()" style="width:auto;padding:8px 20px">もどる</button>
            </div>`;
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // スクリーンrootは bindEvents 内で使う
  const root = $id('screen-root');
}

function scrollChat() {
  setTimeout(() => {
    const el = $id('chat-area');
    if (el) el.scrollTop = el.scrollHeight;
  }, 80);
}

function burstCalAnimation() {
  const lensCount = {};
  S.records.forEach(r => { if (r.lens) lensCount[r.lens] = (lensCount[r.lens]||0) + 1; });
  const items = [];
  LENSES.forEach(l => { for(let i=0;i<(lensCount[l.id]||0);i++) items.push(l.icon); });
  if (items.length === 0) return;

  const wrap = document.createElement('div');
  wrap.className = 'cal-burst-wrap';
  document.body.appendChild(wrap);
  const cx = window.innerWidth/2, cy = window.innerHeight/2;
  items.forEach((icon, i) => {
    const el = document.createElement('div');
    el.className = 'cal-burst-item';
    el.textContent = icon;
    const angle = (i/items.length)*360, dist = 80+Math.random()*80;
    const rad = angle*Math.PI/180;
    el.style.left = cx+'px'; el.style.top = cy+'px';
    el.style.setProperty('--tx', Math.cos(rad)*dist+'px');
    el.style.setProperty('--ty', Math.sin(rad)*dist+'px');
    el.style.animationDelay = (i*.05)+'s';
    wrap.appendChild(el);
  });
  setTimeout(() => wrap.remove(), 2000);
}

// ── App ──
const App = {

 switchTab(tab) {
  const prev = S.tab;
  S.tab  = tab;
  S.flow = 'home';
  render();
  if (tab === 'cal' && prev !== 'cal') setTimeout(triggerCalBurst, 100);
},

  closeChatFlow() { S.flow='home'; S.tab='home'; render(); },

  // ── オンボーディング ──
  obNext() {
    if (S.step === 0) {
      const name = $id('ob-name')?.value?.trim();
      if (!name) {
        $id('ob-name-err')?.classList.add('show');
        $id('ob-name')?.classList.add('error');
        return;
      }
      S.user.name = name;
    } else if (S.step === 1) {
      // タイプ選択（クリックで即反映済み、値チェックのみ）
    } else if (S.step === 2) {
      S.user.likes     = $id('ob-likes')?.value?.trim() || '';
      S.user.strengths = $id('ob-str')?.value?.trim()   || '';
    } else {
      S.onboarded = true; S.tab='home'; S.flow='home';
      persistSave(); render(); return;
    }
    S.step++;
    render();
  },
  obBack() { if(S.step>0){ S.step--; render(); } },
  setType(t)   { S.user.type=t; render(); },
  setAge(a)    { S.user.ageGroup=a; persistSave(); render(); },
  setParent(p) { S.user.parentName=p; render(); },

  // ── AI お題生成 ──
  async _generateAiOdai() {
    try {
      const res = await callAI(
        [{ role:'user', content:'日本の子ども（3〜9歳）が日常生活で目にしそうな具体的なものを1つ提案してください。JSONのみ: {"name":"ひらがな短い単語","emoji":"絵文字1つ","label":"カテゴリ"}' }],
        'JSONのみ返してください（Markdownなし）。具体的な身近なものを。'
      );
      const parsed = JSON.parse(res.replace(/```json|```/g,'').trim());
      S.randOdai = parsed;
    } catch {
      S.randOdai = pickRand();
    }
    S.odaiGenerating = false;
    render();
  },

  // ── お題→レンズへ ──
  goToLens(o) {
    S.odai=o; S.lens=null; S.flow='lens';
    S._savedThisSession=false; render();
  },
  replayOdai(o) { App.goToLens(o); },

  async submitFree() {
    const txt = $id('free-in')?.value?.trim();
    if (!txt) return;
    try {
      const res = await callAI(
        [{ role:'user', content:`子どもが「${txt}」と言いました。JSONのみ: {"name":"ひらがな短い単語","emoji":"絵文字","label":"カテゴリ"}` }],
        'JSONのみ返してください（Markdownなし）。'
      );
      App.goToLens(JSON.parse(res.replace(/```json|```/g,'').trim()));
    } catch {
      App.goToLens({ emoji:'✨', name:txt.slice(0,10), label:'きになること' });
    }
  },

  selectLens(id) { S.lens = S.lens===id ? null : id; render(); },

  // ── チャット開始 ──
  async startChat() {
    if (!S.lens) return;
    S.messages=[]; S.flow='chat'; S.isLoading=true; S.lastError=false;
    render();
    try {
      const text = await callAI(
        [{ role:'user', content:'最初の問いかけを1つだけ。' }],
        chatSystem()
      );
      S.messages.push({ role:'ai', text });
    } catch(err) {
      console.error('chat start error:', err);
      S.messages.push({ role:'ai', text:`${S.odai?.name}について、どんなことを知ってる？🔍` });
    }
    S.isLoading=false; render(); scrollChat();
  },

  setSpeaker(sp) { S.speaker=sp; render(); },

  // ── メッセージ送信 ──
  async sendChat() {
    const inp = $id('chat-in');
    const txt = inp?.value?.trim();
    if (!txt || S.isLoading) return;

    S.messages.push({ role:S.speaker, text:txt });
    S.isLoading=true; S.lastError=false;
    render(); scrollChat();

    const payload = App._buildApiMsgs();
    S.lastSendPayload = payload; // リトライ用に保存

    try {
      const text = await callAI(payload, chatSystem());
      S.messages.push({ role:'ai', text });
      S.lastError = false;
    } catch(err) {
      console.error('chat error:', err);
      S.lastError = true;
      // 最後のユーザーメッセージは残す（リトライで再送）
    }
    S.isLoading=false; render(); scrollChat();
  },

  async retryLastSend() {
    if (!S.lastSendPayload || S.isLoading) return;
    S.isLoading=true; S.lastError=false; render(); scrollChat();
    try {
      const text = await callAI(S.lastSendPayload, chatSystem());
      S.messages.push({ role:'ai', text });
      S.lastError=false;
    } catch(err) {
      S.lastError=true;
    }
    S.isLoading=false; render(); scrollChat();
  },

  _buildApiMsgs() {
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
    return apiMsgs;
  },

  // ── サマリー生成 ──
  async goSummary() {
    S.flow='summary'; S.summaryItems=[]; S.summaryOpinion='';
    S.opinionOpen=false; S.bookmarked=false; S.currentNote='';
    render();

    try {
      const res  = await callAI(
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

    App._saveRecord();
    persistSave();
    render();
    setTimeout(triggerFindingAnim, 50);
  },

  // きろくノート保存
  saveNote() {
    const txt = $id('note-input')?.value?.trim() || '';
    S.currentNote = txt;
    const last = S.records[S.records.length-1];
    if (last) last.note = txt;
    persistSave();
    // 保存フィードバック
    const btn = document.querySelector('.note-save-btn');
    if (btn) { btn.textContent='✓ ほぞんしたよ！'; setTimeout(()=>{ btn.textContent='💾 ほぞんする'; },1500); }
  },

  _saveRecord() {
    if (S._savedThisSession) return;
    S._savedThisSession = true;
    const entry = {
      odai:       { ...S.odai },
      lens:       S.lens,
      date:       new Date().toISOString(),
      findings:   [...S.summaryItems],
      bookmarked: false,
      note:       '',
    };
    S.records.push(entry);
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now()-86400000).toDateString();
    if (S._lastPlayDate !== today) {
      S.streak       = S._lastPlayDate===yesterday ? S.streak+1 : 1;
      S._lastPlayDate = today;
    }
  },

  doAgain() {
    S.lens=null; S.flow='lens'; S._savedThisSession=false; render();
  },

  nextOdai() {
    S.flow='home'; S.tab='home'; S.randOdai=null; render();
  },

  toggleBookmark() {
    S.bookmarked = !S.bookmarked;
    const last = S.records[S.records.length-1];
    if (last) last.bookmarked = S.bookmarked;
    persistSave();
    render();
  },

  toggleRecordFav(idx) {
    if (S.records[idx]) {
      S.records[idx].bookmarked = !S.records[idx].bookmarked;
      persistSave();
      render();
    }
  },

  showDayTakara(year, month, day) { S.dayModal={year,month,day}; render(); },
  closeDayModal() { S.dayModal=null; render(); },

  calPrev() {
    const now=new Date();
    let y=S.calYear??now.getFullYear(), m=S.calMonth??now.getMonth();
    if(--m<0){m=11;y--;} S.calYear=y; S.calMonth=m; render();
  },
  calNext() {
    const now=new Date();
    let y=S.calYear??now.getFullYear(), m=S.calMonth??now.getMonth();
    if(++m>11){m=0;y++;} S.calYear=y; S.calMonth=m; render();
  },

  toggleOpinion()     { S.opinionOpen=!S.opinionOpen; render(); },
  toggleShowOpinion() { S.showOpinion=!S.showOpinion; persistSave(); render(); },

  setFontSize(size) {
    S.fontSize = size;
    applyFontSize();
    persistSave();
    render();
  },

  // ウィークリーレポート生成
  async generateReport() {
    const sys = weeklyReportSystem();
    if (!sys) {
      alert('今週のきろくがまだないよ！たからさがしをしてからためしてね🔍');
      return;
    }
    S.reportLoading=true; render();
    try {
      const res  = await callAI([{ role:'user', content:'レポートをつくってください。' }], sys);
      const data = JSON.parse(res.replace(/```json|```/g,'').trim());
      S.weeklyReport = `✨ ハイライト\n${data.highlight}\n\n📈 のびている力\n${data.growth}\n\n💡 来週のヒント\n${data.next}`;
    } catch(err) {
      console.error('report error:', err);
      S.weeklyReport = '生成に失敗しました。もう一度試してみてください。';
    }
    S.reportLoading=false;
    persistSave();
    render();
  },

  saveSettings() {
    const name = $id('s-name')?.value?.trim();
    if (!name) {
      $id('s-name-err')?.classList.add('show');
      $id('s-name')?.classList.add('error');
      return;
    }
    S.user.name      = name;
    S.user.likes     = $id('s-likes')?.value?.trim() || '';
    S.user.strengths = $id('s-str')?.value?.trim()   || '';
    // ageGroupはsetAge()で都度保存されるが念のため同期
    persistSave();
    App.switchTab('home');
  },

  // ── CSV エクスポート ──
  exportCSV() {
    if (S.records.length === 0) {
      alert('まだきろくがないよ！たからさがしをしてからためしてね🔍');
      return;
    }
    const header = ['日付','お題','絵文字','カテゴリ','レンズ','発見1','発見2','発見3','ノート','お気に入り'];
    const rows = S.records.map(r => [
      r.date ? new Date(r.date).toLocaleDateString('ja-JP') : '',
      r.odai?.name   || '',
      r.odai?.emoji  || '',
      r.odai?.label  || '',
      r.lens         || '',
      r.findings?.[0] || '',
      r.findings?.[1] || '',
      r.findings?.[2] || '',
      r.note         || '',
      r.bookmarked   ? '★' : '',
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
      .join('\n');
    const bom  = '﻿'; // Excel用BOM
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `takarasagashi_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // ── CSV インポート ──
  triggerImport() {
    $id('csv-import-input')?.click();
  },

  importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text  = e.target.result.replace(/^﻿/, ''); // BOM除去
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) throw new Error('データがないよ');

        let imported = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
                               .map(c => c.replace(/^"|"$/g,'').replace(/""/g,'"'));
          if (cols.length < 5) continue;
          const [dateStr, name, emoji, label, lens, f1, f2, f3, note, fav] = cols;
          const findings = [f1,f2,f3].filter(Boolean);
          // 重複チェック（同日同お題は除外）
          const alreadyExists = S.records.some(r =>
            r.odai?.name === name &&
            r.date && new Date(r.date).toLocaleDateString('ja-JP') === dateStr
          );
          if (!alreadyExists) {
            S.records.push({
              odai:       { name, emoji, label },
              lens:       lens || '',
              date:       dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
              findings,
              note:       note || '',
              bookmarked: fav === '★',
            });
            imported++;
          }
        }
        persistSave();
        alert(`${imported}件のきろくをインポートしたよ！`);
        render();
      } catch(err) {
        console.error('import error:', err);
        alert('インポートに失敗したよ。CSVファイルをたしかめてね。');
      }
      // inputをリセット（同じファイルを再度選べるように）
      event.target.value = '';
    };
    reader.readAsText(file, 'UTF-8');
  },

  // ── フィードバック送信（Google フォーム） ──
  sendFeedback() {
    const txt = $id('feedback-text')?.value?.trim();
    if (!txt) {
      alert('メッセージをにゅうりょくしてね！');
      return;
    }
    // Google フォームのプリフィル URL（entry.XXXXXXXXX はフォームのフィールドID）
    const FORM_URL = 'https://forms.gle/XEVhBG2636FCohLw9';
    // フォームを新しいタブで開く
    window.open(FORM_URL, '_blank', 'noopener,noreferrer');
    // テキストをクリップボードにコピー（フォームに貼り付けやすくする）
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(() => {
        const btn = document.querySelector('#feedback-text');
        if (btn) btn.value = '';
        alert('フォームをひらいたよ！\nクリップボードにコピーしたので、フォームに貼り付けてね 📋');
      }).catch(() => {
        alert('フォームをひらいたよ！\nないようをコピーして貼り付けてね 📋');
      });
    } else {
      alert('フォームをひらいたよ！\nないようをコピーして貼り付けてね 📋');
    }
  },

  // ── PWA アップデート適用 ──
  applyUpdate() {
    if (App._waitingSW) {
      App._waitingSW.postMessage('skipWaiting');
    } else {
      window.location.reload();
    }
  },
  _waitingSW: null,
};

// ── Service Worker 登録 ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');

      // アップデート検知
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            App._waitingSW = newSW;
            const banner = document.getElementById('update-banner');
            if (banner) banner.style.display = 'flex';
          }
        });
      });

      // SW切り替わり時にリロード
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

    } catch(err) {
      console.warn('SW registration failed:', err);
    }
  });
}

// ── 起動 ──
persistLoad();
applyFontSize();
render();
