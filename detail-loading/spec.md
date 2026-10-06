# Spec · Trạng thái tải khi mở chi tiết giáo án

**Trạng thái:** đề xuất chờ Huy duyệt · **05/10/2026**, bản 2 **06/10/2026** sau BA co-review (`ux-review/detail-loading-ba-review.md`) · UI UX Designer  
**Phạm vi:** mở một giáo án đã có (từ danh sách hoặc URL trực tiếp / back). **Không** redesign skeleton danh sách lần đầu (#60/#61 đang ổn — on hold). **Không** thay màn Đang soạn (generating).  
**Mockup:** `./index.html` · Pages: `/detail-loading/`  
**Token:** giữ `--blue / --g* / Inter` hiện tại (không teal/orange/Plus Jakarta). Không dark mode.

## Guidelines đã dùng (ui-ux-pro-max `--domain ux`)

| Guideline | Áp dụng |
|---|---|
| **Feedback · Loading Indicators** | Skeleton ổn định + `aria-busy`; không spinner một ngưỡng cho mọi việc; tránh flash tải nhanh |
| **Layout · Content Jumping** | Shell giữ chỗ tab / mục lục / 4 HĐ tên cố định → CLS ≈ 0 khi data vào |
| **Animation · Reduced Motion** | `motion-reduce:animate-none` / tắt shimmer & spinner quay |
| **Animation · Excessive Motion** | Chỉ shimmer nhẹ + 1 top progress; không bounce hàng loạt |
| **Touch · (pro-rules ≥44)** | Tab, Thử lại, Về danh sách, hàng đang mở ≥44px |
| proposal.md **§11.1–11.3, 11.5–11.6** | Skeleton cho tải nội dung; 0ms phản hồi bấm; 300/500/8s/15s; copy không “lỗi/máy chủ” |

## 1. Chẩn đoán (prod `fe8b2e5`)

| Giai đoạn | Quan sát (WebKit 820, API chậm ~2–2,5s) |
|---|---|
| Bấm hàng danh sách | **0 phản hồi** (`recent-plan-list` chỉ `<Link>`, không pressed / “Đang mở…”) · ~0,5–1,5s vẫn ở `/` |
| Sau đổi URL | `PlanOpenSkeleton` = **3 khối xám**, **không có tab** (`tabList` chỉ mount khi `plan`) · không `loading.tsx` |
| Job `done` nhưng chưa `plan` | `editorSurface` → `"plan"` → skeleton tắt, **tab vẫn 0** · khoảng trống |
| Plan về | Tab + nội dung **nhảy cùng lúc** |

**Dead time chính:** (1) không feedback hàng / route; (2) skeleton không phải page shell (thiếu tab + TOC định hình); (3) gap surface=`plan` & `!plan`.

## 2. States

| State | Khi nào | UI |
|---|---|---|
| **A. Row opening** | Pointer-down / click hàng “Đã soạn” | Nền `--blue-s`; cột Cập nhật: spinner 14px + **Đang mở…**; optional top progress 2px; hàng khác vẫn bấm được |
| **B. Detail shell** | Route `/editor/[jobId]` + đang fetch job/plan (finished plan) | Bar 48px (Xuất Word **disabled**); **3 tab Soạn \| Xem như giáo án \| So sánh** hiện ngay, `aria-disabled` / selected Soạn; chip/rail mục lục = skeleton; dòng Phụ lục IV **chữ thật**; khối Thông tin / I / II + **4 HĐ + Hướng dẫn về nhà tên cố định**, thân = khung xám; `aria-busy` trên vùng nội dung; live-region “Đang mở giáo án.” |
| **C. Slow** | Shell đã hiện ≥ **8s** | Thêm dòng “Đang mở lâu hơn bình thường.” + **Thử lại** + **Về danh sách** (không đợi 15s mới có Thử lại — AC10: đủ cả hai nút ở mốc 8–10s) |
| **D. Error** | Fetch fail / timeout ~30s (chỉ áp cho giáo án đã soạn xong) | Card vàng (§11.5), **không** có khung xám/shell chồng hoặc xếp dưới: **Chưa mở được giáo án này** / câu phụ “Giáo án vẫn được lưu. Bấm Thử lại hoặc quay về danh sách.” · **Thử lại** · **Về danh sách** (cả hai trong thẻ) · focus tiêu đề. Thử lại chỉ tải lại giáo án đã có (xem AC12) |
| **E. Ready** | Có `plan` | Tab bật; TOC thật; nội dung thay khung (cùng geometry) |
| **F. Generating** | Job `running`/`pending` | **Giữ `PlanWaitScreen`** — không dùng shell B |

**Direct URL / back:** không có A → vào B (sau 300ms; dữ liệu về trước 300ms thì bỏ qua B) → E/D/F.

## 3. Timing

| Mốc | Giá trị | Ghi chú |
|---|---|---|
| Phản hồi hàng / top progress | **0 ms** | Loading Indicators: phản hồi tức thì |
| Hiện shell B | sau **300 ms** kể từ khi route `/editor/[id]` mount; dữ liệu về trước mốc này thì **không** hiện shell | Một phương án duy nhất để QA đo (AC7) |
| Min visible shell | **500 ms** | Đã hiện thì giữ ≥500ms rồi mới sang E; sang D/F thì bỏ shell ngay |
| Chờ lâu | **8–10 s** | Copy + Thử lại + Về danh sách |
| Error | **~30 s** hoặc fail sớm | §11.5 |
| Reduced motion | shimmer/spinner off | khung xám tĩnh |

## 4. Cấu trúc component (gợi ý Dev FE — chưa code trước duyệt)

```
app/editor/[jobId]/loading.tsx          ← optional Next shell (bar+tabs disabled+TOC skel) trong lúc chunk
components/home/recent-plan-list.tsx    ← RowOpening: isOpeningJobId, spinner ở cột Cập nhật
components/editor/editor-view.tsx       ← luôn render EditorTabList (disabled khi !plan && loading)
components/editor/plan-open-skeleton.tsx← mở rộng thành DetailShellSkeleton (tabs ngoài / TOC / ACT names)
lib/editor-mode.ts                      ← tránh surface "plan" khi !hasPlan (giữ "loading" đến khi có plan)
```

Tái dùng: `OPENING_PLAN_STATUS`, `PlanLoadFailure`, `SKELETON_PULSE` + `motion-reduce:animate-none`, token `globals.css`.

## 5. Acceptance criteria

**Điều kiện đo chung (AC1, AC3, AC7, AC10):** WebKit 820×1180 (iPad UA), API giả lập chậm **2 s** cho job/plan như phần chẩn đoán §1, trừ khi AC ghi điều kiện khác.

1. Bấm hàng finished → **≤100 ms** thấy nền pressed + chữ “Đang mở…” trên chính hàng đó.  
2. Trên `/editor/[id]` trước khi có plan: **nhìn thấy 3 tab** (disabled) + tên 4 HĐ + “Hướng dẫn về nhà” cố định + skeleton thân; không khoảng trống không tab.  
3. **CLS ≤ 0,1** từ lúc hiện khung (B) tới lúc nội dung vào (E), đo cùng điều kiện; tab/mục lục/tên HĐ giữ chỗ.  
4. `prefers-reduced-motion: reduce`: không shimmer/spin quay.  
5. `aria-busy` + live-region (`role=status`, `aria-live=polite`) “Đang mở giáo án.”; error `role=alert` + focus.  
6. Job generating vẫn màn Đang soạn — không nhầm shell mở.  
7. Dữ liệu về **< 300 ms** thì **không** hiện khung xám; đã hiện khung thì giữ **ít nhất 500 ms**.  
8. Touch ≥44px; contrast chữ/ghi chú đạt token hiện tại (≥4.5:1 text).  
9. Copy ngắn tiếng Việt, không “lỗi/máy chủ”.  
10. **Trạng thái C:** ở mốc **8–10 giây** (tính từ lúc shell hiện) có dòng “Đang mở lâu hơn bình thường.” cùng **cả** Thử lại và Về danh sách.  
11. **Trạng thái D:** lỗi hoặc quá **~30 giây** thì hiện thẻ “Chưa mở được giáo án này” với câu phụ “Giáo án vẫn được lưu. Bấm Thử lại hoặc quay về danh sách.”, **Thử lại** và **Về danh sách** trong thẻ; tiêu đề được focus; không có khung xám/shell chồng hoặc xếp dưới thẻ.  
12. **Nghiệp vụ:** Thử lại chỉ tải lại giáo án đã có: **không soạn lại, không gọi AI, không trừ lượt miễn phí** (QA: chỉ có request đọc job/plan, không có request tạo/soạn).  
13. Đang mở hàng A mà bấm hàng B thì mở B; không mở 2 trang, không kẹt “Đang mở…” ở A.  

## 6. Ngoài phạm vi

- Skeleton danh sách lần đầu (đã #60/#61).  
- Formula preview / phím a/b (A2).  
- Dark mode.

## 7. Câu hỏi mở (Q1, Q2)

BA (06/10): cả hai là quyết định kỹ thuật/hiển thị — **không đưa Huy**; UI UX + Techlead chốt theo khuyến nghị dưới. Huy chỉ duyệt hướng chung.

**Q1.** Top progress 2px trên cùng khi route chậm — giữ hay chỉ dựa hàng “Đang mở…”?  
**Khuyến nghị:** giữ cả hai (hàng = phản hồi cục bộ; progress = tín hiệu toàn trang khi chunk chậm >300ms); tắt progress khi shell B đã hiện đủ.

**Q2.** Có bắt buộc `loading.tsx` (Next) hay chỉ mở rộng `PlanOpenSkeleton` trong client?  
**Khuyến nghị:** cả hai nếu chunk JS editor nặng; tối thiểu client shell + sửa `editorSurface` để hết gap `plan && !plan`.

## 8. Thay đổi bản 2 (06/10/2026, sau BA co-review)

- AC1, AC3, AC7 đo được (điều kiện WebKit 820 + API chậm 2s; CLS ≤ 0,1; chọn một phương án 300ms/500ms). Bảng Timing sửa theo AC7.
- Thêm AC10 (trạng thái C), AC11 (trạng thái D), AC12 (Thử lại không soạn lại / không gọi AI / không trừ lượt), AC13 (bấm hàng B khi đang mở A).
- Câu phụ thẻ lỗi: “Giáo án vẫn được lưu. Bấm Thử lại hoặc quay về danh sách.” (mockup `index.html?state=error` vẫn hiện câu cũ; spec là chuẩn).
- Viết đầy đủ “Hướng dẫn về nhà” (bỏ chữ viết tắt).
- Q1/Q2 để UI UX + Techlead chốt, không đưa Huy.

