/**
 * Canvas Image Exporter
 * Generates crisp 1200x800 PNG Certificate & Settlement Ledger for easy sharing
 */

class ProofCardExporter {
  
  // 1. Export Sàn Kèo Certificate with Participants
  static exportContract(state) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#0a0d18');
    bgGrad.addColorStop(0.5, '#12172b');
    bgGrad.addColorStop(1, '#080a12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 800);
      ctx.stroke();
    }
    for (let y = 0; y < 800; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Gold Certificate Borders
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(42, 42, 1116, 716);
    ctx.setLineDash([]);

    // Corner Ornaments
    this.drawCorner(ctx, 42, 42);
    this.drawCorner(ctx, 1158, 42, Math.PI / 2);
    this.drawCorner(ctx, 1158, 758, Math.PI);
    this.drawCorner(ctx, 42, 758, -Math.PI / 2);

    // Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd200';
    ctx.font = 'bold 22px "Chakra Petch", sans-serif';
    ctx.fillText('CỘNG HÒA XÃ HỘI CHỐT KÈO HỌC ĐƯỜNG', 600, 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Outfit", sans-serif';
    ctx.fillText('Độc Lập - Tự Do - Thua Là Chung Kèo', 600, 105);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 30px "Chakra Petch", sans-serif';
    ctx.fillText('BIÊN BẢN CHỨNG NHẬN SÀN KÈO THI CỬ', 600, 145);

    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 15px "Outfit", sans-serif';
    ctx.fillText(`KỲ THI: ${state.examName.toUpperCase()}`, 600, 175);

    // 2 Candidates Banner
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(70, 200, 1060, 95);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(70, 200, 1060, 95);

    // Cand 1 Left
    ctx.textAlign = 'left';
    ctx.font = '36px sans-serif';
    ctx.fillText(state.candidates.c1.avatar, 95, 260);

    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 12px "Chakra Petch", sans-serif';
    ctx.fillText('THÍ SINH 1', 150, 235);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 18px "Chakra Petch", sans-serif';
    ctx.fillText(state.candidates.c1.name, 150, 260);

    // Cand 2 Right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ff2a85';
    ctx.font = 'bold 12px "Chakra Petch", sans-serif';
    ctx.fillText('THÍ SINH 2', 1050, 235);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 18px "Chakra Petch", sans-serif';
    ctx.fillText(state.candidates.c2.name, 1050, 260);

    ctx.font = '36px sans-serif';
    ctx.fillText(state.candidates.c2.avatar, 1105, 260);

    // VS Center
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd200';
    ctx.font = '900 24px "Chakra Petch", sans-serif';
    ctx.fillText('VS', 600, 255);

    // Bet Slips Ledger Grid (Show up to 8 slips)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(70, 315, 1060, 350);
    ctx.strokeStyle = '#ffd200';
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 315, 1060, 350);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffd200';
    ctx.font = 'bold 16px "Chakra Petch", sans-serif';
    ctx.fillText(`📋 DANH SÁCH ANH EM ĐÃ VÀO KÈO (${state.betSlips.length} VÉ):`, 90, 345);

    const slipsToShow = state.betSlips.slice(0, 8);
    if (slipsToShow.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 14px "Outfit", sans-serif';
      ctx.fillText('Chưa có vé cược nào trên sàn.', 90, 380);
    } else {
      slipsToShow.forEach((s, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 90 + col * 520;
        const y = 375 + row * 65;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(x, y, 500, 52);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeRect(x, y, 500, 52);

        let typeText = s.type === 'EVEN' ? 'CỬA CHẴN' : (s.type === 'ODD' ? 'CỬA LẺ' : `TỈ SỐ (${s.targetCand === 1 ? 'A' : 'B'}: ${s.predictedScore}đ)`);
        let color = s.type === 'EVEN' ? '#00f2fe' : (s.type === 'ODD' ? '#ff2a85' : '#ffd200');

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px "Outfit", sans-serif';
        ctx.fillText(s.bettor, x + 12, y + 22);

        ctx.fillStyle = color;
        ctx.font = 'bold 12px "Chakra Petch", sans-serif';
        ctx.fillText(`• ${typeText}`, x + 12, y + 42);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#ff3860';
        ctx.font = 'bold 12px "Outfit", sans-serif';
        ctx.fillText(`Cược: ${s.stake}`, x + 488, y + 32);
        ctx.textAlign = 'left';
      });
    }

    // Stamp
    this.drawStamp(ctx, 1010, 150, 'ĐÃ CHỐT', 'SÀN CHÍNH THỨC', 'CẤM QUỴT KÈO');

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Outfit", sans-serif';
    ctx.fillText(`MÃ KÈO: ${state.hashTag}  |  LẬP LÚC: ${state.createdDate}  |  EXAM BETTING PLATFORM`, 600, 755);

    const filename = `SAN_KEO_THI_CU_${state.candidates.c1.name.replace(/\s+/g, '_')}_VS_${state.candidates.c2.name.replace(/\s+/g, '_')}.png`;
    this.triggerDownload(canvas, filename);
  }

  // 2. Export Settlement / Payout Results Card
  static exportVictoryResult(state, settlement) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#100c1e');
    bgGrad.addColorStop(0.5, '#1e1435');
    bgGrad.addColorStop(1, '#0b0816');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    ctx.strokeStyle = '#ffd200';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1140, 740);

    // Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd200';
    ctx.font = '900 34px "Chakra Petch", sans-serif';
    ctx.fillText('🏆 BẢNG VÀNG PHÂN XỬ & TRẢ THƯỞNG KÈO THI CỬ', 600, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText(`KẾT QUẢ THỰC TẾ: ${settlement.actualFateLabel}  |  Điểm A: ${settlement.realScoreA}đ  |  Điểm B: ${settlement.realScoreB}đ`, 600, 125);

    // 2 Columns: Winners vs Losers
    // Left: Winners (Green)
    ctx.fillStyle = 'rgba(0, 245, 160, 0.08)';
    ctx.fillRect(60, 160, 520, 540);
    ctx.strokeStyle = '#00f5a0';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 160, 520, 540);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#00f5a0';
    ctx.font = '900 18px "Chakra Petch", sans-serif';
    ctx.fillText(`👑 DANH SÁCH THẮNG KÈO (${settlement.winners.length} NGƯỜI)`, 80, 195);

    settlement.winners.slice(0, 6).forEach((w, i) => {
      const y = 225 + i * 75;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(80, y, 480, 65);
      ctx.strokeStyle = 'rgba(0, 245, 160, 0.3)';
      ctx.strokeRect(80, y, 480, 65);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Outfit", sans-serif';
      ctx.fillText(`✓ ${w.bettor}`, 95, y + 25);

      ctx.fillStyle = '#00f5a0';
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.fillText(`Nhận: ${w.stake}`, 95, y + 48);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 11px "Outfit", sans-serif';
      ctx.fillText(w.reason, 250, y + 48);
    });

    // Right: Losers (Red)
    ctx.fillStyle = 'rgba(255, 56, 96, 0.08)';
    ctx.fillRect(620, 160, 520, 540);
    ctx.strokeStyle = '#ff3860';
    ctx.lineWidth = 2;
    ctx.strokeRect(620, 160, 520, 540);

    ctx.fillStyle = '#ff3860';
    ctx.font = '900 18px "Chakra Petch", sans-serif';
    ctx.fillText(`💀 DANH SÁCH THUA KÈO (${settlement.losers.length} NGƯỜI)`, 640, 195);

    settlement.losers.slice(0, 6).forEach((l, i) => {
      const y = 225 + i * 75;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(640, y, 480, 65);
      ctx.strokeStyle = 'rgba(255, 56, 96, 0.3)';
      ctx.strokeRect(640, y, 480, 65);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Outfit", sans-serif';
      ctx.fillText(`✕ ${l.bettor}`, 655, y + 25);

      ctx.fillStyle = '#ff3860';
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.fillText(`Phải chung: ${l.stake}`, 655, y + 48);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 11px "Outfit", sans-serif';
      ctx.fillText(l.reason, 810, y + 48);
    });

    // Stamp
    this.drawStamp(ctx, 1020, 100, 'ĐÃ TRẢ KÈO', 'KẾT QUẢ SÀN', 'EXAM ARENA 2026');

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Outfit", sans-serif';
    ctx.fillText(`MÃ KÈO: ${state.hashTag}  |  CHỨNG THỰC BỞI SÀN KÈO THI CỬ GITHUB PAGES`, 600, 755);

    const filename = `KET_QUA_SAN_KEO_${state.candidates.c1.name.replace(/\s+/g, '_')}_VS_${state.candidates.c2.name.replace(/\s+/g, '_')}.png`;
    this.triggerDownload(canvas, filename);
  }

  static drawStamp(ctx, x, y, mainText, topText, botText) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-15 * Math.PI / 180);

    ctx.strokeStyle = '#ff2a5f';
    ctx.fillStyle = '#ff2a5f';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(0, 0, 65, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 10px "Chakra Petch", sans-serif';
    ctx.fillText(topText, 0, -32);

    ctx.font = '900 20px "Chakra Petch", sans-serif';
    ctx.fillText(mainText, 0, 6);

    ctx.font = 'bold 9px "Chakra Petch", sans-serif';
    ctx.fillText(botText, 0, 38);

    ctx.restore();
  }

  static drawCorner(ctx, x, y, rot = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = '#ffd200';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    ctx.restore();
  }

  static triggerDownload(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}
