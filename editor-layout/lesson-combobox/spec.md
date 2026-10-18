# Tên bài · combobox gợi ý (form Tạo giáo án, home v2) · 18/10

Mock: `lesson-combobox/index.html?state=a|b|c|d` (`&kb=1` giả lập bàn phím ảo 300px). Ảnh: `shots/state-{a,b,c,d,a-keyboard}-{375x812,820x1180}.png`.
Dữ liệu: 151 bài KNTT Toán 6–9 từ `muc-luc-toan-6-9-kntt.md` (chỉ dòng "Bài n"; bỏ Luyện tập chung, Bài tập cuối chương, hoạt động trải nghiệm). Đóng gói tĩnh, không gọi API, **không có trạng thái loading**.

## Phạm vi (tối thiểu)
- Chỉ ô `Tên bài` đổi thành combobox. Không màn/bước mới. Các ô khác giữ nguyên.
- Giá trị gửi vẫn là chuỗi tên bài (API không đổi). Gõ tự do ngoài danh sách vẫn hợp lệ.
- Nút `Tạo` vẫn `disabled` khi tên rỗng sau trim; dòng nhắc `Nhập tên bài để tạo.` như cũ. `Huỷ` không đổi.

## Hành vi
- Mở danh sách khi đã gõ ≥1 ký tự (không mở khi focus ô rỗng).
- Lọc theo Khối đang chọn. So khớp **không phân biệt hoa thường và dấu** (bỏ dấu, đ→d), khớp chuỗi con. Bài bắt đầu bằng chuỗi gõ lên trước, sau đó theo số bài.
- Phần khớp tô đậm màu #1d4ed8 (không nền).
- Tối đa **8** mục. Hơn 8: dòng cuối xám `Gõ thêm để thu hẹp ({n} bài)` (role=presentation).
- Chọn: chạm/click, hoặc ↑/↓ rồi Enter. Chọn xong đóng danh sách, điền đúng tên bài.

## Trạng thái và khuyến nghị
- **(a) Có gợi ý.** Mỗi dòng: tên bài (15px g900) + dòng phụ xám `Bài n · Chương R` (12px g500). Khuyến nghị **có dòng phụ**: tên trùng hoặc gần giống giữa các chương, số bài giúp GV nhận ra đúng bài theo sách. Dòng cao ≥52px (2 dòng tên ở 375 → ~71px).
- **(b) Không khớp.** Giữ nguyên chữ đã gõ. **Không có dòng `Dùng "…"`.** Đóng danh sách, dòng nhắc xám dưới ô: `Không có trong mục lục Lớp {k}. Vẫn tạo được.` Lý do: gõ tự do vốn hợp lệ; thêm dòng giả lập lựa chọn chỉ tốn một lần chạm.
- **(c) Chưa chọn Khối.** Prod mặc định Khối 8 nên hiếm gặp. Khuyến nghị **dòng nhắc `Chọn Khối để xem gợi ý.`**, không hiện cả 4 lớp gộp nhóm (dài, dễ chọn nhầm lớp).
- **(d) Đổi Khối sau khi đã chọn một bài của lớp khác.** **Giữ nguyên chữ**, hiện ghi chú nhẹ (chữ g700, vạch trái #d97706): `Bài này ở Lớp {cũ}, không phải Lớp {mới}.` Không bao giờ tự xoá. Chỉ hiện khi giá trị vẫn đúng là bài đã chọn; nếu GV đã sửa chữ thì là gõ tự do, không ghi chú.
- **(e) 375 / 820.** Danh sách nằm ngay dưới ô, phủ lên form (không đẩy layout). `max-height = min(6 dòng × 52 + 8, khoảng từ đáy ô tới đỉnh bàn phím − 8)`, tính lại theo `visualViewport.resize`; tối thiểu 2 dòng. Ở 375 có bàn phím: ~202px (≈3–4 dòng), cuộn trong danh sách (`overscroll-behavior: contain`). Ở 820 bàn phím không chạm danh sách.

## ARIA (WAI-ARIA combobox, list autocomplete)
- Input: `role=combobox`, `aria-autocomplete=list`, `aria-expanded`, `aria-controls=lb`, `aria-activedescendant` = id dòng đang chọn, `aria-describedby` = dòng nhắc, `autocomplete=off`, 16px.
- `<ul role=listbox aria-label="Gợi ý tên bài">`, mỗi dòng `role=option` + `aria-selected`.
- Phím: ↓ mở/xuống, ↑ lên (vòng), Enter chọn khi có dòng active (không submit), Esc đóng danh sách (Esc lần 2 mới đóng dialog). Focus luôn ở input.
- Vùng `aria-live=polite` (ẩn): `{n} gợi ý. Dùng phím mũi tên để chọn.` / `Không có gợi ý.` / `Đã chọn {tên}.`
- Dòng active: nền #eff6ff + vạch trái 3px #2563eb. Focus ring input 2px #2563eb offset 2.

## AC
1. Gõ `goc` ở Khối 7 → 4 bài, phần "góc" tô đậm, đọc "4 gợi ý…".
2. Khối 6, gõ `phan so` khớp `Mở rộng phân số. Phân số bằng nhau` (bỏ dấu, hoa thường).
3. Gõ tên không có → không danh sách, nhắc (b), nút `Tạo` bật, gửi đúng chữ đã gõ.
4. Chọn bài lớp 7 rồi đổi Khối 8 → chữ giữ nguyên, ghi chú (d).
5. ≤8 mục; dòng ≥44px; tối đa ~6 dòng thấy được; không cuộn ngang 320/375.
6. Không gọi mạng khi gõ.

## Cập nhật 18/10 (Huy duyệt mock 4 trạng thái lúc 11:01)
- Nút gửi của form ghi **`Tạo`**, không có icon +. Lúc gửi vẫn `Đang tạo…`. Tiêu đề form vẫn `Tạo giáo án mới`. Áp cho cả nút đầu trang và thẻ trống ở home v2.
