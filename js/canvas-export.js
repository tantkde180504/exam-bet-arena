/**
 * Canvas Image Exporter
 * Generates crisp 1200x800 PNG Certificate & Victory Result Card for easy sharing
 * Updated with Kèo Chẵn / Kèo Lẻ & Kèo Tỉ Số
 */

class ProofCardExporter {
  
  // 1. Export Honor Contract Certificate
  static exportContract(betState) {
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
    ctx.fillText('CỘNG HÒA XÃ HỘI CHỐT KÈO VIỆT NAM', 600, 85);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px "Outfit", sans-serif';
    ctx.fillText('Độc Lập - Tự Do - Thua Là Chung Kèo', 600, 112);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 30px "Chakra Petch", sans-serif';
    ctx.fillText('BIÊN BẢN GIAO KÈO CHẴN / LẺ & TỈ SỐ ĐIỂM THI', 600, 155);

    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText(`KỲ THI: ${betState.examName.toUpperCase()}`, 600, 185);

    // Duel Cards (Side by Side)
    // Party 1 (Left)
    this.drawPartyCard(ctx, 70, 215, 460, 230, {
      role: 'BÊN A (Chủ Kèo 1)',
      name: betState.p1.name,
      avatar: betState.p1.avatar,
      title: betState.p1.title,
      score: betState.p1.targetScore,
      betType: betState.p1.betType === 'EVEN' ? 'BẮT KÈO CHẴN' : 'BẮT KÈO LẺ',
      quote: betState.p1.quote,
      accentColor: '#00f2fe'
    });

    // VS Circle in middle
    ctx.save();
    ctx.beginPath();
    ctx.arc(600, 330, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#161d36';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffd200';
    ctx.stroke();

    ctx.fillStyle = '#ffd200';
    ctx.font = '900 24px "Chakra Petch", sans-serif';
    ctx.fillText('VS', 600, 338);
    ctx.restore();

    // Party 2 (Right)
    this.drawPartyCard(ctx, 670, 215, 460, 230, {
      role: 'BÊN B (Chủ Kèo 2)',
      name: betState.p2.name,
      avatar: betState.p2.avatar,
      title: betState.p2.title,
      score: betState.p2.targetScore,
      betType: betState.p2.betType === 'EVEN' ? 'BẮT KÈO CHẴN' : 'BẮT KÈO LẺ',
      quote: betState.p2.quote,
      accentColor: '#ff2a85'
    });

    // Terms Box (Lower half)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(70, 465, 1060, 185);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 465, 1060, 185);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffd200';
    ctx.font = 'bold 16px "Chakra Petch", sans-serif';
    ctx.fillText('⚖️ ĐIỀU KHOẢN KÈO CHẴN / LẺ & KÈO TỈ SỐ:', 90, 495);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px "Outfit", sans-serif';
    ctx.fillText('• KÈO CHẴN: Thắng khi Cả 2 cùng ĐẬU hoặc Cả 2 cùng RỚT.', 100, 525);
    ctx.fillText('• KÈO LẺ: Thắng khi Đúng 1 trong 2 người ĐẬU (người kia Rớt).', 100, 550);
    ctx.fillText(`• KÈO TỈ SỐ: Đoán chuẩn điểm thi (${betState.p1.name}: ${Number(betState.p1.targetScore).toFixed(2)}đ | ${betState.p2.name}: ${Number(betState.p2.targetScore).toFixed(2)}đ)`, 100, 575);
    
    // Highlight penalty
    ctx.fillStyle = '#ff3860';
    ctx.font = 'bold 15px "Outfit", sans-serif';
    ctx.fillText(`👉 HÌNH PHẠT CHUNG KÈO: ${betState.penalty}`, 100, 605);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 12px "Outfit", sans-serif';
    ctx.fillText('• Cam kết: Biên bản có giá trị vĩnh viễn, cấm hủy kèo, bùng nợ hoặc trốn tránh khi công bố điểm!', 100, 633);

    // Signatures
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillText('CHỮ KÝ BÊN A', 240, 675);
    ctx.fillText('CHỮ KÝ BÊN B', 960, 675);

    ctx.fillStyle = '#00f2fe';
    ctx.font = 'italic 20px cursive';
    ctx.fillText(betState.p1.name, 240, 705);

    ctx.fillStyle = '#ff2a85';
    ctx.font = 'italic 20px cursive';
    ctx.fillText(betState.p2.name, 960, 705);

    ctx.fillStyle = '#00f5a0';
    ctx.font = '11px "Outfit", sans-serif';
    ctx.fillText('✓ ĐÃ XÁC THỰC KÈO', 240, 725);
    ctx.fillText('✓ ĐÃ XÁC THỰC KÈO', 960, 725);

    // Footer Hash
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Outfit", sans-serif';
    ctx.fillText(`MÃ KÈO: ${betState.hashTag}  |  LẬP LÚC: ${betState.createdDate}  |  EXAM SHOWDOWN ARENA`, 600, 755);

    // RED STAMP WATERMARK
    this.drawStamp(ctx, 1000, 160, 'ĐÃ CHỐT', 'KÈO CHÍNH THỨC', 'CẤM QUỴT KÈO');

    // Trigger Download
    const filename = `KEO_CHĂN_LE_${betState.p1.name.replace(/\s+/g, '_')}_VS_${betState.p2.name.replace(/\s+/g, '_')}.png`;
    this.triggerDownload(canvas, filename);
  }

  // 2. Export Official Victory / Result Reveal Card
  static exportVictoryResult(betState, summaryData) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Victory dark neon gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#100c1e');
    bgGrad.addColorStop(0.5, '#1e1435');
    bgGrad.addColorStop(1, '#0b0816');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = '#ffd200';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1140, 740);

    // Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd200';
    ctx.font = '900 36px "Chakra Petch", sans-serif';
    ctx.fillText('🏆 BẢNG VÀNG PHÂN XỬ KÈO THI CỬ', 600, 95);

    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 18px "Outfit", sans-serif';
    ctx.fillText(`KỲ THI: ${betState.examName.toUpperCase()}`, 600, 135);

    // Winner Headline Card
    ctx.fillStyle = 'rgba(255, 210, 0, 0.15)';
    ctx.fillRect(100, 165, 1000, 130);
    ctx.strokeStyle = '#ffd200';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 165, 1000, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 32px "Chakra Petch", sans-serif';
    ctx.fillText(summaryData.headline, 600, 220);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px "Outfit", sans-serif';
    ctx.fillText(summaryData.sub, 600, 260);

    // Detailed Breakdown 4 Cards Grid
    const cards = [
      { title: 'KẾT QUẢ KÈO CHẴN / LẺ', val: summaryData.evenOddText, icon: '🎲' },
      { title: `KÈO TỈ SỐ ${betState.p1.name.toUpperCase()}`, val: summaryData.scoreP1Text, icon: '🎯' },
      { title: `KÈO TỈ SỐ ${betState.p2.name.toUpperCase()}`, val: summaryData.scoreP2Text, icon: '🎯' },
      { title: 'NGHĨA VỤ CHUNG KÈO', val: summaryData.penaltyText, icon: '🍲', isPenalty: true }
    ];

    cards.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 100 + col * 520;
      const y = 320 + row * 190;
      const w = 480;
      const h = 160;

      ctx.fillStyle = c.isPenalty ? 'rgba(255, 56, 96, 0.15)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = c.isPenalty ? '#ff3860' : 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(x, y, w, h);

      ctx.textAlign = 'left';
      ctx.fillStyle = c.isPenalty ? '#ff3860' : '#ffd200';
      ctx.font = 'bold 15px "Chakra Petch", sans-serif';
      ctx.fillText(`${c.icon} ${c.title}`, x + 20, y + 35);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Outfit", sans-serif';
      this.drawWrappedText(ctx, c.val, x + 20, y + 70, 440, 24);
    });

    // Stamp
    this.drawStamp(ctx, 1020, 230, 'ĐÃ PHÂN XỬ', 'KẾT QUẢ CHÍNH THỨC', 'EXAM ARENA 2026');

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Outfit", sans-serif';
    ctx.fillText(`CHỨNG THỰC BỞI EXAM BET ARENA  |  MÃ KÈO: ${betState.hashTag}`, 600, 750);

    const filename = `KET_QUA_KEO_${betState.p1.name.replace(/\s+/g, '_')}_VS_${betState.p2.name.replace(/\s+/g, '_')}.png`;
    this.triggerDownload(canvas, filename);
  }

  static drawPartyCard(ctx, x, y, w, h, data) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = data.accentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.avatar, x + 50, y + 65);

    ctx.textAlign = 'left';
    ctx.fillStyle = data.accentColor;
    ctx.font = 'bold 12px "Chakra Petch", sans-serif';
    ctx.fillText(data.role, x + 100, y + 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px "Chakra Petch", sans-serif';
    ctx.fillText(data.name, x + 100, y + 65);

    ctx.fillStyle = '#ffd200';
    ctx.font = '13px "Outfit", sans-serif';
    ctx.fillText(`Danh hiệu: ${data.title}`, x + 100, y + 90);

    ctx.fillStyle = '#00f5a0';
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.fillText(`Kèo Số Phận: ${data.betType}`, x + 30, y + 135);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px "Outfit", sans-serif';
    ctx.fillText(`Kèo Tỉ Số (Đoán Điểm): ${Number(data.score).toFixed(2)} đ`, x + 30, y + 160);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 12px "Outfit", sans-serif';
    ctx.fillText(`"${data.quote}"`, x + 30, y + 195);

    ctx.restore();
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

  static drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  static triggerDownload(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}
