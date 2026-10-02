# Findings: bộ giáo án mẫu Toán 6 (HK1 + HK2) so với editor hiện tại

Ngày: 03/10/2026 · UI UX Designer · chỉ phân tích, chưa giao Dev FE.
Nguồn: `/workspace/mau/gamau-toan6-hk1.docx`, `gamau-toan6-hk2.docx`. Mọi số dưới đây đo bằng script (`data/analyze.py`, `data/report.py`, `data/omml.py`, `data/chars.py`) trên `word/document.xml`. Chưa tìm thấy chỗ nào cần phỏng đoán; chỗ nào là suy luận có ghi "suy luận".

Định nghĩa: **từ** = chuỗi cách nhau bởi khoảng trắng (mỗi âm tiết tiếng Việt 1 từ), gồm cả chữ trong ô bảng. **Dòng** = đoạn văn không rỗng, kể cả đoạn trong ô bảng. **Trang** = LibreOffice render ra PDF (khổ letter như file), chỉ để so cỡ, Word có thể lệch ±1 trang/bài. Metadata trong file ghi 113 trang (HK1) và 208 trang (HK2), LibreOffice cho 113 và 203.

## 1. Tổng quan hai bộ

| | HK1 | HK2 |
|---|---|---|
| Đơn vị | 12 bài (Heading 1 "TIẾT …"), 18 tiết, 2 chương (I, II) | 32 bài ("BÀI 23" … "BÀI 43" + 11 bài không số), không ghi số tiết |
| Bài đánh số / không số | 10 bài §1–§10 + 2 "Luyện tập chung" | 21 bài số 23–43 + 11 bài không số (6 "Luyện tập chung", 2 bài tập cuối chương, ôn tập chương VII, luyện tập chương VIII, chuyên đề "Kế hoạch chi tiêu cá nhân và gia đình") |
| Từ tổng | 26.808 | 48.810 |
| Từ mỗi bài: TB / trung vị / min / max | 2.234 / 2.370 / 1.039 / 3.103 | 1.525 / 1.681 / 636 / 2.832 |
| Dòng tổng | 2.316 (file có 2.373 đoạn không rỗng gồm phần đầu) | 4.137 |
| Trang (LibreOffice) | 113 (mỗi bài 5–12, TB 9,4) | 203 |
| Bảng (kể cả lồng) | 42 (35 ngoài cùng + 7 lồng) | 103 ngoài cùng (+ lồng, chưa đếm riêng) |
| Bảng "GV–HS" 2 cột | 18, đều trong mục B, ở 10 bài | 49, ở 22 bài (47 trong B, 1 trong C, 1 trong D) |
| Bảng khác | 16: 12 bảng đánh giá 2×4, 3 bảng dữ liệu (3×3, 4×4, 6×2), 1 bảng Ngày soạn | 54: 50 bảng 1×2 (đề bài | lời giải), 4 bảng dữ liệu (5×4 ×2, 4×4 ×2) |
| Hoạt động con của B | 16 ("Hoạt động 1/2"), 2 bài có 1 bảng không tên, 2 bài luyện tập chung bỏ trống B | 47, 10 bài không có bảng GV–HS |
| Công thức OMML | 192 | 657 |
| Phân số (`m:f`) | 0 | 708 (14 bài) |
| Mũ: chạy chữ chỉ số trên / `m:sSup` | 199 / 0 | 6 / 7 |
| Ký hiệu MathType (OLE) | 34 (đều là ⋮ gạch chéo = không chia hết) | 0 |
| Hình ảnh (picture) | 30 (28 tệp khác nhau) + 9 OLE PBrush | 140 (114 tệp) |
| Hình vẽ (shape) | 11 (8 nhóm + 3 hình, float) | 12 (7 Rectangle, 4 Arc, 1 Group, float) |
| Định dạng ảnh | png 30 hình, jpeg 5 tệp, gif 2 tệp, wmf 3 tệp (MathType) | 100% png (140), không có emf/wmf |
| Tổng dung lượng media | 40 tệp, 1,42 MB (1 tệp >500 KB) | 114 tệp, 3,0 MB (lớn nhất 151 KB) |

Chi tiết từng bài: `data/lesson-table.md` (HK1), `data/lesson-table-hk2.md` (HK2).

## 2. Cấu trúc một bài (giống nhau giữa hai bộ)

Thứ tự: [Ngày soạn/Ngày dạy: HK1 có 12/12, HK2 không có] → I. Mục tiêu (1 Kiến thức, 2 Năng lực, 3 Phẩm chất) → II. Thiết bị (GV / HS) → III. Tiến trình: A Khởi động (Mở đầu), B Hình thành kiến thức mới, C Luyện tập, D Vận dụng, mỗi hoạt động có a) Mục tiêu b) Nội dung c) Sản phẩm d) Tổ chức thực hiện → [HK1: IV Kế hoạch đánh giá (bảng 2×4, 12/12), V Hồ sơ dạy học, Hướng dẫn về nhà].

Khác nhau:
- **HK2 không có** IV Kế hoạch đánh giá, V Hồ sơ dạy học (0 từ). Hướng dẫn về nhà có ở một phần bài (752 từ, 1,5%; HK1 764 từ, 2,8%).
- **HK2 có thêm** khối "Năng lực số" trong I.2 (22 lần xuất hiện) kèm mã (ví dụ `1.3.TC1a`), và mã đó lặp lại trong ô GV–HS ("GV: Hướng dẫn HS dùng Google Sheets (1.3.TC1a)…"). 87 dòng chứa mã/khối này. *BA co-review 03/10: không đưa vào MVP; app không sinh mã, GV tự gõ là văn bản tự do; mockup không có.*
- **HK2 gộp "C-D. Luyện tập – Vận dụng"** ở 6 bài (không tách C và D). Trong số liệu của tôi các bài này nằm trong cột B.
- **11 bài HK2 không phải bài học mới** (luyện tập chung, ôn tập, bài tập cuối chương): B rỗng hoặc rất ngắn (3 bài có B < 30 từ), nội dung chính là danh sách bài tập.
- **Nhãn 4 bước khác nhau**: HK1 "Bước 1: Chuyển giao nhiệm vụ / 2: Thực hiện nhiệm vụ / 3: Báo cáo, thảo luận / 4: Kết luận, nhận định" (30 bộ bước: 12 trong A viết dạng đoạn văn + 18 trong bảng). HK2 "Bước 1: GV chuyển giao nhiệm vụ học tập / 2: HS thực hiện nhiệm vụ học tập / 3: Báo cáo kết quả hoạt động và thảo luận / 4: Đánh giá kết quả thực hiện nhiệm vụ học tập" (49 bộ, 47 bảng bắt đầu bằng "Bước 1"). Editor hiện dùng "Giao nhiệm vụ / Thực hiện nhiệm vụ / Báo cáo thảo luận / Kết luận/nhận định".
- **Nhãn c)**: HK1 "c) Sản phẩm", HK2 "c. Sản phẩm học tập" (dùng a. b. c. d. thay a) b) c) d)).
- **Thời lượng từng hoạt động**: gần như không ghi. HK1 có 1 dòng chứa "phút" cả file; HK2 13 dòng. Editor đang bắt buộc "Thời lượng (phút)" cho cả 4 hoạt động.

## 3. Độ dài

Tỷ lệ từ theo mục (HK1 / HK2): I Mục tiêu 7,5% / 12,6%; II Thiết bị 2,3% / 3,6%; A 10,9% / 6,6%; **B 48,4% / 49,7%**; C 11,2% / 13,9%; D 8,4% / 11,1%; IV 6,9% / 0%; HDVN 2,8% / 1,5%. (HK2: C-D gộp tính vào B nên B hơi cao.)

Một nửa bài là mục B. Trong B, nội dung nằm ở **Bước 1** của bảng GV–HS:
- Số ký tự: bước 1 TB **1.061** (tối đa 2.071), bước 2 TB 137, bước 3 TB 125, bước 4 TB 114 (HK1, 18 bảng).
- Toàn ô trái (4 bước): TB 1.439 ký tự (tối đa 2.434). Ô phải (Sản phẩm dự kiến): TB 864 (tối đa 1.654). Không ô nào vượt 4.000 ký tự (giới hạn hiện tại của mỗi ô nhập).
- Số từ: HK1 trái TB 354 (223–575), phải TB 254 (47–554); HK2 trái TB 234 (max 465), phải TB 88 (max 206).
- Bước 2–4 ngắn và lặp khuôn (ví dụ "HS tiếp nhận nhiệm vụ, trao đổi, thảo luận", "GV gọi HS đứng tại chỗ trả lời"). Nhãn 4 bước giống hệt nhau ở 18/18 bảng HK1 và 49/49 bảng HK2.
- Mục a) Mục tiêu / b) Nội dung / c) Sản phẩm của mỗi hoạt động rất ngắn: TB 127 / 74 / 52 ký tự, trung vị 91 / 74 / 50 (HK1, 54 khối; gồm cả nhãn). Nội dung "ghi bảng" thật nằm ở **ô phải của bảng GV–HS**, không nằm ở c).

Hệ quả cho UI: một bài = 1.039–3.103 từ (HK1) hoặc 636–2.832 từ (HK2) và 5–12 trang in. Bước 1 và ô phải cần ô nhập lớn; bước 2–4 và a/b/c thì ngắn.

## 4. Bảng GV–HS

- Luôn 2 cột: trái "HOẠT ĐỘNG CỦA GV VÀ HS" (HK2: "… GV - HS"), phải "SẢN PHẨM DỰ KIẾN"; 1 hàng dữ liệu (2×2 gồm hàng tiêu đề). Không có cột GV và cột HS riêng: GV và HS nằm lẫn trong ô trái, tách bằng tiền tố "GV:" / "HS:" (HK1: 167 đoạn bắt đầu bằng GV, 60 bằng HS).
- 7/18 bảng HK1 và 14/49 bảng HK2 chứa ảnh; HK1 có 7 bảng lồng (ví dụ bảng số La Mã 2×10 trong ô trái, bảng ước 11×3), HK2 có 9.
- **Khác schema**: editor có 4 chuỗi `organization.*` (khớp 4 bước) và 1 chuỗi `products`. Cột "Sản phẩm dự kiến" của mẫu **không có trường riêng theo hoạt động con** (xem câu hỏi BA/Techlead).

## 5. Công thức

- **HK1**: 192 OMML, 94% là ký hiệu 1–2 ký tự: ⋮ 88, ∈ 31, N 13, ∉ 12, × 11, ≤ 9, ≥ 5, ≠ 5, → 5. Chỉ 2 `m:d` (ngoặc) và 2 `m:eqArr`. 34 đối tượng MathType: đều là **⋮ gạch chéo (không chia hết)**, ảnh xem trước 4,5–9 pt rộng × 18,75 pt cao. 199 chữ mũ viết bằng chỉ số trên (139 ở §6 Lũy thừa). **Không có phân số, căn, tổng**.
- **HK2**: 657 OMML, **708 phân số** (`m:f`; đếm cả phân số lồng), 7 `m:sSup`. Bài nhiều nhất: Bài 25 cộng trừ phân số (144 phân số), Bài 24 (106), Bài 26 (112). 14/32 bài có phân số. Bài 29–30 số thập phân và toàn bộ hình học/thống kê gần như không có công thức.
- Suy luận: một bộ HK1 + HK2 thế này cho thấy cần hiển thị cả ký hiệu (⋮, ∈, ≤), mũ, và phân số. Lớp 7–9 sẽ có căn và hệ phương trình, nhưng **không có mẫu để đo**.

Trích minh hoạ (HK1 §8 Luyện tập, Bài 2.5): "a) Vì 100 ⋮̸ 8 và 40 ⋮ 8 => (100 - 40) ⋮̸ 8". Ký hiệu ⋮̸ trong mẫu là ảnh MathType. Unicode không có một ký tự riêng cho ký hiệu này.

## 6. Hình ảnh

### 6.1 Số đếm

| | HK1 | HK2 |
|---|---|---|
| Hình ảnh (picture) | 30 | 140 |
| Số bài có hình | 7/12 | 25/32 |
| Hình mỗi bài | 5,4,4,7,4,0,0,0,3,0,0,3 | 1,1,0,2,0,0,0,3,1,1,2,1,0,2,8,4,4,3,6,7,11,3,5,4,**32**,10,7,0,6,4,12,0 |
| Bài nhiều hình nhất | §4 (7 hình) | Bài 39 Biểu đồ tranh (32), Bài tập cuối chương IX (12), Bài 37 (11), Bài 40 (10), Bài 32 (8) |
| Chế độ đặt | picture đều inline; shape vẽ đều float | picture đều inline (140); shape float |
| Theo hoạt động | A 4, B 15, C 4, Hồ sơ dạy học (V) 7 | A 16, B 63, C 30, D 31 |
| Vị trí trong bảng | 11 ô phải GV–HS, 4 ô trái GV–HS, 15 đoạn văn | **95 trong bảng 1×2 đề|lời giải** (47 ô trái = đề, 48 ô phải = lời giải, 11 bảng có hình cả hai bên), 31 ô phải GV–HS, 1 ô trái, 13 đoạn văn |
| Rộng (px, theo khung trong docx) | trung vị 278 (105–551) | trung vị 222 (16–594); <100px: 33, 100–250: 50, 250–400: 45, ≥400: 12 |
| Ảnh nguồn (px) | rộng trung vị 332, tối đa 1.057 × 831 | rộng trung vị 228, tối đa 594 × 632 |
| Hình rất nhỏ (<60 px cả hai chiều) | 0 | 31 (ví dụ biểu tượng 18×20 px lặp 13 lần ở Bài 39 làm "đơn vị" biểu đồ tranh) |
| Tệp dùng lại | 2 tệp dùng 2 lần | 4 tệp, nhiều nhất 13 lần |
| Mô tả thay thế (descr) | 2 hình có, đều là chuỗi dán từ web | 140/140 có nhưng **vô dụng**: 38 là chú thích tự sinh tiếng Anh ("…AI-generated content may be incorrect"), 102 là chuỗi dạng "[tên bộ sách] Giải toán 6 bài …" |

Nội dung hình (xem tay một số tệp, chưa phân loại toàn bộ): bảng số liệu, biểu đồ cột, biểu đồ tranh, hình hình học (điểm, đoạn thẳng, góc), hình minh hoạ tình huống, tranh nhân vật.

### 6.2 Ý nghĩa cho UI

- Hình là **nội dung của ô** (đề bài, lời giải, sản phẩm dự kiến), không phải trang trí. HK2: 95/140 hình nằm trong cặp đề | lời giải.
- Cột hẹp: ô phải GV–HS ở 820 px portrait cho ~300 px, ở 390 px không còn cột. Có hình 485 px nguồn.
- Chuỗi mô tả thay thế trong mẫu mang tên SGK và nguồn web (chuỗi dạng "[tên bộ sách] Giải toán 6 bài …"): hình có thể lấy từ sách hoặc trang web. Rủi ro bản quyền cần BA/Techlead nhìn, ngoài phạm vi UI.
- Không có emf/wmf trong nội dung hình HK2; HK1 có 3 tệp wmf nhưng chỉ cho ký hiệu MathType.

## 7. Editor hiện tại (repo `lequanghuy/giaoanai` @ `8c5e53d`, 01/10 22:09 +07; Figma node 3-2)

- Editor = một cột dài `max-w-[860px]` + cột phải 260 px không bấm được, ẩn ≤720 px (`plan-editor-frame.tsx`; `SIDEBAR_ITEMS` 9 dòng tĩnh).
- `LessonPlanEditor`: tên bài, Trường/Tổ/GV, I Mục tiêu (3 danh sách), II Thiết bị (1 danh sách), III 4 hoạt động đều mở sẵn, IV Điều chỉnh. Mỗi hoạt động: Thời lượng, a) b) c), d) 4 ô bước; hoạt động con có tên + a b c d. Toàn bộ là `textarea`/`input` thuần, `min-h 4.5rem`, **không có ảnh, bảng, công thức**.
- Xuất Word (`apps/api/src/export/docx.ts`, 131 dòng): chỉ Heading + Paragraph, **không bảng, không ảnh, không công thức**.
- Figma 3-2: hoạt động 1 mở, 3 hoạt động còn lại gập; có chip a/b/c/d cạnh tiêu đề (nhỏ cho ngón tay); cột phải có Mục lục, Phiên bản. Code hiện tại bỏ gập và chip.
- Tôi dựng lại cấu trúc editor hiện tại trong `app.html?mode=current` (cùng bài minh hoạ trung tính với mockup, không phải app thật): cao **6.625 px** ở 820 px, 51 ô nhập (bản 1 đo với nội dung mẫu thật: 6.426 px, 50 ô).

## 8. Điểm chưa đo / hạn chế

- HK1/HK2 mỗi file là một nguồn, có lỗi chính tả; coi là ví dụ, không phải chuẩn.
- Trang đếm bằng LibreOffice; chiều cao bàn phím iPad ước lượng (portrait ~314 px, landscape ~398 px), chưa đo trên máy thật.
- Chưa phân loại nội dung từng ảnh trong 114 tệp HK2; chỉ xem tay vài chục tệp.
- Số "phân số" (`m:f`) có thể đếm lồng; số bài có phân số (14) là chắc.
- Ảnh trích ở `media/hk1/` (40 tệp), `media/hk2/` (114 tệp) trên box, **không** đưa lên GitHub Pages (chỉ 8 ảnh dùng trong mockup nằm ở `assets/`).


## Ghi chú sau BA co-review 03/10

- Các số "11/32 bài (HK2) và 2/12 bài (HK1) không phải bài học mới" là số **UI UX tự đo**, BA chưa kiểm lại. Loại bài hoãn, chưa vào đợt layout.
- Nhãn 4 bước trong mẫu (HK1/HK2) khác nhau và khác editor; khi xuất Word dùng nhãn editor (một nguồn `ORGANIZATION_STEP_FIELDS`). BA chưa đối chiếu chữ chính xác của văn bản 5512, sẽ hỏi GV.
- Mockup dùng bài minh hoạ trung tính, không dùng nội dung hay hình của mẫu; ảnh trích từ mẫu chỉ ở trên box để đo, không đưa lên Pages.
