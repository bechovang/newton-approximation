# Newton Approximation Calculator

Một ứng dụng web mô phỏng máy tính Casio fx-580VN X với animation phương pháp Newton để giải phương trình.

## 🌟 Tính năng

- **Máy tính Casio mô phỏng**: Giao diện giống máy tính Casio fx-580VN X với đầy đủ chức năng
- **Phương pháp Newton**: Minh họa trực quan quá trình tìm nghiệm bằng phương pháp Newton
- **Animation tương tác**: Hiển thị từng bước của phương pháp Newton với animation mượt mà
- **Phân tích điểm khởi tạo**: Đánh giá và đưa ra gợi ý về điểm khởi tạo
- **Đồ thị tương tác**: Zoom, pan và xem chi tiết đồ thị hàm số
- **Hiệu ứng**: Hiệu ứng pháo hoa khi tìm được nghiệm chính xác

## 🚀 Cài đặt

1. Clone repository:
```bash
git clone https://github.com/yourusername/newton-approximation.git
cd newton-approximation
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy development server:
```bash
npm run dev
```

4. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt

## 🛠️ Công nghệ sử dụng

- **Next.js**: Framework React cho web
- **TypeScript**: Ngôn ngữ lập trình type-safe
- **Tailwind CSS**: Framework CSS utility-first
- **shadcn/ui**: Component library
- **Canvas API**: Vẽ đồ thị và animation
- **Math.js**: Xử lý biểu thức toán học

## 📚 Hướng dẫn sử dụng

### 1. Nhập phương trình
- Nhập phương trình dạng f(x) = 0 (ví dụ: x^3 - 7)
- Hỗ trợ các hàm: sin, cos, tan, log, ln, sqrt, exp
- Sử dụng ^ cho lũy thừa

### 2. Chọn điểm khởi tạo
- Nhập giá trị x₁ ban đầu
- Xem phân tích điểm khởi tạo để chọn điểm phù hợp

### 3. Sử dụng máy tính
- Nhập công thức Newton vào máy tính
- Nhấn = liên tục để tìm nghiệm
- Xem kết quả và so sánh với nghiệm chính xác

### 4. Xem animation
- Nhấn "Chạy" để xem animation
- Điều khiển: Tiến, Lùi, Dừng, Reset
- Zoom và pan đồ thị để xem chi tiết

## 🎯 Ví dụ

1. Giải phương trình x³ - 7 = 0:
   - Phương trình: x^3 - 7
   - Điểm khởi tạo: x₁ = 2
   - Công thức Newton: Ans - (Ans^3 - 7)/(3*Ans^2)

2. Giải phương trình sin(x) = x/2:
   - Phương trình: sin(x) - x/2
   - Điểm khởi tạo: x₁ = 1
   - Công thức Newton: Ans - (sin(Ans) - Ans/2)/(cos(Ans) - 0.5)

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

## 📝 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👥 Tác giả

- Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Cảm ơn

- [shadcn/ui](https://ui.shadcn.com/) cho component library
- [Next.js](https://nextjs.org/) cho framework
- [Tailwind CSS](https://tailwindcss.com/) cho styling