# Danh sách giáo án (home) v2 · spec (đã áp BA review 18/10)

Mock: `home-v2/index.html?view=empty|list|create|create-filled|create-quota&acct=1&bare=1`.
- Ảnh đơn: `shots/h2-{view}-{820x1180,375x812,320x568}.png`.
- Ảnh trước/sau: `shots/ba-{empty,list,create,create-quota}-{820x1180,375x812}.png`. "Trước" của list là `/workspace/critiques/prod-editor/01_lesson-list_*`; của empty và create là `/workspace/critiques/prod-review/05*`, `06*`.
- Chỉ là mock, chưa giao Dev FE.

Token khóa: #2563eb, #1d4ed8, #eff6ff, #bfdbfe, g50–g900, #059669, #d97706. Font Inter. Không dark mode.

**Danh từ:** dùng thống nhất **giáo án**, không dùng "tiết". Cụ thể: `{n} giáo án`, `Tạo giáo án` (dấu + là icon SVG aria-hidden), cột `Tên bài`, form `Tạo giáo án mới`, nút `Tạo giáo án`, `Tìm giáo án…`. Dùng `Huỷ` như prod; cần kiểm cả app (câu hỏi mở).

## 1. Header
- Logo kèm `GiaoAn AI`. Bên phải là nút tài khoản (email ẩn ở ≤600px, avatar luôn hiện).
- Nút có `aria-haspopup=menu`, `aria-expanded`, `aria-label="Tài khoản {email}"`.
- Menu `role=menu`: dòng email và `Đăng xuất` (44px). Esc đóng menu và trả focus về nút. Giống editor v2.

## 2. Trống (n = 0)
- Tiêu đề `Giáo án của tôi`. **Không có dòng phụ.**
- Không có bảng, tiêu đề cột, chip, ô tìm, nút góc trên.
- Thẻ giữa trang:
  - Cú mascot `assets/owl-mascot-256.svg` (bọc PNG nền trong), 112px, `alt=""`.
  - `Chưa có giáo án`.
  - `AI soạn theo khung Phụ lục IV. Bạn sửa rồi xuất Word.`
  - Nút duy nhất `Tạo giáo án`.

## 3. Có giáo án
- Dòng phụ `{n} giáo án`. Nút `Tạo giáo án` ở bên phải.
- Không có chip môn và cột Môn khi chỉ có một môn.
- Chip trạng thái `Tất cả · Đã soạn · Gần SGK`:
  - Tên chip khớp pill.
  - Vùng chạm 44px, `aria-pressed`. Chip đang chọn nền g100.
- Ô tìm cao 44, chữ 16px.
- Bảng (≥601px): Tên bài · Khối · Trạng thái · Cập nhật. Tên dài cắt `…` kèm `title`.
- Thẻ (≤600px): dòng 1 là tên (16/600, tối đa 2 dòng) và pill. Dòng 2 xám (14 g500): `Lớp 9 · v3 · {cập nhật}`.
- Dữ liệu mẫu: 6 giáo án, lấy nguyên văn tên bài KNTT, đúng lớp (`/workspace/muc-luc-toan-6-9-kntt.md`):

  | Tên bài | Lớp | Trạng thái |
  |---|---|---|
  | Đơn thức | 8 | Đã soạn |
  | Giải hệ hai phương trình bậc nhất hai ẩn | 9 | Đã sửa |
  | Hai đường thẳng song song và dấu hiệu nhận biết | 7 | Gần SGK |
  | Định lí và chứng minh định lí | 7 | Đã soạn |
  | Tập hợp | 6 | Gần SGK |
  | Phân thức đại số | 8 | Đã soạn |

  Editor v2 cũng đổi tên bài mẫu thành `Đơn thức — lớp 8`.

## 4. Form tạo
- Tiêu đề `Tạo giáo án mới`, dòng phụ `AI soạn theo khung Phụ lục IV.`
- Môn: chỉ đọc `Toán`. Khối: select.
- `Tên bài`:
  - Rỗng, `maxlength=120`.
  - Placeholder đổi theo Khối:
    - 6: `Ví dụ: Tập hợp`
    - 7: `Ví dụ: Tổng các góc trong một tam giác`
    - 8: `Ví dụ: Phân thức đại số`
    - 9: `Ví dụ: Giải hệ hai phương trình bậc nhất hai ẩn`
- Nút `Tạo giáo án` `disabled` khi tên rỗng sau trim. Dòng nhắc `Nhập tên bài để tạo.` gắn qua `aria-describedby`, ẩn khi đã có tên.
- Gợi ý tên bài từ mục lục KNTT bằng combobox là **task riêng**, chờ Huy; không có trong v2.

## 5. Biến thể lượt (`create-quota`) · **chờ Huy**
- `Dùng 1 lượt (còn 4)`. Số lấy từ hạn mức BE-3, FE không tự tạo số.
- BA đề xuất để sau UAT.

## 6. AC (theo BA, mock đã đáp ứng)
1. n = 0: không có bảng, chip, ô tìm, nút góc trên. Có đúng 1 nút `Tạo giáo án`. Ẩn dòng `0 …`. ✓
2. Chỉ có 1 môn: không có chip môn, không có cột Môn. Có ≥2 môn thì chip hiện lại. Dev FE test bằng dữ liệu giả 2 môn.
3. Form mở: Tên bài rỗng. Nút tạo `disabled` khi tên rỗng sau trim (thử `"   "`). Dòng nhắc gắn `aria-describedby`. Có tên thì nút bật ngay khi gõ (≤100 ms). ✓ (mock có `oninput`)
4. Tên bài: `maxlength=120`. Danh sách cắt `…` kèm `title` đủ. Không cuộn ngang ở 320/375. ✓
5. Chip `Gần SGK` = verdict `flagged`, gồm cả legacy. Chip `Đã soạn` = không flagged, gồm `Đã sửa`. Mẫu có 6 giáo án: Gần SGK 2, Đã soạn 4.
6. Cập nhật: hôm nay `hh:mm`, hôm qua `Hôm qua`, trong năm `dd/mm`, khác năm `dd/mm/yyyy`, theo giờ Việt Nam. Áp cho cả bảng và dòng 2 của thẻ. Mẫu có `08:41` · `Hôm qua` · `15/10` · `12/05/2025`.
7. Mọi control ≥44px. Ô nhập 16px. Focus 2px #2563eb, offset 2. Dialog có `aria-modal` và `aria-labelledby`. Esc đóng dialog và trả focus về nút mở. ✓ (đo WebKit 320/375/820)
8. 100% tên bài mẫu khớp nguyên văn mục lục KNTT, đúng lớp. ✓

## Câu hỏi mở
- Dòng 2 của thẻ: lần trước dùng ví dụ `9 ngày trước`, nhưng AC 6 dùng ngày tuyệt đối. Mock theo AC 6.
- `Huỷ` hay `Huỷ` toàn app.
- Pill `Đã sửa` cần `edited_at` ở server (GA-49).


## Empty state (cập nhật 18/10)
- Minh hoạ `assets/empty-lesson.svg` (phương án 1: trang giáo án + huy hiệu cộng #bfdbfe/#2563eb), thay cú. Không dùng icon app.
- Ảnh 112px dưới 640px, 160px từ 640px. `alt=""`; SVG có `aria-hidden="true" focusable="false"`, không role="img".
- Nét 2.5px cho viền trang, góc gấp, dòng xám. Chỉ nút là khối xanh đặc.
- Nhãn nút thống nhất `Tạo giáo án`, dấu + là icon aria-hidden.
