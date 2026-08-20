# 🎓 KÈO THI CỬ - ĐẠI CHIẾN ĐIỂM SỐ & SỐ PHẬN
> **Exam Showdown & Bet Arena**: Nền tảng chốt kèo thi cử, tỉ số điểm thi và số phận Đậu/Rớt đỉnh cao cho 2 người bạn. Giao diện trực quan, sống động, hỗ trợ tạo biên bản danh dự, xuất ảnh bằng chứng PNG và mở bát phân xử kết quả tự động!

---

## ⚡ Tính Năng Nổi Bật

- 🥊 **Giao Diện Đấu Trường VS Sống Động**: Thiết kế Cyberpunk Neon & Manga Duel cực ngầu với Player 1 (Neon Cyan) vs Player 2 (Neon Pink).
- ⚖️ **Hệ Thống Lên Kèo Đầy Đủ**:
  - **Kèo Đậu / Rớt**: Đặt cược số phận (Cùng Đậu, Ai Đậu Ai Rớt, Cùng Toang...).
  - **Kèo Tỉ Số & Điểm Thi**: So sánh điểm, cược chấp điểm (Handicap: Chấp 0.5 - 1.5 điểm), cược Tài/Xỉu tổng điểm.
  - **Hình Phạt / Phần Thưởng**: Buffet nướng lẩu, 1 tháng trà sữa, cạo đầu, mặc váy, rửa chén...
- 📜 **Biên Bản Giao Kèo Bất Tử**: Có dấu mộc đỏ nhấp nháy *"KÈO ĐÃ CHỐT - CẤM QUỴT"*.
- 📸 **Xuất Ảnh Bằng Chứng Nét Căng (Canvas PNG)**: 1 click là tải ngay ảnh biên bản để gửi vào group chat Messenger / Zalo.
- 🔗 **Chia Sẻ Link Trực Tiếp (Zero-Backend)**: Dữ liệu được mã hóa trực tiếp vào URL (`#bet=...`), bạn bè bấm link là thấy ngay toàn bộ kèo.
- 🏆 **Chế Độ Mở Bát Kết Quả (Live Reveal)**: Nhập điểm thi thực tế để hệ thống tự động phân xử thắng thua, kích hoạt pháo hoa ăn mừng và xử phạt người thua.
- 🔊 **Âm Thanh Sống Động**: Tích hợp Web Audio API (tiếng chốt kèo, tiếng còi hú, pháo hoa ăn mừng) không cần kết nối mạng hay tải file mp3 bên ngoài.

---

## 🚀 Hướng Dẫn Đưa Lên GitHub Pages (Miễn Phí 100%)

### Cách 1: Đẩy Lên Bằng Git Command Line (Khuyên dùng)
1. Tạo 1 repository mới trên GitHub của bạn (ví dụ đặt tên: `keo-thi-cu`).
2. Mở terminal trong thư mục này và chạy các lệnh sau:
   ```bash
   git init
   git add .
   git commit -m "Kèo thi cử 2026 - Initial Commit"
   git branch -M main
   git remote add origin https://github.com/TÊN_GITHUB_CỦA_BẠN/keo-thi-cu.git
   git push -u origin main
   ```
3. Truy cập vào GitHub repo của bạn -> Vào **Settings** -> Chọn tab **Pages** ở cột trái.
4. Tại mục **Branch**, chọn `main` và thư mục `/ (root)` -> Nhấn **Save**.
5. Đợi khoảng 1-2 phút, trang web của bạn sẽ hoạt động trực tiếp tại:
   `https://TÊN_GITHUB_CỦA_BẠN.github.io/keo-thi-cu/`

### Cách 2: Tải Trực Tiếp Qua Giao Diện Web GitHub
1. Tạo repository mới trên [github.com/new](https://github.com/new).
2. Nhấn vào **"uploading an existing file"**.
3. Kéo toàn bộ thư mục và các file (`index.html`, thư mục `css`, `js`, `README.md`) vào trình duyệt và nhấn **Commit changes**.
4. Vào **Settings -> Pages** -> Chọn branch `main` -> **Save**.

---

## 📁 Cấu Trúc Dự Án
```text
exam-bet-arena/
├── index.html              # Giao diện chính (HTML5 Semantic, SEO, Responsive)
├── css/
│   ├── style.css           # Hệ thống giao diện Neon Glassmorphism & Cyberpunk
│   └── animations.css      # Keyframe sấm sét, mộc đỏ, rung lắc, pháo hoa
├── js/
│   ├── app.js              # Quản lý trạng thái, URL sharing, phân xử kết quả
│   ├── audio.js            # Trình tổng hợp âm thanh Web Audio API
│   ├── canvas-export.js    # Tạo ảnh thẻ giao kèo xuất ra file PNG
│   └── confetti.js         # Động cơ pháo hoa ăn mừng
└── README.md               # Hướng dẫn chi tiết
```

---
*Chúc các bạn thi cử đạt kết quả thật cao và chốt kèo vui vẻ cùng bạn bè! 🎉*
