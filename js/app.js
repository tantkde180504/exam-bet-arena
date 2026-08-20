/**
 * KÈO THI CỬ - APP CONTROLLER
 * Main Application Logic for GitHub Pages Static Site
 * Updated with KÈO CHẴN / KÈO LẺ / KÈO TỈ SỐ
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
    betType: "EVEN", // EVEN = Kèo Chẵn (Cùng đậu hoặc cùng rớt) | ODD = Kèo Lẻ (1 người đậu)
    targetScore: 9.00,
    quote: "Tầm này 9+ trong tầm tay, bạn tuổi gì mà so!"
  },
  p2: {
    name: "Trần Thị B",
    avatar: "🚀",
    title: "Thánh Khoanh Lụi",
    sbd: "2026-002",
    betType: "ODD",  // ODD = Kèo Lẻ
    targetScore: 8.75,
    quote: "Khoanh C hết vẫn đủ điểm đè bẹp bạn yêu nhé!"
  },
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

  const saved = localStorage.getItem('EXAM_BET_STATE_2026_V2');
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
  localStorage.setItem('EXAM_BET_STATE_2026_V2', JSON.stringify(betState));
}

// Generate shareable link
function getShareableUrl() {
  const jsonStr = JSON.stringify(betState);
  const b64 = utf8ToBase64(jsonStr);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#bet=${b64}`;
}

// Update all UI Components
function updateUI() {
  // 1. Arena View Elements
  document.getElementById('displayExamName').textContent = betState.examName;

  // Player 1
  document.getElementById('p1AvatarDisplay').textContent = betState.p1.avatar;
  document.getElementById('p1TitleDisplay').textContent = betState.p1.title;
  document.getElementById('p1NameDisplay').textContent = betState.p1.name;
  document.getElementById('p1QuoteDisplay').textContent = `"${betState.p1.quote}"`;
  document.getElementById('p1TargetScoreDisplay').textContent = Number(betState.p1.targetScore).toFixed(2) + ' đ';
  document.getElementById('p1SbdDisplay').textContent = betState.p1.sbd;

  const p1BetTypeDisplay = document.getElementById('p1BetTypeDisplay');
  if (betState.p1.betType === 'EVEN') {
    p1BetTypeDisplay.innerHTML = '<span class="badge-even"><i class="fa-solid fa-equals"></i> BẮT CHẴN</span>';
  } else {
    p1BetTypeDisplay.innerHTML = '<span class="badge-odd"><i class="fa-solid fa-shuffle"></i> BẮT LẺ</span>';
  }

  // Player 2
  document.getElementById('p2AvatarDisplay').textContent = betState.p2.avatar;
  document.getElementById('p2TitleDisplay').textContent = betState.p2.title;
  document.getElementById('p2NameDisplay').textContent = betState.p2.name;
  document.getElementById('p2QuoteDisplay').textContent = `"${betState.p2.quote}"`;
  document.getElementById('p2TargetScoreDisplay').textContent = Number(betState.p2.targetScore).toFixed(2) + ' đ';
  document.getElementById('p2SbdDisplay').textContent = betState.p2.sbd;

  const p2BetTypeDisplay = document.getElementById('p2BetTypeDisplay');
  if (betState.p2.betType === 'EVEN') {
    p2BetTypeDisplay.innerHTML = '<span class="badge-even"><i class="fa-solid fa-equals"></i> BẮT CHẴN</span>';
  } else {
    p2BetTypeDisplay.innerHTML = '<span class="badge-odd"><i class="fa-solid fa-shuffle"></i> BẮT LẺ</span>';
  }

  // Center Column Matchup Overview
  const p1PickStr = betState.p1.betType === 'EVEN' ? 'Chẵn' : 'Lẻ';
  const p2PickStr = betState.p2.betType === 'EVEN' ? 'Chẵn' : 'Lẻ';
  document.getElementById('p1EvenOddShort').textContent = `${betState.p1.name} Bắt ${p1PickStr}`;
  document.getElementById('p2EvenOddShort').textContent = `${betState.p2.name} Bắt ${p2PickStr}`;

  document.getElementById('gaugeP1Name').textContent = betState.p1.name;
  document.getElementById('gaugeP2Name').textContent = betState.p2.name;
  document.getElementById('gaugeP1Score').textContent = Number(betState.p1.targetScore).toFixed(2) + ' đ';
  document.getElementById('gaugeP2Score').textContent = Number(betState.p2.targetScore).toFixed(2) + ' đ';

  // Power Gauge based on predicted scores
  const s1 = parseFloat(betState.p1.targetScore) || 5;
  const s2 = parseFloat(betState.p2.targetScore) || 5;
  const total = s1 + s2;
  const p1Width = total > 0 ? Math.round((s1 / total) * 100) : 50;
  const p2Width = 100 - p1Width;
  document.getElementById('gaugeBarP1').style.width = p1Width + '%';
  document.getElementById('gaugeBarP2').style.width = p2Width + '%';

  // Stakes
  document.getElementById('stakesDisplay').innerHTML = `<i class="fa-solid fa-utensils"></i> ${betState.penalty}`;

  // 2. Contract View Elements
  document.getElementById('cExamName').textContent = betState.examName;
  document.getElementById('contractDateDisplay').textContent = betState.createdDate;
  document.getElementById('contractHashTag').textContent = betState.hashTag;

  document.getElementById('cParty1Name').textContent = betState.p1.name;
  document.getElementById('cParty1Title').textContent = betState.p1.title;
  document.getElementById('cParty1Fate').textContent = betState.p1.betType === 'EVEN' ? 'BẮT KÈO CHẴN' : 'BẮT KÈO LẺ';
  document.getElementById('cParty1Score').textContent = Number(betState.p1.targetScore).toFixed(2) + ' đ';
  document.getElementById('cParty1Quote').textContent = betState.p1.quote;
  document.getElementById('cSignA').textContent = betState.p1.name;

  document.getElementById('cParty2Name').textContent = betState.p2.name;
  document.getElementById('cParty2Title').textContent = betState.p2.title;
  document.getElementById('cParty2Fate').textContent = betState.p2.betType === 'EVEN' ? 'BẮT KÈO CHẴN' : 'BẮT KÈO LẺ';
  document.getElementById('cParty2Score').textContent = Number(betState.p2.targetScore).toFixed(2) + ' đ';
  document.getElementById('cParty2Quote').textContent = betState.p2.quote;
  document.getElementById('cSignB').textContent = betState.p2.name;

  document.getElementById('cPenaltyText').textContent = betState.penalty;

  // 3. Result View Inputs hints
  document.getElementById('resP1Avatar').textContent = betState.p1.avatar;
  document.getElementById('resP1Name').textContent = betState.p1.name;
  document.getElementById('resP1TargetHint').textContent = `Bắt ${p1PickStr} - Đoán: ${Number(betState.p1.targetScore).toFixed(2)} đ`;

  document.getElementById('resP2Avatar').textContent = betState.p2.avatar;
  document.getElementById('resP2Name').textContent = betState.p2.name;
  document.getElementById('resP2TargetHint').textContent = `Bắt ${p2PickStr} - Đoán: ${Number(betState.p2.targetScore).toFixed(2)} đ`;
}

// Populate Modal Form with State
function fillModalForm() {
  document.getElementById('inputExamName').value = betState.examName;
  document.getElementById('inputExamType').value = betState.scale;

  // P1
  document.getElementById('inputP1Name').value = betState.p1.name;
  document.getElementById('inputP1Title').value = betState.p1.title;
  document.getElementById('inputP1Sbd').value = betState.p1.sbd;
  document.getElementById('inputP1BetType').value = betState.p1.betType;
  document.getElementById('inputP1TargetScore').value = betState.p1.targetScore;
  document.getElementById('inputP1Quote').value = betState.p1.quote;

  // P2
  document.getElementById('inputP2Name').value = betState.p2.name;
  document.getElementById('inputP2Title').value = betState.p2.title;
  document.getElementById('inputP2Sbd').value = betState.p2.sbd;
  document.getElementById('inputP2BetType').value = betState.p2.betType;
  document.getElementById('inputP2TargetScore').value = betState.p2.targetScore;
  document.getElementById('inputP2Quote').value = betState.p2.quote;

  // Penalty
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
    betType: document.getElementById('inputP1BetType').value,
    targetScore: parseFloat(document.getElementById('inputP1TargetScore').value) || 8.0,
    quote: document.getElementById('inputP1Quote').value.trim() || 'Tự tin đỗ đầu!'
  };

  betState.p2 = {
    name: document.getElementById('inputP2Name').value.trim() || 'Đấu Thủ B',
    avatar: p2Chip ? p2Chip.dataset.val : '🚀',
    title: document.getElementById('inputP2Title').value.trim() || 'Chiến Thần',
    sbd: document.getElementById('inputP2Sbd').value.trim() || '2026-002',
    betType: document.getElementById('inputP2BetType').value,
    targetScore: parseFloat(document.getElementById('inputP2TargetScore').value) || 8.0,
    quote: document.getElementById('inputP2Quote').value.trim() || 'Không ngán đối thủ nào!'
  };

  betState.penalty = document.getElementById('inputCustomPenalty').value.trim() || '1 Chầu Ăn Uống Hoành Tráng';

  saveStateToStorage();
  updateUI();
  closeModal('betModalOverlay');
  soundEngine.playGavel();
  showToast('Đã chốt kèo Chẵn/Lẻ & Tỉ Số thành công! ⚡', 'gold');

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

  // 1. Determine Actual Even / Odd Outcome
  // EVEN = Cả 2 cùng PASS (Pass - Pass) hoặc Cả 2 cùng FAIL (Fail - Fail)
  // ODD = 1 người PASS, 1 người FAIL
  const isActualEven = (realP1Fate === realP2Fate);
  const actualOutcomeType = isActualEven ? 'EVEN' : 'ODD';
  const actualOutcomeLabel = isActualEven 
    ? `CHẴN (${realP1Fate === 'PASS' ? 'Cả 2 cùng ĐẬU 🎓' : 'Cả 2 cùng RỚT 😭'})`
    : 'LẺ (1 người Đậu, 1 người Rớt ⚡)';

  // Who won the Even/Odd Bet?
  const p1WonEvenOdd = (betState.p1.betType === actualOutcomeType);
  const p2WonEvenOdd = (betState.p2.betType === actualOutcomeType);

  let evenOddSummaryText = `Kết quả thi ra: ${actualOutcomeLabel}. `;
  if (p1WonEvenOdd && !p2WonEvenOdd) {
    evenOddSummaryText += `👉 ${betState.p1.name} THẮNG KÈO SỐ PHẬN!`;
  } else if (!p1WonEvenOdd && p2WonEvenOdd) {
    evenOddSummaryText += `👉 ${betState.p2.name} THẮNG KÈO SỐ PHẬN!`;
  } else if (p1WonEvenOdd && p2WonEvenOdd) {
    evenOddSummaryText += `👉 Cả 2 cùng bắt đúng ${actualOutcomeLabel}!`;
  } else {
    evenOddSummaryText += '👉 Cả 2 cùng bắt sai kèo số phận!';
  }

  // 2. Score Accuracy Bet (Kèo Tỉ Số)
  const targetA = parseFloat(betState.p1.targetScore) || 0;
  const targetB = parseFloat(betState.p2.targetScore) || 0;

  const diffA = Math.abs(realP1Score - targetA);
  const diffB = Math.abs(realP2Score - targetB);

  const p1Exact = diffA < 0.01;
  const p2Exact = diffB < 0.01;

  let scoreSummaryP1 = `Đoán: ${targetA.toFixed(2)}đ | Thật: ${realP1Score.toFixed(2)}đ `;
  scoreSummaryP1 += p1Exact ? '(🎯 CHÍNH XÁC TUYỆT ĐỐI)' : `(Lệch ${diffA.toFixed(2)}đ)`;

  let scoreSummaryP2 = `Đoán: ${targetB.toFixed(2)}đ | Thật: ${realP2Score.toFixed(2)}đ `;
  scoreSummaryP2 += p2Exact ? '(🎯 CHÍNH XÁC TUYỆT ĐỐI)' : `(Lệch ${diffB.toFixed(2)}đ)`;

  // 3. Points Awarding System
  // Even/Odd Bet Win: +3 points
  // Exact Score Match: +3 points, or closer score prediction: +1 point
  let p1Points = 0;
  let p2Points = 0;

  if (p1WonEvenOdd) p1Points += 3;
  if (p2WonEvenOdd) p2Points += 3;

  if (p1Exact) p1Points += 3;
  if (p2Exact) p2Points += 3;

  if (diffA < diffB) p1Points += 1;
  else if (diffB < diffA) p2Points += 1;

  // 4. Overall Winner & Loser
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

  const headlineText = isTie ? 'KÈO BẤT PHÂN THẮNG BẠI (HÒA KÈO)!' : `👑 ${winner.toUpperCase()} CHIẾN THẮNG TOÀN DIỆN!`;
  const subText = isTie 
    ? 'Hai bên hòa điểm kèo, cùng vui vẻ chia đôi hóa đơn hoặc đi quẩy chung!'
    : `${loser} đã thua kèo và bắt buộc phải thực hiện nghĩa vụ chung kèo!`;

  const penaltySummaryText = isTie 
    ? `Cả 2 cùng cưa đôi hóa đơn: ${betState.penalty}`
    : `${loser} phải bao ngay: ${betState.penalty}`;

  lastOutcomeData = {
    headline: headlineText,
    sub: subText,
    evenOddText: evenOddSummaryText,
    scoreP1Text: scoreSummaryP1,
    scoreP2Text: scoreSummaryP2,
    penaltyText: penaltySummaryText
  };

  // Populate Outcome Dashboard in DOM
  const dashboard = document.getElementById('outcomeDashboard');
  dashboard.style.display = 'block';

  document.getElementById('verdictHeadline').textContent = headlineText;
  document.getElementById('verdictSub').textContent = subText;
  document.getElementById('evenOddResultSummary').textContent = evenOddSummaryText;
  document.getElementById('scoreResultP1Summary').textContent = scoreSummaryP1;
  document.getElementById('scoreResultP2Summary').textContent = scoreSummaryP2;

  if (isTie) {
    document.getElementById('penaltyClaimSummary').innerHTML = `Cả 2 cùng cưa đôi: <b>${betState.penalty}</b>`;
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
    const p1Type = betState.p1.betType === 'EVEN' ? 'KÈO CHẴN' : 'KÈO LẺ';
    const p2Type = betState.p2.betType === 'EVEN' ? 'KÈO CHẴN' : 'KÈO LẺ';

    const text = `📜 BIÊN BẢN GIAO KÈO: ${betState.examName}\n` +
      `👤 Bên A: ${betState.p1.name} (${betState.p1.title}) - Bắt: ${p1Type} - Đoán: ${betState.p1.targetScore}đ\n` +
      `👤 Bên B: ${betState.p2.name} (${betState.p2.title}) - Bắt: ${p2Type} - Đoán: ${betState.p2.targetScore}đ\n` +
      `⚖️ Thể lệ: Kèo Chẵn (Cùng Đậu / Cùng Rớt) vs Kèo Lẻ (1 người Đậu) & Kèo Tỉ Số\n` +
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
