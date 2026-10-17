# Danh sách giáo án (home) v2 · spec

Mock: `home-v2/index.html?view=empty|list|create|create-filled|create-quota&acct=1&bare=1`.
- "Trước" là ảnh prod của Critiquito (`/workspace/critiques/prod-review/05*`, `06*`).
- Ảnh đơn: `shots/h2-{view}-{820x1180,375x812,320x568}.png`.
- Ảnh trước/sau: `shots/ba-{empty,list,create,create-quota}-{820x1180,375x812}.png`.
- Chỉ là mock, chưa giao Dev FE.

Token khóa: #2563eb, #1d4ed8, #eff6ff, #bfdbfe, g50–g900, #059669, #d97706. Font Inter. Không dark mode.

## 1. Header
- Bên trái: logo và `GiaoAn AI`.
- Bên phải: nút tài khoản. Nút có email (ẩn ở ≤600px) và avatar chữ cái đầu. Thuộc tính `aria-haspopup=menu`, `aria-expanded`, `aria-label="Tài khoản {email}"`.
- Menu: `role=menu`, gồm dòng email (13 g500) và `Đăng xuất` (menuitem, 44px). Esc đóng menu và trả focus về nút. Giống editor v2.
- Bỏ link `Đăng xuất` trần trên header.

## 2. Trống lần đầu (`empty`)
- Tiêu đề trang `Giáo án của tôi` (22/600), dòng phụ `0 tiết`. Bỏ "· Toán · Ngữ văn · Tiếng Anh".
- Không có bảng, không có tiêu đề cột, không có chip lọc, không có ô tìm. Nút `+ Tạo tiết mới` ở góc trên bị ẩn để chỉ còn **một** CTA.
- Thẻ giữa trang (max-width 440, radius 16, viền g200, padding 32/24, margin-top 40):
  - Cú mascot `assets/owl-mascot-256.svg` (từ `/workspace/owl-icon/png/owl-mascot-512.png`, nền trong), hiển thị 112px, `alt=""`.
  - Tiêu đề **Chưa có giáo án** (20/600, h2).
  - Dòng phụ `AI soạn theo khung Phụ lục IV. Bạn sửa rồi xuất Word.` (15 g600). Không dùng "KHBĐ".
  - Nút chính `+ Tạo tiết mới`.

## 3. Có giáo án (`list`)
- Dòng phụ `{n} tiết`. Nút `+ Tạo tiết mới` ở bên phải tiêu đề.
- Ẩn chip lọc môn vì hiện chỉ có Toán; khi có ≥2 môn thì hiện lại.
- Chip lọc trạng thái: `Tất cả · Đã soạn · Cần soát`.
  - `aria-pressed`. Vùng chạm 44px, phần nhìn thấy 32px. Chữ 14.
  - Chip đang chọn nền g100, chữ g900/600.
- Ô tìm: cao 44, chữ **16px** (iOS không tự zoom), placeholder `Tìm tiết…`, `aria-label`.
- ≥601px dùng bảng 4 cột: Tên tiết · Khối · Trạng thái (pill: Đã soạn xanh lá / Đã sửa xanh dương / Gần SGK amber) · Cập nhật. Cột Môn bị bỏ. Hàng cao 56, link ở tên tiết.
- ≤600px dùng thẻ: tên (16/600) và một dòng `Lớp 7 · pill · thời gian`. Cả thẻ là link.

## 4. Form tạo (`create`, `create-filled`)
- Dòng phụ `AI soạn theo khung Phụ lục IV.` (bỏ "KHBĐ").
- Môn: khung chỉ đọc `Toán`, vì chỉ có một môn. Khối: select.
- Tên bài / tiết: **để trống**, placeholder `Ví dụ: Phương trình bậc nhất một ẩn`. Ô nhập 16px, cao 48.
- Nút `Tạo & mở editor` bị `disabled` khi tên trống (sau khi bỏ khoảng trắng đầu cuối). Dòng nhắc `Nhập tên bài để tạo.` gắn qua `aria-describedby`. Có tên thì dòng nhắc biến mất và nút bật.
- Thời lượng và Loại bài giữ như prod. Loại bài dùng `role=radiogroup` với các `radio`, mỗi lựa chọn cao 52.
- Select tự vẽ (`appearance:none` kèm chevron g500) để WebKit không hiện nền xám.

## 5. Biến thể lượt dùng (`create-quota`) · **chờ Huy quyết**
- Ở chân form, bên trái: `Dùng 1 lượt (còn 4)` kèm nhãn `Chờ Huy`. Nhãn chỉ có trong mock.
- Chưa làm nếu Huy chưa duyệt. Còn mở: hết lượt thì làm gì, con số lấy từ đâu (BE).

## 6. Kiểm tra (WebKit 320/375/820)
- Không có cuộn ngang. Không có control nào thấp hơn 44px.
- Focus: `outline 2px #2563eb, offset 2px`. Dialog có `aria-modal` và `aria-labelledby`.
