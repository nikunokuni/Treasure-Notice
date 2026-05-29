/* ═══════════════════════════════
   たからさがし — logic  v8
   ═══════════════════════════════ */

// ── 定数 ──
const PARENT_OPTS = ['パパ','ママ','きょうだい','ともだち','一人','その他'];

// ── カラーテーマ（12色相環） ──
const COLOR_THEMES = [
  { id:'amber',   name:'あんばー',   emoji:'🟡',
    amber:'#e8860a', amberLight:'#ffd166', amberPale:'#fff3cd',
    teal:'#0a9396',  tealLight:'#94d2bd',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#2d1b00',  paper:'#fdf6e3', paper2:'#fef9f0',
    lavender:'#9b89c4' },
  { id:'red',     name:'あか',       emoji:'🔴',
    amber:'#d62828', amberLight:'#f77f7f', amberPale:'#fde8e8',
    teal:'#457b9d',  tealLight:'#a8dadc',
    coral:'#e63946', coralLight:'#f4a261',
    mint:'#2a9d8f',  mintLight:'#a8dadc',
    deep:'#1d0000',  paper:'#fff5f5', paper2:'#fff0f0',
    lavender:'#9b89c4' },
  { id:'orange',  name:'おれんじ',   emoji:'🟠',
    amber:'#f4631e', amberLight:'#ffb347', amberPale:'#fff0e0',
    teal:'#0a9396',  tealLight:'#94d2bd',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#2d1100',  paper:'#fff8f2', paper2:'#fff4ec',
    lavender:'#9b89c4' },
  { id:'yellow',  name:'きいろ',     emoji:'🟡',
    amber:'#c9a800', amberLight:'#ffe066', amberPale:'#fffbe0',
    teal:'#0a9396',  tealLight:'#94d2bd',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#2d2400',  paper:'#fffef0', paper2:'#fffde8',
    lavender:'#9b89c4' },
  { id:'lime',    name:'きみどり',   emoji:'🟢',
    amber:'#6db33f', amberLight:'#b8e07a', amberPale:'#edfade',
    teal:'#0a9396',  tealLight:'#94d2bd',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#0d2200',  paper:'#f6fef0', paper2:'#f0fce6',
    lavender:'#9b89c4' },
  { id:'green',   name:'みどり',     emoji:'🟢',
    amber:'#2d9e6b', amberLight:'#7fe0b0', amberPale:'#e0f7ee',
    teal:'#0a9396',  tealLight:'#94d2bd',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#002d1a',  paper:'#f0fdf6', paper2:'#e8fdf0',
    lavender:'#9b89c4' },
  { id:'teal',    name:'みずいろ',   emoji:'🔵',
    amber:'#0a9396', amberLight:'#94d2bd', amberPale:'#e0f4f5',
    teal:'#2d9e6b',  tealLight:'#7fe0b0',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#457b9d',  mintLight:'#a8dadc',
    deep:'#002d2d',  paper:'#f0fdfd', paper2:'#e6fafa',
    lavender:'#9b89c4' },
  { id:'blue',    name:'あお',       emoji:'🔵',
    amber:'#1d6fa4', amberLight:'#74b3e8', amberPale:'#e0f0ff',
    teal:'#0a9396',  tealLight:'#94d2bd',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#001a2d',  paper:'#f0f6ff', paper2:'#e8f2ff',
    lavender:'#9b89c4' },
  { id:'indigo',  name:'あいいろ',   emoji:'🟣',
    amber:'#3d52a0', amberLight:'#8fa3e8', amberPale:'#eaecff',
    teal:'#0a9396',  tealLight:'#94d2bd',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#0d0a2d',  paper:'#f4f0ff', paper2:'#ede8ff',
    lavender:'#c4b5f4' },
  { id:'purple',  name:'むらさき',   emoji:'🟣',
    amber:'#7b2d8b', amberLight:'#c97edd', amberPale:'#f8e8ff',
    teal:'#0a9396',  tealLight:'#94d2bd',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#1a002d',  paper:'#fdf0ff', paper2:'#fae8ff',
    lavender:'#c4b5f4' },
  { id:'pink',    name:'ぴんく',     emoji:'🩷',
    amber:'#c2456a', amberLight:'#f0a0bd', amberPale:'#ffe8f0',
    teal:'#0a9396',  tealLight:'#94d2bd',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#2d001a',  paper:'#fff0f6', paper2:'#ffe8f2',
    lavender:'#9b89c4' },
  { id:'rose',    name:'ばら',       emoji:'🌹',
    amber:'#e0365a', amberLight:'#ff8fa3', amberPale:'#ffe8ed',
    teal:'#457b9d',  tealLight:'#a8dadc',
    coral:'#e76f51', coralLight:'#f4a261',
    mint:'#52b788',  mintLight:'#b7e4c7',
    deep:'#2d0010',  paper:'#fff5f7', paper2:'#ffecf0',
    lavender:'#9b89c4' },
];

const TYPES = [
  { id:'A', icon:'👀', name:'はっけん',
    desc:'じっくりかんさつする。「あ、これみて！」' },
  { id:'B', icon:'📚', name:'しらべる',
    desc:'ただしいちしきがすき。「ほんとうはなに？」' },
  { id:'C', icon:'🔭', name:'そうぞう',
    desc:'みえないぶぶんをすいりする。「もしかして〜かな？」' },
];

const agePrompts = [
  { id:'young',  label:'3〜5さい',  icon:'🐣', desc:'ひらがなメイン・みじかいぶん・ごかんちゅうしん' },
  { id:'middle', label:'6〜8さい',  icon:'🌱', desc:'すこしふくざつなといかけもたのしめる' },
  { id:'older',  label:'9〜12さい', icon:'🌳', desc:'ろんりてきなしこう・ふかいこうさつもできる' },
];

// ── バッヂ定義（20個） ──
const BADGES = [
  { id:'first',      icon:'🔍', name:'はじめてのはっけん', cond:'たからさがしを1かいやった',           check: s=>s.records.length>=1 },
  { id:'kagaku',     icon:'🔬', name:'かがくたんけんか',   cond:'かがくレンズで1かいたんけんした',     check: s=>s.records.some(r=>r.lens==="かがく") },
  { id:'streak3',    icon:'📅', name:'3にちれんぞく',      cond:'3にちれんぞくでたからさがしをした',   check: s=>s.streak>=3 },
  { id:'jibun',      icon:'💛', name:'じぶんたんけんか',   cond:'じぶんレンズで1かいたんけんした',     check: s=>s.records.some(r=>r.lens==="じぶん") },
  { id:'ten',        icon:'⭐', name:'10こはっけん',       cond:'たからを10こあつめた',               check: s=>s.records.length>=10 },
  { id:'shakai',     icon:'🗺', name:'しゃかいたんけんか', cond:'しゃかいレンズで1かいたんけんした',   check: s=>s.records.some(r=>r.lens==="しゃかい") },
  { id:'lensmaster', icon:'🌈', name:'レンズマスター',     cond:'5つのレンズをすべてつかった',         check: s=>new Set(s.records.map(r=>r.lens).filter(Boolean)).size>=5 },
  { id:'kotoba',     icon:'📖', name:'ことばたんけんか',   cond:'ことばレンズで1かいたんけんした',     check: s=>s.records.some(r=>r.lens==="ことば") },
  { id:'kazu',       icon:'🔢', name:'かずたんけんか',     cond:'かずレンズで1かいたんけんした',       check: s=>s.records.some(r=>r.lens==="かず") },
  { id:'streak7',    icon:'🔥', name:'1しゅうかんれんぞく',cond:'7にちれんぞくでたからさがしをした',   check: s=>s.streak>=7 },
  { id:'twenty',     icon:'💎', name:'20こはっけん',       cond:'たからを20こあつめた',               check: s=>s.records.length>=20 },
  { id:'photo',      icon:'📷', name:'カメラたんけんか',   cond:'しゃしんでたからをみつけた',          check: s=>s.records.some(r=>r.odai&&r.odai.fromPhoto) },
  { id:'bookmark5',  icon:'🔖', name:'コレクター',         cond:'おきにいりを5こあつめた',             check: s=>s.records.filter(r=>r.bookmarked).length>=5 },
  { id:'parent',     icon:'👨‍👧', name:'いっしょにたんけん', cond:'おやもさんかしたかいわがあった',       check: s=>s.records.some(r=>r.hadParent) },
  { id:'fifty',      icon:'🏆', name:'たから50こ！',       cond:'たからを50こあつめた',               check: s=>s.records.length>=50 },
  { id:'streak30',   icon:'🌟', name:'1かげつれんぞく',    cond:'30にちれんぞくでたからさがしをした',  check: s=>s.streak>=30 },
  { id:'custom',     icon:'🏷', name:'タグはかせ',         cond:'じぶんでタグを3つつくった',           check: s=>(s.customTags||[]).length>=3 },
  { id:'note10',     icon:'📓', name:'きろくノートめいじん',cond:'ノートを10こかいた',                 check: s=>s.records.filter(r=>r.note&&r.note.trim()).length>=10 },
  { id:'sameodai3',  icon:'🎯', name:'しつこいたんけんか', cond:'おなじおだいを3かいいじょうたんけんした', check: s=>{ const c={}; s.records.forEach(r=>{const k=r.odai&&r.odai.name||""; c[k]=(c[k]||0)+1;}); return Object.values(c).some(n=>n>=3); } },
  { id:'allcat',     icon:'🗂', name:'カテゴリマスター',   cond:'5つのカテゴリをせいはした',           check: s=>new Set(s.records.map(r=>r.odai&&r.odai.label).filter(Boolean)).size>=5 },
];

const ODAI_ALL = [
  {emoji:'☁️',name:'くも',         label:'そら'},
  {emoji:'💧',name:'みず',         label:'自然'},
  {emoji:'🌙',name:'つき',         label:'そら'},
  {emoji:'🌈',name:'にじ',         label:'そら'},
  {emoji:'🌧',name:'あめ',         label:'おてんき'},
  {emoji:'🌬',name:'かぜ',         label:'自然'},
  {emoji:'☀️',name:'たいよう',     label:'そら'},
  {emoji:'⛅',name:'くもりそら',   label:'そら'},
  {emoji:'❄️',name:'ゆき',         label:'おてんき'},
  {emoji:'🌫',name:'きり',         label:'おてんき'},
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
  {emoji:'🍚',name:'ごはん',       label:'たべもの'},
  {emoji:'🍞',name:'パン',         label:'たべもの'},
  {emoji:'🥚',name:'たまご',       label:'たべもの'},
  {emoji:'🥛',name:'ぎゅうにゅう', label:'たべもの'},
  {emoji:'🧅',name:'たまねぎ',     label:'たべもの'},
  {emoji:'🍎',name:'りんご',       label:'たべもの'},
  {emoji:'🥦',name:'ブロッコリー', label:'たべもの'},
  {emoji:'🥕',name:'にんじん',     label:'たべもの'},
  {emoji:'🪞',name:'かがみ',       label:'いえのなか'},
  {emoji:'💡',name:'でんきゅう',   label:'いえのなか'},
  {emoji:'🚿',name:'シャワー',     label:'いえのなか'},
  {emoji:'🪥',name:'はぶらし',     label:'いえのなか'},
  {emoji:'📺',name:'テレビ',       label:'いえのなか'},
  {emoji:'🧲',name:'じしゃく',     label:'いえのなか'},
  {emoji:'🔦',name:'かいちゅうでんとう',label:'いえのなか'},
  {emoji:'🤲',name:'て',           label:'からだ'},
  {emoji:'👣',name:'あしあと',     label:'からだ'},
  {emoji:'💨',name:'いき',         label:'からだ'},
  {emoji:'❤️',name:'しんぞう',     label:'からだ'},
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
   kidDesc:'どんなことばでいえるかな？ ことばあそびもしよう！',
   cls:'lens-ことば'},
  {id:'かず',     icon:'🔢', name:'かず',
   kidDesc:'かずや かたち・おおきさを くらべてみよう！',
   cls:'lens-かず'},
  {id:'かがく',   icon:'🔬', name:'かがく',
   kidDesc:'なんで？どうして？を いっしょに かんがえよう！',
   cls:'lens-かがく'},
  {id:'しゃかい', icon:'🗺', name:'しゃかい',
   kidDesc:'だれが つくったの？どこから きたの？',
   cls:'lens-しゃかい'},
  {id:'じぶん',   icon:'💛', name:'じぶん',
   kidDesc:'きみはどう おもった？ すき？きらい？なんで？',
   cls:'lens-じぶん'},
];

// ── ユーティリティ ──
function fmtDate(iso){
  const d=new Date(iso);
  return `${d.getMonth()+1}がつ${d.getDate()}にち`;
}
function pickRand(){
  return ODAI_ALL[Math.floor(Math.random()*ODAI_ALL.length)];
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
  lastSendPayload: null,
  summaryItems: [],
  summaryOpinion: '',
  opinionOpen: false,
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
  lastLens: null,   // 前回使ったレンズ
  chatPhase: 1,
  boxFilterTag: null,
  badgeModal: null,
  streakBrokenPop: false,
  streakBrokenCount: 0,
  weeklyTakara: null,
  customTags: [],
  settingsAgeOpen: false,
  settingsTypeOpen: false,
  obAgeOpen: false,
  obTypeOpen: false,
  // ページネーション
  favPage: 0,
  notePage: 0,
  // テーマ
  theme: 'amber',
  obColorOpen: false,
  // 新規取得バッヂ通知
  newBadges: [],
  shownBadgeModal: null,
};

// ── localStorage 永続化 ──
const STORAGE_KEY = 'tks_v8_state';
const STORAGE_KEY_OLD = 'tks_v7_state';

function persistSave(){
  try {
    const toSave = {
      onboarded:     S.onboarded,
      user:          S.user,
      records:       S.records,
      streak:        S.streak,
      _lastPlayDate: S._lastPlayDate,
      fontSize:      S.fontSize,
      weeklyReport:  S.weeklyReport,
      customTags:    S.customTags,
      lastLens:      S.lastLens,
      theme:         S.theme,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch(e){ console.warn('save failed:',e); }
}

function persistLoad(){
  try {
    // v7→v8 マイグレーション
    const oldRaw=localStorage.getItem(STORAGE_KEY_OLD);
    if(oldRaw&&!localStorage.getItem(STORAGE_KEY)){
      localStorage.setItem(STORAGE_KEY,oldRaw);
      localStorage.removeItem(STORAGE_KEY_OLD);
      console.info('tks: migrated v7→v8');
    }
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const saved=JSON.parse(raw);
    Object.assign(S,{
      onboarded:     saved.onboarded     ??false,
      user:          {...S.user,...(saved.user||{})},
      records:       saved.records       ??[],
      streak:        saved.streak        ??0,
      _lastPlayDate: saved._lastPlayDate ??null,
      fontSize:      saved.fontSize      ??'medium',
      weeklyReport:  saved.weeklyReport  ??'',
      customTags:    saved.customTags    ??[],
      lastLens:      saved.lastLens      ??null,
      theme:         saved.theme         ??'amber',
    });
    // ストリーク途切れチェック
    const _today=new Date().toDateString();
    const _yesterday=new Date(Date.now()-86400000).toDateString();
    if(S._lastPlayDate&&S._lastPlayDate!==_today&&S._lastPlayDate!==_yesterday&&S.streak>0){
      S.streakBrokenPop=true;
      S.streakBrokenCount=S.streak;
      S.streak=0;
    }
  } catch(e){ console.warn('load failed:',e); }
}

// ── ヘルパー ──
const $id=id=>document.getElementById(id);

function applyFontSize(){
  document.body.classList.remove('fs-small','fs-medium','fs-large');
  document.body.classList.add('fs-'+(S.fontSize||'medium'));
}

function applyTheme(){
  const t=COLOR_THEMES.find(c=>c.id===S.theme)||COLOR_THEMES[0];
  const root=document.documentElement;
  root.style.setProperty('--amber',       t.amber);
  root.style.setProperty('--amber-light', t.amberLight);
  root.style.setProperty('--amber-pale',  t.amberPale);
  root.style.setProperty('--teal',        t.teal);
  root.style.setProperty('--teal-light',  t.tealLight);
  root.style.setProperty('--coral',       t.coral);
  root.style.setProperty('--coral-light', t.coralLight);
  root.style.setProperty('--mint',        t.mint);
  root.style.setProperty('--mint-light',  t.mintLight);
  root.style.setProperty('--deep',        t.deep);
  root.style.setProperty('--paper',       t.paper);
  root.style.setProperty('--paper2',      t.paper2);
  root.style.setProperty('--lavender',    t.lavender);
}

function _refreshWeeklyTakara(){
  const now=new Date();
  const day=now.getDay();
  const monday=new Date(now);
  monday.setDate(now.getDate()-((day+6)%7));
  monday.setHours(0,0,0,0);
  const lastMonday=new Date(monday);
  lastMonday.setDate(monday.getDate()-7);
  const lastWeekRecs=S.records.filter(r=>{
    const d=new Date(r.date);
    return d>=lastMonday&&d<monday;
  });
  S.weeklyTakara=lastWeekRecs.length>0
    ?lastWeekRecs[Math.floor(Math.random()*lastWeekRecs.length)]
    :null;
}

function calcTotalDays(){
  const days=new Set(S.records.map(r=>new Date(r.date).toDateString()));
  return days.size;
}

function getYesterdayRecord(){
  const yesterday=new Date(Date.now()-86400000).toDateString();
  return S.records.slice().reverse().find(r=>new Date(r.date).toDateString()===yesterday)||null;
}

// ── フェーズ判定 ──
// AIの返答テキストとユーザーの会話数からフェーズを推定
function detectPhaseFromAI(text, userMsgCount){
  // フェーズ4シグナル（AIがまとめを促す）
  const phase4signals=[
    'ひとことでいうと','まとめてみよう','たからをしまおう',
    'どういうものだと思う？','ひとことで','いちばんおもしろかった',
    'わかったことを','きょうのたから','下のボタン','📦'
  ];
  if(phase4signals.some(sig=>text.includes(sig))) return 4;

  // フェーズ3シグナル（なぜ・どうして系）
  const phase3signals=['なんで','どうして','なぜ','どうおもう','どう思う','かんがえてみて'];
  if(phase3signals.some(sig=>text.includes(sig))&&userMsgCount>=2) return 3;

  // 会話数ベースのフォールバック
  if(userMsgCount>=4) return 3;
  if(userMsgCount>=2) return 2;
  return null;
}

// ── API ──
async function callAI(messages,system){
  const res=await fetch('/api/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({messages,system}),
  });
  const data=await res.json();
  if(!res.ok) throw new Error(data.error||'API error');
  return data.text;
}

async function analyzePhoto(b64,mime){
  const res=await fetch('/api/photo',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({b64,mime}),
  });
  const data=await res.json();
  if(!res.ok) throw new Error(data.error||'API error');
  return data;
}

// ── プロンプト ──
function chatSystem(){
  const u=S.user;
  const userMsgCount=S.messages.filter(m=>m.role!=='ai').length;
  const parentDue=userMsgCount>0&&userMsgCount%4===0;

  const baseLayer=`あなたは「たからちゃん」です。
子どもが日常で見つけたものについて、一緒に「子どもなりの答え」を作る案内役です。

【たからちゃんの話し方】
- 子どもの言葉をそのまま繰り返してから次の問いへ（受容→深掘り）
- 褒めるときは「えらい」より「気づいたね！」「おもしろい！」「そっか！」
- 間違いは否定せず「そう思うんだね、じゃあ〜はどう？」で転換する
- 「なんとなく」「わからない」も大切に受け取り、別の角度で聞き直す
- 絵文字は1つだけ使う
- 1回の返答は2文以内。問いは必ず1つだけ
- 答えを先に言わない。押しつけや説教はしない
- [${u.parentName}]に直接話しかけることは禁止。
  ただし4往復ごとのタイミングでは「${u.parentName}はどう思うか聞いてみて！」と
  子どもを通じて親に橋渡しする

【子どもの情報】
- 呼び方: ${u.name||'きみ'}
- すきなもの: ${u.likes||'なし'}
- とくいなこと: ${u.strengths||'なし'}
${u.likes?`- 対話の中で自然なタイミングで「${u.likes}と比べてみたらどう？」と絡める`:''}

【今回のお題】「${S.odai?.name}」
【レンズ】${S.lens}`;

  const ageLayers={
    young:`【ことばのルール：3〜5さい】
- 全文ひらがな・カタカナのみ。漢字は使わない
- 1文は15文字以内。短く、テンポよく
- 抽象的な概念は使わず、五感（見る・触る・聞く・におい）で表現する`,
    middle:`【ことばのルール：6〜8さい】
- 小学校1〜2年レベルの漢字まで使用可
- 1文は25文字以内
- 「なぜ？」「どう思う？」まで扱える`,
    older:`【ことばのルール：9〜12さい】
- 小学校全学年の漢字を使用可
- 1文は40文字以内
- 仮説・根拠・比較まで扱える`,
  };

  const typeLayers={
    A:`【はっけんタイプ：観察から出発】
フェーズ2では「色・形・さわった感じ・音・におい」を引き出す問いを使う。`,
    B:`【しらべるタイプ：名前・なかまから出発】
フェーズ2では「名前・なかま・ほかとのちがい」を引き出す問いを使う。`,
    C:`【そうぞうタイプ：仮説から出発】
フェーズ2では「中はどうなってると思う？」「なんでそうなってる？」を使う。`,
  };

  const lensLayers={
    ことば:`【ことばレンズ】フェーズ3では「これを一言で言うとしたら？」「まるで〇〇みたい、はどう？」オノマトペを一緒に作る。`,
    かず:`【かずレンズ】フェーズ3では「どのくらいの大きさ？」「○○と比べると？」「いくつある？」パターンや規則性に気づかせる。`,
    かがく:`【かがくレンズ】フェーズ3では「なんでそうなってると思う？」「もし〜だったらどうなる？」子どもの仮説を「実験したらわかるね！」と次の行動につなげる。`,
    しゃかい:`【しゃかいレンズ】フェーズ3では「だれがつくったんだろう？」「なんのためにあるの？」「これがなかった昔はどうしてたんだろう？」`,
    じぶん:`【じぶんレンズ】フェーズ3では「好き？嫌い？なんで？」「前に似たような経験した？」「正解はないよ。きみはどう感じた？」`,
  };

  const phaseLayer=`【会話の4フェーズ — 必ずこの順番で進める】

■ フェーズ1「いまどこ？」（1往復）
  「どこで見つけたの？」「そのとき、まわりに何があった？」
  場所・状況が掴めたら即フェーズ2へ。

■ フェーズ2「よくみると？」（1往復）
  [タイプ]の視点でお題を観察させる。まだ「なぜ？」は聞かない。

■ フェーズ3「どう思う？」（1〜2往復）
  [レンズ]の方向で「なぜ？」を深掘り。子どもが「〜だと思う」と言えたら成功。

■ フェーズ4「まとめ」（フェーズ3完了後）
  「じゃあ、${S.odai?.name}ってひとことで言うとどういうもの？」と聞く。
  子どもの答えを受け取ったあと、必ず「📦」絵文字を使って「たからをしまおう！」と誘導する。
  例：「今日のたからをしまってみよう！📦」

【重要】フェーズは順番通りに進める。飛ばさない。戻らない。
現在の会話数: ${userMsgCount}回目
${parentDue?`→ このタイミングで「${u.parentName}はどう思うか聞いてみて！」と子どもを通じて促すこと`:''}`;

  const prevLayer='';

  const finalRules=`【最重要・必ず守る】
① 1回の返答で問うのは1つだけ
② 答えを先に言わない
③ 2文以内
④ フェーズ4でまとめを促すときは必ず「📦」を使う（これがフェーズ4検出のトリガーになる）`;

  return [
    baseLayer,
    ageLayers[u.ageGroup]||ageLayers.young,
    typeLayers[u.type]||typeLayers.A,
    lensLayers[S.lens]||'',
    phaseLayer,
    prevLayer,
    finalRules,
  ].filter(Boolean).join('\n\n');
}

function summarySystem(){
  const conv=S.messages.map(m=>{
    const who=m.role==='ai'?'たからちゃん':m.role==='child'?S.user.name||'こども':S.user.parentName;
    return `[${who}] ${m.text}`;
  }).join('\n');
  const ageLabel=agePrompts.find(a=>a.id===S.user.ageGroup)?.label||'';
  const maxChars=S.user.ageGroup==='young'?60:S.user.ageGroup==='middle'?100:150;

  const maxFindings=S.user.ageGroup==='older'?3:2;

  return `あなたは「たからちゃん」です。以下の会話をもとにまとめを作ってください。

お題: ${S.odai?.name}　レンズ: ${S.lens}

【会話記録】
${conv}

【重要ルール】
- findingsは必ず上記の会話の中で実際に出た言葉・気づき・発見のみを使う
- 会話にない言葉の補完・推測・創作は禁止
- findingsは最大${maxFindings}個まで（${S.user.ageGroup==='older'?'9〜12歳なので3個まで':'3〜8歳なので2個まで'}）
- 会話が浅い場合は1個でよい
- 子どもが自分の言葉で言った「答え」があれば、それを最初のfindingにする

【出力形式】JSONのみ（Markdownなし）:
{
  "findings": ["子どもが実際に言った言葉を活かした発見（1〜${maxFindings}個）"],
  "opinion": "保護者向けの温かいコメント。${maxChars}文字以内。2〜3段落。段落区切りは\\n。押しつけがましくない。${S.user.ageGroup==='young'?'ひらがな多め。':''}"
}`;
}

function weeklyReportSystem(){
  const u=S.user;
  const oneWeekAgo=Date.now()-7*86400000;
  const weekRecs=S.records.filter(r=>new Date(r.date).getTime()>oneWeekAgo);
  if(weekRecs.length===0) return null;
  const summary=weekRecs.map(r=>`【${r.lens}レンズ】${r.odai.name}：${(r.findings||[]).join('、')}`).join('\n');
  return `あなたは子どもの学びを見守るアドバイザーです。
以下は${u.name}さん（${agePrompts.find(a=>a.id===u.ageGroup)?.label||''}）の今週（7日間）のたからさがしの記録です。

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
function render(){
  const root=$id('screen-root');
  const tw=$id('tabs-wrap');

  if(!S.onboarded){
    tw.style.display='none';
    root.innerHTML=renderOnboard();
    bindEvents();
    return;
  }

  const inFlow=['lens','chat','summary'].includes(S.flow);
  if(inFlow){
    tw.style.display='none';
    let content='';
    if(S.flow==='lens')    content=renderLens();
    if(S.flow==='chat')    content=renderChat();
    if(S.flow==='summary') content=renderSummary();
    root.innerHTML=renderChatHeader()+content;
  } else {
    tw.style.display='block';
    tw.innerHTML=renderTabs();
    const map={home:renderHome,cal:renderCal,box:renderBox,fav:renderFav,set:renderSettings};
    root.innerHTML=(map[S.tab]||renderHome)();
  }
  bindEvents();
}

// ── イベントバインド ──
function bindEvents(){
  const root=$id('screen-root');
  const ci=$id('chat-in');
  if(ci) ci.addEventListener('keydown',e=>{if(e.key==='Enter') App.sendChat();});

  const fi=$id('free-in');
  if(fi) fi.addEventListener('keydown',e=>{if(e.key==='Enter') App.submitFree();});

  const fg=$id('free-go-btn');
  if(fg) fg.addEventListener('click',()=>App.submitFree());

  const rr=$id('reroll-btn');
  if(rr) rr.addEventListener('click',e=>{
    e.stopPropagation();
    S.odaiGenerating=true;
    render();
    App._generateAiOdai();
  });

  const rc=$id('rand-card');
  if(rc) rc.addEventListener('click',()=>App.goToLens(S.randOdai));

  const pi=$id('photo-input');
  if(pi){
    pi.addEventListener('change',async e=>{
      const file=e.target.files[0];
      if(!file) return;
      const reader=new FileReader();
      reader.onload=async ev=>{
        const b64=ev.target.result.split(',')[1];
        const safeType=/^image\/(jpeg|png|gif|webp)$/.test(file.type)?file.type:'image/jpeg';
        const loadingDiv=document.createElement('div');
        loadingDiv.style.cssText='flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:32px';
        const img=document.createElement('img');
        img.src=`data:${safeType};base64,${b64}`;
        img.style.cssText='width:100%;max-height:200px;object-fit:cover;border-radius:16px';
        const sp=document.createElement('div'); sp.className='spinner';
        const tx=document.createElement('div');
        tx.style.cssText='font-size:13px;color:rgba(45,27,0,0.5)';
        tx.textContent='しゃしんをよんでいるよ…';
        loadingDiv.append(img,sp,tx);
        root.innerHTML='';
        root.appendChild(loadingDiv);
        try {
          const result=await analyzePhoto(b64,file.type);
          App.goToLens(result);
        } catch(err){
          console.error('photo error:',err);
          root.innerHTML=`
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:32px;text-align:center">
              <div style="font-size:36px">📷</div>
              <div style="font-size:13px;color:rgba(45,27,0,0.5)">よみとりにしっぱいしたよ<br>もう一どためしてみてね</div>
              <button class="btn-secondary" onclick="App.closeChatFlow()" style="width:auto;padding:8px 20px">もどる</button>
            </div>`;
        }
      };
      reader.readAsDataURL(file);
    });
  }
}

function scrollChat(){
  setTimeout(()=>{
    const el=$id('chat-area');
    if(el) el.scrollTop=el.scrollHeight;
  },80);
}

function triggerCalBurst(){
  const emojis=S.records.map(r=>r.odai?.emoji).filter(Boolean);
  if(emojis.length===0) return;
  const frame=document.getElementById('app')||document.body;
  const rect=frame.getBoundingClientRect();
  const cx=rect.left+rect.width/2;
  const cy=rect.top+rect.height/2;
  document.querySelectorAll('.cal-burst-wrap').forEach(el=>el.remove());
  const layer=document.createElement('div');
  layer.className='cal-burst-wrap';
  document.body.appendChild(layer);
  const count=Math.min(emojis.length,20);
  for(let i=0;i<count;i++){
    const el=document.createElement('div');
    el.className='cal-burst-item';
    const angle=(i/count)*Math.PI*2;
    const dist=90+Math.random()*120;
    const tx=Math.round(Math.cos(angle)*dist);
    const ty=Math.round(Math.sin(angle)*dist);
    el.style.cssText=`left:${cx}px;top:${cy}px;--tx:${tx}px;--ty:${ty}px;animation-delay:${i*0.045}s;`;
    el.textContent=emojis[i%emojis.length];
    layer.appendChild(el);
  }
  setTimeout(()=>layer.remove(),1800);
}

// ── App ──
const App = {

  switchTab(tab){
    const prev=S.tab;
    S.tab=tab; S.flow='home';
    // おきにいりタブ開時：新規バッヂがあれば表示
    if(tab==='fav'&&S.newBadges.length>0){
      S.shownBadgeModal=S.newBadges[0];
      S.newBadges=S.newBadges.slice(1);
    }
    render();
    if(tab==='cal'&&prev!=='cal') setTimeout(triggerCalBurst,100);
  },

  closeChatFlow(){ S.flow='home'; S.tab='home'; render(); },

  // ── オンボーディング ──
  obNext(){
    if(S.step===0){
      const name=$id('ob-name')?.value?.trim();
      if(!name){
        $id('ob-name-err')?.classList.add('show');
        $id('ob-name')?.classList.add('error');
        return;
      }
      S.user.name=name;
    } else if(S.step===1){
      // 年齢・タイプ選択済み
    } else if(S.step===2){
      S.user.likes=$id('ob-likes')?.value?.trim()||'';
    } else if(S.step===3){
      // 一緒にする人選択済み
    } else {
      // step===4: カラー選択完了
      S.onboarded=true; S.tab='home'; S.flow='home';
      applyTheme();
      persistSave(); render(); return;
    }
    S.step++;
    render();
  },
  obBack(){ if(S.step>0){ S.step--; render(); } },
  setType(t){ S.user.type=t; render(); },
  setAge(a){ S.user.ageGroup=a; persistSave(); render(); },
  setParent(p){ S.user.parentName=p; render(); },
  setTheme(id){ S.theme=id; applyTheme(); persistSave(); render(); },
  toggleObColor(){ S.obColorOpen=!S.obColorOpen; render(); },

  // ── AI お題生成 ──
  async _generateAiOdai(){
    try {
      const res=await callAI(
        [{role:'user',content:'日本の子ども（3〜9歳）が日常生活で目にしそうな具体的なものを1つ提案してください。JSONのみ: {"name":"ひらがな短い単語","emoji":"絵文字1つ","label":"カテゴリ"}'}],
        'JSONのみ返してください（Markdownなし）。具体的な身近なものを。'
      );
      const parsed=JSON.parse(res.replace(/```json|```/g,'').trim());
      S.randOdai=parsed;
    } catch {
      S.randOdai=pickRand();
    }
    S.odaiGenerating=false;
    render();
  },

  goToLens(o){
    S.odai=o;
    // 前回レンズを初期選択
    S.lens=S.lastLens||null;
    S.flow='lens';
    S._savedThisSession=false;
    render();
  },
  replayOdai(o){ App.goToLens(o); },



  async submitFree(){
    const txt=$id('free-in')?.value?.trim();
    if(!txt) return;
    try {
      const res=await callAI(
        [{role:'user',content:`子どもが「${txt}」と言いました。JSONのみ: {"name":"ひらがな短い単語","emoji":"絵文字","label":"カテゴリ"}`}],
        'JSONのみ返してください（Markdownなし）。'
      );
      App.goToLens(JSON.parse(res.replace(/```json|```/g,'').trim()));
    } catch {
      App.goToLens({emoji:'✨',name:txt.slice(0,10),label:'きになること'});
    }
  },

  selectLens(id){
    if(S.prevRecord) return;
    S.lens=S.lens===id?null:id;
    render();
  },

  // ── チャット開始 ──
  async startChat(){
    if(!S.lens) return;
    S.messages=[];
    S.flow='chat';
    S.isLoading=true;
    S.lastError=false;
    S.chatPhase=1;
    S.lastLens=S.lens; // 今回使ったレンズを記憶
    persistSave();
    render();

    const hour=new Date().getHours();
    const timeOfDay=hour<11?'あさ':hour<17?'ひるま':'よる';
    const startMsg=`${timeOfDay}です。フェーズ1から始めてください。最初の問いかけを1つだけ。`;

    try {
      const text=await callAI(
        [{role:'user',content:startMsg}],
        chatSystem()
      );
      S.messages.push({role:'ai',text});
      // 初回はフェーズ1固定
      S.chatPhase=1;
    } catch(err){
      console.error('chat start error:',err);
      S.messages.push({role:'ai',text:`${S.odai?.name}、どこでみつけたの？🔍`});
    }
    S.isLoading=false;
    render();
    scrollChat();
  },

  setSpeaker(sp){ S.speaker=sp; render(); },

  // ── メッセージ送信 ──
  async sendChat(){
    const inp=$id('chat-in');
    const txt=inp?.value?.trim();
    if(!txt||S.isLoading) return;

    const sentAs=S.speaker;
    S.messages.push({role:sentAs,text:txt});
    S.speaker='child';
    S.isLoading=true;
    S.lastError=false;
    if(inp) inp.value='';
    render();
    scrollChat();

    const payload=App._buildApiMsgs();
    S.lastSendPayload=payload;

    const userMsgCount=S.messages.filter(m=>m.role!=='ai').length;

    try {
      const text=await callAI(payload,chatSystem());
      S.messages.push({role:'ai',text});
      S.lastError=false;

      // フェーズ進行：AIの返答＋会話数から判定
      const detected=detectPhaseFromAI(text,userMsgCount);
      if(detected&&detected>S.chatPhase){
        S.chatPhase=detected;
      } else if(!detected){
        // フォールバック：会話数だけで進める
        if(userMsgCount>=1&&S.chatPhase<2) S.chatPhase=2;
        if(userMsgCount>=3&&S.chatPhase<3) S.chatPhase=3;
      }
    } catch(err){
      console.error('chat error:',err);
      S.lastError=true;
    }
    S.isLoading=false;
    render();
    scrollChat();
  },

  async retryLastSend(){
    if(!S.lastSendPayload||S.isLoading) return;
    S.isLoading=true; S.lastError=false;
    render(); scrollChat();
    try {
      const text=await callAI(S.lastSendPayload,chatSystem());
      S.messages.push({role:'ai',text});
      S.lastError=false;
    } catch(err){
      S.lastError=true;
    }
    S.isLoading=false;
    render();
    scrollChat();
  },

  _buildApiMsgs(){
    const apiMsgs=[];
    for(const m of S.messages){
      if(m.role==='ai'){
        apiMsgs.push({role:'assistant',content:m.text});
      } else {
        const label=m.role==='child'?S.user.name||'こども':S.user.parentName;
        apiMsgs.push({role:'user',content:`[${label}] ${m.text}`});
      }
    }
    if(apiMsgs[0]?.role==='assistant'){
      apiMsgs.unshift({role:'user',content:'はじめてください'});
    }
    return apiMsgs;
  },

  // ── サマリー生成 ──
  async goSummary(){
    S.flow='summary';
    S.summaryItems=[];
    S.summaryOpinion='';
    S.opinionOpen=false;
    S.bookmarked=false;
    S.currentNote='';
    render();

    try {
      const res=await callAI(
        [{role:'user',content:'まとめてください。'}],
        summarySystem()
      );
      const data=JSON.parse(res.replace(/```json|```/g,'').trim());
      S.summaryItems=data.findings||[];
      S.summaryOpinion=data.opinion||'';
    } catch(err){
      console.error('summary error:',err);
      S.summaryItems=['いっぱいかんがえた！'];
      S.summaryOpinion='ふたりとも、すごいはっけんだったね！';
    }

    App._saveRecord();
    persistSave();
    render();
    setTimeout(triggerFindingAnim,50);
  },

  saveNote(){
    const txt=$id('note-input')?.value?.trim()||'';
    S.currentNote=txt;
    const last=S.records[S.records.length-1];
    if(last) last.note=txt;
    persistSave();
    const btn=document.querySelector('.note-save-btn');
    if(btn){ btn.textContent='✓ ほぞんしたよ！'; setTimeout(()=>{btn.textContent='💾 ほぞんする';},1500); }
  },

  _saveRecord(){
    if(S._savedThisSession) return;
    S._savedThisSession=true;
    // 保存前のバッヂ状態を記録
    const prevEarned=new Set(BADGES.filter(b=>b.check(S)).map(b=>b.id));
    const entry={
      odai:{...S.odai},
      lens:S.lens,
      date:new Date().toISOString(),
      findings:[...S.summaryItems],
      bookmarked:false,
      note:'',
      status:'closed',
      hadParent:S.messages.some(m=>m.role==='parent'),
    };
    S.records.push(entry);
    const today=new Date().toDateString();
    const yesterday=new Date(Date.now()-86400000).toDateString();
    if(S._lastPlayDate!==today){
      S.streak=S._lastPlayDate===yesterday?S.streak+1:1;
      S._lastPlayDate=today;
    }
    // 新規取得バッヂを検出
    BADGES.forEach(b=>{
      if(!prevEarned.has(b.id)&&b.check(S)){
        S.newBadges.push(b.id);
      }
    });
  },



  doAgain(){
    S.lens=null; S.flow='lens';
    S._savedThisSession=false;
    S.prevRecord=null;
    render();
  },

  nextOdai(){
    S.flow='home'; S.tab='home'; S.randOdai=null;
    S.prevRecord=null;
    render();
  },

  toggleBookmark(){
    S.bookmarked=!S.bookmarked;
    const last=S.records[S.records.length-1];
    if(last) last.bookmarked=S.bookmarked;
    persistSave();
    render();
    setTimeout(triggerFindingAnim,50);
  },

  toggleRecordFav(idx){
    if(S.records[idx]){
      S.records[idx].bookmarked=!S.records[idx].bookmarked;
      persistSave(); render();
    }
  },

  setRecordStatusByIdx(idx,status){
    if(S.records[idx]){ S.records[idx].status=status; persistSave(); render(); }
  },

  // サマリーのAIかんがえ開閉（findingsを再描画しないようにCSSで制御済み）
  toggleOpinion(){
    S.opinionOpen=!S.opinionOpen;
    // innerHTMLでの再描画を避け、DOMを直接操作
    const body=document.querySelector('.ai-opinion-body');
    const chevron=document.querySelector('.ai-opinion-chevron');
    if(body) body.style.display=S.opinionOpen?'block':'none';
    if(chevron) chevron.classList.toggle('open',S.opinionOpen);
  },

  showDayTakara(year,month,day){ S.dayModal={year,month,day}; render(); },
  closeDayModal(){ S.dayModal=null; render(); },

  calPrev(){
    const now=new Date();
    let y=S.calYear??now.getFullYear(), m=S.calMonth??now.getMonth();
    if(--m<0){m=11;y--;} S.calYear=y; S.calMonth=m; render();
  },
  calNext(){
    const now=new Date();
    let y=S.calYear??now.getFullYear(), m=S.calMonth??now.getMonth();
    if(++m>11){m=0;y++;} S.calYear=y; S.calMonth=m; render();
  },

  setFontSize(size){
    S.fontSize=size;
    applyFontSize();
    persistSave();
    render();
  },

  async generateReport(){
    const sys=weeklyReportSystem();
    if(!sys){
      alert('こんしゅうのきろくがまだないよ！たからさがしをしてからためしてね🔍');
      return;
    }
    S.reportLoading=true; render();
    try {
      const res=await callAI([{role:'user',content:'レポートをつくってください。'}],sys);
      const data=JSON.parse(res.replace(/```json|```/g,'').trim());
      S.weeklyReport=`✨ ハイライト\n${data.highlight}\n\n📈 のびている力\n${data.growth}\n\n💡 来週のヒント\n${data.next}`;
    } catch(err){
      console.error('report error:',err);
      S.weeklyReport='せいせいにしっぱいしました。もう一どためしてみてください。';
    }
    S.reportLoading=false;
    persistSave();
    render();
  },

  saveSettings(){
    const name=$id('s-name')?.value?.trim();
    if(!name){
      $id('s-name-err')?.classList.add('show');
      $id('s-name')?.classList.add('error');
      return;
    }
    S.user.name=name;
    S.user.likes=$id('s-likes')?.value?.trim()||'';
    persistSave();
    App.switchTab('home');
  },

  exportCSV(){
    if(S.records.length===0){
      alert('まだきろくがないよ！たからさがしをしてからためしてね🔍');
      return;
    }
    const header=['日付','お題','絵文字','カテゴリ','レンズ','発見1','発見2','発見3','ノート','お気に入り','ステータス'];
    const rows=S.records.map(r=>[
      r.date?new Date(r.date).toLocaleDateString('ja-JP'):'',
      r.odai?.name||'', r.odai?.emoji||'', r.odai?.label||'',
      r.lens||'',
      r.findings?.[0]||'', r.findings?.[1]||'', r.findings?.[2]||'',
      r.note||'',
      r.bookmarked?'★':'',
      r.status||'',
    ]);
    const csvContent=[header,...rows]
      .map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob=new Blob(['\uFEFF'+csvContent],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`takarasagashi_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  },

  triggerImport(){ $id('csv-import-input')?.click(); },

  importCSV(event){
    const file=event.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{
      try {
        const text=e.target.result.replace(/^\uFEFF/,'');
        const lines=text.split(/\r?\n/).filter(Boolean);
        if(lines.length<2) throw new Error('データがないよ');
        let imported=0;
        for(let i=1;i<lines.length;i++){
          const cols=lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
                             .map(c=>c.replace(/^"|"$/g,'').replace(/""/g,'"'));
          if(cols.length<5) continue;
          const [dateStr,name,emoji,label,lens,f1,f2,f3,note,fav,status]=cols;
          const findings=[f1,f2,f3].filter(Boolean);
          const alreadyExists=S.records.some(r=>
            r.odai?.name===name&&r.date&&new Date(r.date).toLocaleDateString('ja-JP')===dateStr
          );
          if(!alreadyExists){
            S.records.push({
              odai:{name,emoji,label},
              lens:lens||'',
              date:dateStr?new Date(dateStr).toISOString():new Date().toISOString(),
              findings, note:note||'', bookmarked:fav==='★', status:status||null,
            });
            imported++;
          }
        }
        persistSave();
        alert(`${imported}けんのきろくをインポートしたよ！`);
        render();
      } catch(err){
        console.error('import error:',err);
        alert('インポートにしっぱいしたよ。CSVファイルをたしかめてね。');
      }
      event.target.value='';
    };
    reader.readAsText(file,'UTF-8');
  },

  // フィードバック（フォームを直接開く）
  sendFeedback(){
    const FORM_URL='https://forms.gle/XEVhBG2636FCohLw9';
    window.open(FORM_URL,'_blank','noopener,noreferrer');
  },

  async saveSummaryImage(){
    const el=document.getElementById('summary-capture-area');
    if(!el) return;
    try {
      const canvas=await html2canvas(el,{backgroundColor:'#fdf6e3',scale:2});
      const a=document.createElement('a');
      a.download='たからもの_'+(S.odai?.name||'きろく')+'.png';
      a.href=canvas.toDataURL('image/png');
      a.click();
    } catch(err){ console.error('saveSummaryImage error:',err); }
  },

  shareToX(){
    const name=S.odai?.name||'';
    const findings=(S.summaryItems||[]).join('、');
    const text=`「${name}」のたから：${findings} #たからさがし`;
    const url=`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url,'_blank','noopener,noreferrer');
  },

  setBoxFilter(tag){ S.boxFilterTag=S.boxFilterTag===tag?null:tag; render(); },
  openBadge(id){ S.badgeModal=BADGES.find(b=>b.id===id)||null; render(); },
  closeBadge(){ S.badgeModal=null; S.shownBadgeModal=null; render(); },
  dismissStreakPop(){ S.streakBrokenPop=false; render(); },

  addCustomTag(){
    const inp=document.getElementById('custom-tag-input');
    const val=inp?.value?.trim();
    if(!val) return;
    if(!S.customTags.includes(val)){ S.customTags.push(val); persistSave(); }
    if(inp) inp.value='';
    render();
  },

  toggleObAge(){  S.obAgeOpen =!S.obAgeOpen;  render(); },
  toggleObType(){ S.obTypeOpen=!S.obTypeOpen; render(); },
  toggleSettingsAge(){  S.settingsAgeOpen =!S.settingsAgeOpen;  render(); },
  toggleSettingsType(){ S.settingsTypeOpen=!S.settingsTypeOpen; render(); },

  // ページネーション
  loadMoreFav(){  S.favPage =(S.favPage ||0)+1; render(); },
  loadMoreNote(){ S.notePage=(S.notePage||0)+1; render(); },

  applyUpdate(){
    if(App._waitingSW){ App._waitingSW.postMessage('skipWaiting'); }
    else { window.location.reload(); }
  },
  _waitingSW:null,
};

// ── Service Worker ──
if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    try {
      const reg=await navigator.serviceWorker.register('/sw.js');
      reg.addEventListener('updatefound',()=>{
        const newSW=reg.installing;
        newSW.addEventListener('statechange',()=>{
          if(newSW.state==='installed'&&navigator.serviceWorker.controller){
            App._waitingSW=newSW;
            const banner=document.getElementById('update-banner');
            if(banner) banner.style.display='flex';
          }
        });
      });
      navigator.serviceWorker.addEventListener('controllerchange',()=>window.location.reload());
    } catch(err){ console.warn('SW registration failed:',err); }
  });
}

// ストリーク途切れポップを5秒後に自動で閉じる
setTimeout(()=>{
  if(S.streakBrokenPop){ S.streakBrokenPop=false; render(); }
},5000);

// ── 起動 ──
persistLoad();
applyFontSize();
applyTheme();
render();
