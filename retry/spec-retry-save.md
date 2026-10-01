# Nút "Thử lại" khi lưu chỉnh sửa tay không được (autosave NEW-02, PR #36)

GiaoAn AI · UI UX Designer · 01/10/2026 · bản đề xuất, chưa BA/Dev FE duyệt
Mockup: `index.html` (bản box: `mockup.html`) (thêm `?live=1` để bấm thử) · Ảnh: `shots/`

## 1. Hiện trạng trong code (`origin/main` @ `3f2c05a`, #36)

| Việc | File |
| --- | --- |
| 3 nhãn: `saved` "Đã lưu", `saving` "Đang lưu", `error` "Lưu lỗi". Hằng số debounce 1000 ms, `MAX_SAVE_CHAIN` 5 | `apps/web/src/lib/save-status.ts` |
| Hiển thị nhãn | `apps/web/src/components/editor/save-status-label.tsx` (`SaveStatusLabel`) |
| Chỗ đặt: hàng tiêu đề thẻ "Giáo án (Phụ lục IV)", bên phải, `mb-3 flex items-center justify-between gap-2` | `apps/web/src/components/editor/editor-view.tsx` ~dòng 497–502 |
| Máy trạng thái, retry ngầm | `apps/web/src/lib/plan-autosave.ts` (`createPlanAutosave`) |
| Hook React (`status`, `noteEdit`, `noteBlur`, `ensureSaved`) | `apps/web/src/components/editor/use-plan-autosave.ts` |
| Chặn Soạn lại / Tạo phiếu / Xuất khi lưu lỗi | `apps/web/src/lib/commit-plan-action.ts` (`commitPlanBeforeAction`, trả `null` thì thôi, không báo gì) |
| Token, nút | `apps/web/src/app/globals.css`, `components/ui/button.tsx`, `tailwind.config.ts` |

**Markup hiện tại** (mọi thứ dưới đây giữ nguyên, chỉ thêm nút):
```tsx
<span className="inline-block min-w-[5.5rem] shrink-0 text-right text-[11px] font-medium leading-none text-g500" aria-live="polite">
  {SAVE_STATUS_TEXT[status]}
</span>
```
Cả ba nhãn cùng màu `text-g500` (#6B7280), nên "Lưu lỗi" hiện không khác "Đã lưu" về màu. Không có nút, không có `role`.

**Khi nào status = `error`** (`plan-autosave.ts`): PUT lỗi (kể cả 409 sau khi tải lại head), vượt `MAX_SAVE_CHAIN`, hoặc keepalive lỗi (khi rời trang), hoặc `toSavePlanContent` ném lỗi.
**Retry ngầm hiện có** (giữ nguyên): gõ tiếp (`noteEdit` → debounce 1 s), rời field (`noteBlur` → `pump`), `ensureSaved()` khi bấm "Soạn lại giáo án" / "Tạo phiếu bài tập" / "Xuất". Văn bản chưa lưu **luôn còn trong editor** (`planRef`/`latest`), không bị ghi đè khi lỗi.

Lưu ý một điểm trong `run()`: khi `status === "error"` mà nội dung không còn "dirty" thì nhánh `!isDirty()` **không** đặt lại `saved`. Nút Thử lại cần đi qua đường `pump()` và để `sendOnce` đặt `saving` trước (xem §6, câu hỏi cho Dev FE).

## 2. Đề xuất (chọn một)

**Giữ đúng một chỗ hiện trạng. Nhãn đổi chữ, có thêm một nút nhỏ ngay bên phải nhãn, cùng hàng với tiêu đề thẻ. Không toast, không banner, không dòng thứ hai.**

| | Chữ |
| --- | --- |
| Nhãn lỗi (thay "Lưu lỗi") | **Chưa lưu được** |
| Nút | **Thử lại** |
| Đang thử lại | nhãn "Đang lưu" (đã có), nút vẫn là "Thử lại" nhưng mờ |
| Xong | "Đã lưu", nút biến mất |
| Lại lỗi | về "Chưa lưu được", nút bật lại |

### Vì sao chọn "Chưa lưu được · Thử lại" thay vì một câu
| Phương án | Nhận xét |
| --- | --- |
| **A. "Chưa lưu được" + nút "Thử lại"** (chọn) | Ngắn nên hàng tiêu đề không xuống dòng ở 360px trở lên. "Chưa" nói đây là việc chưa xong, có thể làm lại, không đổ lỗi, không có chữ "lỗi". Cùng cách nói với dòng "Chưa lưu được, thầy cô bấm lại giúp nhé" đã duyệt cho "Đã soát" (`REVIEW_ACK_ERROR`). Nút "Thử lại" đã là copy có sẵn trong app (`plan-status-banner.tsx`). |
| B. Một câu "Chưa lưu được, thầy cô bấm lại giúp nhé" + nút | Ấm hơn, nhưng dài ~210px ở 11px (đo: 210px so với 76px của "Chưa lưu được"), đẩy tiêu đề xuống dòng ở 390px, làm lệch bố cục. Với nhãn 11px thì chữ đã nhỏ. Có nút ngay cạnh nên câu thêm không bổ sung thông tin. |
| C. "Lưu lỗi" giữ nguyên + nút | Giữ chữ "lỗi" mà quy ước copy tránh, và không nói được "chưa mất gì". |
| D. "Chưa lưu được · Thử lại" làm link chữ | Gọn nhất, nhưng link 11px khó bấm trên điện thoại, không có viền nên dễ lẫn với nhãn. |

Câu "thầy cô bấm lại giúp nhé" của `REVIEW_ACK_ERROR` vẫn đúng ở chỗ đó, vì ở đó không có nút nào khác. Ở đây nút tự nói việc cần làm.

**Màu nhãn lỗi:** `#92400E` (amber-800, cùng màu `.rv-ackfail` trong `review-note.css`), 7.09:1 trên trắng. Không dùng đỏ (`red`), không dùng icon mới. Hai nhãn còn lại giữ `text-g500`.

## 3. Bố cục

- **Chỗ đặt:** trong cùng `<div className="mb-3 flex items-center justify-between gap-2">`, thay `<SaveStatusLabel/>` bằng một nhóm `flex shrink-0 items-center gap-1.5` gồm nhãn + nút. Tiêu đề thẻ ở bên trái, không dịch.
- **Nút:** dùng `<Button variant="secondary">` đang có, thêm `className="px-2 py-0.5 text-xs"` (nhỏ như nút "Thử lại" trong `plan-status-banner.tsx`). Cao 24px nên không làm hàng cao hơn dòng tiêu đề (24px).
- **Vùng chạm 44px** không làm to nút: `::after` cao 44px căn giữa (cách làm của `.rv-done::after` trong `review-note.css`). Trong code Tailwind: `relative after:absolute after:inset-x-[-4px] after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']`. Áp cho mọi breakpoint (không tốn gì ở desktop).
- **Focus ring:** giống `.rv-done:focus-visible`: `outline: 2px solid #2563eb; outline-offset: 2px; border-radius: 4px`.
- **Không dịch chuyển:** đo trên mockup ở 1280, 720, 390: chiều cao thẻ, chiều cao hàng, vị trí tiêu đề **giống nhau ở cả 7 trạng thái**. Nhãn giữ `min-w-[5.5rem]`; chữ "Chưa lưu được" vừa trong 5.5rem nên chiều rộng nhãn không đổi. Khi nút xuất hiện (saved/saving lần đầu → lỗi) nhãn dịch sang trái bằng bề rộng nút + 6px, tiêu đề không dịch. Từ lỗi → đang thử lại → lại lỗi thì **không dịch gì** vì nút luôn ở đó.
- **Hẹp:** đủ chỗ từ 360px. Ở 320px hàng tiêu đề xuống 2 dòng (tiêu đề "Giáo án (Phụ lục IV)" dài 152px). Chấp nhận, hoặc cho tiêu đề `min-w-0 truncate` (hỏi Dev FE).
- **Không có icon, không có nền, không có viền thẻ đổi màu.**

## 4. Bảng trạng thái

| # | Trạng thái | Nhãn (`aria-live="polite"`) | Nút "Thử lại" | Focus | Ảnh |
| --- | --- | --- | --- | --- | --- |
| 1 | Đã lưu | Đã lưu (g500) | không có | – | tất cả |
| 2 | Đang lưu (lần đầu, tự động) | Đang lưu (g500) | không có | – | |
| 3 | **Lỗi** | **Chưa lưu được** (#92400E) | có, bấm được | không tự chuyển focus | |
| 4 | **Đang thử lại** (bấm nút, hoặc gõ tiếp / rời field / Soạn lại / Xuất khi đang lỗi) | Đang lưu (g500) | **vẫn hiện**, `aria-disabled="true"`, `aria-busy="true"`, mờ 45% (cùng `disabled:opacity-45` của Button), không nhận click | **giữ nguyên trên nút** nếu focus đang ở đó | |
| 5 | **Thử lại xong** | Đã lưu | biến mất | nếu focus đang ở nút (nút sắp biến mất): chuyển về field vừa sửa gần nhất (hoặc `body` nếu không có) | |
| 6 | **Lại lỗi** | Chưa lưu được | bật lại, bấm được | **vẫn ở nút** | |

Ghi chú:
- Dùng `aria-disabled` thay `disabled` ở trạng thái 4 để nút không mất focus (nút `disabled` rơi khỏi thứ tự Tab, trình đọc màn hình mất vị trí). Click khi `aria-disabled` bị bỏ qua trong handler.
- Nút ở trạng thái 4 hiện **từ lúc status = `saving` mà từ lần lỗi trước chưa có `saved`** (cờ `hadError` trong hook, xoá khi `saved`). Nhờ vậy nút không nhấp nháy mất/hiện khi tự động thử lại.
- Trạng thái "vẫn lỗi" **dùng lại cùng chữ "Chưa lưu được"**, không thêm bản "Vẫn chưa lưu được". Mockup bản đầu có thử "Vẫn…" nhưng bỏ vì làm nhãn rộng hơn 5.5rem (dịch bố cục), và vì việc lỗi lặp lại đã được báo hiệu bằng đường đi lỗi → "Đang lưu" → lỗi ở aria-live.
- Không có dòng "Đã lưu lại" hay xác nhận phụ sau khi thử lại xong: nhãn "Đã lưu" vừa đổi là đủ, và nó được đọc qua aria-live. Không cần toast.
- Bấm nút lúc `saving` (trạng thái 4) không làm gì. Đợi tối thiểu **~600 ms** ở trạng thái "Đang lưu" khi bấm tay, để thầy cô thấy có phản hồi nếu mạng trả lỗi tức thì (gợi ý, hỏi Dev FE).

## 5. Văn bản chưa lưu, và các lần thử lại còn lại

- **Văn bản chưa lưu nằm nguyên trong editor.** Lỗi lưu không xoá, không khôi phục về bản server, không khoá ô nhập. Bấm "Thử lại" gửi **bản đang hiển thị** (`latest`), không phải bản lúc lỗi.
- **Các cách thử lại cũ giữ nguyên:** gõ tiếp (1 s), rời field, "Soạn lại giáo án", "Tạo phiếu bài tập", "Xuất". Nút chỉ là thêm một đường bấm tay, dùng cùng `pump()`, nên không có hai yêu cầu song song (đã có hàng đợi `tail`).
- **Khi Soạn lại / Xuất bị chặn vì lưu lỗi:** hiện chỉ thấy nhãn đổi. Nút Thử lại ở cùng hàng cho thầy cô cách sửa. Xem câu hỏi 2.

## 6. A11y

1. **aria-live:** giữ `aria-live="polite"` trên nhãn như hiện tại (vùng luôn có trong DOM). Chỉ chữ nhãn được đọc: "Đang lưu" → "Chưa lưu được" / "Đã lưu". Không thêm vùng thứ hai.
2. **Nút là `<button type="button">`** thật, Tab tới được, Enter/Space kích hoạt. Tên truy cập: "Thử lại" (chữ nhìn thấy). Không cần `aria-label` riêng vì nhãn bên cạnh đã nói "chưa lưu được".
3. **Focus:** trạng thái 4, 6 giữ ở nút (kiểm bằng test bàn phím trong mockup `?live=1`: Enter → vẫn ở nút → vẫn lỗi → vẫn ở nút). Trạng thái 5 chuyển về field vừa sửa.
4. **Vùng chạm:** `::after` 44px (đo: cao 44, rộng nút + 8px). Mobile 390 và 720 đều đạt.
5. **Tương phản:** nhãn lỗi #92400E / #FFFFFF = 7.09:1; nhãn g500 #6B7280 / #FFFFFF = 4.83:1 (nhãn hiện có, đạt 4.5:1); nút chữ g700 / trắng 10.3:1; nút mờ 45% là trạng thái chờ, không phải thông tin duy nhất vì nhãn "Đang lưu" đi kèm.
6. **Không truyền nghĩa chỉ bằng màu:** nhãn đổi chữ "Chưa lưu được" và có nút. Màu chỉ là phụ.
7. **`prefers-reduced-motion`:** không có animation nào mới, không spinner mới.
8. **Mobile:** không có tooltip, không hover. Nút và nhãn cùng hàng ở ≥ 360px.

## 7. Copy

| Vị trí | Chữ | Ghi chú |
| --- | --- | --- |
| Nhãn đã lưu | Đã lưu | giữ nguyên |
| Nhãn đang lưu | Đang lưu | giữ nguyên |
| Nhãn lỗi | Chưa lưu được | thay "Lưu lỗi" (cập nhật `SAVE_STATUS_TEXT.error` và `plan-autosave.test.ts:503`) |
| Nút | Thử lại | trùng chữ với nút trong `plan-status-banner.tsx` |
| Không dùng | "Lưu lỗi", "Lỗi", "thất bại", "job", mã quy tắc, "mạng", "máy chủ", "server" | nguyên nhân không phải việc của thầy cô |

## 8. Thay đổi code gợi ý (cho Dev FE, không làm trong thiết kế này)

- `save-status.ts`: `error: "Chưa lưu được"`, thêm `export const SAVE_RETRY_TEXT = "Thử lại"`.
- `plan-autosave.ts`: thêm `retry(): Promise<void>` = `clearTimer(); return pump()` (đi qua `sendOnce`, đặt `saving` trước), và bảo đảm khi không còn dirty mà status đang `error` thì đặt lại `saved` (xem §1).
- `use-plan-autosave.ts`: xuất `retry`, cộng `hadError` (đặt khi `error`, xoá khi `saved`) để quyết định hiện nút ở trạng thái `saving`.
- `save-status-label.tsx`: nhận `onRetry`, `showRetry`; render nút khi `status === "error"` hoặc `status === "saving" && hadError`. Màu nhãn lỗi `text-[#92400e]`.
- Test: `plan-autosave.test.ts` cập nhật chữ, thêm test retry (lỗi → retry thành công; lỗi → retry lỗi giữ `error`; retry khi đang `saving` bị bỏ qua).

## 9. Câu hỏi

**Cho Dev FE**
1. **Lỗi không thể thử lại.** `toSavePlanContent` ném lỗi (dữ liệu sai dạng) hoặc `MAX_SAVE_CHAIN`: bấm Thử lại sẽ lại lỗi mãi. Có tách riêng không (ví dụ chỉ hiện nút khi lỗi là mạng/5xx/409, còn lỗi dữ liệu thì chỉ nhãn)? Đề nghị: cùng một nhãn, vẫn hiện nút (đơn giản nhất), BE/FE log nguyên nhân.
2. **Hàng tiêu đề cuộn khỏi màn hình.** Trên điện thoại, hàng "Giáo án (Phụ lục IV)" cuộn đi khi thầy cô ở dưới cuối giáo án. Khi bấm "Xuất" bị chặn vì lưu lỗi, thầy cô không thấy nhãn đổi. Có cho nhãn + nút `sticky` trên đầu vùng cuộn (dùng kiểu có sẵn), hoặc cuộn về hàng tiêu đề khi bị chặn? Thiết kế này **không thêm** gì thêm theo yêu cầu, nên để mở.
3. **Sau 409.** `reloadHead` đặt lại `baseVersion` về head. Bấm Thử lại sẽ gửi văn bản của thầy cô đè lên bản mới của server. Đúng ý không, hay cần thông báo riêng (ngoài phạm vi)?
4. Độ trễ tối thiểu ~600 ms ở "Đang lưu" khi bấm tay có được không?
5. Có thêm `min-w-0 truncate` cho tiêu đề thẻ để chịu được 320px không?

**Cho BA**
1. Có chấp nhận đổi nhãn "Lưu lỗi" thành "Chưa lưu được" cho cả trường hợp tự lưu (không chỉ khi có nút)?
2. Khi lỗi lưu lặp lại nhiều lần liên tiếp, có cần cách khác (ví dụ gợi ý lưu bản sao) hay chỉ giữ nút? Đề nghị: chưa cần.

## 10. Ảnh

| Ảnh | Nội dung |
| --- | --- |
| `shots/desktop-1280-all-states.png` | 7 thẻ (hiện tại + 6 trạng thái) ở 1280×800 |
| `shots/mobile-720-all-states.png` | như trên ở 720 |
| `shots/mobile-390-all-states.png` | như trên ở 390 (@2x) |
| `shots/desktop-1280-closeup-error.png` | hàng tiêu đề, trạng thái lỗi, 1280 |
| `shots/mobile-390-closeup-error.png` | hàng tiêu đề, trạng thái lỗi, 390 (@2x) |
