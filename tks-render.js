/* ═══════════════════════════════
   たからさがし — render  v4
   ═══════════════════════════════ */

// ── タブバー ──────────────────────────────
function renderTabs() {
  const tabs = [
    { id:'home', icon:'🏠', label:'たからさがし', cls:'tab-home' },
    { id:'cal',  icon:'🗓️', label:'カレンダー',   cls:'tab-cal'  },
    { id:'box',  icon:'📦', label:'たからばこ',   cls:'tab-box'  },
    { id:'fav',  icon:'⭐', label:'おきにいり',   cls:'tab-fav'  },
    { id:'set',  icon:'⚙️', label:'せってい',     cls:'tab-set'  },
  ];
  return `
    <div class="tabs">
      ${tabs.map(t => `
        <div class="tab ${t.cls} ${S.tab === t.id ? 'active' : ''}"
             onclick="App.switchTab('${t.id}')">
          <span class="tab-icon">${t.icon}</span>${t.label}
        </div>`).join('')}
    </div>
    <div class="tab-line"></div>`;
}

// ── 会話中ヘッダー ────────────────────────
function renderChatHeader() {
  const lens = LENSES.find(l => l.id === S.lens);
  return `
    <div class="chat-header">
      <div class="chat-header-info">
        <span class="chat-header-emoji">${S.odai?.emoji || ''}</span>
        <span class="chat-header-name">${S.odai?.name || ''}</span>
        ${lens ? `<span class="chat-header-lens">${lens.icon} ${lens.name}</span>` : ''}
      </div>
      <button class="chat-close-btn" onclick="App.closeChatFlow()">✕</button>
    </div>`;
}

// ── オンボーディング ──────────────────────
function renderOnboard() {
  const s = S.step;
  const u = S.user;
  const dots = [0,1,2].map(i =>
    `<div class="step-dot ${i < s ? 'done' : i === s ? 'active' : ''}"></div>`
  ).join('');

  let body = '';
  if (s === 0) {
    body = `
      <div class="form-block">
        <div class="form-label">お子さんの <em>呼び方</em></div>
        <input class="form-input" id="ob-name" placeholder="例：はるくん" value="${u.name}">
        <div class="form-error" id="ob-name-err">名前を入力してください</div>
      </div>
      <div class="form-block">
        <div class="form-label"><em>子どもタイプ</em>を選んでね</div>
        <div class="type-grid">${renderTypeCards(u.type)}</div>
      </div>`;
  } else if (s === 1) {
    body = `
      <div class="form-block">
        <div class="form-label">好きなもの <em>（自由に）</em></div>
        <input class="form-input" id="ob-likes" placeholder="例：ポケモン、サッカー…" value="${u.likes}">
      </div>
      <div class="form-block">
        <div class="form-label">得意なこと</div>
        <input class="form-input" id="ob-str" placeholder="絵をかくこと…" value="${u.strengths}">
      </div>`;
  } else {
    body = `
      <div class="form-block">
        <div class="form-label"><em>いっしょにするひと</em>の呼び方</div>
        <div class="parent-chips">${renderParentChips(u.parentName)}</div>
      </div>
      <p style="font-size:11px;color:rgba(45,27,0,0.4);line-height:1.7;text-align:center;padding:0 8px;margin-top:4px">
        ⚙️ せってい からいつでも変えられます
      </p>`;
  }

  return `
    <div class="onboard-wrap">
      <div class="onboard-hero">
        <span class="onboard-emoji">🔍</span>
        <div class="onboard-ttl">たから<em>さがし</em></div>
        <div class="onboard-sub">日常のふとした疑問が、<br>学びのたからになる</div>
      </div>
      <div class="step-dots">${dots}</div>
      ${body}
      <div style="padding-top:18px">
        <button class="btn-primary" onclick="App.obNext()">
          ${s < 2 ? 'つぎへ ›' : 'はじめる 🔍'}
        </button>
        ${s > 0 ? `<button class="btn-secondary" onclick="App.obBack()">← もどる</button>` : ''}
      </div>
    </div>`;
}

function renderTypeCards(current) {
  return TYPES.map(t => `
    <div class="type-card ${current === t.id ? 'sel-' + t.id : ''}"
         onclick="App.setType('${t.id}')">
      <div class="type-badge type-badge-${t.id}">${t.icon}</div>
      <div class="type-info">
        <div class="type-name">${t.name}</div>
        <div class="type-desc">${t.desc}</div>
      </div>
    </div>`).join('');
}

function renderParentChips(current) {
  return PARENT_OPTS.map(p => `
    <div class="parent-chip ${current === p ? 'sel' : ''}"
         onclick="App.setParent('${p}')">${p}</div>`).join('');
}

// ── ホーム ────────────────────────────────
function renderHome() {
  const u    = S.user;
  const type = TYPES.find(t => t.id === u.type) || TYPES[0];
  const rec  = S.records.slice(-3).reverse();
  if (!S.randOdai) S.randOdai = pickRand();
  const r = S.randOdai;

  return `
    <div class="content">
      <div class="home-greeting">
        <span class="home-greeting-emoji">🔍</span>
        <div>
          <div class="home-greeting-name">${u.name}きょうも探検しよう！</div>
          <div style="font-size:11px;color:rgba(45,27,0,0.45)">気になること、なんでもOK</div>
        </div>
      </div>
      <div class="home-type-badge htb-${type.id}" onclick="App.switchTab('set')">
        ${type.icon} ${type.name} ›
      </div>

      <div class="odai-random" id="rand-card">
        <span class="odai-random-icon">${r.emoji}</span>
        <div>
          <div class="odai-random-label">🎲 ランダム</div>
          <div class="odai-random-name">${r.name}</div>
        </div>
        <span class="odai-random-arrow">›</span>
        <button class="reroll-btn" id="reroll-btn">ふりなおす</button>
      </div>

      <div class="free-section">
        <div class="free-label">✏️ いまどんなことが気になってる？</div>
        <div class="free-row">
          <input class="free-input" id="free-in" placeholder="なんでも入力してね…">
          <button class="free-go" id="free-go-btn">➤</button>
        </div>
      </div>

      <div class="photo-row">
        <input type="file" accept="image/*" id="photo-input">
        <span class="photo-row-icon">📷</span>
        <div>
          <div class="photo-row-ttl">写真でお題をつくる</div>
          <div class="photo-row-sub">撮った写真をAIが読み取るよ</div>
        </div>
        <span style="font-size:17px;color:rgba(10,147,150,0.4)">›</span>
      </div>

      ${rec.length > 0 ? `
        <div class="section-ttl" style="margin-top:12px">さいきんのたから</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${rec.map(r => `
            <div style="padding:6px 12px;border-radius:20px;background:var(--amber-pale);color:var(--amber);font-size:11px;font-weight:700;cursor:pointer"
                 onclick='App.replayOdai(${JSON.stringify(r.odai)})'>
              ${r.odai.emoji} ${r.odai.name}
            </div>`).join('')}
        </div>` : ''}
    </div>`;
}

// ── レンズ選択 ────────────────────────────
function renderLens() {
  return `
    <div class="content">
      <div style="margin-bottom:12px">
        <div class="odai-pill">
          <span class="odai-pill-emoji">${S.odai.emoji}</span>
          <span class="odai-pill-name">${S.odai.name}</span>
        </div>
      </div>
      <div class="lens-hint">どのレンズで見てみる？<br>1つだけ選んでね</div>
      <div class="lens-grid">
        ${LENSES.map(l => `
          <div class="lens-card ${l.cls} ${S.lens === l.id ? 'selected' : ''}"
               onclick="App.selectLens('${l.id}')">
            <span class="lens-icon">${l.icon}</span>
            <div class="lens-info">
              <div class="lens-name">${l.name}</div>
              <div class="lens-desc">${l.desc}</div>
            </div>
          </div>`).join('')}
      </div>
      <button class="btn-dark" onclick="App.startChat()" ${!S.lens ? 'disabled' : ''}>
        ${!S.lens ? 'レンズをえらんでね' : `${LENSES.find(l=>l.id===S.lens)?.icon} ${S.lens}レンズではじめる ›`}
      </button>
      <button class="btn-secondary" onclick="App.closeChatFlow()">← お題にもどる</button>
    </div>`;
}

// ── チャット ──────────────────────────────
function renderChat() {
  const u = S.user;
  return `
    <div class="chat-wrap">
      <div class="speaker-row">
        <div class="speaker-btn ${S.speaker === 'child'  ? 'active-child'  : ''}"
             onclick="App.setSpeaker('child')">👦 ${u.name || 'こども'}</div>
        <div class="speaker-btn ${S.speaker === 'parent' ? 'active-parent' : ''}"
             onclick="App.setSpeaker('parent')">👨 ${u.parentName}</div>
      </div>
      <div class="chat-area" id="chat-area">
        ${S.messages.map(renderBubble).join('')}
        ${S.isLoading ? `
          <div class="bubble-ai">
            <div class="ai-avatar">🔍</div>
            <div class="bubble-ai-text">
              <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
          </div>` : ''}
      </div>
      <div class="chat-input-row">
        <input class="chat-input" id="chat-in"
          placeholder="${S.speaker === 'child' ? 'かんがえてみよう…' : u.parentName + 'も考えてみよう…'}"
          ${S.isLoading ? 'disabled' : ''}>
        <button class="mic-btn" title="音声入力">🎤</button>
        <button class="chat-send" id="chat-send" onclick="App.sendChat()"
          ${S.isLoading ? 'disabled' : ''}>➤</button>
      </div>
      ${S.messages.filter(m=>m.role!=='ai').length >= 3
        ? `<button class="finish-btn" onclick="App.goSummary()">きょうのたからをまとめる ✨</button>`
        : ''}
    </div>`;
}

function renderBubble(m) {
  if (m.role === 'ai') return `
    <div class="bubble-ai">
      <div class="ai-avatar">🔍</div>
      <div class="bubble-ai-text">${m.text.replace(/\n/g,'<br>')}</div>
    </div>`;
  if (m.role === 'child') return `
    <div class="bubble-child"><div class="bubble-child-text">${m.text}</div></div>`;
  return `
    <div class="bubble-parent-wrap">
      <div class="bubble-parent-who">${S.user.parentName}</div>
      <div style="display:flex;justify-content:flex-end">
        <div class="bubble-parent-text">${m.text}</div>
      </div>
    </div>`;
}

// ── サマリー ──────────────────────────────
function renderSummary() {
  const items = S.summaryItems;
  const paras = S.summaryOpinion.split(/\n/).filter(Boolean);
  const colors = ['#e8860a','#0a9396','#e76f51','#52b788','#9b89c4','#ffd166'];

  return `
    <div class="content">
      <div class="summary-hero">
        <span class="summary-hero-emoji">${S.odai?.emoji || '🔍'}</span>
        <div class="summary-hero-ttl">たからみつかった！</div>
      </div>

      <div class="findings-card">
        <button class="bookmark-btn ${S.bookmarked ? 'active' : ''}"
                onclick="App.toggleBookmark()">🔖</button>
        <div class="findings-label">✨ きょうみつけたたから</div>
        ${items.length === 0
          ? `<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(45,27,0,0.4)">
               <span class="spinner"></span>まとめているよ…
             </div>`
          : items.map((f,i) => `
              <div class="finding-item">
                <div class="finding-dot" style="background:${colors[i % colors.length]}"></div>
                <div class="finding-text">${f}</div>
              </div>`).join('')}
      </div>

      ${S.showOpinion ? `
        <div class="ai-opinion-card">
          <div class="ai-opinion-toggle" onclick="App.toggleOpinion()">
            <div class="ai-opinion-label">💡 AIのかんがえ</div>
            <div class="ai-opinion-chevron ${S.opinionOpen ? 'open' : ''}">▾</div>
          </div>
          ${S.opinionOpen && paras.length > 0 ? `
            <div class="ai-opinion-body">
              ${paras.map(p => `<div class="ai-opinion-para">${p}</div>`).join('')}
            </div>` : ''}
        </div>` : ''}

      <div class="summary-actions">
        <button class="btn-again"     onclick="App.doAgain()">🔄 別のレンズで</button>
        <button class="btn-next-odai" onclick="App.nextOdai()">つぎのお題 ›</button>
      </div>
    </div>`;
}

// ── カレンダー ────────────────────────────
function renderCal() {
  const now   = new Date();
  const year  = S.calYear  ?? now.getFullYear();
  const month = S.calMonth ?? now.getMonth();
  const isThisMonth = (year === now.getFullYear() && month === now.getMonth());

  // その月にスタンプが押された日→記録のリスト
  const dayMap = {}; // { day: [record,...] }
  S.records.forEach(r => {
    const d = new Date(r.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(r);
    }
  });

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const monthName   = `${year}年${month+1}月`;
  const dows        = ['日','月','火','水','木','金','土'];

  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday   = isThisMonth && d === now.getDate();
    const isStamped = !!dayMap[d];
    const onclick   = isStamped ? `onclick="App.showDayTakara(${year},${month},${d})"` : '';
    cells += `
      <div class="cal-day ${isToday?'today':''} ${isStamped?'stamped':''}" ${onclick}>
        ${isStamped ? `<div class="cal-stamp">🔍</div>` : ''}
        <div style="font-size:${isStamped?'9':'11'}px;opacity:${isStamped?'.5':'1'}">${d}</div>
      </div>`;
  }

  return `
    <div class="content">
      <div class="cal-streak">
        <div>
          <div class="cal-streak-num">${S.streak}🔥</div>
          <div class="cal-streak-lbl">れんぞく日</div>
        </div>
        <div style="flex:1;font-size:11px;color:rgba(45,27,0,0.45);padding-left:8px;line-height:1.6">
          ${S.streak > 0 ? `${S.streak}日れんぞくでたからさがし中！` : 'きょうから始めよう！'}
        </div>
      </div>
      <div class="cal-header">
        <button class="cal-nav" onclick="App.calPrev()">‹</button>
        <div class="cal-month">${monthName}</div>
        <button class="cal-nav" onclick="App.calNext()">›</button>
      </div>
      <div class="cal-grid">
        ${dows.map((d,i) => `<div class="cal-dow ${i===0?'sun':i===6?'sat':''}">${d}</div>`).join('')}
        ${cells}
      </div>
      <div class="section-ttl">今月の発見 ${Object.keys(dayMap).length}日</div>
    </div>
    ${S.dayModal ? renderDayModal() : ''}`;
}

function renderDayModal() {
  const m = S.dayModal;
  const records = S.records.filter(r => {
    const d = new Date(r.date);
    return d.getFullYear()===m.year && d.getMonth()===m.month && d.getDate()===m.day;
  });
  return `
    <div class="modal-overlay" onclick="App.closeDayModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="App.closeDayModal()">✕</button>
        <div class="modal-ttl">${m.month+1}月${m.day}日のたから</div>
        ${records.map(r => renderTakaraCard(r, false)).join('')}
      </div>
    </div>`;
}

// ── たからばこ ────────────────────────────
function renderBox() {
  const recs = S.records.slice().reverse();
  const lensUsed = [...new Set(S.records.map(r=>r.lens).filter(Boolean))].length;
  return `
    <div class="content">
      <div class="stats-row">
        <div class="stat-box"><div class="stat-num">${S.records.length}</div><div class="stat-lbl">たから数</div></div>
        <div class="stat-box"><div class="stat-num">${S.streak}</div><div class="stat-lbl">れんぞく日</div></div>
        <div class="stat-box"><div class="stat-num">${lensUsed}</div><div class="stat-lbl">レンズ数</div></div>
      </div>
      ${recs.length === 0
        ? `<div class="empty-msg">📦<br>まだたからがないよ<br>さがしにいこう！</div>`
        : recs.map(r => renderTakaraCard(r, true)).join('')}
      <div class="section-ttl" style="margin-top:14px">バッジ</div>
      <div class="badge-grid">
        <div class="badge ${S.records.length>=1?'badge-on':'badge-off'}">🔍 はじめての発見</div>
        <div class="badge ${S.records.some(r=>r.lens==='かがく')?'badge-on':'badge-off'}">🔬 かがく探検家</div>
        <div class="badge ${S.streak>=3?'badge-on':'badge-off'}">📅 3日れんぞく</div>
        <div class="badge ${S.records.some(r=>r.lens==='じぶん')?'badge-on':'badge-off'}">💛 じぶん探検家</div>
        <div class="badge ${S.records.length>=10?'badge-on':'badge-off'}">⭐ 10こ発見</div>
      </div>
    </div>`;
}

// ── おきにいり ────────────────────────────
function renderFav() {
  const favs = S.records.filter(r=>r.bookmarked).slice().reverse();
  return `
    <div class="content">
      <div style="font-family:'Kaisei Decol',serif;font-size:16px;color:var(--deep);margin-bottom:14px">
        ⭐ おきにいりのたから
      </div>
      ${favs.length === 0
        ? `<div class="empty-msg">⭐<br>おきにいりがまだないよ<br>🔖を押してみよう！</div>`
        : favs.map(r => renderTakaraCard(r, true)).join('')}
    </div>`;
}

// ── たからカード（共通） ──────────────────
function renderTakaraCard(r, showFavBtn) {
  const lens   = LENSES.find(l=>l.id===r.lens);
  const colors = ['#e8860a','#0a9396','#e76f51','#52b788','#9b89c4','#ffd166'];
  const idx    = S.records.indexOf(r); // インデックスでfav切り替え
  return `
    <div class="takara-item">
      ${showFavBtn ? `
        <button class="takara-fav-btn ${r.bookmarked?'active':''}"
                onclick="App.toggleRecordFav(${S.records.lastIndexOf(r)})">🔖</button>` : ''}
      <div class="takara-item-header">
        <span class="takara-item-emoji">${r.odai.emoji}</span>
        <span class="takara-item-name">${r.odai.name}</span>
        ${lens ? `<span class="takara-item-lens">${lens.icon} ${lens.name}</span>` : ''}
      </div>
      <div class="takara-findings">
        ${(r.findings||[]).map((f,i)=>`
          <div class="takara-finding">
            <div class="finding-dot" style="background:${colors[i%colors.length]};width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px"></div>
            ${f}
          </div>`).join('')}
      </div>
      <div class="takara-item-date">${fmtDate(r.date)}</div>
    </div>`;
}

// ── せってい ──────────────────────────────
function renderSettings() {
  const u = S.user;
  return `
    <div class="content">
      <div class="settings-section">
        <div class="settings-ttl">こどもの情報</div>
        <div class="settings-field">
          <div class="settings-field-label">呼び方</div>
          <input class="form-input" id="s-name" value="${u.name}" placeholder="ニックネーム">
          <div class="form-error" id="s-name-err">名前を入力してください</div>
        </div>
        <div class="settings-field">
          <div class="settings-field-label">子どもタイプ</div>
          <div class="type-grid">${renderTypeCards(u.type)}</div>
        </div>
        <div class="settings-field">
          <div class="settings-field-label">好きなもの</div>
          <input class="form-input" id="s-likes" value="${u.likes}" placeholder="ポケモン・サッカーなど">
        </div>
        <div class="settings-field">
          <div class="settings-field-label">得意なこと</div>
          <input class="form-input" id="s-str" value="${u.strengths}">
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-ttl">いっしょにするひと</div>
        <div class="settings-field">
          <div class="settings-field-label">呼び方</div>
          <div class="parent-chips">${renderParentChips(u.parentName)}</div>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-ttl">表示設定</div>
        <div class="toggle-row">
          <div class="toggle-label">💡 AIのかんがえ を表示する</div>
          <div class="toggle-sw ${S.showOpinion?'on':''}" onclick="App.toggleShowOpinion()">
            <div class="toggle-knob"></div>
          </div>
        </div>
      </div>
      <button class="btn-primary" onclick="App.saveSettings()">保存する ✓</button>
    </div>`;
}

// ── ユーティリティ ────────────────────────
function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth()+1}月${d.getDate()}日`;
}
function pickRand() {
  return ODAI_ALL[Math.floor(Math.random() * ODAI_ALL.length)];
}
