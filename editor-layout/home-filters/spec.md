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
