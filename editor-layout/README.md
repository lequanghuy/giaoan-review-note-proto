# ga-editor-layout

- `findings.md` phân tích mẫu HK1 + HK2 (số đo thật, kể cả hình)
- `proposal.md` đề xuất bố cục, đổi/giữ, câu hỏi cho Huy/BA/Techlead
- `index.html` trang xem tổng hợp (khung iPad/desktop/mobile nhúng)
- `app.html` editor mockup chạy được (phương án A)
- `shots/` ảnh Chrome headless: 820×1180, 1180×820, 1280, 390
- `data/` script phân tích + bảng số liệu từng bài; `media/hk1`, `media/hk2` ảnh trích từ docx (chỉ trên box); `assets/` 6 hình SVG tự vẽ dùng trong mockup; `ref/` ảnh Figma 3-2

Tham số `app.html`:
- `lesson=demo-chart` (mặc định, hình SVG tự vẽ + bảng + phân số) | `demo-div` (ký hiệu ⋮ / ⋮̸, c) rỗng ở A). Bài minh hoạ trung tính, không lấy từ sách. `hk2-40`/`hk1-8` là bí danh cũ.
- `tab=soan|xem` · `open=0..3` (hoạt động mở, -1 đóng hết) · `sub=0|1`
- `save=saved|saving|net|data` · `kbd=1` (giả lập bàn phím + thanh ký hiệu)
- `hvn=off` (đã xoá phần Hướng dẫn về nhà) · `hvn=edit` (mở sẵn khối) · `word=1` (Xem trước Word)
- `view=create` (form tạo giáo án) · `type=bai-moi|luyen-tap-chung|on-tap|thuc-hanh` · `grade=6..9`
- `mode=current` (dựng lại cấu trúc editor hiện tại để so chiều cao)
- `scroll=act-1` · `img=demo-cot-2.svg` (mở bảng hình, thiếu mô tả) · `add=1` (bảng Thêm hình) · `info=1` (mở Thông tin chung + Loại bài, Đề xuất) · `type=…` (Loại bài, Đề xuất) · `toc=1` (mở Mục lục)
- Trạng thái chờ / tải (proposal mục 11): `view=list&state=loading|loading-long|error|empty|ready|row-opening` · `state=opening|opening-error|generating|generating-long|generating-error|generating-timeout|revising|revise-error|exporting|exported|export-error|xem-loading|compare-loading` · `view=create&state=busy|error` · `add=1&state=uploading|upload-error` · `motion=reduce` · `t=giây` · `live=1` (giả lập độ trễ thật; `&fail=1` luôn thất bại, `&delay=ms`)

Chạy ảnh: `NODE_PATH=/usr/local/lib/node_modules node shots.js && node shots-kbd.js && node shots-load.js`
