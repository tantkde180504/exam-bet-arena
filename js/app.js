/**
 * SÀN KÈO THI CỬ - DYNAMIC BETTING PLATFORM ENGINE
 * Multi-user Bet Slips, Live Market Odds, Settlement & Payout Engine
 */

// Default State with preloaded sample community bets
let appState = {
  examName: "Kỳ Thi Tốt Nghiệp & Đại Học 2026",
  candidates: {
    c1: {
      name: "Nguyễn Văn A",
      avatar: "🎓",
      quote: "Mục tiêu 9+ trong tầm tay, anh em tin tưởng đặt cửa nào!"
    },
    c2: {
      name: "Trần Thị B",
      avatar: "🚀",
      quote: "Khoanh lụi vẫn tự tin đè bẹp đối thủ nhé!"
    }
  },
  betSlips: [
    {
      id: "slip-1",
      bettor: "Hoàng Tử Khoanh Lụi",
      type: "EVEN", // EVEN | ODD | SCORE
      targetCand: null,
      predictedScore: null,
      stake: "1 Ly Trà Sữa Trân Châu Size L",
      time: "20/08 - 21:00"
    },
    {
      id: "slip-2",
      bettor: "Chiến Thần Học Đêm",
      type: "ODD",
      targetCand: null,
      predictedScore: null,
      stake: "50.000 VNĐ Tiền Mặt",
      time: "20/08 - 21:15"
    },
    {
      id: "slip-3",
      bettor: "Thầy Bói Xem Voi",
      type: "SCORE",
      targetCand: 1, // 1 for Cand A, 2 for Cand B
      predictedScore: 9.25,
      stake: "1 Chầu Buffet Nướng",
      time: "20/08 - 21:20"
    },
    {
      id: "slip-4",
      bettor: "Hội Trưởng Fanclub Bạn B",
      type: "SCORE",
      targetCand: 2,
      predictedScore: 8.50,
      stake: "1 Ly Matcha Đá Xay",
      time: "20/08 - 21:30"
    }
  ],
  createdDate: new Date().toLocaleDateString('vi-VN') + ' - ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  hashTag: "#KEO-ARENA-" + Math.floor(1000 + Math.random() * 9000)
};

// Cached settlement data for canvas export
let lastSettlementData = null;
let currentFilter = "ALL";

// UTF-8 Safe Base64 Encoding & Decoding for Vietnamese URL serialization
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

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadStateFromUrlOrStorage();
  updateUI();
  setupEventListeners();
  spawnAmbientParticles();
});

// Load state from URL or LocalStorage
function loadStateFromUrlOrStorage() {
  const hash = window.location.hash;
  const urlParams = new URLSearchParams(window.location.search);
  const rawData = urlParams.get('data') || (hash.startsWith('#data=') ? hash.replace('#data=', '') : (hash.startsWith('#bet=') ? hash.replace('#bet=', '') : null));

  if (rawData) {
    try {
      const decoded = JSON.parse(base64ToUtf8(rawData));
      appState = { ...appState, ...decoded };
      showToast('Đã tải thành công Sàn Kèo từ link chia sẻ! 🚀', 'gold');
      return;
    } catch (e) {
      console.warn('Could not parse share link state', e);
    }
  }

  const saved = localStorage.getItem('EXAM_BET_PLATFORM_V3');
  if (saved) {
    try {
      appState = { ...appState, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Could not parse localStorage state', e);
    }
  }
}

// Save state to LocalStorage
function saveStateToStorage() {
  localStorage.setItem('EXAM_BET_PLATFORM_V3', JSON.stringify(appState));
}

// Generate shareable link
function getShareableUrl() {
  const jsonStr = JSON.stringify(appState);
  const b64 = utf8ToBase64(jsonStr);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#data=${b64}`;
}

// Set Stake input helper
function setStakeInput(val) {
  soundEngine.playClick();
  document.getElementById('inputStakeValue').value = val;
}

// Update all UI Components
function updateUI() {
  // 1. Candidate Info
  document.getElementById('displayExamName').textContent = appState.examName;

  document.getElementById('c1Avatar').textContent = appState.candidates.c1.avatar;
  document.getElementById('c1Name').textContent = appState.candidates.c1.name;
  document.getElementById('c1Quote').textContent = `"${appState.candidates.c1.quote}"`;

  document.getElementById('c2Avatar').textContent = appState.candidates.c2.avatar;
  document.getElementById('c2Name').textContent = appState.candidates.c2.name;
  document.getElementById('c2Quote').textContent = `"${appState.candidates.c2.quote}"`;

  // Market 2 Candidate headers
  document.getElementById('smC1Avatar').textContent = appState.candidates.c1.avatar;
  document.getElementById('smC1Name').textContent = `Kèo Điểm Số ${appState.candidates.c1.name}`;

  document.getElementById('smC2Avatar').textContent = appState.candidates.c2.avatar;
  document.getElementById('smC2Name').textContent = `Kèo Điểm Số ${appState.candidates.c2.name}`;

  // Result tab Candidate hints
  document.getElementById('resC1Avatar').textContent = appState.candidates.c1.avatar;
  document.getElementById('resC1Name').textContent = appState.candidates.c1.name;
  document.getElementById('resC2Avatar').textContent = appState.candidates.c2.avatar;
  document.getElementById('resC2Name').textContent = appState.candidates.c2.name;

  // Contract tab info
  document.getElementById('cExamName').textContent = appState.examName;
  document.getElementById('contractDateDisplay').textContent = appState.createdDate;
  document.getElementById('contractHashTag').textContent = appState.hashTag;
  document.getElementById('cParty1Name').textContent = appState.candidates.c1.name;
  document.getElementById('cParty1Quote').textContent = appState.candidates.c1.quote;
  document.getElementById('cParty2Name').textContent = appState.candidates.c2.name;
  document.getElementById('cParty2Quote').textContent = appState.candidates.c2.quote;

  // 2. Compute Market 1 Live Pool (Even vs Odd)
  const evenSlips = appState.betSlips.filter(s => s.type === 'EVEN');
  const oddSlips = appState.betSlips.filter(s => s.type === 'ODD');
  const scoreSlips = appState.betSlips.filter(s => s.type === 'SCORE');

  const totalEvenOdd = evenSlips.length + oddSlips.length;
  let evenPct = 50;
  let oddPct = 50;
  if (totalEvenOdd > 0) {
    evenPct = Math.round((evenSlips.length / totalEvenOdd) * 100);
    oddPct = 100 - evenPct;
  }

  document.getElementById('evenPoolStats').textContent = `${evenSlips.length} vé (${evenPct}%)`;
  document.getElementById('oddPoolStats').textContent = `${oddSlips.length} vé (${oddPct}%)`;
  document.getElementById('totalEvenOddStakeText').textContent = `${totalEvenOdd} Vé Cược`;

  document.getElementById('poolBarEven').style.width = evenPct + '%';
  document.getElementById('poolBarOdd').style.width = oddPct + '%';

  // 3. Render Market 2 Bids List
  const c1ScoreBids = scoreSlips.filter(s => s.targetCand === 1);
  const c2ScoreBids = scoreSlips.filter(s => s.targetCand === 2);

  const c1BidsContainer = document.getElementById('c1ScoreBidsList');
  if (c1ScoreBids.length === 0) {
    c1BidsContainer.innerHTML = '<span class="empty-hint">Chưa có ai đặt kèo điểm Bạn A. Hãy là người đầu tiên!</span>';
  } else {
    c1BidsContainer.innerHTML = c1ScoreBids.map(s => `
      <div class="bid-item-chip">
        <span class="bid-bettor"><i class="fa-solid fa-user-tag"></i> ${escapeHtml(s.bettor)}</span>
        <span class="bid-score">${Number(s.predictedScore).toFixed(2)} đ</span>
        <span class="bid-stake">${escapeHtml(s.stake)}</span>
      </div>
    `).join('');
  }

  const c2BidsContainer = document.getElementById('c2ScoreBidsList');
  if (c2ScoreBids.length === 0) {
    c2BidsContainer.innerHTML = '<span class="empty-hint">Chưa có ai đặt kèo điểm Bạn B. Hãy là người đầu tiên!</span>';
  } else {
    c2BidsContainer.innerHTML = c2ScoreBids.map(s => `
      <div class="bid-item-chip">
        <span class="bid-bettor"><i class="fa-solid fa-user-tag"></i> ${escapeHtml(s.bettor)}</span>
        <span class="bid-score">${Number(s.predictedScore).toFixed(2)} đ</span>
        <span class="bid-stake">${escapeHtml(s.stake)}</span>
      </div>
    `).join('');
  }

  // 4. Update Badge Counts
  document.getElementById('totalSlipsBadge').textContent = appState.betSlips.length;
  document.getElementById('countFilterAll').textContent = appState.betSlips.length;
  document.getElementById('countFilterEven').textContent = evenSlips.length;
  document.getElementById('countFilterOdd').textContent = oddSlips.length;
  document.getElementById('countFilterScore').textContent = scoreSlips.length;

  // 5. Render Bet Slips Feed (Tab 2)
  renderBetSlipsFeed();

  // 6. Render Contract Ledger (Tab 3)
  renderContractLedger();
}

// Render Bet Slips Feed with filtering
function renderBetSlipsFeed() {
  const container = document.getElementById('slipsFeed');
  if (!container) return;

  let filtered = appState.betSlips;
  if (currentFilter === 'EVEN') filtered = appState.betSlips.filter(s => s.type === 'EVEN');
  else if (currentFilter === 'ODD') filtered = appState.betSlips.filter(s => s.type === 'ODD');
  else if (currentFilter === 'SCORE') filtered = appState.betSlips.filter(s => s.type === 'SCORE');

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: #64748b;">
        <i class="fa-solid fa-inbox" style="font-size: 36px; margin-bottom: 8px;"></i>
        <p>Chưa có vé cược nào trong mục này. Bấm <b>"Thêm Vé Cược"</b> để vào kèo ngay!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(slip => {
    let typeClass = "slip-even";
    let typeBadge = '<span class="slip-pick-tag tag-even"><i class="fa-solid fa-equals"></i> CỬA CHẴN (Cùng Đậu / Cùng Rớt)</span>';

    if (slip.type === 'ODD') {
      typeClass = "slip-odd";
      typeBadge = '<span class="slip-pick-tag tag-odd"><i class="fa-solid fa-shuffle"></i> CỬA LẺ (1 Người Đậu)</span>';
    } else if (slip.type === 'SCORE') {
      typeClass = "slip-score";
      const candName = slip.targetCand === 1 ? appState.candidates.c1.name : appState.candidates.c2.name;
      typeBadge = `<span class="slip-pick-tag tag-score"><i class="fa-solid fa-crosshairs"></i> ĐOÁN ĐIỂM: ${candName} = ${Number(slip.predictedScore).toFixed(2)} đ</span>`;
    }

    return `
      <div class="bet-slip-card ${typeClass}">
        <div class="slip-header">
          <span class="slip-bettor"><i class="fa-solid fa-user"></i> ${escapeHtml(slip.bettor)}</span>
          <button class="slip-delete-btn" onclick="deleteBetSlip('${slip.id}')" title="Xóa vé này">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="slip-body">
          ${typeBadge}
          <div class="slip-stake-box">
            <i class="fa-solid fa-hand-holding-dollar"></i> Cược: <b>${escapeHtml(slip.stake)}</b>
          </div>
        </div>
        <div class="slip-time"><i class="fa-regular fa-clock"></i> ${slip.time}</div>
      </div>
    `;
  }).join('');
}

// Render Compact Ledger in Certificate View
function renderContractLedger() {
  const container = document.getElementById('contractLedgerList');
  if (!container) return;

  if (appState.betSlips.length === 0) {
    container.innerHTML = '<span class="empty-hint">Chưa có ai vào kèo trên sàn này.</span>';
    return;
  }

  container.innerHTML = appState.betSlips.map(s => {
    let pickText = s.type === 'EVEN' ? 'Cửa Chẵn' : (s.type === 'ODD' ? 'Cửa Lẻ' : `Đoán ${s.targetCand === 1 ? 'A' : 'B'}: ${Number(s.predictedScore).toFixed(2)}đ`);
    return `
      <div class="ledger-item">
        <span class="bettor-name"><b>${escapeHtml(s.bettor)}</b> (${pickText})</span>
        <span class="stake-text">${escapeHtml(s.stake)}</span>
      </div>
    `;
  }).join('');
}

// Quick Open Bet Modals
function quickOpenBetModal(choice) {
  soundEngine.playClick();
  document.querySelector('input[name="betCategory"][value="EVEN_ODD"]').checked = true;
  toggleBetCategoryFields();
  document.querySelector(`input[name="inputEvenOddChoice"][value="${choice}"]`).checked = true;
  openBetModal();
}

function quickOpenScoreModal(candNum) {
  soundEngine.playClick();
  document.querySelector('input[name="betCategory"][value="SCORE_EXACT"]').checked = true;
  toggleBetCategoryFields();
  document.getElementById('inputScoreTargetCand').value = candNum;
  openBetModal();
}

function openBetModal() {
  soundEngine.playClick();
  document.getElementById('inputBettorName').value = '';
  document.getElementById('betSlipModalOverlay').classList.add('active');
}

function openConfigModal() {
  soundEngine.playClick();
  document.getElementById('cfgExamName').value = appState.examName;
  document.getElementById('cfgC1Name').value = appState.candidates.c1.name;
  document.getElementById('cfgC1Avatar').value = appState.candidates.c1.avatar;
  document.getElementById('cfgC1Quote').value = appState.candidates.c1.quote;

  document.getElementById('cfgC2Name').value = appState.candidates.c2.name;
  document.getElementById('cfgC2Avatar').value = appState.candidates.c2.avatar;
  document.getElementById('cfgC2Quote').value = appState.candidates.c2.quote;

  document.getElementById('configModalOverlay').classList.add('active');
}

function closeModal(modalId) {
  soundEngine.playClick();
  document.getElementById(modalId).classList.remove('active');
}

function toggleBetCategoryFields() {
  const cat = document.querySelector('input[name="betCategory"]:checked').value;
  const evenOddBox = document.getElementById('evenOddFields');
  const scoreBox = document.getElementById('scoreExactFields');

  if (cat === 'EVEN_ODD') {
    evenOddBox.style.display = 'block';
    scoreBox.style.display = 'none';
  } else {
    evenOddBox.style.display = 'none';
    scoreBox.style.display = 'block';
  }
}

// Confirm Place Bet Slip
function confirmPlaceBet() {
  const bettorName = document.getElementById('inputBettorName').value.trim();
  const stakeVal = document.getElementById('inputStakeValue').value.trim();

  if (!bettorName) {
    alert('Vui lòng nhập tên / nickname của bạn!');
    return;
  }
  if (!stakeVal) {
    alert('Vui lòng nhập mức cược / phần thưởng!');
    return;
  }

  const category = document.querySelector('input[name="betCategory"]:checked').value;
  const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN');

  let newSlip = {
    id: "slip-" + Date.now(),
    bettor: bettorName,
    type: category === 'EVEN_ODD' ? document.querySelector('input[name="inputEvenOddChoice"]:checked').value : 'SCORE',
    targetCand: category === 'SCORE_EXACT' ? parseInt(document.getElementById('inputScoreTargetCand').value) : null,
    predictedScore: category === 'SCORE_EXACT' ? parseFloat(document.getElementById('inputPredictedScore').value) : null,
    stake: stakeVal,
    time: timeStr
  };

  appState.betSlips.unshift(newSlip);
  saveStateToStorage();
  updateUI();
  closeModal('betSlipModalOverlay');
  soundEngine.playGavel();
  showToast(`🎉 ${bettorName} đã vào kèo thành công!`, 'gold');
}

// Delete Bet Slip
function deleteBetSlip(id) {
  soundEngine.playClick();
  appState.betSlips = appState.betSlips.filter(s => s.id !== id);
  saveStateToStorage();
  updateUI();
  showToast('Đã hủy vé cược thành công.');
}

// Save Candidate Config
function saveCandidatesConfig() {
  appState.examName = document.getElementById('cfgExamName').value.trim() || 'Kỳ Thi 2026';
  appState.candidates.c1 = {
    name: document.getElementById('cfgC1Name').value.trim() || 'Thí sinh 1',
    avatar: document.getElementById('cfgC1Avatar').value.trim() || '🎓',
    quote: document.getElementById('cfgC1Quote').value.trim() || 'Tự tin đỗ đầu!'
  };
  appState.candidates.c2 = {
    name: document.getElementById('cfgC2Name').value.trim() || 'Thí sinh 2',
    avatar: document.getElementById('cfgC2Avatar').value.trim() || '🚀',
    quote: document.getElementById('cfgC2Quote').value.trim() || 'Khoanh lụi vẫn đè bẹp đối thủ!'
  };

  saveStateToStorage();
  updateUI();
  closeModal('configModalOverlay');
  soundEngine.playGavel();
  showToast('Đã lưu thông tin 2 thí sinh thành công! ⚡', 'gold');
}

// Mở Bát & Settlement Engine
function calculateSettlement() {
  soundEngine.playClick();

  const realC1Fate = document.querySelector('input[name="resC1Fate"]:checked').value;
  const realC2Fate = document.querySelector('input[name="resC2Fate"]:checked').value;
  const realC1Score = parseFloat(document.getElementById('resC1ScoreInput').value) || 0;
  const realC2Score = parseFloat(document.getElementById('resC2ScoreInput').value) || 0;

  // 1. Determine Actual Even / Odd Status
  const isActualEven = (realC1Fate === realC2Fate);
  const actualOutcomeLabel = isActualEven 
    ? `CHẴN (${realC1Fate === 'PASS' ? 'Cả 2 cùng ĐẬU 🎓' : 'Cả 2 cùng RỚT 😭'})`
    : 'LẺ (Đúng 1 người Đậu ⚡)';

  // 2. Scan every single slip in the market
  const winners = [];
  const losers = [];

  appState.betSlips.forEach(slip => {
    let isWinner = false;
    let reason = "";

    if (slip.type === 'EVEN') {
      if (isActualEven) {
        isWinner = true;
        reason = `Bắt đúng CỬA CHẴN (${actualOutcomeLabel})`;
      } else {
        isWinner = false;
        reason = `Bắt Cửa Chẵn nhưng kết quả ra Cửa Lẻ`;
      }
    } else if (slip.type === 'ODD') {
      if (!isActualEven) {
        isWinner = true;
        reason = `Bắt đúng CỬA LẺ (${actualOutcomeLabel})`;
      } else {
        isWinner = false;
        reason = `Bắt Cửa Lẻ nhưng kết quả ra Cửa Chẵn`;
      }
    } else if (slip.type === 'SCORE') {
      const targetName = slip.targetCand === 1 ? appState.candidates.c1.name : appState.candidates.c2.name;
      const realScore = slip.targetCand === 1 ? realC1Score : realC2Score;
      const diff = Math.abs(realScore - slip.predictedScore);

      if (diff < 0.01) {
        isWinner = true;
        reason = `Đoán ${targetName} = ${slip.predictedScore.toFixed(2)}đ (🎯 TRÚNG TUYỆT ĐỐI)`;
      } else if (diff <= 0.25) {
        isWinner = true;
        reason = `Đoán ${targetName} = ${slip.predictedScore.toFixed(2)}đ (Lệch chỉ ${diff.toFixed(2)}đ -> Thắng Kèo)`;
      } else {
        isWinner = false;
        reason = `Đoán ${targetName} = ${slip.predictedScore.toFixed(2)}đ nhưng điểm thật là ${realScore.toFixed(2)}đ (Lệch ${diff.toFixed(2)}đ)`;
      }
    }

    const item = {
      bettor: slip.bettor,
      stake: slip.stake,
      reason: reason,
      type: slip.type
    };

    if (isWinner) winners.push(item);
    else losers.push(item);
  });

  // 3. Cache Data for export
  lastSettlementData = {
    actualFateLabel: actualOutcomeLabel,
    realScoreA: realC1Score.toFixed(2),
    realScoreB: realC2Score.toFixed(2),
    winners: winners,
    losers: losers
  };

  // 4. Render DOM Outcome Dashboard
  const dashboard = document.getElementById('outcomeDashboard');
  dashboard.style.display = 'block';

  document.getElementById('settleFateVal').textContent = actualOutcomeLabel;
  document.getElementById('settleScoreAVal').textContent = realC1Score.toFixed(2) + ' đ';
  document.getElementById('settleScoreBVal').textContent = realC2Score.toFixed(2) + ' đ';

  document.getElementById('winnerCount').textContent = winners.length;
  document.getElementById('loserCount').textContent = losers.length;

  const winnersList = document.getElementById('winnersList');
  if (winners.length === 0) {
    winnersList.innerHTML = '<span class="empty-hint">Không có ai thắng kèo đợt này!</span>';
  } else {
    winnersList.innerHTML = winners.map(w => `
      <div class="payout-item-card">
        <div class="payout-item-header">
          <span class="payout-name"><i class="fa-solid fa-crown"></i> ${escapeHtml(w.bettor)}</span>
          <span class="payout-stake"><i class="fa-solid fa-gift"></i> Nhận: ${escapeHtml(w.stake)}</span>
        </div>
        <div class="payout-reason">${escapeHtml(w.reason)}</div>
      </div>
    `).join('');
  }

  const losersList = document.getElementById('losersList');
  if (losers.length === 0) {
    losersList.innerHTML = '<span class="empty-hint">Toàn bộ sàn đều dự đoán chính xác!</span>';
  } else {
    losersList.innerHTML = losers.map(l => `
      <div class="payout-item-card">
        <div class="payout-item-header">
          <span class="payout-name"><i class="fa-solid fa-skull"></i> ${escapeHtml(l.bettor)}</span>
          <span class="payout-stake"><i class="fa-solid fa-receipt"></i> Phải chung: ${escapeHtml(l.stake)}</span>
        </div>
        <div class="payout-reason">${escapeHtml(l.reason)}</div>
      </div>
    `).join('');
  }

  soundEngine.playVictory();

  if (confettiEngine) {
    confettiEngine.launch(4500);
  }

  dashboard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Stepper score
function stepScore(inputId, delta) {
  soundEngine.playClick();
  const input = document.getElementById(inputId);
  if (!input) return;
  let val = parseFloat(input.value) || 0;
  val = Math.max(0, Math.min(10, Math.round((val + delta) * 100) / 100));
  input.value = val.toFixed(2);
}

// Switch tabs
function switchTab(tabId) {
  soundEngine.playClick();
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

// HTML Entity Escape
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Toast helper
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

// Event Listeners setup
function setupEventListeners() {
  // Tabs
  document.getElementById('tabMarketView').addEventListener('click', () => switchTab('market-view'));
  document.getElementById('tabSlipsView').addEventListener('click', () => switchTab('slips-view'));
  document.getElementById('tabContractView').addEventListener('click', () => switchTab('contract-view'));
  document.getElementById('tabResultView').addEventListener('click', () => switchTab('result-view'));

  // Header
  document.getElementById('openBetModalBtn').addEventListener('click', openBetModal);
  document.getElementById('openBetSlipFromMarketBtn').addEventListener('click', openBetModal);
  document.getElementById('openResultTabBtn').addEventListener('click', () => switchTab('result-view'));
  document.getElementById('quickHelpBtn').addEventListener('click', () => {
    soundEngine.playClick();
    document.getElementById('helpModalOverlay').classList.add('active');
  });

  // Sound toggle
  const soundBtn = document.getElementById('soundToggleBtn');
  soundBtn.addEventListener('click', () => {
    const isMuted = soundEngine.toggleMute();
    soundBtn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
    showToast(isMuted ? 'Đã tắt âm thanh' : 'Đã bật âm thanh');
  });

  // Share link
  document.getElementById('shareLinkBtn').addEventListener('click', () => {
    soundEngine.playClick();
    const url = getShareableUrl();
    navigator.clipboard.writeText(url).then(() => {
      showToast('Đã sao chép liên kết toàn bộ Sàn Kèo vào Clipboard! 🔗', 'gold');
    }).catch(() => {
      prompt('Sao chép đường link này gửi vào group:', url);
    });
  });

  // Clear all slips
  document.getElementById('clearAllSlipsBtn').addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách vé cược trên sàn không?')) {
      appState.betSlips = [];
      saveStateToStorage();
      updateUI();
      showToast('Đã làm trống toàn bộ sàn cược.');
    }
  });

  // Filter chips in Tab 2
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      soundEngine.playClick();
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderBetSlipsFeed();
    });
  });

  // Modal Actions
  document.getElementById('confirmPlaceBetBtn').addEventListener('click', confirmPlaceBet);
  document.getElementById('saveCandidatesConfigBtn').addEventListener('click', saveCandidatesConfig);

  // Settlement & Reveal
  document.getElementById('calculateResultBtn').addEventListener('click', calculateSettlement);
  document.getElementById('replaySoundBtn').addEventListener('click', () => {
    soundEngine.playVictory();
    if (confettiEngine) confettiEngine.launch(3000);
  });

  // Export Canvas Images
  document.getElementById('exportImageBtn').addEventListener('click', () => {
    soundEngine.playClick();
    ProofCardExporter.exportContract(appState);
    showToast('Đang tải ảnh bằng chứng Sàn Kèo về máy! 📸', 'gold');
  });

  document.getElementById('exportVictoryCardBtn').addEventListener('click', () => {
    soundEngine.playClick();
    if (lastSettlementData) {
      ProofCardExporter.exportVictoryResult(appState, lastSettlementData);
    } else {
      ProofCardExporter.exportContract(appState);
    }
    showToast('Đã xuất ảnh bảng vàng trả thưởng! 🏆', 'gold');
  });

  // Copy Contract Text
  document.getElementById('copyContractTextBtn').addEventListener('click', () => {
    soundEngine.playClick();
    const evenSlips = appState.betSlips.filter(s => s.type === 'EVEN');
    const oddSlips = appState.betSlips.filter(s => s.type === 'ODD');
    const scoreSlips = appState.betSlips.filter(s => s.type === 'SCORE');

    let text = `📜 BIÊN BẢN SÀN KÈO THI CỬ: ${appState.examName}\n` +
      `🥊 Thí sinh 1: ${appState.candidates.c1.name} VS Thí sinh 2: ${appState.candidates.c2.name}\n` +
      `📊 Tổng số vé: ${appState.betSlips.length} (Chẵn: ${evenSlips.length} vé | Lẻ: ${oddSlips.length} vé | Tỉ số: ${scoreSlips.length} vé)\n` +
      `👉 Xem và vào kèo trực tiếp tại: ${getShareableUrl()}`;

    navigator.clipboard.writeText(text).then(() => {
      showToast('Đã sao chép nội dung sàn kèo! 📋');
    });
  });
}

// Background Floating Particles
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
