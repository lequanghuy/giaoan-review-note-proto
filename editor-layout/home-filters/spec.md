# Home · hàng lọc (iPad/desktop/phone) · 3 phương án · 18/10

Mock: `home-filters/index.html?opt=a|b|c` (`&open=1` mở dropdown/popover/sheet, `&mon=Ngữ văn&st=ok` trạng thái đã lọc). Dữ liệu mẫu 5 môn.
Ảnh: `shots/opt-{a,b,c}-{default,open,filtered}-{820x1180,1180x820,375x812}.png`.

Vấn đề prod (ảnh Huy 11:18): hai chip `Tất cả`; chip môn và chip trạng thái khác cỡ/kiểu nhưng chung một hàng; chip môn nằm ngang không mở rộng được khi nhiều môn.

Chung cho cả 3: mỗi control đúng một `Tất cả` (Môn dùng `Tất cả môn`). Môn ẩn khi chỉ có 1 môn (như hiện nay); khi đã lọc 1 môn thì ẩn cột Môn. Vùng chạm ≥44px. Ô tìm 44px, chữ 16px. Nút đầu trang `Tạo` (`aria-label="Tạo giáo án"`). `Huỷ`. Token khoá, Inter.

## A · Môn dạng dropdown + trạng thái dạng segmented (khuyến nghị)
- iPad/desktop: một hàng `[Tất cả môn ▾] [Tất cả | Đã soạn | Gần SGK] [Tìm giáo án…]`.
- Phone: Môn (dòng 1), segmented full width (dòng 2), tìm (dòng 3).
- Môn: nút `aria-haspopup=listbox` mở listbox (dòng 44px, dấu ✓, số giáo án mỗi môn xám). Nhiều môn: listbox cuộn, max ~8 dòng. Đang lọc môn: nút nền #eff6ff viền #2563eb.
- Trạng thái: `role=radiogroup`, mỗi nút `role=radio` + `aria-checked`; nền g100, mục chọn nền trắng. Cao 38 + vùng chạm mở rộng 44.
- Lý do: hai control khác hình dạng nên không lẫn; dropdown mở rộng cho bao nhiêu môn cũng được; trạng thái (3 lựa chọn cố định) vẫn 1 chạm. Ít thay đổi nhất so với prod.

## B · Tìm + nút `Lọc` (popover iPad/desktop, bottom sheet phone)
- Hàng: `[Tìm giáo án…] [≡ Lọc (n)]`. Popover 340px / sheet đáy (`role=dialog`, `aria-modal` ở phone): nhóm `Môn` (listbox cuộn) và `Trạng thái` (segmented). Chân: `Huỷ` · `Xem {n} giáo án`.
- Lọc đang dùng hiện chip xoá được dưới hàng (`Ngữ văn ×`, `Đã soạn ×`, `Xoá lọc`); chip 36px + vùng chạm 44.
- Gọn nhất, mở rộng tốt, nhưng trạng thái (dùng thường) cần 2–3 chạm.

## C · Môn trong tiêu đề + tab trạng thái có số
- Tiêu đề `Giáo án tất cả môn ▾` / `Giáo án Ngữ văn ▾` là nút mở listbox Môn (phạm vi trang).
- Tab `Tất cả n · Đã soạn n · Gần SGK n` (`role=tablist`), gạch chân #2563eb; ô tìm bên dưới.
- Đẹp, có số đếm, nhưng tiêu đề kiêm control khó nhận ra là bấm được; tiêu đề đổi theo môn.

## Khuyến nghị
**A.** Ít rủi ro, ít việc FE, rõ ràng trên iPad. Có thể thêm số đếm ở segmented sau (như C) nếu Huy muốn.

---

# Kiểu C — chốt 18/10 (Huy chọn 11:25)

Mock: `index.html?opt=c` (live: bấm, phím đều chạy). Tham số: `&one=1` (1 môn), `&open=1`, `&mon=Ngữ văn`, `&mon=Hoạt động trải nghiệm, hướng nghiệp` (tên dài), `&mon=Ngữ văn&st=fl` (tab 0), `&focus=1`.
Ảnh: `shots/opt-c-{one,many,open,selected,long,zero,focus,keyboard}-{820x1180,1180x820,375x812}.png`. Phương án A/B giữ để tham khảo, không làm.

## Cấu trúc
```html
<div class="h1wrap">            <!-- position:relative, neo listbox -->
  <h1>Giáo án <button id="sb" type="button" aria-haspopup="listbox" aria-expanded="false"
       aria-controls="sl" aria-label="Chọn môn, đang xem: Tất cả môn">
       <span>Tất cả môn</span><svg aria-hidden="true">chevron</svg></button></h1>
  <ul id="sl" role="listbox" tabindex="-1" aria-label="Môn" aria-activedescendant="so0">…</ul>  <!-- NGOÀI h1 -->
</div>
<p>{n} giáo án</p>
<div role="tablist" aria-label="Trạng thái"> <button role="tab" aria-selected aria-controls="lp">Tất cả <span>{n}</span></button> … </div>
<div id="lp" role="tabpanel" aria-labelledby="t-…">bảng / thẻ</div>
```
Listbox đặt ngoài `<h1>` để tên heading chỉ là "Giáo án {môn}".

## Nút môn (affordance)
- Chữ môn xanh #1d4ed8, 24px/700 (20px ở ≤600px), chevron 20px luôn hiện, xoay 180° khi mở (tắt khi `prefers-reduced-motion`).
- Viền 1px #bfdbfe, bo 10px, nền trắng. Hover / nhấn / đang mở: nền #eff6ff. Cao 44px. Focus 2px #2563eb offset 2.
- Tên dài: cắt `…` một dòng, `title` = tên đầy đủ; ở 375 nút không đẩy nút `Tạo` xuống (max-width = viewport − 32 − nút Tạo − "Giáo án").

## Trạng thái
1 môn: không có nút, heading thường `Giáo án của tôi`, không cột Môn · nhiều môn: `Giáo án [Tất cả môn ▾]`, có cột Môn · mở: listbox ✓ + số · đã chọn môn: `Giáo án [Ngữ văn ▾]`, ẩn cột Môn, số trên tab tính theo môn · tab 0: vẫn hiện, panel ghi `Không có giáo án khớp.`

## Acceptance criteria (Dev FE)
1. Chỉ có 1 môn trong dữ liệu: heading là chữ thường `Giáo án của tôi`, không có nút chọn môn, không cột/không dòng Môn.
2. Từ 2 môn: heading `Giáo án` + `<button>` thật nằm trong `<h1>`, mặc định nhãn hiển thị `Tất cả môn`.
3. Nút có `aria-haspopup="listbox"`, `aria-expanded` đúng trạng thái, `aria-controls` trỏ listbox, `aria-label="Chọn môn, đang xem: {môn hoặc Tất cả môn}"`.
4. Nút: chevron luôn hiện; chữ #1d4ed8; viền #bfdbfe; nền #eff6ff khi hover/nhấn/mở; cao ≥44px; focus-visible 2px #2563eb offset 2px.
5. Listbox nằm ngoài `<h1>`; dòng đầu `Tất cả môn`, sau đó các môn theo thứ tự cố định; mỗi dòng ≥44px, có số giáo án (xám, toàn bộ, không theo tab) và ✓ ở mục đang chọn (`aria-selected=true`).
6. Listbox cao tối đa 8 dòng (~364px), quá thì cuộn trong listbox; mục active luôn được cuộn vào tầm nhìn.
7. Bàn phím: trên nút, Enter/Space mở và đưa focus vào listbox; ↓/↑ cũng mở. Trong listbox: ↑/↓ di chuyển (`aria-activedescendant`), Home/End, Enter/Space chọn và đóng, Esc đóng và trả focus về nút, Tab đóng không chọn.
8. Chạm/click ngoài listbox thì đóng, không đổi môn. Chạm một dòng thì chọn và đóng.
9. Chọn môn: nhãn nút + aria-label đổi theo môn; ẩn cột Môn (bảng) và tiền tố môn (thẻ); dòng `{n} giáo án` và số trên cả 3 tab tính lại theo môn.
10. Tab trạng thái: `role=tablist` / `role=tab` + `aria-selected` + `aria-controls`; một tab `tabindex=0` (roving); ←/→ đổi tab, Home/End; cao 44px; tab chọn chữ #1d4ed8, gạch chân 2px #2563eb, số nền #eff6ff.
11. Mỗi tab luôn hiện số (`Tất cả n · Đã soạn n · Gần SGK n`), kể cả 0. Tab có 0 vẫn chọn được; panel hiện `Không có giáo án khớp.`
12. Chỉ một `Tất cả` trong hàng tab; listbox dùng `Tất cả môn`.
13. Tên môn dài cắt `…` trong nút (1 dòng, có `title`) và trong ô Môn của bảng (có `title`); ở 375 nút `Tạo` vẫn cùng hàng, không cuộn ngang.
14. iPad 820/1180 và phone 375: không cuộn ngang; bảng ≥601px, thẻ ≤600px như home v2; listbox không bị cắt bởi màn hình.
15. Ô tìm giữ nguyên (44px, 16px, `Tìm giáo án…`) và lọc trong kết quả của môn + tab đang chọn.
16. Môn đang chọn giữ khi đổi tab và ngược lại; không lưu qua phiên (mặc định `Tất cả môn`, tab `Tất cả`).
