# Spec · Trạng thái tải khi mở chi tiết giáo án

**Trạng thái:** đề xuất chờ Huy duyệt · **05/10/2026** · UI UX Designer  
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
| **B. Detail shell** | Route `/editor/[jobId]` + đang fetch job/plan (finished plan) | Bar 48px (Xuất Word **disabled**); **3 tab Soạn \| Xem như giáo án \| So sánh** hiện ngay, `aria-disabled` / selected Soạn; chip/rail mục lục = skeleton; dòng Phụ lục IV **chữ thật**; khối Thông tin / I / II + **4 HĐ + HVN tên cố định**, thân = khung xám; `aria-busy` trên vùng nội dung; live-region “Đang mở giáo án.” |
| **C. Slow** | Shell đã hiện ≥ **8s** | Thêm dòng “Đang mở lâu hơn bình thường.” + **Thử lại** + **Về danh sách** (không đợi 15s mới có Thử lại nếu FE gộp — AC: đủ cả hai nút ở mốc 8–10s) |
| **D. Error** | Fetch fail / timeout ~30s | Card vàng (§11.5): **Chưa mở được giáo án này** / Chưa có nội dung nào hiện ra… · Thử lại · Về danh sách · focus tiêu đề |
| **E. Ready** | Có `plan` | Tab bật; TOC thật; nội dung thay khung (cùng geometry) |
| **F. Generating** | Job `running`/`pending` | **Giữ `PlanWaitScreen`** — không dùng shell B |

**Direct URL / back:** không có A → vào B (sau delay 300ms nếu muốn chống flash) → E/D/F.

## 3. Timing

| Mốc | Giá trị | Ghi chú |
|---|---|---|
| Phản hồi hàng / top progress | **0 ms** | Loading Indicators: phản hồi tức thì |
| Hiện shell B | **0 ms** nếu đã navigate; hoặc delay **300 ms** chỉ khi chống flash trên tải &lt;300ms *sau khi* JS route đã mount | Ưu tiên shell sớm hơn flash trống |
| Min visible shell | **500 ms** | Tránh nháy |
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

1. Bấm hàng finished → ≤100ms thấy pressed + “Đang mở…” (hoặc tương đương).  
2. Trên `/editor/[id]` trước khi có plan: **nhìn thấy 3 tab** (disabled) + tên 4 HĐ cố định + skeleton thân; không khoảng trống không tab.  
3. Khi plan vào: không nhảy layout đáng kể (tab/TOC/HĐ cùng chỗ) — checklist CLS.  
4. `prefers-reduced-motion: reduce`: không shimmer/spin quay.  
5. `aria-busy` + live-region “Đang mở giáo án.”; error `role=alert` + focus.  
6. Job generating vẫn màn Đang soạn — không nhầm shell mở.  
7. Fast load &lt;300ms: không flash skeleton rồi mất (min 500ms hoặc bỏ qua shell nếu dữ liệu đã sẵn sau paint đầu).  
8. Touch ≥44px; contrast chữ/ghi chú đạt token hiện tại (≥4.5:1 text).  
9. Copy ngắn tiếng Việt, không “lỗi/máy chủ”.  

## 6. Ngoài phạm vi

- Skeleton danh sách lần đầu (đã #60/#61).  
- Formula preview / phím a/b (A2).  
- Dark mode.

## 7. Câu hỏi mở cho Huy

**Q1.** Top progress 2px trên cùng khi route chậm — giữ hay chỉ dựa hàng “Đang mở…”?  
**Khuyến nghị:** giữ cả hai (hàng = phản hồi cục bộ; progress = tín hiệu toàn trang khi chunk chậm &gt;300ms); tắt progress khi shell B đã hiện đủ.

**Q2.** Có bắt buộc `loading.tsx` (Next) hay chỉ mở rộng `PlanOpenSkeleton` trong client?  
**Khuyến nghị:** cả hai nếu chunk JS editor nặng; tối thiểu client shell + sửa `editorSurface` để hết gap `plan && !plan`.
