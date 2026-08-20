/**
 * KÈO THI CỬ - APP CONTROLLER
 * Main Application Logic for GitHub Pages Static Site
 */

// Default App State
let betState = {
  examName: "Kỳ Thi Tốt Nghiệp & Đại Học 2026",
  scale: 10,
  p1: {
    name: "Nguyễn Văn A",
    avatar: "🎓",
    title: "Học Bá Bất Diệt",
    sbd: "2026-001",
    fate: "PASS",
    targetScore: 9.00,
    quote: "Tầm này 9+ trong tầm tay, bạn tuổi gì mà so!"
  },
  p2: {
    name: "Trần Thị B",
    avatar: "🚀",
    title: "Thánh Khoanh Lụi",
    sbd: "2026-002",
    fate: "PASS",
    targetScore: 8.75,
    quote: "Khoanh C hết vẫn đủ điểm đè bẹp bạn yêu nhé!"
  },
  handicap: "0",
  handicapLabel: "Kèo Đồng Banh (0 - 0)",
  overUnder: 16.5,
  penalty: "1 Chầu Buffet Nướng Lẩu Full Topping + 1 Ly Trà Sữa Size L",
  createdDate: new Date().toLocaleDateString('vi-VN') + ' - ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  hashTag: "#KEO-THICU-" + Math.floor(1000 + Math.random() * 9000)
};

// Cached outcome data for image export
let lastOutcomeData = null;

// UTF-8 Safe Base64 Encoding & Decoding for Vietnamese text
function utf8ToBase64(str) {
  return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
}

function base64ToUtf8(str) {
  return decodeURIComponent(Array.prototype.map.call(window.atob(str), (c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadStateFromUrlOrStorage();
  updateUI();
  setupEventListeners();
  spawnAmbientParticles();
});

// Load state from URL hash / query or fallback to LocalStorage
function loadStateFromUrlOrStorage() {
  const hash = window.location.hash;
  const urlParams = new URLSearchParams(window.location.search);
  const rawData = urlParams.get('data') || (hash.startsWith('#bet=') ? hash.replace('#bet=', '') : null);

  if (rawData) {
    try {
      const decoded = JSON.parse(base64ToUtf8(rawData));
      betState = { ...betState, ...decoded };
      showToast('Đã tải thành công dữ liệu kèo từ liên kết chia sẻ! 🎉', 'gold');
      return;
    } catch (e) {
      console.warn('Could not decode URL params', e);
    }
  }

  const saved = localStorage.getItem('EXAM_BET_STATE_2026');
  if (saved) {
    try {
      betState = { ...betState, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Could not load local storage', e);
    }
  }
}

// Save state to LocalStorage
function saveStateToStorage() {
  localStorage.setItem('EXAM_BET_STATE_2026', JSON.stringify(betState));
}

// Generate shareable link
function getShareableUrl() {
  const jsonStr = JSON.stringify(betState);
  const b64 = utf8ToBase64(jsonStr);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#bet=${b64}`;
}

// Get readable handicap text
function getHandicapText(code) {
  switch (code) {
    case 'P1_05': return `${betState.p1.name} chấp ${betState.p2.name} 0.5 điểm`;
    case 'P1_10': return `${betState.p1.name} chấp ${betState.p2.name} 1.0 điểm`;
    case 'P1_15': return `${betState.p1.name} chấp ${betState.p2.name} 1.5 điểm`;
    case 'P2_05': return `${betState.p2.name} chấp ${betState.p1.name} 0.5 điểm`;
    case 'P2_10': return `${betState.p2.name} chấp ${betState.p1.name} 1.0 điểm`;
    case 'P2_15': return `${betState.p2.name} chấp ${betState.p1.name} 1.5 điểm`;
    default: return 'Kèo Đồng Banh (0 - 0)';
  }
}

// Update all UI Components
function updateUI() {
  betState.handicapLabel = getHandicapText(betState.handicap);

  // 1. Arena View Elements
  document.getElementById('displayExamName').textContent = betState.examName;

  // Player 1
  document.getElementById('p1AvatarDisplay').textContent = betState.p1.avatar;
  document.getElementById('p1TitleDisplay').textContent = betState.p1.title;
  document.getElementById('p1NameDisplay').textContent = betState.p1.name;
  document.getElementById('p1QuoteDisplay').textContent = `"${betState.p1.quote}"`;
  document.getElementById('p1TargetScoreDisplay').textContent = Number(betState.p1.targetScore).toFixed(2) + ' đ';
  document.getElementById('p1SbdDisplay').textContent = betState.p1.sbd;

  const p1FateBadge = document.getElementById('p1FateBadge');
  if (betState.p1.fate === 'PASS') {
    p1FateBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> ĐẬU CHẮC';
    p1FateBadge.className = 'stat-value fate-badge';
  } else {
    p1FateBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> RỚT NỮA';
    p1FateBadge.className = 'stat-value fate-badge fail';
  }

  // Player 2
  document.getElementById('p2AvatarDisplay').textContent = betState.p2.avatar;
  document.getElementById('p2TitleDisplay').textContent = betState.p2.title;
  document.getElementById('p2NameDisplay').textContent = betState.p2.name;
  document.getElementById('p2QuoteDisplay').textContent = `"${betState.p2.quote}"`;
  document.getElementById('p2TargetScoreDisplay').textContent = Number(betState.p2.targetScore).toFixed(2) + ' đ';
  document.getElementById('p2SbdDisplay').textContent = betState.p2.sbd;

  const p2FateBadge = document.getElementById('p2FateBadge');
  if (betState.p2.fate === 'PASS') {
    p2FateBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> ĐẬU CHẮC';
    p2FateBadge.className = 'stat-value fate-badge';
  } else {
    p2FateBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> RỚT NỮA';
    p2FateBadge.className = 'stat-value fate-badge fail';
  }

  // Handicap & Balance Gauge
  document.getElementById('handicapTextDisplay').textContent = betState.handicapLabel;
  document.getElementById('overUnderDisplay').textContent = `Tài/Xỉu: ${betState.overUnder} điểm`;
  document.getElementById('gaugeP1Name').textContent = betState.p1.name;
  document.getElementById('gaugeP2Name').textContent = betState.p2.name;

  // Calculate Power Gauge width based on target scores & handicap
  const s1 = parseFloat(betState.p1.targetScore) || 5;
  const s2 = parseFloat(betState.p2.targetScore) || 5;
  const totalScore = s1 + s2;
  const p1Percent = totalScore > 0 ? Math.round((s1 / totalScore) * 100) : 50;
  const p2Percent = 100 - p1Percent;

  document.getElementById('gaugeBarP1').style.width = p1Percent + '%';
  document.getElementById('gaugeBarP2').style.width = p2Percent + '%';
  document.getElementById('gaugeP1Percent').textContent = p1Percent + '%';
  document.getElementById('gaugeP2Percent').textContent = p2Percent + '%';

  // Stakes
  document.getElementById('stakesDisplay').innerHTML = `<i class="fa-solid fa-utensils"></i> ${betState.penalty}`;

  // 2. Contract View Elements
  document.getElementById('cExamName').textContent = betState.examName;
  document.getElementById('contractDateDisplay').textContent = betState.createdDate;
  document.getElementById('contractHashTag').textContent = betState.hashTag;

  document.getElementById('cParty1Name').textContent = betState.p1.name;
  document.getElementById('cParty1Title').textContent = betState.p1.title;
  document.getElementById('cParty1Fate').textContent = betState.p1.fate === 'PASS' ? 'ĐẬU CHẮC' : 'RỚT NỮA';
  document.getElementById('cParty1Score').textContent = Number(betState.p1.targetScore).toFixed(2) + ' đ';
  document.getElementById('cParty1Quote').textContent = betState.p1.quote;
  document.getElementById('cSignA').textContent = betState.p1.name;

  document.getElementById('cParty2Name').textContent = betState.p2.name;
  document.getElementById('cParty2Title').textContent = betState.p2.title;
  document.getElementById('cParty2Fate').textContent = betState.p2.fate === 'PASS' ? 'ĐẬU CHẮC' : 'RỚT NỮA';
  document.getElementById('cParty2Score').textContent = Number(betState.p2.targetScore).toFixed(2) + ' đ';
  document.getElementById('cParty2Quote').textContent = betState.p2.quote;
  document.getElementById('cSignB').textContent = betState.p2.name;

  document.getElementById('cHandicapInfo').textContent = betState.handicapLabel;
  document.getElementById('cOverUnderInfo').textContent = `${betState.overUnder} điểm`;
  document.getElementById('cPenaltyText').textContent = betState.penalty;

  // 3. Result View Inputs hints
  document.getElementById('resP1Avatar').textContent = betState.p1.avatar;
  document.getElementById('resP1Name').textContent = betState.p1.name;
  document.getElementById('resP1TargetHint').textContent = `${betState.p1.fate === 'PASS' ? 'Đậu' : 'Rớt'} (${Number(betState.p1.targetScore).toFixed(2)} đ)`;

  document.getElementById('resP2Avatar').textContent = betState.p2.avatar;
  document.getElementById('resP2Name').textContent = betState.p2.name;
  document.getElementById('resP2TargetHint').textContent = `${betState.p2.fate === 'PASS' ? 'Đậu' : 'Rớt'} (${Number(betState.p2.targetScore).toFixed(2)} đ)`;
}

// Populate Modal Form with State
function fillModalForm() {
  document.getElementById('inputExamName').value = betState.examName;
  document.getElementById('inputExamType').value = betState.scale;

  // P1
  document.getElementById('inputP1Name').value = betState.p1.name;
  document.getElementById('inputP1Title').value = betState.p1.title;
  document.getElementById('inputP1Sbd').value = betState.p1.sbd;
  document.getElementById('inputP1Fate').value = betState.p1.fate;
  document.getElementById('inputP1TargetScore').value = betState.p1.targetScore;
  document.getElementById('inputP1Quote').value = betState.p1.quote;

  // P2
  document.getElementById('inputP2Name').value = betState.p2.name;
  document.getElementById('inputP2Title').value = betState.p2.title;
  document.getElementById('inputP2Sbd').value = betState.p2.sbd;
  document.getElementById('inputP2Fate').value = betState.p2.fate;
  document.getElementById('inputP2TargetScore').value = betState.p2.targetScore;
  document.getElementById('inputP2Quote').value = betState.p2.quote;

  // Handicap & Penalty
  document.getElementById('inputHandicapType').value = betState.handicap;
  document.getElementById('inputOverUnder').value = betState.overUnder;
  document.getElementById('inputCustomPenalty').value = betState.penalty;

  // Select Avatar Chips
  document.querySelectorAll('#p1AvatarChips .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.val === betState.p1.avatar);
  });
  document.querySelectorAll('#p2AvatarChips .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.val === betState.p2.avatar);
  });
}

// Save Modal Form back to State
function saveModalForm() {
  betState.examName = document.getElementById('inputExamName').value.trim() || 'Kỳ Thi 2026';
  betState.scale = parseInt(document.getElementById('inputExamType').value) || 10;

  // Avatar chips active
  const p1Chip = document.querySelector('#p1AvatarChips .chip.active');
  const p2Chip = document.querySelector('#p2AvatarChips .chip.active');

  betState.p1 = {
    name: document.getElementById('inputP1Name').value.trim() || 'Đấu Thủ A',
    avatar: p1Chip ? p1Chip.dataset.val : '🎓',
    title: document.getElementById('inputP1Title').value.trim() || 'Học Bá',
    sbd: document.getElementById('inputP1Sbd').value.trim() || '2026-001',
    fate: document.getElementById('inputP1Fate').value,
    targetScore: parseFloat(document.getElementById('inputP1TargetScore').value) || 8.0,
    quote: document.getElementById('inputP1Quote').value.trim() || 'Tự tin đỗ đầu!'
  };

  betState.p2 = {
    name: document.getElementById('inputP2Name').value.trim() || 'Đấu Thủ B',
    avatar: p2Chip ? p2Chip.dataset.val : '🚀',
    title: document.getElementById('inputP2Title').value.trim() || 'Chiến Thần',
    sbd: document.getElementById('inputP2Sbd').value.trim() || '2026-002',
    fate: document.getElementById('inputP2Fate').value,
    targetScore: parseFloat(document.getElementById('inputP2TargetScore').value) || 8.0,
    quote: document.getElementById('inputP2Quote').value.trim() || 'Không ngán đối thủ nào!'
  };

  betState.handicap = document.getElementById('inputHandicapType').value;
  betState.overUnder = parseFloat(document.getElementById('inputOverUnder').value) || 16.0;
  betState.penalty = document.getElementById('inputCustomPenalty').value.trim() || '1 Chầu Ăn Uống Hoành Tráng';

  saveStateToStorage();
  updateUI();
  closeModal('betModalOverlay');
  soundEngine.playGavel();
  showToast('Đã chốt cập nhật kèo thành công! ⚡', 'gold');

  // Trigger stamp animation in contract view
  const stamp = document.getElementById('stampVerified');
  if (stamp) {
    stamp.classList.remove('pulse-stamp');
    void stamp.offsetWidth; // Reflow
    stamp.classList.add('pulse-stamp');
  }
}

// Calculate Bet Outcome & Reveal Winner
function calculateVerdict() {
  soundEngine.playClick();

  const realP1Fate = document.querySelector('input[name="resP1Fate"]:checked').value;
  const realP2Fate = document.querySelector('input[name="resP2Fate"]:checked').value;

  const realP1Score = parseFloat(document.getElementById('resP1ScoreInput').value) || 0;
  const realP2Score = parseFloat(document.getElementById('resP2ScoreInput').value) || 0;

  // 1. Handicap Adjustment
  let adjP1Score = realP1Score;
  let adjP2Score = realP2Score;

  if (betState.handicap === 'P1_05') adjP1Score -= 0.5;
  else if (betState.handicap === 'P1_10') adjP1Score -= 1.0;
  else if (betState.handicap === 'P1_15') adjP1Score -= 1.5;
  else if (betState.handicap === 'P2_05') adjP2Score -= 0.5;
  else if (betState.handicap === 'P2_10') adjP2Score -= 1.0;
  else if (betState.handicap === 'P2_15') adjP2Score -= 1.5;

  // 2. Pass / Fail Evaluation
  const p1FateSuccess = realP1Fate === betState.p1.fate;
  const p2FateSuccess = realP2Fate === betState.p2.fate;

  // 3. Points calculation (Pass = +2 points, Higher adjusted score = +3 points)
  let p1Points = 0;
  let p2Points = 0;

  if (p1FateSuccess) p1Points += 2;
  if (p2FateSuccess) p2Points += 2;

  if (adjP1Score > adjP2Score) p1Points += 3;
  else if (adjP2Score > adjP1Score) p2Points += 3;
  else {
    p1Points += 1;
    p2Points += 1;
  }

  // 4. Over / Under Evaluation
  const totalRealScore = realP1Score + realP2Score;
  const isOver = totalRealScore > betState.overUnder;
  const ouText = isOver 
    ? `Tổng: ${totalRealScore.toFixed(2)}đ -> NỔ TÀI (> ${betState.overUnder})`
    : `Tổng: ${totalRealScore.toFixed(2)}đ -> VỀ XỈU (<= ${betState.overUnder})`;

  // 5. Determine Overall Winner
  let winner = null;
  let loser = null;
  let isTie = false;

  if (p1Points > p2Points) {
    winner = betState.p1.name;
    loser = betState.p2.name;
  } else if (p2Points > p1Points) {
    winner = betState.p2.name;
    loser = betState.p1.name;
  } else {
    isTie = true;
  }

  // Summary strings
  const headlineText = isTie ? 'KÈO BẤT PHÂN THẮNG BẠI (HÒA KÈO)!' : `👑 ${winner.toUpperCase()} THẮNG TOÀN DIỆN!`;
  const subText = isTie 
    ? 'Hai bên ngang tài ngang sức, cùng chia sẻ tiền phạt hoặc dắt nhau đi ăn chung!'
    : `${loser} đã thua kèo và bắt buộc phải thực hiện nghĩa vụ chung kèo!`;

  const fateSummaryText = `${betState.p1.name}: ${realP1Fate === 'PASS' ? 'ĐẬU ✅' : 'RỚT ❌'} | ${betState.p2.name}: ${realP2Fate === 'PASS' ? 'ĐẬU ✅' : 'RỚT ❌'}`;
  const scoreSummaryText = `Điểm thực tế: ${realP1Score.toFixed(2)} vs ${realP2Score.toFixed(2)} (Sau chấp: ${adjP1Score.toFixed(2)} vs ${adjP2Score.toFixed(2)})`;
  const penaltySummaryText = isTie 
    ? `Cả 2 cùng cưa đôi hóa đơn: ${betState.penalty}`
    : `${loser} phải bao ngay: ${betState.penalty}`;

  lastOutcomeData = {
    headline: headlineText,
    sub: subText,
    fateText: fateSummaryText,
    scoreText: scoreSummaryText,
    ouText: ouText,
    penaltyText: penaltySummaryText
  };

  // Populate Outcome Dashboard
  const dashboard = document.getElementById('outcomeDashboard');
  dashboard.style.display = 'block';

  document.getElementById('verdictHeadline').textContent = headlineText;
  document.getElementById('verdictSub').textContent = subText;
  document.getElementById('fateResultSummary').textContent = fateSummaryText;
  document.getElementById('scoreResultSummary').textContent = scoreSummaryText;
  document.getElementById('overUnderResultSummary').textContent = ouText;

  if (isTie) {
    document.getElementById('penaltyClaimSummary').innerHTML = `Cả 2 cùng cưa đôi hóa đơn: <b>${betState.penalty}</b>`;
  } else {
    document.getElementById('penaltyClaimSummary').innerHTML = `<b class="loser-name">${loser}</b> phải chung ngay: <b>${betState.penalty}</b>`;
  }

  soundEngine.playVictory();

  // Confetti Blast!
  if (confettiEngine) {
    confettiEngine.launch(4500);
  }

  // Scroll smoothly to result
  dashboard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Stepper score adjust
function stepScore(inputId, delta) {
  soundEngine.playClick();
  const input = document.getElementById(inputId);
  if (!input) return;
  let val = parseFloat(input.value) || 0;
  val = Math.max(0, Math.min(10, Math.round((val + delta) * 100) / 100));
  input.value = val.toFixed(2);
}

// Switch Tabs
function switchTab(tabId) {
  soundEngine.playClick();
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

// Modal open/close
function openEditModal(playerNum = null) {
  soundEngine.playClick();
  fillModalForm();
  document.getElementById('betModalOverlay').classList.add('active');
}

function closeModal(modalId) {
  soundEngine.playClick();
  document.getElementById(modalId).classList.remove('active');
}

// Toast notification helper
function showToast(message, type = 'cyan') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'gold' ? 'toast-gold' : ''}`;
  toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Setup Event Listeners
function setupEventListeners() {
  // Tab switching
  document.getElementById('tabBetView').addEventListener('click', () => switchTab('bet-view'));
  document.getElementById('tabContractView').addEventListener('click', () => switchTab('contract-view'));
  document.getElementById('tabResultView').addEventListener('click', () => switchTab('result-view'));

  // Header buttons
  document.getElementById('newBetTopBtn').addEventListener('click', () => openEditModal());
  document.getElementById('quickHelpBtn').addEventListener('click', () => {
    soundEngine.playClick();
    document.getElementById('helpModalOverlay').classList.add('active');
  });

  // Sound toggle
  const soundBtn = document.getElementById('soundToggleBtn');
  soundBtn.addEventListener('click', () => {
    const isMuted = soundEngine.toggleMute();
    soundBtn.innerHTML = isMuted 
      ? '<i class="fa-solid fa-volume-xmark"></i>' 
      : '<i class="fa-solid fa-volume-high"></i>';
    showToast(isMuted ? 'Đã tắt âm thanh' : 'Đã bật âm thanh');
  });

  // Arena action bar buttons
  document.getElementById('quickEditBetBtn').addEventListener('click', () => openEditModal());
  document.getElementById('viewContractBtn').addEventListener('click', () => switchTab('contract-view'));
  document.getElementById('openResultBtn').addEventListener('click', () => switchTab('result-view'));

  // Copy share link
  document.getElementById('shareLinkBtn').addEventListener('click', () => {
    soundEngine.playClick();
    const url = getShareableUrl();
    navigator.clipboard.writeText(url).then(() => {
      showToast('Đã sao chép liên kết chia sẻ kèo vào Clipboard! 🔗', 'gold');
    }).catch(() => {
      prompt('Sao chép đường link này để gửi cho bạn bè:', url);
    });
  });

  // Export Contract image
  document.getElementById('exportImageBtn').addEventListener('click', () => {
    soundEngine.playClick();
    ProofCardExporter.exportContract(betState);
    showToast('Đang tải ảnh chứng nhận kèo về máy! 📸', 'gold');
  });

  // Copy Contract Text
  document.getElementById('copyContractTextBtn').addEventListener('click', () => {
    soundEngine.playClick();
    const text = `📜 BIÊN BẢN GIAO KÈO: ${betState.examName}\n` +
      `👤 Bên A: ${betState.p1.name} (${betState.p1.title}) - Kèo: ${betState.p1.fate} (${betState.p1.targetScore}đ)\n` +
      `👤 Bên B: ${betState.p2.name} (${betState.p2.title}) - Kèo: ${betState.p2.fate} (${betState.p2.targetScore}đ)\n` +
      `⚖️ Thể lệ: ${betState.handicapLabel} | Tài/Xỉu: ${betState.overUnder}đ\n` +
      `🍲 Hình phạt: ${betState.penalty}\n` +
      `👉 Xem chi tiết tại: ${getShareableUrl()}`;
    
    navigator.clipboard.writeText(text).then(() => {
      showToast('Đã sao chép nội dung biên bản! 📋');
    });
  });

  // Verdict calculation
  document.getElementById('calculateResultBtn').addEventListener('click', calculateVerdict);
  document.getElementById('replaySoundBtn').addEventListener('click', () => {
    soundEngine.playVictory();
    if (confettiEngine) confettiEngine.launch(3000);
  });
  document.getElementById('exportVictoryCardBtn').addEventListener('click', () => {
    if (lastOutcomeData) {
      ProofCardExporter.exportVictoryResult(betState, lastOutcomeData);
    } else {
      ProofCardExporter.exportContract(betState);
    }
    showToast('Đã xuất hình ảnh kết quả thắng thua! 🏆', 'gold');
  });

  // Save Bet Modal
  document.getElementById('saveBetConfigBtn').addEventListener('click', saveModalForm);

  // Avatar chips selection
  document.querySelectorAll('#p1AvatarChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      soundEngine.playClick();
      document.querySelectorAll('#p1AvatarChips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  document.querySelectorAll('#p2AvatarChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      soundEngine.playClick();
      document.querySelectorAll('#p2AvatarChips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Penalty Preset Chips
  document.querySelectorAll('#penaltyChips .p-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      soundEngine.playClick();
      document.getElementById('inputCustomPenalty').value = chip.dataset.text;
    });
  });
}

// Background Floating Ambient Sparkles
function spawnAmbientParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'floating-sparkle';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.top = Math.random() * 100 + 'vh';
    sparkle.style.animationDelay = (Math.random() * 5) + 's';
    sparkle.style.animationDuration = (3 + Math.random() * 4) + 's';
    sparkle.style.background = Math.random() > 0.5 ? '#00f2fe' : '#ff007f';
    sparkle.style.boxShadow = `0 0 10px ${sparkle.style.background}`;
    container.appendChild(sparkle);
  }
}
