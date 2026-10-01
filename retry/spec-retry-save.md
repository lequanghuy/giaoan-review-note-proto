# Biểu tượng "Thử lại" khi lưu chỉnh sửa tay không được (autosave NEW-02, PR #36) · bản 2

GiaoAn AI · UI UX Designer · 01/10/2026 · **bản 2 (biểu tượng)**, thay cho bản 1 (nút chữ "Thử lại", BA đã PASS copy + AC1–6).
Bản 1 vẫn xem được để so sánh: `v1-text/`. Mockup bản 2: `index.html` (bản trên box: `mockup.html`) (thêm `?live=1` để bấm thử) · Ảnh: `shots/` · Test: `ac-test.js` (kết quả `ac-test-output.txt`).

Thay đổi so với bản 1: (1) nút chữ thành **biểu tượng xoay vòng**; (2) tooltip "Thử lại" khi rê chuột hoặc focus bàn phím; (3) biểu tượng **chỉ có ở trạng thái lỗi**; (4) vì biểu tượng biến mất khi "Đang lưu", **focus chuyển sang nhãn** trong lúc thử lại (§5). **Không đổi:** chữ nhãn "Chưa lưu được", dòng giải thích tại nút hành động (AC5), mọi hành vi AC1–6.

## 0. Tiêu chí nghiệm thu (nguyên văn của BA)

| # | Tiêu chí (BA) | Ghi chú cho bản biểu tượng |
| --- | --- | --- |
| AC1 | Khi `status=error`, nhãn đúng "Chưa lưu được" (không có "Lỗi/lỗi/sai/máy chủ"), nút "Thử lại" hiện, không toast. | "Nút Thử lại" là **biểu tượng** có `aria-label="Thử lại"`. Không toast. |
| AC2 | Bấm Thử lại: nhãn "Đang lưu" ≥ 600 ms; thành công → "Đã lưu" và nút biến mất; thất bại → về "Chưa lưu được", nút bật lại, focus còn ở nút. | Trong 600 ms "Đang lưu" **không có biểu tượng** (nên "nút" tạm biến mất); focus ở nhãn, rồi thành công thì về ô đang sửa, thất bại thì về biểu tượng (§5). |
| AC3 | Clicking the button while the label is 'Đang lưu' creates no second PUT request (request count = 1). | Khi "Đang lưu" không còn nút để bấm. Phần tử focus (nhãn) cũng không gửi gì. Test: bấm/nhấn phím nhiều lần, PUT = 1. |
| AC4 | The text the teacher typed stays intact after each failure and after Thử lại (compare content before/after). | Không đổi. |
| AC5 | When in error and the teacher clicks Xuất, Soạn lại or Tạo phiếu bài tập, an explanatory line appears within the viewport at the clicked button so the teacher knows the action did not run. | Không đổi, xem §8 về chữ "Thử lại" trong câu. |
| AC6 | At 390px the title row does not wrap and the button tap target is 44px. | Hàng không xuống dòng, vùng chạm 44×44 (§3). |

## 1. Hiện trạng trong code (`origin/main` @ `3f2c05a`, #36)

| Việc | File |
| --- | --- |
| 3 nhãn `saved` / `saving` / `error`, hằng số debounce 1000 ms, `MAX_SAVE_CHAIN` 5 | `apps/web/src/lib/save-status.ts` |
| Hiển thị nhãn (một `<span aria-live="polite">`, 11px, `min-w-[5.5rem]`, `text-g500`) | `apps/web/src/components/editor/save-status-label.tsx` |
| Chỗ đặt: hàng tiêu đề thẻ "Giáo án (Phụ lục IV)", `mb-3 flex items-center justify-between gap-2` | `apps/web/src/components/editor/editor-view.tsx` ~dòng 497–502 |
| Máy trạng thái, retry ngầm | `apps/web/src/lib/plan-autosave.ts` |
| Hook (`status`, `noteEdit`, `noteBlur`, `ensureSaved`) | `apps/web/src/components/editor/use-plan-autosave.ts` |
| Chặn Soạn lại / Tạo phiếu / Xuất khi lưu lỗi (trả `null`, thoát im lặng) | `apps/web/src/lib/commit-plan-action.ts` |
| Bộ icon của app | **Inline SVG**, viewBox 24, `stroke="currentColor"`, `strokeWidth` 2 (check 2.5), `round`, `aria-hidden`: `apps/web/src/components/plan/review-note/icons.tsx` (`LookIcon`, `CheckIcon`, `CheckCircleIcon`). `lucide-react ^0.474` có trong `package.json` nhưng **chưa được import ở đâu trong `src`** |
| Tooltip hiện có | `.rv-tip` trong `review-note.css` (nền #FFFBEB, viền #FDE68A, chữ #92400E 12px/600, `role="tooltip"`) |
| Vòng focus hiện có | `.rv-done:focus-visible`: `outline:2px solid #2563eb; outline-offset:2px` |

Retry ngầm hiện có (giữ nguyên): gõ tiếp (debounce 1 s), rời field (`noteBlur`), `ensureSaved()` khi Soạn lại / Tạo phiếu / Xuất. Văn bản chưa lưu luôn còn trong editor.

## 2. Biểu tượng

| | Chọn |
| --- | --- |
| Hình | **`rotate-cw`** (vòng tròn hở, đầu mũi tên quay theo chiều kim đồng hồ). Cùng họ Lucide, cùng công thức với icon của app. Path: `M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8` và `M21 3v5h-5` |
| Cách vẽ | SVG inline, viewBox 24, `fill:none`, `stroke:currentColor`, **`stroke-width` 2**, `round` cap/join, `aria-hidden`, `focusable="false"`. Đặt trong `icons.tsx` (`RetryIcon`) như các icon khác |
| Kích thước | **14px** (nét hiển thị ≈ 1.17px, cùng độ đậm với icon 13px `LookIcon` trong chip). Khung nút **24×24** |
| Màu | **`#92400E`** (cùng màu nhãn lỗi và `.rv-ackfail`): **7.09:1** trên trắng, 6.84:1 trên #FFFBEB. Glyph cần ≥ 3:1: đạt. Đã thử xám g500 (4.83:1) nhưng nhạt hơn nhãn nên trông như bị tắt |
| Khung | nền trắng, viền 1px `#FDE68A`, bo 8px, giống nút "Đã soát" (`.rv-done`) |
| Vị trí | ngay **sau nhãn**, cùng hàng tiêu đề, cách nhãn 10px, căn giữa dọc với nhãn |
| Hover | nền `#F9FAFB`, viền `#FCD34D` (= `.rv-done:hover`) |
| Pressed (`:active`) | nền `#FFFBEB`, viền `#F59E0B`, glyph xoay **60°** trong 0.2 s |
| Focus-visible | `outline:2px solid #2563eb; outline-offset:2px` (= `.rv-done:focus-visible`) |
| Xoay một lần khi bấm | Chỉ là `transform` khi `:active` (nhấn xuống thì xoay 60°, thả ra thì về). **Không phần tử mới, không animation vòng lặp.** `prefers-reduced-motion: reduce` thì tắt hẳn (`transition:none; transform:none`) |

Vì sao chọn `rotate-cw` thay vì `refresh-cw` (hai mũi tên) hoặc `rotate-ccw`: một mũi tên đơn ở 14px rõ nét hơn, hai mũi tên bị rối ở cỡ nhỏ; chiều kim đồng hồ là quy ước "tải lại / thử lại". Khung viền amber làm biểu tượng trông là nút bấm được (không chỉ là trang trí), nhất là trên điện thoại không có tooltip.

## 3. Bố cục và vùng chạm

- **Hàng tiêu đề** (không đổi `mb-3 flex items-center justify-between gap-2`): bên phải là `flex shrink-0 items-center gap-2.5` gồm nhãn + **ô giữ chỗ 24×24**.
- **Không dịch chuyển:** ô giữ chỗ 24px **luôn có**, kể cả khi không có biểu tượng. Nhờ đó nhãn đứng yên giữa các trạng thái. Nhãn giữ `min-w-[5.5rem]` (chữ "Chưa lưu được" rộng 76px < 88px).
  - Đo ở **1280 / 720 / 390**, mọi trạng thái (Đã lưu, Đang lưu, Lỗi, Hover, Focus, Đang thử lại, Thử lại xong, Lại lỗi): chiều cao hàng **24.14px**, chiều cao thẻ, vị trí X/Y của tiêu đề, mép trái và mép phải của nhãn **giống hệt nhau** (test (e)).
  - Chi phí: khi "Đã lưu" / "Đang lưu" có một khoảng trống 24px + 10px bên phải nhãn. Nhãn đã đẩy sang trái 34px so với bản gốc của PR #36 (nhãn nằm sát mép phải). Đổi lại không có chữ nào nhảy.
- **Vùng chạm 44×44:** `::after` rộng nút + 22px mỗi bên, cao 44px, căn giữa dọc (cách của `.rv-done::after`). Hit-test: ±21px quanh tâm trúng nút, ±24px thì trượt (test (d), ở 390, 720, 1280). Lưu ý bù 1px viền: `left/right:-11px`.
- **Hẹp:** 390px đủ chỗ, hàng không xuống dòng (AC6). Ở 320px hàng xuống 2 dòng (tiêu đề dài 152px + nhãn + ô 24px): chấp nhận hoặc cho tiêu đề `min-w-0 truncate`.
- Không icon cạnh "Đã lưu" và "Đang lưu". Không icon nào khác. Không nền, không viền đổi màu ở thẻ.

### Tooltip "Thử lại"
- Giống `.rv-tip` về kiểu. Nằm **tuyệt đối** dưới biểu tượng (`top:calc(100% + 6px); right:0`), **căn mép phải** với biểu tượng nên không bao giờ tràn ra khỏi mép thẻ (rộng 57px, đo: nằm trọn trong thẻ và trong màn hình ở cả 3 cỡ). Không chiếm chỗ trong luồng nên không đẩy bố cục (test (c): hình học hàng tiêu đề giống hệt khi tooltip bật).
- **Hiện khi:** rê chuột vào biểu tượng (hoặc vào chính tooltip, có "cầu" 8px nên rê từ nút xuống tooltip không bị tắt), và khi nút có **`:focus-visible`**. **Esc** ẩn tooltip, **focus vẫn ở nút**. Rê vào lại hoặc focus lại thì hiện lại (WCAG 1.4.13: dismissible, hoverable, persistent).
- **`aria-hidden="true"`**: tooltip chỉ là phụ. Tên truy cập là `aria-label`. Trên điện thoại không có tooltip (chạm không có hover, và `:focus-visible` không bật khi chạm), nên biểu tượng + nhãn "Chưa lưu được" bên cạnh phải đủ hiểu (§8).

## 4. Bảng trạng thái

| # | Trạng thái | Nhãn (`aria-live="polite"`) | Biểu tượng | Focus | Ảnh |
| --- | --- | --- | --- | --- | --- |
| 1 | Đã lưu | Đã lưu (g500) | **không** (ô trống 24px) | – | tất cả |
| 2 | Đang lưu (tự động, lần đầu) | Đang lưu (g500) | **không** | – | |
| 3 | **Lỗi** | **Chưa lưu được** (#92400E) | **có**, `aria-label="Thử lại"` | không tự chuyển | |
| 4 | Rê chuột vào biểu tượng | như 3 | có + tooltip "Thử lại" | – | `closeup-*-hover-tooltip` |
| 5 | Focus bàn phím | như 3 | có + vòng focus + tooltip | ở biểu tượng | `closeup-*-focus-tooltip` |
| 6 | **Đang thử lại** (bấm biểu tượng, hoặc Soạn lại / Xuất / Tạo phiếu / gõ tiếp / rời field khi đang lỗi) | Đang lưu (g500), **≥ 600 ms** khi bấm tay | **không** (ô trống 24px) | **chuyển sang nhãn** nếu focus đang ở biểu tượng (§5) | `closeup-*-retrying` |
| 7 | **Thử lại xong** | Đã lưu | không | về **ô đang sửa gần nhất** (hoặc `body` nếu chưa từng sửa) | |
| 8 | **Lại lỗi** | Chưa lưu được | **trở lại**, nhận lại focus | ở biểu tượng | |
| 9 | Lỗi, bấm Xuất / Soạn lại / Tạo phiếu (AC5) | Chưa lưu được | có | ở lại nút vừa bấm | `closeup-*-blocked-action` |

Ghi chú:
- **AC3:** không có nút nào để bấm lúc "Đang lưu", nên không thể có PUT thứ hai từ biểu tượng. Handler vẫn thoát nếu `status === "saving"`, và `retry()` đi qua `pump()` (hàng đợi `tail`) làm lớp bảo vệ thứ hai.
- **Đợi tối thiểu ~600 ms** ở "Đang lưu" khi bấm tay (AC2). Đo: 610–614 ms.
- "Vẫn lỗi" **dùng lại đúng chữ "Chưa lưu được"**. Việc lỗi lặp lại được báo bằng chuỗi aria-live "Đang lưu" → "Chưa lưu được" và bằng việc biểu tượng trở lại với focus.
- Không dòng "Đã lưu lại" phụ, không toast.

## 5. Focus khi biểu tượng biến mất lúc "Đang thử lại" (quyết định)

Vấn đề: biểu tượng chỉ có ở trạng thái lỗi, nên khi bấm thì nó biến mất và focus rơi về `<body>` (trình đọc màn hình mất vị trí, người dùng bàn phím phải Tab lại từ đầu trang).

| Phương án | Đánh giá |
| --- | --- |
| **A. Chuyển focus sang nhãn trước khi gỡ biểu tượng** (**chọn**) | Nhãn "Đang lưu" là phần tử ở ngay chỗ đó. Bọc chữ nhãn trong `<span tabindex="-1">` (focus được bằng mã, không nằm trong thứ tự Tab). Khi lưu xong: focus về ô đang sửa. Lưu lỗi: focus về biểu tượng (vừa quay lại). Hiện đúng vị trí, vòng focus nhìn thấy được (khi dùng bàn phím) |
| B. Giữ nút trong DOM nhưng ẩn bằng mắt + `aria-disabled` | Nút ẩn mà vẫn focus được thì **vòng focus vô hình** (WCAG 2.4.7 không đạt); trình đọc màn hình đọc "Thử lại, không khả dụng" trong khi nhãn nói "Đang lưu"; ô tap vô hình vẫn bắt chạm |
| C. Đẩy focus lên `body`/ô soạn thảo ngay | Mất ngữ cảnh. Và nếu bấm bằng chuột trên điện thoại, nhảy về ô soạn có thể bật bàn phím ảo |
| D. Giữ biểu tượng (mờ) trong lúc thử lại | Trái yêu cầu "Đang lưu không có biểu tượng" |

**Cài đặt:** trong `SaveStatusLabel`, tham chiếu `labelRef` (span `tabindex=-1`). Trong handler bấm: `labelRef.current.focus({ preventScroll: true })` **trước** khi đặt trạng thái `saving` (để biểu tượng bị gỡ khi focus đã sang chỗ khác). Khi chuyển `saving → saved` và focus đang ở nhãn: `lastEditedField.focus({ preventScroll: true })` (hook lưu phần tử cuối cùng `onBlur`/`onChange`; không có thì để nguyên). Khi `saving → error` và focus đang ở nhãn: `retryButtonRef.current.focus()`. **Chỉ chuyển focus nếu focus đang ở nhãn hoặc biểu tượng**, không giành focus của việc khác.

**Đã kiểm (mockup + `ac-test.js`):** bằng bàn phím (Enter) và chuột; bấm thêm Enter/Space/click lúc "Đang lưu" thì focus **không bao giờ về `<body>`**; thất bại → focus ở biểu tượng; thành công → focus ở `TEXTAREA`. Điều **chưa kiểm được** ở môi trường này: đọc bằng NVDA / VoiceOver / TalkBack thật. Lưu ý Dev FE kiểm: nhãn là vùng aria-live đồng thời là phần tử nhận focus, có thể bị đọc "Đang lưu" hai lần (một lần do focus, một lần do vùng live). Nếu bị, đặt `aria-live` lên một phần tử cha tách riêng (nhãn vẫn là phần tử nhận focus, cha là vùng live).

## 6. A11y

1. **Tên truy cập:** `<button type="button" aria-label="Thử lại">`. Glyph `aria-hidden`. Tooltip `aria-hidden` (không phải tên duy nhất; không cần `aria-describedby`, vì cùng chữ với tên).
2. **aria-live polite** vẫn ở nhãn. Chỉ chữ nhãn được đọc: "Đang lưu" → "Chưa lưu được" / "Đã lưu". Dòng AC5 có `aria-live="polite"` riêng (như bản 1).
3. **Bàn phím:** Tab tới biểu tượng, Enter/Space kích hoạt, Esc ẩn tooltip. Biểu tượng chỉ có trong DOM khi lỗi nên không có điểm dừng Tab thừa.
4. **Vòng focus** giống `.rv-done:focus-visible`. Nhãn nhận focus bằng mã (tabindex=-1) cũng hiện vòng khi là focus bàn phím.
5. **Tương phản:** nhãn lỗi và glyph `#92400E` / trắng 7.09:1 (chữ ≥ 4.5, glyph ≥ 3: đạt); viền khung `#FDE68A` / trắng 1.25:1 chỉ là trang trí, glyph đã tự đủ tương phản; tooltip `#92400E` / `#FFFBEB` 6.84:1; vòng focus `#2563EB` / trắng 5.17:1.
6. **Không truyền nghĩa chỉ bằng màu hay chỉ bằng biểu tượng:** nhãn chữ "Chưa lưu được" luôn đi kèm; biểu tượng có tên.
7. **`prefers-reduced-motion`:** tắt transition và xoay.
8. **Mobile:** vùng chạm 44×44. Tooltip chỉ là phụ, không bắt buộc.

## 7. Copy

| Vị trí | Chữ |
| --- | --- |
| Nhãn đã lưu | Đã lưu |
| Nhãn đang lưu | Đang lưu |
| Nhãn lỗi | Chưa lưu được |
| Tên truy cập của biểu tượng (`aria-label`) và tooltip | Thử lại |
| Dòng giải thích tại nút hành động (AC5, không đổi) | Chưa lưu được nên thao tác này chưa chạy. Thầy cô bấm Thử lại ở đầu giáo án giúp nhé. |

Không dùng: "Lưu lỗi", "Lỗi", "sai", "máy chủ", "thất bại", "job", mã quy tắc.

## 8. Dòng AC5 và chữ "Thử lại" (ghi chú)

Giữ nguyên câu như yêu cầu. Nhận xét: câu nói "bấm **Thử lại** ở đầu giáo án", nhưng trên màn hình giờ chỉ có biểu tượng, **không có chữ "Thử lại" nhìn thấy** (chữ chỉ hiện trong tooltip và `aria-label`).
- Với trình đọc màn hình: **đọc đúng**, vì tên của nút chính là "Thử lại".
- Với người xem bằng mắt trên điện thoại: không có tooltip, thầy cô thấy một biểu tượng xoay vòng cạnh nhãn "Chưa lưu được". Khá dễ đoán nhưng câu chữ không khớp từng chữ.
- Đề xuất tuỳ chọn (không áp dụng, chờ BA/Huy): **"Chưa lưu được nên thao tác này chưa chạy. Thầy cô bấm biểu tượng thử lại ở đầu giáo án giúp nhé."** (biểu tượng thường nằm ngay phía trên câu này trên desktop, nhưng trên điện thoại hàng tiêu đề có thể đã cuộn đi khá xa.) Cần cập nhật `REVIEW`/copy test nếu đổi.
- Dòng AC5 vẫn chỉ đường tới hàng tiêu đề. Câu hỏi "nút ở đầu giáo án cuộn đi mất" từ bản 1 vẫn mở (Dev FE câu 2).

## 9. Thay đổi code gợi ý (cho Dev FE)

- `icons.tsx`: thêm `RetryIcon({ size })` với hai path ở §2.
- `save-status.ts`: `error: "Chưa lưu được"`, thêm `SAVE_RETRY_LABEL = "Thử lại"`.
- `plan-autosave.ts`: `retry()` = `clearTimer(); return pump()` (đi qua `sendOnce`, đặt `saving` trước); đảm bảo khi không còn dirty mà status là `error` thì đặt lại `saved`.
- `use-plan-autosave.ts`: xuất `retry`, có thể cộng phần giữ tối thiểu ~600 ms ở `saving` khi bấm tay.
- `save-status-label.tsx`: render nhãn (`<span aria-live>` chứa `<span ref tabIndex={-1}>`), ô giữ chỗ `w-6 h-6 shrink-0`, nút biểu tượng khi `status === "error"`; logic chuyển focus ở §5; tooltip bằng state `tipOpen` (hover/focus-visible) + Esc.
- `editor-view.tsx`: truyền `onRetry`, lưu `lastEditedFieldRef` (blur/change), thêm dòng AC5 dưới hàng nút (như bản 1 §3.1).
- CSS: `.save-retry`, `.save-tip` (xem `mockup.html`), có thể đặt cạnh `review-note.css`.
- Test: cập nhật chữ ở `plan-autosave.test.ts:503`; thêm test retry (lỗi → retry thành công / lại lỗi / bấm khi `saving` bị bỏ qua), test focus (không về `body`).

## 10. Kết quả kiểm tự động (`ac-test.js`, Chrome headless, 390 / 720 / 1280)

**124/124 đạt** (đầy đủ trong `ac-test-output.txt`). Gồm các mục BA yêu cầu:
- (a) không có phần tử biểu tượng ở Đã lưu / Đang lưu / Đang thử lại / Thử lại xong; có ở Lỗi / Hover / Focus / Lại lỗi.
- (b) biểu tượng là `<button>` tên "Thử lại" bằng `aria-label`; glyph và tooltip `aria-hidden`.
- (c) tooltip hiện khi hover (≥ 720) và khi focus-visible, nằm trong thẻ và trong màn hình, không đổi hình học hàng tiêu đề; Esc ẩn tooltip, focus còn ở nút.
- (d) vùng chạm ≥ 44×44 ở 390 (và 720, 1280).
- (e) chiều cao hàng 24.14px, chiều cao thẻ, vị trí tiêu đề, mép nhãn giống hệt qua mọi trạng thái, ở cả 3 cỡ.
- (f) focus không bao giờ về `<body>` trong lúc thử lại (bàn phím và chuột).
- (g) lặp bấm / phím lúc "Đang lưu": đúng 1 PUT.
- Cộng: AC1 (chữ nhãn đúng, không từ cấm, không toast), AC2 (≥ 600 ms; thành công/thất bại), AC4 (văn bản còn nguyên), AC5 (câu nguyên văn, trong khung nhìn, dưới nút, focus ở nút, không PUT), AC6, vòng focus 2px #2563eb, không lỗi trang.

**Chưa kiểm:** trình đọc màn hình thật; cảm giác chạm trên máy thật.

## 11. Ảnh (`shots/`)

| Ảnh | Nội dung |
| --- | --- |
| `desktop-1280-all-states.png`, `mobile-720-all-states.png`, `mobile-390-all-states.png` (@2x) | Hiện tại (PR #36) + 9 trạng thái: Đã lưu, Đang lưu, Lỗi, Hover + tooltip, Focus + tooltip, Đang thử lại, Thử lại xong, Lại lỗi, Dòng AC5 |
| `closeup-1280-error.png`, `closeup-390-error.png` (@2x) | Hàng tiêu đề ở trạng thái lỗi |
| `closeup-1280-hover-tooltip.png`, `closeup-390-hover-tooltip.png` (@2x) | Hover + tooltip (ép trạng thái) |
| `closeup-1280-focus-tooltip.png`, `closeup-390-focus-tooltip.png` (@2x) | Focus bàn phím + tooltip |
| `closeup-1280-retrying.png`, `closeup-390-retrying.png` (@2x) | "Đang lưu", không biểu tượng, focus ở nhãn |
| `closeup-1280-blocked-action.png`, `closeup-390-blocked-action.png` (@2x) | Dòng AC5 |
| `live-1280-real-hover.png`, `live-1280-real-keyboard-focus.png` (@2x) | Hover và focus **thật** từ demo `?live=1` (không ép trạng thái) |

## 12. Câu hỏi

**Dev FE**
1. Lỗi không thể thử lại (`toSavePlanContent` ném lỗi, `MAX_SAVE_CHAIN`): bấm Thử lại sẽ lại lỗi. Đề nghị vẫn hiện biểu tượng, log nguyên nhân.
2. Hàng tiêu đề cuộn khỏi màn hình trên điện thoại: biểu tượng ở xa dòng AC5. Chấp nhận, hoặc làm cụm "Thử lại" trong dòng AC5 thành nút chữ chạy cùng `retry()`?
3. Sau 409, `reloadHead` đặt lại `baseVersion`; Thử lại ghi đè văn bản lên bản mới của server. Đúng ý không?
4. §5: nhãn vừa là vùng live vừa nhận focus, có bị đọc hai lần không (kiểm NVDA/VoiceOver)? Nếu có, tách vùng live ra phần tử cha.
5. Giữ tối thiểu ~600 ms ở "Đang lưu" khi bấm tay: đặt ở hook hay ở component?
6. Có dùng `lucide-react` (đã là dependency, chưa import) hay inline SVG như `icons.tsx`? Đề nghị inline, cho đồng bộ.
7. Tiêu đề thẻ `min-w-0 truncate` cho 320px?

**BA / Huy**
1. Giữ nguyên câu AC5 hay đổi sang "bấm biểu tượng thử lại" (§8)?
2. Ô giữ chỗ 24px làm nhãn "Đã lưu" / "Đang lưu" lùi sang trái 34px so với hiện tại: chấp nhận không (đổi lại không giật bố cục)?
