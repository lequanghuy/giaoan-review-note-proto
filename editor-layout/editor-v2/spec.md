# Editor v2 · spec (sửa theo critique, Huy duyệt 18/10/2026)

Mock: `editor-v2/index.html?view=done|flagged|flagged-legacy|blocked|ws-ready|ws-blocked|ws-error&acct=1&bare=1`. Nền là layout prod PR #75 (1a00979).
Ảnh: `shots/v2-{view}-{820x1180,375x812,1180x820,320x568}.png`. Ảnh trước/sau: `shots/ba-{done,flagged,ws-ready,ws-blocked}-{820x1180,375x812}.png`.
Chỉ là mock, chưa giao Dev FE.
Token khóa: #2563eb, #1d4ed8, #eff6ff, #bfdbfe, g50–g900, #059669, #d97706, #dc2626. Font Inter. Không dark mode.

## P1-1 · Cảnh báo SGK (một nghĩa)
- Thay tiêu đề cũ "Một số đoạn gần với SGK, bạn nên xem lại." (`FLAGGED_BANNER_TITLE`) và hộp "Cần đối chiếu SGK" bằng **một thanh**:
  - Nền trắng, viền g200, **viền trái 4px #d97706**, radius 8, chữ 15/600.
  - Nội dung: `3 đoạn gần với SGK.` rồi `‹ 1/3 ›` rồi **Xem**.
- **Xem**: cuộn tới và focus ô bị đánh dấu đầu tiên. Nếu ô nằm trong Hoạt động đang đóng thì mở ra trước.
- ‹ ›: đi tới ô trước / ô sau. Bộ đếm `aria-live=polite`. Chỉ có 1 đoạn thì ẩn ‹ ›.
- Pill ở hàng meta đổi theo đúng câu chữ đó: `3 đoạn gần SGK` (amber).
- Mỗi ô bị đánh dấu:
  - Vạch trái 4px #d97706 và tag `Gần SGK` (12/600, chữ #92400e, nền #fffbeb, viền #fde68a) cạnh nhãn.
  - Ô đang trỏ tới có thêm viền amber và ring 3px rgba(217,119,6,.18).
- Chip mục lục và dòng Hoạt động chứa ô bị đánh dấu có chấm amber 6–8px, kèm `aria-label`.
- Bỏ "bạn nên". Không hiện đoạn văn SGK.
- **Phụ thuộc API (Techlead xác nhận):**
  - Hiện chưa làm được: API chỉ trả `{verdict, reasonCodes, teacherMessage}`. Xem mục Ghi chú API.
  - Trước khi API có vị trí, chỉ hiện `Có đoạn gần với SGK.` cùng nút **Xem** dẫn tới mục III, và không có bộ đếm.

## P1-1b · Ba trạng thái SGK (Techlead chốt 18/10)
API mới (BE): `sgk: {count, items:[{path}]}`, với `path` dạng `activity:1:content`, `objectives:knowledge:0`… Server **không trả đoạn văn**. Nếu cần xem trước thì FE tự lấy chữ từ chính giáo án.

| Trạng thái | Khi nào | Thanh / hộp | Pill | Đánh dấu ô |
|---|---|---|---|---|
| `flagged` (có vị trí) | verdict `flagged` và có `items` | `3 đoạn gần với SGK.` · `‹ 1/3 ›` · **Xem** (viền trái amber) | `3 đoạn gần SGK` (amber) | Vạch trái amber cùng tag `Gần SGK` trên từng ô trong `items` |
| `flagged-legacy` | verdict `flagged` nhưng chưa có `items` (giáo án cũ) | `Có đoạn gần với SGK. Soát lại trước khi nộp.`, không có bộ đếm, không có Xem | `Gần SGK` (amber) | Không đánh dấu |
| `blocked` | verdict/status `blocked` (khớp tên bộ SGK, NXB hoặc tên bài; mã `hard_*`) | Khung đỏ nhạt trên cùng, `role=alert`, id `blkMsg`: **Chưa xuất được Word: giáo án có tên SGK, NXB hoặc tên bài SGK.** / `Xoá tên đó (ngoài mục II) rồi lưu lại.` | `Chưa xuất được` (đỏ) | Không đánh dấu từng ô |

Quy tắc:
- **Xem / ›**:
  - Từ `path` tìm ô tương ứng. Nếu ô nằm trong Hoạt động đang đóng thì mở ra (`aria-expanded=true`).
  - `scrollIntoView({block:"center"})`, chừa chỗ cho top bar 52px và hàng chip.
  - Focus vào ô (`preventScroll`), cập nhật `i/n`.
  - Bấm Xem lần nữa thì sang ô kế tiếp, tới cuối thì quay về ô đầu. ‹ đi lùi.
  - `n = 1` thì ẩn ‹ ›.
  - `path` không khớp ô nào (do schema lệch) thì bỏ qua ô đó, và không tính vào `n` hiển thị.
- **Sau mỗi lần lưu** (autosave hoặc lưu-trước-thao-tác):
  - Lấy `sgk` mới từ kết quả lưu rồi vẽ lại các vạch, tag, chấm trên chip và bộ đếm.
  - Giữ vị trí đang trỏ nếu ô đó vẫn còn trong `items`; nếu không thì về ô đầu.
  - `count = 0` thì ẩn thanh và pill quay về `Đã soạn`.
  - Không di chuyển focus của GV.
- **Legacy**: không đoán vị trí ở phía client. Khi GV lưu lại, server quét theo từng ô và trả `items`, lúc đó chuyển sang `flagged`.
- **Blocked**:
  - Code hiện tại khi tạo giáo án:
    - `editorSurface()` trả `"blocked"` và hiện thẻ `PlanGenerateFailure` (tiêu đề "Chưa soạn được giáo án", Thử lại, Sửa thông tin). Không hiện giáo án.
    - Mock này **không đổi** màn đó; nó chỉ áp cho trường hợp đã có giáo án và lần lưu sau đó bị chặn.
  - Khi lưu sau sửa (`save-plan.ts`):
    - Guardrail chạy lại. Nếu kết quả là blocked thì giáo án vẫn mở (`jobType editPlan`), nhưng Xuất Word bị từ chối (`isExportAllowed` false).
    - Lý do là `teacherMessage`: "Nội dung bị chặn vì khớp tên SGK/NXB/bài học. Không thể xuất Word/PDF." (`packages/guardrails/src/job-status.ts`).
    - Câu đó được rút gọn thành copy ở bảng trên. Bỏ "PDF" vì chưa có xuất PDF.
  - Nút Xuất Word dùng `aria-disabled=true` cùng `aria-describedby="blkMsg"` (để còn focus được và đọc lý do). Màu g200, chữ g600.
  - Lưu lại mà hết bị chặn thì khung đỏ biến mất.
  - FE nên hiển thị copy cố định theo `verdict`, không in nguyên `teacherMessage` từ server, vì câu `flagged` từ server vẫn có "vui lòng".

## P1-2 · Ô dạng danh sách (Kiến thức, Năng lực, Phẩm chất, Học liệu…)
- Đổi `<input>` một dòng (nối bằng "; ") sang **textarea tự giãn** (`field-sizing:content`, fallback tự đặt chiều cao theo scrollHeight). Hiện đủ mọi dòng, không có thanh cuộn trong ô.
- Mỗi ý một dòng. Tách và ghép bằng `\n`, giống Học liệu. Nhãn phụ `· mỗi dòng một ý`.
- Lỗi "0.;": do `list-draft-field.tsx` dùng ngăn cách `"; "` ghép sau câu đã có dấu chấm. Dùng `\n` thì hết.
  - `plan-diff.tsx` cũng đang `join("; ")`, nên đổi sang danh sách dòng.
  - Word export giữ như hiện tại (mỗi ý một dòng). Techlead cần kiểm lại `docx.ts`.

## P1-3 · Top bar điện thoại (≤720px)
- Thứ tự: `☰` (Mục lục, 44×44, aria-label "Mục lục"), tên giáo án (600, cắt có dấu "…", `title` = tên đủ), `← Danh sách` (link, aria-label "Về danh sách giáo án"), **Xuất Word**, rồi avatar mở menu tài khoản.
- Menu tài khoản: nút có `aria-haspopup=menu` và `aria-expanded`. `role=menu` gồm dòng email (13 g500) và `Đăng xuất` (menuitem, 44px). Esc đóng menu và trả focus về avatar.
- ≤359px: link về chỉ còn `←` (vẫn giữ aria-label), Xuất Word 13px.
- Đo: tên giáo án còn khoảng 61px ở 375 và 76px ở 320. Không có cuộn ngang. Xem câu hỏi mở 1.
- ≥721px: logo, breadcrumb `GiaoAn AI / Giáo án / tên`. Mỗi link ≥44px chiều cao. Xuất Word và avatar. Đăng xuất cũng nằm trong menu.

## P2
- **5 · Chip:**
  - Hàng chip mờ dần ở mép phải (mask 40px). Ẩn thanh cuộn.
  - Gộp 3 chip con của Mục tiêu thành một chip `I. Mục tiêu`. Rút gọn còn `II. Thiết bị dạy học`, `III. Tiến trình`, `2. Hình thành kiến thức`.
  - Bỏ "phiên bản 11" khỏi dòng phụ, vì phiên bản đã có ở pill `v4`.
- **6 · Tab chế độ:**
  - Một segmented control ở mọi cỡ màn: khung trắng, viền g200, radius 10, padding 2. Tab đang chọn nền #2563eb, chữ trắng.
  - ≤480px các tab giãn đều và dùng nhãn ngắn. Không sticky.
  - Chip nhẹ hơn: chữ 13 g600, viền g200. Chip đang chọn nền g100, chữ g900/600. Vùng chạm vẫn 44px, phần nhìn thấy cao 32px.
- **7 · Cỡ chữ:**
  - Tiêu đề thẻ 18/600. Tiêu đề mục (I., II., III.) 17/600, cách trên 24px.
  - Nhãn 14/500 g600. Ô nhập ≥16px để iOS không tự zoom.
- **8 · Hoạt động:**
  - Mỗi dòng là `button aria-expanded`, cao 52px. Chevron › xoay 90° khi mở. Bên phải là pill thời lượng `18 phút` (13 g600, nền g100).
- **9 · Thời lượng:**
  - Bộ tăng giảm `−` [input `inputmode=numeric pattern=[0-9]*`] `+`, mỗi nút 44×44. aria-label "Bớt 1 phút" / "Thêm 1 phút". Chặn trong khoảng 1–90.
  - Breadcrumb: mỗi link ≥44px chiều cao.

## A11y và kiểm tra
- Focus: `outline:2px solid #2563eb; offset 2px`.
- Đo trên mock (WebKit): không có cuộn ngang ở 320/375/820/1180. Không có control nào thấp hơn 44px. Không textarea nào bị cắt nội dung.

## Ghi chú API (mục 1)
- `packages/guardrails/src/post-check.ts`: `postCheckContent()` quét **cả bài đã ghép thành một chuỗi** (`assembleLessonPlanText`). Kết quả mỗi lần trúng (`GuardrailHit`) chỉ gồm `code`, `severity`, `category`, `entryId` và `matchedLabel` (nhãn của danh sách cấm hoặc tên heuristic). Không có tên ô, không có vị trí, không đếm số đoạn.
- `toPublicFlags()` gửi ra web `{verdict, reasonCodes (đã bỏ trùng), teacherMessage}`. DB `ai_jobs.guardrail` cũng chỉ lưu đúng chừng ấy.
- Vì vậy cần đổi bên BE/guardrails:
  - Quét theo từng ô, mỗi ô có đường dẫn như `objectives.knowledge[0]` hoặc `activities[1].objective`.
  - Trả thêm `flaggedFields: [{path, code}]`, không kèm đoạn văn (vẫn giữ quy tắc không lộ đoạn trùng).
  - Kết quả lưu-lại cũng phải trả `flaggedFields` để danh sách cập nhật khi GV sửa.
- Techlead xác nhận.

## Câu hỏi mở
1. Ở 375 tên giáo án chỉ còn khoảng 7 ký tự, vì phải chứa đủ 5 thứ. Có thể đưa tên xuống làm tiêu đề thẻ (đã có sẵn) và bỏ khỏi top bar ở ≤480px. Cần Huy chọn.
2. Đếm "đoạn" theo ô hay theo câu? Mock đang đếm theo ô.
