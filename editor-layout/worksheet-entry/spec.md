# Tab "Phiếu bài tập" (phương án B) · spec cho Dev FE

> **Cập nhật 18/10 (critique, Huy duyệt) — các điểm dưới đây thắng nội dung cũ:**
> - **Bỏ badge số câu trên tab.** Tab chỉ có chữ `Phiếu bài tập` / `Phiếu`. Số câu nằm ở tiêu đề thẻ: `Phiếu bài tập · 6 câu`, với phần `· 6 câu` màu g500. Lúc đang tạo cũng không có chấm trên tab, trạng thái chỉ hiện trong panel. aria-label của tab chỉ là "Phiếu bài tập".
> - **Chưa lưu được:** ẩn nút Tạo phiếu, chỉ còn **Về tab Soạn**. Bên dưới vẫn có tiêu đề và lý do của trạng thái trống, nhưng không có nút.
> - **Một tên cho việc tạo lại:** `Tạo lại phiếu` (bỏ "Soạn lại phiếu"), kèm ghi chú `Phiếu mới thay phiếu hiện tại.` Ô ghi chú đổi nhãn thành `Yêu cầu cho phiếu mới · không bắt buộc`. Trạng thái "giáo án đã sửa" dùng cùng nút này.
> - **Câu hỏi:** hiện 3 câu, rồi nút `Xem thêm 3 câu` (button có aria-expanded, mở xong thì focus vào câu 4).
> - **Lỗi nói rõ nguyên nhân nếu biết:** `Chưa tạo được phiếu: mất kết nối.` · `Chưa tạo được phiếu: hết thời gian chờ.` Không rõ nguyên nhân thì dùng `Chưa tạo được phiếu.` Luôn có nút **Thử lại**.
> - **18/10: Huy duyệt ẩn So sánh → 3 tab `Soạn · Xem · Phiếu`** (mục §2 cũ về 4 tab không còn áp dụng; ≤480 vẫn segmented nhãn ngắn). `Tạo phiếu bài tập` chỉ có ở tab Phiếu.
> - Tab nằm trong segmented control mới (xem `../editor-v2/spec.md` §6). Mock: `../editor-v2/index.html?view=ws-ready|ws-blocked|ws-error`.


Huy chọn B (Captain chuyển, 13/10/2026). Mock: `index.html?state=empty|generating|ready|error|stale|blocked&tab=ws|soan&bare=1`.
Ảnh: `shots/B-{state}-{820x1180,1180x820,375x812,320x568}.png`, ảnh ghép `shots/B-cmp-{size}.png`.
Chỉ là mock. Code hiện tại: `apps/web/src/components/editor/editor-view.tsx` (1a00979).

## 1. Thay đổi so với prod
- **Bỏ** nút `Tạo phiếu bài tập` ở cuối thẻ giáo án (cạnh "Soạn lại giáo án", ~dòng 728–736). "Soạn lại giáo án" giữ nguyên chỗ cũ.
- **Bỏ** thẻ `<Card>` "Phiếu bài tập" riêng nằm dưới giáo án (~dòng 754–764). Nội dung `WorksheetPanel` chuyển vào tabpanel `panel-ws`.
- **Thêm** tab thứ 4 `Phiếu bài tập` vào tablist Soạn / Xem như giáo án / So sánh. Tab **không sticky**, giống các tab cũ.
- Khi mở tab Phiếu, ẩn hàng chip mục lục và thẻ giáo án. Hàng meta (v11 · pill · Phụ lục IV) vẫn hiện.
- `saveBlocked === "worksheet"`: báo lỗi hiện trong tab Phiếu, không hiện ở cuối thẻ giáo án.

## 2. Bố cục tablist
- ≥481px: giữ kiểu hiện tại. Nút rời, gap 8px, min-height 44px, padding 0 14px, 14px/500, border g200, radius 8px. Đang chọn: nền #2563eb, chữ trắng.
- ≤480px: **một hàng dạng segmented**. Khung trắng, border 1px g200, radius 10px, padding 2px, gap 0. Mỗi tab `flex:1 1 0; min-width:0`, padding 0 4px, 13px, radius 8px, không border riêng.
  - Nhãn ngắn hiện ra: **Soạn · Xem · So sánh · Phiếu**. Nhãn đầy đủ nằm ở `aria-label`, bắt đầu bằng đúng chữ hiện ra (WCAG 2.5.3, label in name).
  - Đo: 375 → 4 × 86×44px. 320 → 4 × 73×44px. Không có chữ bị cắt. Trang không cuộn ngang.
- Lý do: không phải cuộn ngang (tab ẩn sẽ mất affordance), không wrap 2 hàng, và giữ ≥44px.

## 3. Badge trên tab Phiếu
- Đã có phiếu: số câu trong pill 11px/700, min-width 18, cao 18, radius 999, border #bfdbfe. Tab đang chọn: nền trắng, chữ #1d4ed8. Tab không chọn: nền #eff6ff.
- Đang tạo: chấm 8px #2563eb nhấp nháy 1.2s. `prefers-reduced-motion` thì đứng yên.
- Chưa có phiếu hoặc lỗi: không có badge.
- Badge `aria-hidden="true"`. Thông tin đưa vào nhãn của tab: `aria-label="Phiếu bài tập, 6 câu"` / `"Phiếu bài tập, đang tạo"` / `"Phiếu bài tập"`.

## 4. Trạng thái trong `panel-ws`
| state | Nội dung | Vai trò |
|---|---|---|
| empty | H3 "Chưa có phiếu bài tập" · "GiaoAn AI soạn phiếu từ Luyện tập và Vận dụng của giáo án này." · nút chính **Tạo phiếu bài tập** · ghi chú 13px g500 "Giáo án được lưu trước khi tạo phiếu." | — |
| generating | Khung xanh nhạt (#eff6ff / #bfdbfe) có spinner: "Đang tạo phiếu bài tập · thường dưới 1 phút" + 3 dòng skeleton · "Có thể chuyển tab khác, phiếu xong sẽ hiện ở đây." Mọi nút tạo/soạn lại phiếu disabled. | `role=status` `aria-live=polite` |
| ready | H2 "Phiếu bài tập · {n} câu" · phụ "Tạo lúc hh:mm · từ giáo án v{x}" · danh sách câu (WorksheetPanel) · "Yêu cầu soạn lại phiếu" + nút **Soạn lại phiếu** · ghi chú "Xuất Word gồm giáo án và phiếu này (kèm gợi ý đáp án)." | — |
| error | Khung đỏ nhạt (#fef2f2 / #fecaca): "**Chưa tạo được phiếu.** Thử lại." + nút chính **Thử lại** · dòng phụ "Giáo án không bị ảnh hưởng." Lỗi mạng: dùng chung "Chưa kết nối được. Thử lại." | `role=alert` |
| stale | Khung vàng (#fffbeb / #fde68a): "Giáo án đã sửa sau khi tạo phiếu." + nút **Tạo lại phiếu** (outline xanh). Bên dưới là phiếu cũ. Hiện khi phiên bản giáo án > phiên bản dùng tạo phiếu. | `role=status` |
| blocked (không lưu được) | Khung đỏ: "Chưa lưu được giáo án nên chưa tạo phiếu. Sửa các ô báo đỏ ở tab Soạn." + nút **Về tab Soạn** (chuyển tab và focus ô lỗi đầu tiên, như `issues.focusFirstInvalid`). Lỗi mạng: dùng `SAVE_ACTION_NETWORK`. Bên dưới vẫn là empty. | `role=alert` |

Copy: ngắn, chỉ nêu lý do, không "Vui lòng", tên là "GiaoAn AI". Không đưa "job" hay "máy chủ" ra giao diện.

## 5. Hành vi
- Bấm Tạo: chạy `handleWorksheet()` như hiện tại (lưu trước, rồi `createGenerateWorksheetJob`). Ở yên tab Phiếu, sang state generating. **Không** chuyển sang màn chờ giáo án.
- Trong lúc tạo phiếu, GV vẫn mở các tab khác được. Khi xong, badge số câu hiện lên tab. Nếu GV đang ở tab khác thì không tự nhảy tab.
- Thử lại: tạo lại job tạo phiếu với cùng giáo án.
- Tab mặc định khi mở editor vẫn là Soạn.

## 6. A11y
- `role=tablist aria-label="Chế độ xem"`. Mỗi tab có `role=tab id=tab-ws aria-controls=panel-ws aria-selected` và roving `tabindex` (0/-1). Phím ←/→/Home/End di chuyển focus. Enter/Space chọn tab.
- `role=tabpanel id=panel-ws aria-labelledby=tab-ws tabindex=-1`.
- Focus ring: `outline:2px solid #2563eb; outline-offset:2px`, áp cho tab, nút và chip.
- Sau khi tạo xong: nếu đang ở tab Phiếu, đặt focus vào H2 phiếu (tabindex=-1). Khi lỗi: đặt focus vào nút Thử lại.
- Tương phản: chữ #1d4ed8 trên #eff6ff đạt 6.7:1. Chữ g500 13px trên trắng đạt 4.8:1.

## 7. Xuất Word
- Hiện tại (`exportBodyForShownPlan(saved, worksheet?.id)` và `apps/api/src/export/docx.ts`): nếu đã có phiếu thì file Word **gồm** giáo án, rồi "PHIẾU BÀI TẬP", mỗi câu kèm "Gợi ý đáp án". Giữ nguyên hành vi này.
- Trong code chưa thấy tùy chọn in đáp án riêng. Xem mục 9.

## 8. Token
#2563eb, #1d4ed8, #eff6ff, #bfdbfe, các mức g50–g900, #059669, #d97706, #dc2626. Riêng nền và viền khung lỗi dùng #fef2f2 / #fecaca, khung vàng dùng #fffbeb / #fde68a, giống thẻ vàng đã duyệt. Font Inter. Không dark mode.

## 9. Câu hỏi mở
1. Mở lại editor thì phiếu có còn không? Hiện `worksheet` chỉ lấy từ job trong phiên (`worksheetFromJob`) và bị reset về null khi tải lại trang. Tab Phiếu cần API lấy phiếu mới nhất theo giáo án (Techlead/BE).
2. "In đáp án riêng": code hiện chưa có. Hiện đáp án in chung trong Word. Cần Huy xác nhận: thêm tùy chọn "Xuất phiếu không đáp án" hay giữ như cũ.
3. Cột "stale" cần lưu phiên bản giáo án lúc tạo phiếu (`worksheet.lessonPlanVersion`). Cần kiểm tra schema có trường này chưa.
