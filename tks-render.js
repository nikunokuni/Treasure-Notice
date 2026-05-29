/* ═══════════════════════════════
   たからさがし — render  v9
   ═══════════════════════════════ */

function esc(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function aiText(str) {
  return esc(str).replace(/\n/g,'<br>');
}

/* ── タブバー（5タブ） ── */
function renderTabs() {
  const tabs = [
    { id:'home', icon:'🏠', label:'ホーム',     cls:'tab-home' },
    { id:'cal',  icon:'🗓️', label:'カレンダー', cls:'tab-cal'  },
    { id:'box',  icon:'📦', label:'たからばこ', cls:'tab-box'  },
    { id:'fav',  icon:'⭐', label:'おきにいり', cls:'tab-fav'  },
    { id:'set',  icon:'⚙️', label:'せってい',   cls:'tab-set'  },
  ];
  return `
    <div class="tabs">
      ${tabs.map(t=>`
        <div class="tab ${t.cls} ${S.tab===t.id?'active':''}" onclick="App.switchTab('${t.id}')">
          <span class="tab-icon">${t.icon}</span>
          <span class="tab-label">${t.label}</span>
        </div>`).join('')}
    </div>
    <div class="tab-line"></div>`;
}

/* ── チャットヘッダー ── */
function renderChatHeader() {
  const lens = LENSES.find(l=>l.id===S.lens);
  return `
    <div class="chat-header">
      <div class="chat-header-info">
        <span class="chat-header-emoji">${esc(S.odai?.emoji||'')}</span>
        <span class="chat-header-name">${esc(S.odai?.name||'')}</span>
        ${lens?`<span class="chat-header-lens">${lens.icon} ${esc(lens.name)}</span>`:''}
      </div>
      <button class="back-btn" onclick="App.closeChatFlow()">◀ ホームにもどる</button>
    </div>`;
}

/* ══════════════════════════
   オンボーディング
   ══════════════════════════ */
function renderOnboard() {
  const s=S.step, u=S.user;
  // 5ステップ（0〜4）
  const dots=[0,1,2,3,4].map(i=>
    `<div class="step-dot ${i<s?'done':i===s?'active':''}"></div>`).join('');
  let body='';
  if(s===0){
    body=`
      <div class="form-block">
        <div class="form-label">お子さんの <em>よびかた</em></div>
        <input class="form-input" id="ob-name" placeholder="れい：はるくん" value="${esc(u.name)}">
        <div class="form-error" id="ob-name-err">なまえをいれてください</div>
      </div>
      <div class="form-block">
        <div class="form-label"><em>ねんれい</em>をえらんでね</div>
        ${renderAgeIconRow(u.ageGroup,"App.toggleObAge()",S.obAgeOpen)}
      </div>`;
  } else if(s===1){
    body=`
      <div class="form-block">
        <div class="form-label"><em>まなびのタイプ</em>をえらんでね</div>
        ${renderTypeIconRow(u.type,"App.toggleObType()",S.obTypeOpen)}
      </div>`;
  } else if(s===2){
    body=`
      <div class="form-block">
        <div class="form-label">すきなもの <em>（じゆうに）</em></div>
        <input class="form-input" id="ob-likes" placeholder="ポケモン・サッカー…" value="${esc(u.likes)}">
      </div>`;
  } else if(s===3){
    body=`
      <div class="form-block">
        <div class="form-label"><em>いっしょにするひと</em>のよびかた</div>
        <div class="parent-chips">${renderParentChips(u.parentName)}</div>
      </div>
      <p style="font-size:11px;color:rgba(45,27,0,0.4);line-height:1.7;text-align:center;padding:0 8px;margin-top:4px">
        ⚙️ せってい からいつでも かえられます
      </p>`;
  } else {
    // step===4: カラー選択
    body=`
      <div class="form-block">
        <div class="form-label">🎨 すきな <em>いろ</em> をえらんでね</div>
        <div class="form-label" style="font-size:10px;margin-top:-4px;margin-bottom:10px;color:rgba(45,27,0,0.35)">
          パパ・ママといっしょにえらぼう！
        </div>
        <div class="color-theme-grid">
          ${COLOR_THEMES.map(t=>`
            <div class="color-theme-chip ${S.theme===t.id?'selected':''}"
                 onclick="App.setTheme('${t.id}')"
                 style="background:${t.amber}">
              <span class="color-theme-check">${S.theme===t.id?'✓':''}</span>
              <span class="color-theme-name">${t.name}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }
  return `
    <div class="onboard-wrap">
      <div class="onboard-hero">
        <span class="onboard-emoji">🔍</span>
        <div class="onboard-ttl">たから<em>さがし</em></div>
        <div class="onboard-sub">まいにちのふとした きづきが、<br>まなびのたからになる</div>
      </div>
      <div class="step-dots">${dots}</div>
      ${body}
      <div style="padding-top:18px">
        <button class="btn-primary" onclick="App.obNext()">
          ${s<4?'つぎへ ›':'はじめる 🔍'}
        </button>
        ${s>0?`<button class="btn-secondary" onclick="App.obBack()">← もどる</button>`:''}
      </div>
    </div>`;
}

function renderAgeIconRow(current,toggleFn,isOpen){
  return `
    <div class="icon-row-select" onclick="${toggleFn}">
      ${agePrompts.map(a=>`
        <div class="icon-sel-item ${current===a.id?'icon-sel-active':''}">
          <div class="icon-sel-badge ${current===a.id?'icon-sel-badge-on':''}">${a.icon}</div>
          ${current===a.id?`<div class="icon-sel-current-lbl">${a.label}</div>`:''}
        </div>`).join('')}
      <span class="icon-row-chevron ${isOpen?'open':''}">▾</span>
    </div>
    ${isOpen?`<div class="icon-row-detail">${renderAgeCards(current)}</div>`:''}`;
}
function renderTypeIconRow(current,toggleFn,isOpen){
  return `
    <div class="icon-row-select" onclick="${toggleFn}">
      ${TYPES.map(t=>`
        <div class="icon-sel-item ${current===t.id?'icon-sel-active':''}">
          <div class="icon-sel-badge ${current===t.id?'icon-sel-badge-type':''}">${t.icon}</div>
          ${current===t.id?`<div class="icon-sel-current-lbl">${t.name}</div>`:''}
        </div>`).join('')}
      <span class="icon-row-chevron ${isOpen?'open':''}">▾</span>
    </div>
    ${isOpen?`<div class="icon-row-detail">${renderTypeCards(current)}</div>`:''}`;
}
function renderAgeCards(current){
  return agePrompts.map(a=>`
    <div class="type-card ${current===a.id?'sel-age':''}" onclick="App.setAge('${a.id}')">
      <div class="type-badge type-badge-age">${a.icon}</div>
      <div class="type-info">
        <div class="type-name">${a.label}</div>
        <div class="type-desc">${a.desc}</div>
      </div>
    </div>`).join('');
}
function renderTypeCards(current){
  return TYPES.map(t=>`
    <div class="type-card ${current===t.id?'sel-'+t.id:''}" onclick="App.setType('${t.id}')">
      <div class="type-badge type-badge-${t.id}">${t.icon}</div>
      <div class="type-info">
        <div class="type-name">${t.name}</div>
        <div class="type-desc">${t.desc}</div>
      </div>
    </div>`).join('');
}
function renderParentChips(current){
  return PARENT_OPTS.map(p=>`
    <div class="parent-chip ${current===p?'sel':''}" onclick="App.setParent('${esc(p)}')">${esc(p)}</div>`).join('');
}

/* ══════════════════════════
   ホーム
   ══════════════════════════ */
function renderHome(){
  const u=S.user;
  const type=TYPES.find(t=>t.id===u.type)||TYPES[0];
  const age=agePrompts.find(a=>a.id===(u.ageGroup||'young'))||agePrompts[0];
  const r=S.randOdai||pickRand();
  if(!S.randOdai) S.randOdai=r;

  // 週ドット
  const today=new Date();
  const weekDots=Array.from({length:7},(_,i)=>{
    const d=new Date(today); d.setDate(today.getDate()-(6-i));
    const done=S.records.some(rec=>{
      const rd=new Date(rec.date);
      return rd.getFullYear()===d.getFullYear()&&rd.getMonth()===d.getMonth()&&rd.getDate()===d.getDate();
    });
    const isToday=i===6;
    return `<span class="week-dot ${done?'done':''} ${isToday?'today':''}">${done?'✅':(isToday?'⭕':'○')}</span>`;
  }).join('');

  const streakMsg=S.streak===0?'きょうからはじめよう！'
    :S.streak<3?`${S.streak}にちれんぞく！このちょうしで！`
    :S.streak<7?`すごい！${S.streak}にちれんぞく中🎉`
    :`${S.streak}にち！もうヒーローだ⭐`;

  const totalDays=calcTotalDays();
  const totalTakara=S.records.length;

  const brokenPop=S.streakBrokenPop?`
    <div class="streak-broken-pop" id="streak-broken-pop">
      <div class="streak-broken-inner">
        <div class="streak-broken-emoji">😢</div>
        <div>
          <div class="streak-broken-ttl">れんぞくがとぎれちゃったよ</div>
          <div class="streak-broken-sub">でも${S.streakBrokenCount}にちも つづけたのはすごい！また今日からいこう🔥</div>
        </div>
        <button class="streak-broken-close" onclick="App.dismissStreakPop()">✕</button>
      </div>
    </div>`:'';

  // まえのたから：直近1件と先週のランダム1件
  const latestRec=S.records.length>0?S.records[S.records.length-1]:null;
  const oneWeekAgo=new Date(Date.now()-7*86400000);
  const lastWeekRecs=S.records.filter(r=>{
    const d=new Date(r.date);
    return d>=oneWeekAgo&&r!==latestRec;
  });
  const weekRandRec=lastWeekRecs.length>0
    ?lastWeekRecs[Math.floor(Math.random()*lastWeekRecs.length)]
    :null;

  return `
    ${brokenPop}
    <div class="content">

      <!-- 統計ストリップ -->
      <div class="home-stats-strip">
        <div class="home-stat-chip">
          <span class="hsc-icon">🔥</span>
          <span class="hsc-num">${S.streak}</span>
          <span class="hsc-lbl">れんぞく</span>
        </div>
        <div class="hsc-divider"></div>
        <div class="home-stat-chip">
          <span class="hsc-icon">📅</span>
          <span class="hsc-num">${totalDays}</span>
          <span class="hsc-lbl">つうさん日</span>
        </div>
        <div class="hsc-divider"></div>
        <div class="home-stat-chip">
          <span class="hsc-icon">📦</span>
          <span class="hsc-num">${totalTakara}</span>
          <span class="hsc-lbl">たから</span>
        </div>
        <div class="hsc-divider"></div>
        <div class="home-stat-chip hsc-dots">${weekDots}</div>
      </div>
      <div class="home-streak-msg">${streakMsg}</div>

      <!-- タイプ/年齢バッジ -->
      <div style="display:flex;gap:6px;align-items:center;margin-bottom:14px">
        <div class="home-type-badge htb-${type.id}" onclick="App.switchTab('set')" style="margin-bottom:0">
          ${type.icon} ${esc(type.name)} ›
        </div>
        <div class="home-type-badge htb-age" onclick="App.switchTab('set')" style="margin-bottom:0">
          ${age.icon} ${esc(age.label)} ›
        </div>
      </div>

      <!-- ★ メインアクションブロック -->
      <div class="main-block">
        <div class="main-block-label">🔍 きょうのたからをさがそう</div>
        <div class="main-actions">
          <div class="main-action-card main-free">
            <div class="main-action-label">✏️ いまきになること</div>
            <div class="free-row">
              <input class="free-input" id="free-in" placeholder="なんでもかいてみよう…">
              <button class="free-go" id="free-go-btn">➤</button>
            </div>
          </div>
          <div class="main-action-card main-photo">
            <input type="file" accept="image/*" id="photo-input">
            <div class="main-photo-inner">
              <span style="font-size:28px">📷</span>
              <div>
                <div class="main-action-label">しゃしんでおだいをつくる</div>
                <div class="main-action-sub">とった写真をAIがよみとるよ</div>
              </div>
              <span class="main-photo-arrow">›</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ランダム（小さく補助的に） -->
      ${S.odaiGenerating?`
        <div class="rand-card-mini rand-loading">
          <span class="spinner" style="width:14px;height:14px"></span>
          <span>おだいをかんがえてるよ…</span>
        </div>`:`
        <div class="rand-card-mini" id="rand-card">
          <span style="font-size:18px">${r.emoji}</span>
          <span class="rand-mini-label">🎲 ランダム：${esc(r.name)}</span>
          <button class="rand-mini-reroll" id="reroll-btn">ふりなおす</button>
          <span style="font-size:14px;color:rgba(45,27,0,0.2)">›</span>
        </div>`}

      <!-- まえのたから（直近1件 + 先週の1件） -->
      ${(latestRec||weekRandRec)?`
        <div class="section-ttl" style="margin-top:16px">まえのたから</div>
        <div class="prev-takara-mini-row">
          ${latestRec?`
            <div class="prev-takara-mini" onclick="App.goToLens(${JSON.stringify(latestRec.odai)})">
              <span class="prev-mini-emoji">${latestRec.odai.emoji}</span>
              <div class="prev-mini-info">
                <div class="prev-mini-tag">さいきん</div>
                <div class="prev-mini-name">${esc(latestRec.odai.name)}</div>
                <div class="prev-mini-meta">${fmtDate(latestRec.date)}</div>
              </div>
            </div>`:''}
          ${weekRandRec?`
            <div class="prev-takara-mini" onclick="App.goToLens(${JSON.stringify(weekRandRec.odai)})">
              <span class="prev-mini-emoji">${weekRandRec.odai.emoji}</span>
              <div class="prev-mini-info">
                <div class="prev-mini-tag">せんしゅう</div>
                <div class="prev-mini-name">${esc(weekRandRec.odai.name)}</div>
                <div class="prev-mini-meta">${fmtDate(weekRandRec.date)}</div>
              </div>
            </div>`:''}
        </div>`:''}
    </div>`;
}

/* ══════════════════════════
   レンズ選択
   ══════════════════════════ */
function renderLens(){
  // 前回と同じレンズが選択済みの場合のショートカット表示
  const sameAsLast = S.lens && S.lens === S.lastLens;
  return `
    <div class="content">
      <div style="margin-bottom:14px">
        <div class="odai-pill">
          <span class="odai-pill-emoji">${esc(S.odai.emoji)}</span>
          <span class="odai-pill-name">${esc(S.odai.name)}</span>
        </div>
      </div>

      ${sameAsLast?`
        <div class="lens-shortcut-banner">
          <div class="lens-shortcut-left">
            <span style="font-size:20px">${LENSES.find(l=>l.id===S.lens)?.icon||''}</span>
            <div>
              <div style="font-size:var(--fs-sm);font-weight:700;color:var(--deep)">まえと同じ「${esc(S.lens)}」レンズ</div>
              <div style="font-size:var(--fs-xs);color:rgba(45,27,0,0.45)">そのままはじめることもできるよ</div>
            </div>
          </div>
          <button class="btn-shortcut" onclick="App.startChat()">そのままはじめる ›</button>
        </div>`:''}

      <div class="lens-hint">どのレンズでみてみる？ひとつだけえらんでね 🔍</div>
      <div class="lens-grid">
        ${LENSES.map(l=>`
          <div class="lens-card ${l.cls} ${S.lens===l.id?'selected':''}"
               onclick="App.selectLens('${l.id}')">
            <div style="display:flex;align-items:center;gap:8px">
              <span class="lens-icon">${l.icon}</span>
              <div class="lens-name">${esc(l.name)}</div>
            </div>
            <div class="lens-desc">${esc(l.kidDesc)}</div>
          </div>`).join('')}
      </div>
      <button class="btn-dark" onclick="App.startChat()" ${!S.lens?'disabled':''}>
        ${!S.lens?'レンズをえらんでね':`${LENSES.find(l=>l.id===S.lens)?.icon} ${esc(S.lens)}レンズではじめる ›`}
      </button>
      <button class="btn-secondary" onclick="App.closeChatFlow()">← おだいにもどる</button>
    </div>`;
}

/* ══════════════════════════
   チャット
   ══════════════════════════ */
function renderChat(){
  const u=S.user;
  const isPhase4=S.chatPhase>=4;
  // フェーズバー：ラベルなし・丸いドットのみ
  const phaseDots=[1,2,3,4].map(n=>`
    <div class="phase-dot-simple ${S.chatPhase>n?'phase-s-done':''} ${S.chatPhase===n?'phase-s-active':''}"></div>
    ${n<4?'<div class="phase-line-simple"></div>':''}`).join('');
  return `
    <div class="phase-bar-wrap-simple">
      <div class="phase-bar-simple">${phaseDots}</div>
    </div>
    <div class="chat-wrap">
      <div class="speaker-row">
        <div class="speaker-btn ${S.speaker==='child'?'active-child':''}"
             onclick="App.setSpeaker('child')">👦 ${esc(u.name||'こども')}</div>
        <div class="speaker-btn ${S.speaker==='parent'?'active-parent':''}"
             onclick="App.setSpeaker('parent')">👨 ${esc(u.parentName)}</div>
      </div>
      <div class="chat-area" id="chat-area">
        ${S.messages.map(renderBubble).join('')}
        ${S.isLoading?`
          <div class="bubble-ai">
            <div class="ai-avatar">🔍</div>
            <div class="bubble-ai-text">
              <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
          </div>`:''}
        ${S.lastError?`
          <div class="chat-error-row">
            ⚠️ つながらなかったよ
            <button class="retry-btn" onclick="App.retryLastSend()">もう一度</button>
          </div>`:''}
      </div>
      <div class="chat-input-row">
        <input class="chat-input" id="chat-in"
          placeholder="${S.speaker==='child'?'かんがえてみよう…':esc(u.parentName)+'もかんがえてみよう…'}"
          ${S.isLoading?'disabled':''}>
        <button class="chat-send" onclick="App.sendChat()" ${S.isLoading?'disabled':''}>➤</button>
      </div>
      ${isPhase4?`
        <button class="finish-btn finish-btn-ready" onclick="App.goSummary()">
          📦 たからをしまう
        </button>`:''}
    </div>`;
}

function renderBubble(m){
  if(m.role==='ai') return `
    <div class="bubble-ai">
      <div class="ai-avatar">🔍</div>
      <div class="bubble-ai-text">${aiText(m.text)}</div>
    </div>`;
  if(m.role==='child') return `
    <div class="bubble-child"><div class="bubble-child-text">${esc(m.text)}</div></div>`;
  return `
    <div class="bubble-parent-wrap">
      <div class="bubble-parent-who">${esc(S.user.parentName)}</div>
      <div style="display:flex;justify-content:flex-end">
        <div class="bubble-parent-text">${esc(m.text)}</div>
      </div>
    </div>`;
}

/* ══════════════════════════
   サマリー
   ══════════════════════════ */
function renderSummary(){
  const items=S.summaryItems;
  const paras=S.summaryOpinion.split(/\n/).filter(Boolean);
  const colors=['#e8860a','#0a9396','#e76f51','#52b788','#9b89c4','#ffd166'];
  const savedNote=S.currentNote||'';

  return `
    <div class="content">
      <div id="summary-capture-area">
        <div class="summary-hero">
          <span class="summary-hero-emoji">${esc(S.odai?.emoji||'🔍')}</span>
          <div class="summary-hero-ttl">たからみつかった！</div>
          <div class="summary-hero-sub">${esc(S.odai?.name||'')} · ${esc(S.lens||'')}レンズ</div>
        </div>

        <!-- きょうのたから（消えない） -->
        <div class="findings-card" id="findings-card">
          <button class="bookmark-btn ${S.bookmarked?'active':''}" onclick="App.toggleBookmark()">🔖</button>
          <div class="findings-label">✨ きょうみつけたたから</div>
          ${items.length===0
            ?`<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(45,27,0,0.4)">
                <span class="spinner"></span>まとめているよ…
              </div>`
            :items.map((f,i)=>`
                <div class="finding-item finding-item-anim" style="animation-delay:${0.1+i*0.18}s">
                  <div class="finding-dot" style="background:${colors[i%colors.length]}"></div>
                  <div class="finding-text">${esc(f)}</div>
                </div>`).join('')}
        </div>

        <!-- AIのかんがえ（独立DOM） -->
        <div class="ai-opinion-card">
          <div class="ai-opinion-toggle" onclick="App.toggleOpinion()">
            <div class="ai-opinion-label">💡 AIのかんがえ（おとな向け）</div>
            <div class="ai-opinion-chevron ${S.opinionOpen?'open':''}">▾</div>
          </div>
          <div class="ai-opinion-body" style="display:${S.opinionOpen?'block':'none'}">
            ${paras.length>0
              ?paras.map(p=>`<div class="ai-opinion-para">${esc(p)}</div>`).join('')
              :`<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(45,27,0,0.4)">
                  <span class="spinner"></span>よみこみちゅう…
                </div>`}
          </div>
        </div>
      </div>

      <!-- きろくノート -->
      <div class="note-card">
        <div class="note-label">📓 きろくノート</div>
        <div style="font-size:var(--fs-xs);color:rgba(45,27,0,0.45);margin-bottom:6px">きょうきづいたこと、おもったことをかいてみよう</div>
        <textarea class="note-textarea" id="note-input" placeholder="（じゆうにかいてね）">${esc(savedNote)}</textarea>
        <button class="note-save-btn" onclick="App.saveNote()">💾 ほぞんする</button>
      </div>

      <!-- アクション -->
      <div class="summary-action-row">
        <button class="summary-action-btn summary-action-again" onclick="App.doAgain()">
          <span class="summary-action-icon">🔄</span>
          <span>べつのレンズで</span>
        </button>
        <button class="summary-action-btn summary-action-next" onclick="App.nextOdai()">
          <span class="summary-action-icon">✨</span>
          <span>つぎのおだい</span>
        </button>
        <button class="summary-action-btn summary-action-save" onclick="App.saveSummaryImage()">
          <span class="summary-action-icon">📸</span>
          <span>ほぞん</span>
        </button>
        <button class="summary-action-btn summary-action-x" onclick="App.shareToX()">
          <span class="summary-action-icon">𝕏</span>
          <span>とうこう</span>
        </button>
      </div>
    </div>`;
}

function triggerFindingAnim(){
  requestAnimationFrame(()=>{
    document.querySelectorAll('.finding-item-anim').forEach(el=>{
      el.classList.add('finding-item-visible');
    });
  });
}

/* ══════════════════════════
   カレンダー
   ══════════════════════════ */
function renderCal(){
  const now=new Date();
  const year=S.calYear??now.getFullYear();
  const month=S.calMonth??now.getMonth();
  const isThisMonth=(year===now.getFullYear()&&month===now.getMonth());
  const dayMap={};
  S.records.forEach(r=>{
    const d=new Date(r.date);
    if(d.getFullYear()===year&&d.getMonth()===month){
      const day=d.getDate();
      if(!dayMap[day]) dayMap[day]=[];
      dayMap[day].push(r);
    }
  });
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const monthName=`${year}ねん${month+1}がつ`;
  const dows=['日','月','火','水','木','金','土'];

  // 月の統計
  const monthDays=Object.keys(dayMap).length;
  const monthTakara=Object.values(dayMap).reduce((a,v)=>a+v.length,0);

  let cells='';
  for(let i=0;i<firstDay;i++) cells+=`<div class="cal-day empty"></div>`;
  for(let d=1;d<=daysInMonth;d++){
    const isToday=isThisMonth&&d===now.getDate();
    const isStamped=!!dayMap[d];
    const stamp=isStamped?(dayMap[d][0].odai?.emoji||'🔍'):'';
    const onclick=isStamped?`onclick="App.showDayTakara(${year},${month},${d})"`:'';
    cells+=`
      <div class="cal-day ${isToday?'today':''} ${isStamped?'stamped':''}" ${onclick}>
        ${isStamped?`<div class="cal-stamp">${stamp}</div>`:''}
        <div class="cal-day-num" style="${isStamped?'font-size:9px;opacity:.5':''}">${d}</div>
      </div>`;
  }

  return `
    <div class="content">
      <div class="cal-header">
        <button class="cal-nav" onclick="App.calPrev()">‹</button>
        <div class="cal-month">${monthName}</div>
        <button class="cal-nav" onclick="App.calNext()">›</button>
      </div>
      <!-- 月の統計 -->
      <div class="cal-month-stats">
        <div class="cal-month-stat">
          <span class="cal-month-stat-num">${monthDays}</span>
          <span class="cal-month-stat-lbl">にち たんけん</span>
        </div>
        <div class="cal-month-stat-div"></div>
        <div class="cal-month-stat">
          <span class="cal-month-stat-num">${monthTakara}</span>
          <span class="cal-month-stat-lbl">こ たから</span>
        </div>
      </div>
      <div class="cal-grid">
        ${dows.map((d,i)=>`<div class="cal-dow ${i===0?'sun':i===6?'sat':''}">${d}</div>`).join('')}
        ${cells}
      </div>
    </div>
    ${S.dayModal?renderDayModal():''}`;
}

function renderDayModal(){
  const m=S.dayModal;
  const records=S.records.filter(r=>{
    const d=new Date(r.date);
    return d.getFullYear()===m.year&&d.getMonth()===m.month&&d.getDate()===m.day;
  });
  return `
    <div class="modal-overlay" onclick="App.closeDayModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="App.closeDayModal()">✕</button>
        <div class="modal-ttl">${m.month+1}がつ${m.day}にちのたから</div>
        ${records.map(r=>renderTakaraCard(r,false)).join('')}
      </div>
    </div>`;
}

/* ══════════════════════════
   たからばこ
   ══════════════════════════ */
function renderBox(){
  const recs=S.records.slice().reverse();
  const lensCount={};
  LENSES.forEach(l=>{lensCount[l.id]=0;});
  S.records.forEach(r=>{if(r.lens&&lensCount[r.lens]!==undefined) lensCount[r.lens]++;});
  const maxCount=Math.max(1,...Object.values(lensCount));
  const lensColors={'ことば':'var(--coral)','かず':'var(--teal)','かがく':'var(--mint)','しゃかい':'var(--amber)','じぶん':'#ffd166'};

  // ヒートマップ（過去90日）
  const heatDays=90;
  const heatData={};
  S.records.forEach(r=>{
    const key=new Date(r.date).toDateString();
    heatData[key]=(heatData[key]||0)+1;
  });
  const heatCells=[];
  const todayD=new Date();
  for(let i=heatDays-1;i>=0;i--){
    const d=new Date(todayD);
    d.setDate(todayD.getDate()-i);
    const key=d.toDateString();
    const count=heatData[key]||0;
    const intensity=count===0?0:count===1?1:count<=3?2:3;
    heatCells.push({key,count,intensity,isToday:i===0});
  }
  const heatHtml=heatCells.map(c=>`
    <div class="heat-cell heat-${c.intensity} ${c.isToday?'heat-today':''}"
         title="${c.count}こ"></div>`).join('');

  // レンズフィルター
  const lensTagIds=LENSES.map(l=>l.id);
  let filteredRecs=recs;
  if(S.boxFilterTag&&lensTagIds.includes(S.boxFilterTag)){
    filteredRecs=recs.filter(r=>r.lens===S.boxFilterTag);
  }

  const filterBar=`
    <div class="box-filter-bar">
      <div class="box-filter-scroll">
        <div class="box-filter-chip ${!S.boxFilterTag?'active':''}" onclick="App.setBoxFilter(null)">すべて</div>
        ${LENSES.map(l=>`<div class="box-filter-chip box-filter-lens ${S.boxFilterTag===l.id?'active':''}" onclick="App.setBoxFilter('${l.id}')">${l.icon} ${esc(l.name)}</div>`).join('')}
      </div>
    </div>`;

  return `
    <div class="content">
      ${S.records.length>0?`
        <!-- ヒートマップ -->
        <div class="section-ttl">たんけんのあしあと（90にち）</div>
        <div class="heatmap-card">
          <div class="heatmap-grid">${heatHtml}</div>
          <div class="heatmap-legend">
            <span>すくない</span>
            <div class="heat-cell heat-0" style="width:12px;height:12px"></div>
            <div class="heat-cell heat-1" style="width:12px;height:12px"></div>
            <div class="heat-cell heat-2" style="width:12px;height:12px"></div>
            <div class="heat-cell heat-3" style="width:12px;height:12px"></div>
            <span>おおい</span>
          </div>
        </div>

        <!-- レンズバー -->
        <div class="section-ttl" style="margin-top:14px">レンズべつのはっけん</div>
        <div class="lens-compare-grid">
          ${LENSES.map(l=>`
            <div class="lens-compare-row">
              <span style="font-size:14px;width:20px">${l.icon}</span>
              <span style="font-size:10px;font-weight:700;color:var(--deep);width:48px">${esc(l.name)}</span>
              <div class="lens-compare-bar-wrap">
                <div class="lens-compare-bar" style="width:${Math.round(lensCount[l.id]/maxCount*100)}%;background:${lensColors[l.id]||'var(--amber)'}"></div>
              </div>
              <span class="lens-compare-count">${lensCount[l.id]}</span>
            </div>`).join('')}
        </div>`:''}

      ${filterBar}

      ${filteredRecs.length===0
        ?`<div class="empty-msg">📦<br>${S.boxFilterTag?'このレンズのたからはまだないよ':'まだたからがないよ<br>さがしにいこう！'}</div>`
        :`<div class="section-ttl">すべてのたから ${S.boxFilterTag?`（${esc(S.boxFilterTag)}）`:''}</div>`
          +filteredRecs.map(r=>renderTakaraCard(r,true)).join('')}
    </div>`;
}

/* ══════════════════════════
   おきにいり（ノート統合）
   ══════════════════════════ */
function renderFav(){
  const PAGE=20;
  const favPage=S.favPage||0;
  const notePage=S.notePage||0;
  const allFavs=S.records.filter(r=>r.bookmarked).slice().reverse();
  const favSlice=allFavs.slice(0,PAGE*(favPage+1));
  const hasMoreFav=allFavs.length>PAGE*(favPage+1);
  const allNotes=S.records.filter(r=>r.note&&r.note.trim()).slice().reverse();
  const noteSlice=allNotes.slice(0,PAGE*(notePage+1));
  const hasMoreNote=allNotes.length>PAGE*(notePage+1);

  const badgeResults=BADGES.map(b=>({...b,earned:b.check(S)}));

  // 新規バッヂ取得モーダル（tab開時に自動表示）
  const newBadgeData=S.shownBadgeModal?BADGES.find(b=>b.id===S.shownBadgeModal):null;
  const newBadgeModalHtml=newBadgeData?`
    <div class="modal-overlay badge-new-overlay" onclick="App.closeBadge()">
      <div class="modal-box badge-new-box" onclick="event.stopPropagation()">
        <div class="badge-new-burst">🎉</div>
        <div class="badge-new-icon">${newBadgeData.icon}</div>
        <div class="badge-new-ttl">あたらしいバッヂ！</div>
        <div class="badge-new-name">${esc(newBadgeData.name)}</div>
        <div class="badge-new-cond">${esc(newBadgeData.cond)}</div>
        <button class="btn-primary" style="margin-top:16px" onclick="App.closeBadge()">やったー！</button>
      </div>
    </div>`:'';

  // 通常バッヂモーダル
  const badgeModalHtml=S.badgeModal?`
    <div class="modal-overlay" onclick="App.closeBadge()">
      <div class="modal-box" onclick="event.stopPropagation()" style="text-align:center">
        <button class="modal-close" onclick="App.closeBadge()">✕</button>
        <div style="font-size:52px;margin:8px 0">${S.badgeModal.icon}</div>
        <div style="font-family:'Kaisei Decol',serif;font-size:var(--fs-xl);color:var(--deep);margin-bottom:6px">${esc(S.badgeModal.name)}</div>
        <div style="font-size:var(--fs-sm);color:rgba(45,27,0,0.5);line-height:1.7;margin-bottom:8px">${esc(S.badgeModal.cond)}</div>
        <div class="badge-modal-status ${badgeResults.find(b=>b.id===S.badgeModal.id)?.earned?'earned':'not-earned'}">
          ${badgeResults.find(b=>b.id===S.badgeModal.id)?.earned?'✅ かくとくずみ！':'🔒 まだかくとくしていないよ'}
        </div>
      </div>
    </div>`:'';

  return `
    <div class="content">
      <div class="badge-section-top">
        <div class="badge-section-ttl">🏅 かくとくしたバッヂ</div>
        <div class="badge-grid-large">
          ${badgeResults.map(b=>`
            <div class="badge-large ${b.earned?'badge-large-on':'badge-large-off'}" onclick="App.openBadge('${b.id}')">
              <div class="badge-large-icon">${b.earned?b.icon:'○'}</div>
              <div class="badge-large-name">${esc(b.name)}</div>
            </div>`).join('')}
        </div>
      </div>

      <div style="font-family:'Kaisei Decol',serif;font-size:var(--fs-lg);color:var(--deep);margin:14px 0 10px">
        ⭐ おきにいりのたから
      </div>
      ${allFavs.length===0
        ?`<div class="empty-msg">⭐<br>おきにいりがまだないよ<br>🔖をおしてみよう！</div>`
        :favSlice.map(r=>renderTakaraCard(r,true)).join('')}
      ${hasMoreFav?`<button class="load-more-btn" onclick="App.loadMoreFav()">つぎの20けん ›</button>`:''}

      <div class="note-section-divider"><span>📓 きろくノート</span></div>
      <div style="font-size:var(--fs-xs);color:rgba(45,27,0,0.45);margin-bottom:14px;line-height:1.7">
        サマリーのあとにかいたメモがあつまるよ
      </div>
      ${allNotes.length===0
        ?`<div class="empty-msg" style="padding:16px 0">📓<br>まだメモがないよ</div>`
        :noteSlice.map(r=>`
          <div class="note-tab-section">
            <div class="note-entry-header">
              <span class="note-entry-emoji">${r.odai.emoji}</span>
              <span class="note-entry-name">${esc(r.odai.name)}</span>
              <span style="font-size:9px;color:rgba(45,27,0,0.35);margin-left:auto">${fmtDate(r.date)}</span>
            </div>
            <div class="note-entry-text">${esc(r.note)}</div>
          </div>`).join('')}
      ${hasMoreNote?`<button class="load-more-btn" onclick="App.loadMoreNote()">つぎの20けん ›</button>`:''}
    </div>
    ${newBadgeModalHtml}
    ${badgeModalHtml}`;
}

/* ══════════════════════════
   たからカード（共通）
   ── カード全体タップで同じお題へ
   ══════════════════════════ */
function renderTakaraCard(r,showFavBtn){
  const lens=LENSES.find(l=>l.id===r.lens);
  const colors=['#e8860a','#0a9396','#e76f51','#52b788','#9b89c4','#ffd166'];
  const idx=S.records.lastIndexOf(r);
  const odaiJson=JSON.stringify(r.odai).replace(/'/g,'&#39;');
  return `
    <div class="takara-item" onclick="App.goToLens(${odaiJson})" style="cursor:pointer">
      <div class="takara-item-header">
        <span class="takara-item-emoji">${r.odai.emoji}</span>
        <span class="takara-item-name">${esc(r.odai.name)}</span>
        ${lens?`<span class="takara-item-lens">${lens.icon} ${esc(lens.name)}</span>`:''}
      </div>
      <div class="takara-findings">
        ${(r.findings||[]).map((f,i)=>`
          <div class="takara-finding">
            <div class="finding-dot" style="background:${colors[i%colors.length]};width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px"></div>
            ${esc(f)}
          </div>`).join('')}
      </div>
      ${r.note?`<div class="takara-note">📓 ${esc(r.note)}</div>`:''}
      <div class="takara-item-date">${fmtDate(r.date)}</div>
      ${showFavBtn?`
        <button class="takara-fav-btn ${r.bookmarked?'active':''}"
                onclick="event.stopPropagation();App.toggleRecordFav(${idx})">🔖</button>`:''}
    </div>`;
}

/* ══════════════════════════
   せってい
   ══════════════════════════ */
function renderSettings(){
  const u=S.user;
  const fs=S.fontSize||'medium';
  return `
    <div class="content">
      <div class="settings-section">
        <div class="settings-ttl">こどもの情報</div>
        <div class="settings-field">
          <div class="settings-field-label">よびかた</div>
          <input class="form-input" id="s-name" value="${esc(u.name)}" placeholder="ニックネーム">
          <div class="form-error" id="s-name-err">なまえをいれてください</div>
        </div>
        <div class="settings-field">
          <div class="settings-field-label">ねんれい</div>
          ${renderAgeIconRow(u.ageGroup,"App.toggleSettingsAge()",S.settingsAgeOpen)}
        </div>
        <div class="settings-field">
          <div class="settings-field-label">まなびのタイプ</div>
          ${renderTypeIconRow(u.type,"App.toggleSettingsType()",S.settingsTypeOpen)}
        </div>
        <div class="settings-field">
          <div class="settings-field-label">すきなもの</div>
          <input class="form-input" id="s-likes" value="${esc(u.likes)}" placeholder="ポケモン・サッカーなど">
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-ttl">いっしょにするひと</div>
        <div class="settings-field">
          <div class="settings-field-label">よびかた</div>
          <div class="parent-chips">${renderParentChips(u.parentName)}</div>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-ttl">🎨 アプリのいろ</div>
        <div style="font-size:var(--fs-xs);color:rgba(45,27,0,0.45);margin-bottom:10px;line-height:1.6">
          パパ・ママといっしょにえらんでね
        </div>
        <div class="color-theme-grid">
          ${COLOR_THEMES.map(t=>`
            <div class="color-theme-chip ${S.theme===t.id?'selected':''}"
                 onclick="App.setTheme('${t.id}')"
                 style="background:${t.amber}">
              <span class="color-theme-check">${S.theme===t.id?'✓':''}</span>
              <span class="color-theme-name">${t.name}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-ttl">表示設定</div>
        <div class="settings-field">
          <div class="settings-field-label">文字サイズ</div>
          <div class="font-size-chips">
            <div class="font-size-chip ${fs==='small' ?'sel':''}" onclick="App.setFontSize('small')">ちいさい</div>
            <div class="font-size-chip ${fs==='medium'?'sel':''}" onclick="App.setFontSize('medium')">ふつう</div>
            <div class="font-size-chip ${fs==='large' ?'sel':''}" onclick="App.setFontSize('large')">おおきい</div>
          </div>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-ttl">ウィークリーレポート</div>
        <div style="font-size:11px;color:rgba(45,27,0,0.45);margin-bottom:10px;line-height:1.6">
          今週の学びをAIがまとめるよ（${u.parentName}向け）
        </div>
        ${S.weeklyReport?`
          <div class="report-card">
            <div class="report-label">📊 ウィークリーレポート</div>
            <div class="report-body">${aiText(S.weeklyReport)}</div>
          </div>
          <button class="btn-secondary" onclick="App.generateReport()">
            ${S.reportLoading?'<span class="spinner"></span>':'🔄 もう一度生成'}
          </button>`:`
          <button class="btn-primary" onclick="App.generateReport()">
            ${S.reportLoading?'<span class="spinner"></span> せいせいちゅう…':'📊 レポートをつくる'}
          </button>`}
      </div>
      <div class="settings-section">
        <div class="settings-ttl">データ管理</div>
        <div style="display:flex;gap:8px;margin-bottom:8px">
          <button class="btn-secondary" style="flex:1;padding:9px;font-size:var(--fs-sm)" onclick="App.exportCSV()">📤 エクスポート</button>
          <button class="btn-secondary" style="flex:1;padding:9px;font-size:var(--fs-sm)" onclick="App.triggerImport()">📥 インポート</button>
        </div>
        <input type="file" id="csv-import-input" accept=".csv" style="display:none" onchange="App.importCSV(event)">
      </div>
      <div class="settings-section">
        <div class="settings-ttl">意見・要望をおくる</div>
        <div style="font-size:var(--fs-sm);color:rgba(45,27,0,0.5);margin-bottom:10px;line-height:1.6">アプリをよりよくするために、きいてね！</div>
        <button class="btn-primary" style="margin-bottom:0" onclick="App.sendFeedback()">📨 フォームをひらく</button>
      </div>
      <button class="btn-primary" onclick="App.saveSettings()">ほぞんする ✓</button>
    </div>`;
}
