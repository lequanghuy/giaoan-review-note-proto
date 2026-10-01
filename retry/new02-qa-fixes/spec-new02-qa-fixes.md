# NEW-02 QA fixes · H1 (tên hoạt động cố định) + M2 (dòng lý do khi lưu bị từ chối)

Trạng thái: **chờ Huy duyệt, Dev FE chưa làm.** Một PR, chỉ FE. Nguồn: `ga-postgen-check/qa-run-new02/results.md` (H1, M2, L1), code `origin/main` b735fd9.
Mockup: `/retry/new02-qa-fixes/` · bấm thử: `?live=1` · kiểm tra tự động: `ac-test.js` (203/203, 3 độ rộng).
Giữ nguyên (đã duyệt): biểu tượng thử lại, tooltip "Thử lại", nhãn "Đã lưu / Đang lưu / Chưa lưu được", ô 24px luôn chiếm chỗ, dòng chặn dưới Xuất/Soạn lại/Tạo phiếu.

## 1. Quy tắc và giới hạn trong code (nguồn của bảng copy)
| Quy tắc | Giới hạn | File |
|---|---|---|
| Mọi ô chữ: mục tiêu / nội dung / sản phẩm, 4 bước tổ chức (Giao nhiệm vụ, Thực hiện, Báo cáo thảo luận, Kết luận), cả hoạt động con | trim, **1 đến 4000** ký tự | `packages/shared/src/save-plan.ts` (`nonEmpty`, `TEXT_MAX`) |
| Kiến thức / Năng lực / Phẩm chất | **ít nhất 1, tối đa 12** ý, mỗi ý ≤ 4000. Ngăn bằng `;` hoặc xuống dòng | `save-plan.ts` (`LIST_MAX`); `components/plan/list-draft-field.tsx` (`parseList`) |
| Học liệu | **ít nhất 1, tối đa 20** dòng, mỗi dòng ≤ 4000 | `save-plan.ts` (`AIDS_MAX`) |
| Tên hoạt động con | 1 đến **200**; tối đa 8 hoạt động con | `save-plan.ts` (`SHORT_TEXT_MAX`, `SUB_ACTIVITY_MAX`) |
| Thời lượng hoạt động | số nguyên **1 đến 180** (ô có `min=1`, đang tự đổi rỗng/0 thành 1: L1) | `save-plan.ts`; `components/plan/activity-editor.tsx` `Number(...) \|\| 1` |
| Thời lượng cả bài | 15 đến 180 (không có ô sửa trên màn hình, không cần copy) | `save-plan.ts` |
| Trường / Tổ chuyên môn / Giáo viên | ≤ **200** (tùy chọn) | `save-plan.ts` |
| Ghi chú điều chỉnh | ≤ 4000 (tùy chọn) | `save-plan.ts` |
| Tên bài | 1 đến 500 (không có ô sửa) | `save-plan.ts` (`TITLE_MAX`) |
| Tên 4 hoạt động lớn | đúng "Mở đầu" / "Hình thành kiến thức mới" (nhận thêm "Hình thành kiến thức") / "Luyện tập" / "Vận dụng" | `packages/shared/src/lesson-plan.ts` (`ACTIVITY_SLOT_NAMES`, `canonicalActivityName`) |
| Kích thước gói gửi | ≤ 1 MiB (413), `baseVersion` (409) | `save-plan.ts` `SAVE_PLAN_MAX_BODY_BYTES`: **là lỗi mạng/phiên bản, không phải lỗi dữ liệu theo từng ô** |

Hiện client chạy `savePlanContentSchema.safeParse` rồi ném `ApiRequestError(400)` **trước khi gửi** (`apps/web/src/lib/save-plan-content.ts`), nên khi lỗi dữ liệu thì **0 PUT** và không có chữ nào hiện ra (đúng như QA H1/M2).

## 2. H1 · Tên 4 hoạt động lớn = tiêu đề cố định
**Trước:** `Label "Tên hoạt động"` + `Input` (viền, nền trắng, gõ được). **Sau:** `<h4 class="act-name">Mở đầu</h4>`.
| Mục | Quy định |
|---|---|
| Thẻ | `<h4>` thật (dưới `<h3>` "III. Tiến trình dạy học"). Không `tabindex`, không `contenteditable`, không `role`, không `readonly/disabled/aria-disabled` (không phải ô bị khóa nên không có "trạng thái hỏng"). Không focus được: đọc bằng phím điều hướng tiêu đề của trình đọc màn hình, đủ cho nhu cầu. |
| Chữ | 15px, weight 600, `line-height` 1.4, màu `--g900 #111827` (tương phản ≥ 7:1 trên trắng, không xám). Chữ đậm hơn nhãn 13px/500/g700 và lớn hơn nội dung 14px. |
| Bỏ so với ô nhập | viền 1px g200, nền trắng, padding 9px 12px, bo 8px, vòng focus xanh, con trỏ nhập. Không thêm icon khóa, không nền xám. |
| Nhãn "Tên hoạt động" | **Bỏ** (chính tiêu đề đã là tên). |
| Căn lề | mép trái trùng mép chip nhắc soát, mép nhãn kế tiếp và mép ô nhập cũ (đo trong test: lệch ≤ 0,5px). Không thụt vào. Margin `8px 0 4px`. |
| Hover / click | `cursor: default`, không đổi màu, không viền. Bấm vào không tạo con trỏ, gõ phím không đổi chữ. |
| Số thứ tự | giữ "Hoạt động 1..4" ở dải tiêu đề như hiện nay; tên là dòng ngay dưới chip. Không thêm tiền tố. |
| Cạnh chip nhắc soát | thứ tự cũ: dải tiêu đề, chip, rồi tên. Chip không dịch (dy = dx = 0). |
| Mobile ≤ 720 | dải 48px (PR #29) giữ nguyên; tên nằm trong phần thân (padding 14px), dưới chip, không nằm trong dải. "Hình thành kiến thức mới" vẫn 1 dòng ở 390. |
| Hoạt động con | giữ nguyên: nhãn "Tên hoạt động con" + ô nhập viền g200, nền trắng, focus xanh. Test xác nhận gõ được. Vẫn là nơi duy nhất để thầy cô đặt tên. |
| Dịch chuyển | không dịch lúc chạy. Một lần duy nhất: khối cao **ngắn hơn 45,5px** so với hiện tại (bỏ nhãn 19,5 + ô 38 + khoảng cách). Đây là chủ ý. |
Lưu ý Dev: hiển thị `ACTIVITY_SLOT_NAMES[index]` (tên chuẩn), không hiển thị `activity.name`, để giáo án cũ có tên "Hình thành kiến thức" cũng thẳng hàng. Cân nhắc gửi tên chuẩn trong `toSavePlanContent` để bản nháp đang hỏng tự lành. Test/E2E nào còn dùng `#activity-*-name` như ô nhập cần cập nhật.

## 3. M2 · Dòng lý do (vị trí và hành vi)
- **Vị trí:** ngay dưới ô có vấn đề, `<p class="field-fail" id="{ô}-why" aria-live="polite">` (kiểu `.rv-ackfail`: 12px / 500 / `#92400E` / line-height 1.4, rỗng thì ẩn trực quan). Không toast, không banner trên đầu.
- **Ô có vấn đề (MỚI, cần duyệt):** `aria-invalid="true"`, `aria-describedby="{ô}-why"`, viền `#D97706` (`--amber`, 3,19:1 trên trắng, đủ cho thành phần UI 3:1). Code hiện chưa có kiểu ô không hợp lệ nào. Khi đang gõ/focus trong ô thì vẫn là viền xanh + vòng focus như mọi ô.
- **Nhiều ô sai cùng lúc: hiện dòng ở TẤT CẢ các ô** (mỗi ô một dòng), không gộp "ô đầu + số lượng". Lý do: thầy cô thấy ngay mọi chỗ cần sửa khi cuộn; mỗi ô là 1 dòng ngắn nên tốn ít chỗ; "ô đầu + số" buộc phải đoán những ô còn lại.
- **Nhãn đầu giáo án:** vẫn "Chưa lưu được" (đã duyệt), màu `#92400E`. Dòng lý do không nằm ở đầu giáo án (đầu giáo án có thể ngoài màn hình).
- **Biểu tượng thử lại khi lỗi dữ liệu: KHUYẾN NGHỊ GIỮ NGUYÊN biểu tượng** (cùng kiểu, tooltip, kích thước, không vô hiệu hóa). Lý do: không đổi thứ đã duyệt, không tạo thêm trạng thái; bấm vào luôn có phản hồi. Khi bấm mà còn ô chưa hợp lệ: **không gửi gì, không hiện "Đang lưu" giả**, đưa focus đến ô đầu tiên có dòng lý do (cuộn vào giữa màn hình) và dòng được đọc lại. Khi các ô đã hợp lệ thì chạy đúng luồng đã duyệt. Phương án thay thế đã xét: ẩn hoặc làm mờ biểu tượng, bị loại vì thêm trạng thái mới và làm mất lối dẫn tới ô cần sửa.
- **Tự lưu lại:** ngay khi ô cuối cùng hợp lệ, tự lưu sau 1 giây như mọi lần sửa (không cần bấm).
- **Khi nào dòng mất:** (1) ngay khi giá trị ô đó hợp lệ lúc đang gõ, kiểm tra cục bộ từng ô, không cần mạng; (2) lưu thành công thì mọi dòng mất; không mất khi chỉ bấm vào ô hay gõ chữ mà vẫn chưa hợp lệ.
- **Focus:** không bao giờ tự chuyển focus lúc đang gõ. Chỉ chuyển khi thầy cô chủ động bấm biểu tượng thử lại.
- **Dòng chặn dưới Xuất/Soạn lại/Tạo phiếu:** giữ nguyên câu đã duyệt ("…Thầy cô bấm biểu tượng thử lại ở đầu giáo án giúp nhé."). Vẫn đúng với lỗi dữ liệu vì biểu tượng vẫn còn và dẫn tới ô cần sửa. Xem CR-2 nếu muốn rõ hơn.

### Bảng copy theo quy tắc (mẫu: "Thầy cô sửa mục **{mục}** rồi thử lại: {lý do}")
| Quy tắc | Câu hiển thị (tên mục = nhãn thật của ô) |
|---|---|
| Kiến thức / Năng lực / Phẩm chất trống | Thầy cô sửa mục Kiến thức rồi thử lại: cần có ít nhất một ý. |
| Kiến thức / Năng lực / Phẩm chất > 12 ý | Thầy cô sửa mục Kiến thức rồi thử lại: tối đa 12 ý. |
| Một ý > 4000 ký tự | Thầy cô sửa mục Kiến thức rồi thử lại: mỗi ý tối đa 4000 ký tự. |
| Học liệu trống | Thầy cô sửa mục Học liệu rồi thử lại: cần có ít nhất một dòng. |
| Học liệu > 20 dòng | Thầy cô sửa mục Học liệu rồi thử lại: tối đa 20 dòng. |
| Một dòng học liệu > 4000 | Thầy cô sửa mục Học liệu rồi thử lại: mỗi dòng tối đa 4000 ký tự. |
| a) Mục tiêu / b) Nội dung / c) Sản phẩm / 4 bước tổ chức: trống hoặc chỉ dấu cách | Thầy cô sửa mục b) Nội dung rồi thử lại: cần có nội dung. (đổi tên mục theo nhãn: a) Mục tiêu, c) Sản phẩm, Giao nhiệm vụ, Thực hiện nhiệm vụ, Báo cáo thảo luận, Kết luận/nhận định) |
| Các ô chữ trên, > 4000 | Thầy cô sửa mục b) Nội dung rồi thử lại: tối đa 4000 ký tự. |
| Thời lượng ngoài 1 đến 180 | Thầy cô sửa mục Thời lượng (phút) rồi thử lại: nhập số phút từ 1 đến 180. |
| Tên hoạt động con trống | Thầy cô sửa mục Tên hoạt động con rồi thử lại: cần có tên. |
| Tên hoạt động con > 200 | Thầy cô sửa mục Tên hoạt động con rồi thử lại: tối đa 200 ký tự. |
| Trường / Tổ chuyên môn / Giáo viên > 200 | Thầy cô sửa mục Trường rồi thử lại: tối đa 200 ký tự. |
| Ghi chú điều chỉnh > 4000 | Thầy cô sửa mục Ghi chú điều chỉnh rồi thử lại: tối đa 4000 ký tự. |
Ở 390px mọi câu trên vừa 1 đến 2 dòng (đo trong test). Không dùng "lỗi / sai / máy chủ / 400 / validation / undefined" và không lộ mã quy tắc. Với hoạt động con, nên thêm số thứ tự khi có nhiều ô trùng nhãn (ví dụ "Tên hoạt động con 2") vì dòng nằm ngay ô nên chưa bắt buộc.

### Các trạng thái (nhãn đầu giáo án + biểu tượng + dòng)
| Trạng thái | Nhãn | Biểu tượng | Dòng dưới ô | Viền ô |
|---|---|---|---|---|
| Đã lưu | Đã lưu | không | không | thường |
| Đang lưu | Đang lưu | không | không | thường |
| Lỗi mạng / 5xx / 409 (đã duyệt) | Chưa lưu được | có | **không** | thường |
| Lỗi dữ liệu, mỗi ô sai | Chưa lưu được | có (y hệt) | có, 1 dòng ở mỗi ô sai | cam `#D97706` |
| Đang gõ trong ô sai | Chưa lưu được | có | giữ dòng đến khi ô hợp lệ | xanh (focus) |
| Ô vừa hợp lệ, ô khác còn sai | Chưa lưu được | có | dòng ô này mất, ô khác giữ | thường |
| Hết ô sai | Chưa lưu được rồi tự lưu: Đang lưu, Đã lưu | mất sau khi lưu xong | mất hết | thường |

### Lỗi mạng và lỗi dữ liệu (khác nhau chỗ nào)
| | Lỗi mạng (mất kết nối, 5xx, 409): giữ nguyên | Lỗi dữ liệu (MỚI) |
|---|---|---|
| Nhãn | Chưa lưu được | Chưa lưu được |
| Biểu tượng | có | có (y hệt) |
| Bấm biểu tượng | Đang lưu ≥ 600ms, gửi lại; focus về ô vừa sửa nếu xong, về biểu tượng nếu lại lỗi | Không gửi, không "Đang lưu"; focus tới ô sai đầu tiên (CR-3) |
| Dòng dưới ô | không | có, mỗi ô sai |
| Hint dưới Xuất/Soạn lại/Tạo phiếu | câu đã duyệt | câu đã duyệt (hoặc CR-2) |
| Gửi PUT | có | không, đến khi mọi ô hợp lệ |
| Hết khi | lưu được | từng ô hợp lệ, rồi tự lưu |
Server trả 400/422 (nếu client lọt) nên dùng cùng giao diện: nếu body có chỉ ra ô thì hiện dòng ở ô đó; nếu không xác định được ô thì chỉ dùng luồng "Chưa lưu được" + biểu tượng (không bịa dòng). Xem câu hỏi mở 1.

## 4. a11y
- Dòng: `aria-live="polite"` trên mỗi `<p>`, rỗng khi hết lỗi. Đọc khi xuất hiện, không ngắt lời đang đọc. Khi nhiều dòng cùng hiện, bộ đọc sẽ lần lượt đọc từng dòng (chấp nhận được; nếu Dev thấy rườm thì chỉ đặt live ở dòng của ô đang gõ).
- Ô: `aria-invalid="true"` + `aria-describedby` trỏ dòng (xóa cả hai khi hợp lệ).
- Không `role="alert"`, không toast, không focus tự động khi gõ. Biểu tượng thử lại giữ nhãn "Thử lại".
- Màu không phải tín hiệu duy nhất: có chữ và viền. `#92400E` trên trắng 7,09:1.
- Tiêu đề hoạt động là `<h4>` thật; không cần tabindex.
- Chưa thử với trình đọc màn hình thật (chỉ kiểm tra thuộc tính và hành vi bằng Chrome headless).

## 5. Thay đổi cần duyệt / xung đột với phần đã duyệt
- **Không xung đột** với biểu tượng, tooltip, nhãn, ô 24px, focus khi thử lại, hay dòng chặn dưới nút.
- **CR-1 (mới):** kiểu viền ô không hợp lệ `#D97706` + `aria-invalid`. Code chưa có kiểu này.
- **CR-2 (tùy chọn):** biến thể dòng dưới Xuất/Soạn lại/Tạo phiếu khi lỗi dữ liệu: "Chưa lưu được nên thao tác này chưa chạy. Thầy cô sửa mục được nhắc rồi bấm biểu tượng thử lại giúp nhé." Mặc định giữ câu đã duyệt, không cần đổi. (Mockup bản cũ còn câu "bấm Thử lại"; mockup này dùng câu thật `SAVE_ACTION_BLOCKED` trên main.)
- **CR-3 (hành vi):** bấm biểu tượng khi còn ô sai thì không gửi và chuyển focus tới ô sai đầu tiên. Đây là hành vi mới của biểu tượng đã duyệt (kiểu dáng không đổi).

## 6. Câu hỏi mở (BA / Dev FE)
1. Nhận biết lỗi dữ liệu ở đâu: client Zod trước khi gửi (hiện tại, cho biết ô nào qua `issue.path`), hay server 400? Cần map `issue.path` sang ô thật (có cả hoạt động con theo chỉ số). Server 400 hiện chỉ trả `issues[0].message`, không có `path`: nếu cần dòng cho trường hợp lọt client, BE phải trả path (ngoài phạm vi PR FE này).
2. L1: ô thời lượng rỗng hoặc 0 đang tự đổi thành 1 không báo. Giữ nguyên hay để rỗng rồi hiện dòng "nhập số phút từ 1 đến 180"? Mockup giả định ô được phép rỗng/không hợp lệ.
3. Danh sách ô có dòng trong PR này: đủ bảng trên, hay chỉ Kiến thức/Học liệu/4000/thời lượng (các ca QA nêu)?
4. Giáo án cũ có tên hoạt động lớn bị đổi trong bản nháp: có cần tự đưa về tên chuẩn khi tải? (đề xuất: có.)
