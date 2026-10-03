# Đề xuất bố cục editor/xem giáo án (iPad trước)

UI UX Designer · 03/10/2026 (bản 4: thêm mục 11 trạng thái chờ/tải và thông báo không tải được; bản 3: Huy chọn phương án A; thêm Hướng dẫn về nhà và Loại bài; bản 2 là sau BA co-review) · **Chỉ đề xuất và mockup. Chưa giao Dev FE. Phạm vi: Toán lớp 6–9 (mockup không có Văn/Anh).**
Số liệu và nguồn: `findings.md`. Mockup: `index.html` (tổng quan), `app.html` (editor chạy được, tham số trong `README.md`). Ảnh ở `shots/`.
Dữ liệu demo trong mockup là bài **tự soạn, trung tính** (không số hình/số câu kiểu SGK, không tên sách); hình là SVG tự vẽ. Mẫu HK1/HK2 chỉ dùng để đo, không đưa lên Pages.
Nhãn **Đề xuất** trên màn hình mockup = chưa được duyệt, không vẽ như đã duyệt.

## 0. Kết quả BA co-review 03/10 (đã áp vào mockup)

1. **Bảng GV–HS 2 cột cho cả 4 hoạt động, chỉ trình bày, không đổi schema.** Cột phải luôn là "Sản phẩm dự kiến" = c) của chính hoạt động đó (ở C/D là lời giải + đáp số). B bắt buộc dùng bảng. A: c) rỗng thì ô để trống, không tự điền. **Bản Xem và Word giống hệt** (cùng một hàm dựng bảng, xem mục 4b).
2. **Loại bài**: đổi hợp đồng và prompt Toán đang đóng băng, **không** coi là đã duyệt về schema. Mockup vẽ ô chọn lúc tạo bài (4 loại, xem mục 10) và chip trung tính trong editor; mọi mô tả khác biệt theo loại bài gắn nhãn **Đề xuất – chờ duyệt**; màn Soạn chỉ hiển thị. *Số 11/32 (HK2) và 2/12 (HK1) bài không phải bài học mới là số tự đo của UI UX, BA chưa kiểm lại.*
3. **Nhãn 4 bước khi xuất Word = nhãn editor** (Giao nhiệm vụ / Thực hiện nhiệm vụ / Báo cáo thảo luận / Kết luận/nhận định), **một nguồn duy nhất** `ORGANIZATION_STEP_FIELDS` cho editor, bản Xem và Word; Word có thể thêm tiền tố "Bước 1:". Mockup dùng đúng cách đó (`stepLabel(i)`). *BA chưa đối chiếu chữ chính xác của văn bản 5512, sẽ hỏi GV.*
4. **Sản phẩm dự kiến theo từng hoạt động con:** schema đã có c) (`products`) cho từng hoạt động con. Bản Xem: mỗi hoạt động con là **một hàng bảng**, cột phải = c) của nó; c) của hoạt động cha (nếu có) là **một dòng ngắn phía trên bảng**. Ghi chú: c) hiện thường chỉ là câu mô tả; BA đề xuất **P0 đổi nghĩa c) thành phát biểu kiến thức + ví dụ mẫu** (chỉ đổi prompt, chờ Captain/Techlead chốt). UI **không hứa** "nội dung ghi bảng" trước khi prompt đổi; mockup không mô phỏng nội dung ghi bảng, nên không có nhãn Đề xuất cho mục này. Nhãn ô là "c) Sản phẩm dự kiến" (đổi từ "c) Sản phẩm"; chờ duyệt).
5. **Năng lực số (mã `1.3.TC1a`): không vào MVP.** Mockup không có. Ghi chú: app không được sinh mã; GV tự gõ thì là văn bản tự do.
6. **Hình MVP:** GV tự thêm, AI không sinh hình, không vẽ Pencil đợt đầu. **Chính sách bản quyền ĐỀ XUẤT (chờ Huy duyệt, có thể cần ý kiến pháp lý):** (a) app không gửi kèm, không lưu sẵn, không gợi ý ảnh SGK nào; (b) hình GV tải lên riêng tư trong tài khoản đó, không chia sẻ, không thư viện chung; (c) khi tải hình có một dòng lưu ý GV chịu trách nhiệm về hình mình tải (câu chữ do Captain/Huy chốt; mockup dùng placeholder "Hình do GV tải lên, GV chịu trách nhiệm về hình." gắn nhãn **Đề xuất**); (d) thêm hình **không** tự điền tên tệp/nguồn vào mô tả, không tự tạo alt có tên sách (mẫu có chuỗi tên bộ sách ở 102/140 hình HK2). Mô tả hình **không chặn xuất Word**, chỉ nhắc nhẹ; dấu nhắc thiếu mô tả **không cộng vào chip "Nên soát n"** (chip đó chỉ dành cho cảnh báo bài toán của AI); dấu nhắc dùng chip nhỏ **trung tính** (xám, không đỏ/hổ phách, không chấm than). Soạn lại (revise) khi đã có hình: **câu hỏi cho Techlead**; BA muốn GV được báo trước nếu hình có thể không còn khớp văn bản mới (mockup có dòng báo, nhãn **Đề xuất**); đề AI sinh phải tự dùng được bằng chữ, không tham chiếu "Hình n" (BA đề xuất C15).
7. **Copy.** Giữ nguyên "Chưa lưu được nên thao tác này chưa chạy. Bấm biểu tượng thử lại ở đầu giáo án." và "Cần có ít nhất một ý." (bản A đã duyệt; dòng thứ hai dưới nút khi lỗi dữ liệu là "Chưa lưu được nên thao tác này chưa chạy. Sửa các ô có dòng nhắc bên dưới."; mockup đã kiểm bằng script, khớp từng chữ). Sửa: (i) chỉ dùng "Chưa có mô tả hình." (bỏ "Hình này chưa có mô tả."); (ii) nhãn "Mô tả hình" + gợi ý nhỏ "Một câu ngắn mô tả hình này."; (iii) "Chạm để xem hoặc sửa". Đã quét toàn bộ chữ hiển thị: không lời mở lịch sự, không "lỗi/sai/máy chủ/400/validation", không chấm than.

## 1. Mẫu cho thấy gì (số đo)

- Một bài dài **636–3.103 từ**, 5–12 trang in. Nửa độ dài là mục B Hình thành kiến thức (48–50% từ).
- Nội dung nằm ở **bước 1** của d) (TB 1.061 ký tự, tối đa 2.071) và ở **ô "Sản phẩm dự kiến"** (TB 864 ký tự). Bước 2–4 TB 114–137 ký tự; a) b) c) TB 127 / 74 / 52 ký tự.
- Bài có **bảng GV–HS 2 cột** (18 bảng HK1, 49 bảng HK2), **hình** (30 HK1, 140 HK2; 95/140 ở HK2 nằm trong cặp đề | lời giải) và **công thức** (HK1: ký hiệu ⋮ ∈ ≤ và chữ mũ; HK2: 708 phân số).
- Editor hiện tại: một cột dài, 4 hoạt động mở hết, chỉ ô văn bản, mục lục tĩnh, không ảnh/bảng/công thức, Word xuất không bảng. Dựng lại với bài minh hoạ trung tính: **6.647 px, 51 ô nhập** ở 820 px.

## 2. Phương án khuyên: A "Soạn theo khối + Xem như giáo án"

Một cột, hai chế độ (tab 44 px), mục lục neo. Chạy trên cả 820×1180, 1180×820, 1280, 390.

**Khung**
- Thanh trên 1 hàng 48 px, dính trên: Mục lục (≤1099 px) · tên bài · trạng thái lưu + icon Thử lại (giữ nguyên) · Xuất Word. Một hàng để còn chỗ khi bàn phím bật.
- Landscape/desktop (≥1100 px): cột Mục lục 236 px bấm được (theo dõi mục đang xem, chip "Nên soát", thời lượng, hoạt động con).
- Portrait/mobile: hàng chip mục lục cuộn ngang (chip cao 44 px) + nút Mục lục mở bảng chọn. Bàn phím mở thì ẩn hàng chip.
- Tab: **Soạn** | **Xem như giáo án** | So sánh (giữ).

**Soạn**
- Thông tin chung thu về một dòng + nút Sửa.
- Nhãn ô c) là "c) Sản phẩm dự kiến"; hoạt động có hoạt động con thêm ô "c) Sản phẩm chung của hoạt động".
- Hoạt động = khối gập, **mở một khối một lúc**. Tiêu đề khối 60 px: số, tên cố định (đã duyệt), phút, số hình, "Nên soát n". Hoạt động con là khối gập lồng.
- d) Tổ chức thực hiện: **Bước 1 mở sẵn, Bước 2–4 là một dòng tóm tắt 44 px, chạm mới mở** (khớp số đo: 1.061 vs ~125 ký tự).
- Ô tự giãn theo nội dung (không cuộn trong ô). Chữ 16 px để iPadOS không tự phóng.
- b) Nội dung và c) Sản phẩm có hàng đính kèm: ảnh thu nhỏ 88×64, bảng, "Thêm hình", "Thêm bảng" (đều ≥44 px). Không dùng hover.
- Công thức: gõ bằng thanh ký hiệu; dòng "Xem trước công thức" hiện ngay dưới ô khi ô có công thức.
- Thanh ký hiệu 48 px trên bàn phím: ⋮ ⋮̸ ∈ ∉ ⊂ ≤ ≥ ≠ × ÷ → ° ∠ ⊥ ∥ π √ + a/b, xⁿ (+ ℕ; 9 ký hiệu thường gặp nhất ⋮ ∈ N ∉ × ≤ ≥ ≠ → chiếm 175/192 công thức OMML HK1).
- Lưu/lỗi: giữ nguyên icon Thử lại, dòng lý do ngắn dưới ô, hai câu nhắc Xuất/Soạn lại/Tạo phiếu đã duyệt. Mockup có `?save=data|net`.
- Ghi chú soi xét: chip "Nên soát … Đã soát" giữ y nguyên trong khối; thêm số trên Mục lục.

**Xem như giáo án** (bản khớp Word)
- Trang giấy: I, II, III (A–D), mỗi hoạt động có a/b, d) là **bảng 2 cột "Hoạt động của GV và HS | Sản phẩm dự kiến" cho cả A, B, C, D** (mục 0.1, 0.4). Cột trái = 4 bước (nhãn editor, tiền tố "Bước n:"); cột phải = c) của chính hoạt động đó + bảng + hình. A có c) rỗng thì ô phải để trống.
- B: một bảng; mỗi hoạt động con là một hàng (hàng tiêu đề con gồm tên, a), b), hình của b); rồi hàng nội dung). c) của hoạt động cha là một dòng ngắn trên bảng.
- ≥721 px: bảng 2 cột (58% / 42%), hình co theo cột, chạm hình mở xem lớn.
- ≤720 px: mỗi hàng bảng thành 2 khối xếp dọc, có nhãn nhỏ phía trên từng khối; hình rộng 100%.
- Công thức hiển thị bằng MathML (phân số, mũ); ký hiệu không chia hết vẽ ghép.

**Hình trong hoạt động** (xem mục 4).

## 3. Phương án B: Soạn | Xem song song (chỉ ≥1100 px)

Hai khung cạnh nhau, khung xem tự cuộn theo ô đang gõ. Portrait và mobile quay về A.
Không khuyên làm đợt đầu: ở 1180 px chỉ còn ~450 px mỗi khung sau cột mục lục, bảng GV–HS chật như ở 390; bàn phím ngang ~398 px còn ~326 px nhìn được, khung xem gần như vô dụng lúc đang gõ; tốn thêm đồng bộ cuộn. Làm sau nếu Huy dùng bàn phím rời.

## 4. Hình: đặt, xem, sửa, xuất

**Chỗ đặt.** Hình thuộc ô: b) Nội dung (đề bài, hình khởi động), c) Sản phẩm dự kiến (lời giải, hình chốt), có thể ở bước 1. Khớp mẫu: HK2 47 hình ở đề, 48 ở lời giải; HK1 11 hình ở cột sản phẩm. Thứ tự theo số 1, 2, 3 trong ô; khi xuất giữ đúng thứ tự.

**Chạm trên iPad** (mockup: chạm ảnh thu nhỏ → bảng dưới/hộp thoại; chạm "Thêm hình" → bảng thêm)
- Xem: ảnh lớn trong khung cuộn, chạm hai lần hoặc chụm hai ngón để phóng. Nhãn nút: "Chạm để xem hoặc sửa".
- Thay/thêm: ba nút 44 px "Ảnh" (Photos), "Tệp" (Files), "Chụp"; dòng lưu ý tải hình (**Đề xuất**, câu chữ do Captain/Huy chốt). Chọn xong thay tại chỗ, giữ chú thích.
- Sửa: "Chú thích dưới hình", "Mô tả hình" (gợi ý nhỏ "Một câu ngắn mô tả hình này."; **không tự điền** tên tệp/nguồn), "Cỡ hình khi xuất" Nhỏ/Vừa/Rộng, "Xoá hình".
- Hình thiếu mô tả: chip nhỏ **trung tính** trên hình + dòng "Chưa có mô tả hình." Không chặn xuất Word, không cộng vào "Nên soát n".
- Không vẽ/khoanh bằng Apple Pencil ở đợt đầu. AI không sinh hình.

**Cột hẹp.** Xem như giáo án: portrait 820 → cột phải ~300 px, hình co theo cột, không cuộn ngang; 390 → xếp dọc, hình rộng 100%. Mọi hình chạm để xem lớn (nguồn trung vị 228–332 px, tối đa 1.057 px).

**4b. Xuất Word = bản Xem.** Hiện tại không có bảng/hình/công thức. Cần: một hàm dựng bảng dùng chung (tiêu đề cột "Hoạt động của GV và HS | Sản phẩm dự kiến", hàng con cho B, c) rỗng thì ô trống), nhãn bước từ `ORGANIZATION_STEP_FIELDS`, hình inline có chú thích và mô tả (alt), công thức dạng OMML. Cỡ hình theo Nhỏ/Vừa/Rộng (không quá 100% rộng cột). Kiểm: so snapshot HTML bản Xem với bảng trong .docx.

**4c. Hình và bản quyền (đề xuất, chờ Huy duyệt, có thể cần ý kiến pháp lý).** (a) app không gửi kèm, không lưu sẵn, không gợi ý ảnh SGK; (b) hình tải lên riêng tư trong tài khoản đó, không chia sẻ, không thư viện chung; (c) một dòng lưu ý khi tải hình; (d) không tự điền tên tệp/nguồn vào mô tả. Mẫu tham chiếu: 140/140 hình HK2 có descr, trong đó 102 mang tên bộ sách và số bài: dấu hiệu hình lấy từ sách/web.

## 5. Công thức

- Lưu dạng text có đánh dấu `$…$` (LaTeX rút gọn) để Techlead dịch được sang MathML (xem) và OMML (Word). Mockup dùng `\frac{1}{2}`, `x^{n}`, `\ndiv`.
- Gõ: thanh ký hiệu chèn ký hiệu/khung; không bắt GV gõ LaTeX. Nút a/b chèn khung phân số, xⁿ chèn khung mũ.
- Xem: MathML. Mockup "Quan hệ chia hết" có ⋮ và ⋮̸; mockup "Biểu đồ cột" có phân số ½ (ở c) của Mở đầu).
- Ký hiệu ⋮̸ (không chia hết) trong mẫu là ảnh MathType 34/34; Unicode không có ký tự riêng.

## 6. Đổi và giữ

| Hạng mục | Hiện tại | Đề xuất | |
|---|---|---|---|
| Cột phải 260 px tĩnh | Không bấm được, ẩn ≤720 px | Mục lục bấm được; portrait/mobile: hàng chip + bảng Mục lục | **Đổi** |
| 4 hoạt động mở hết | 6.426 px (820 px) | Khối gập, mở một khối; chip Nên soát, phút, hình | **Đổi** |
| Bước 1–4 | 4 ô cao bằng nhau | Bước 1 mở, 2–4 tóm tắt 44 px | **Đổi** |
| Ô nhập | min-h 72 px, cuộn trong ô, chữ 14 px | Tự giãn, 16 px | **Đổi** |
| Hình / bảng / công thức | Không có | Hàng đính kèm, thanh ký hiệu, xem trước | **Thêm** |
| Chế độ xem | Không có (chỉ So sánh) | Tab "Xem như giáo án", bảng 2 cột cho cả A–D | **Thêm** |
| Nhãn ô c) | "c) Sản phẩm" | "c) Sản phẩm dự kiến" (khớp cột phải) | **Đổi** (chờ duyệt) |
| Nhãn 4 bước | Mỗi nơi một kiểu | Một nguồn `ORGANIZATION_STEP_FIELDS` cho Soạn, Xem, Word | **Đổi** |
| Xuất Word | Heading + đoạn | Bảng 2 cột, hình, OMML | **Thêm** (BE) |
| Tên 4 hoạt động | Cố định (đã duyệt) | Giữ | Giữ |
| Icon Thử lại + dòng lý do + 2 câu nhắc | Đã duyệt | Giữ nguyên chữ | Giữ |
| Chip "Nên soát … Đã soát" | Có | Giữ, thêm số ở Mục lục | Giữ |
| Tab Bản hiện tại / So sánh | Có | Đổi tên "Soạn"; So sánh giữ | Giữ |
| Câu "theo khung Phụ lục IV · GV tự thẩm định" | Có | Giữ trên mọi chế độ | Giữ |
| a/b/c/d chip Figma (nhỏ) | Không có trong code | Không làm; Mục lục + khối gập thay thế | Bỏ |

Đo mockup (cùng bài minh hoạ trung tính, đo lại 03/10 sau khi thêm Hướng dẫn về nhà; chưa phải app thật). Chiều cao trang Soạn ở 820 px: **3.251 px** (1 hoạt động mở) / 2.017 px (đóng hết) so với **6.647 px** hiện tại dựng lại. 390 px: 3.633 / 2.153 so với 6.893. 1180 px: 3.194 / 1.960. Bản Xem: 3.730 px (820), 3.694 (1180), 5.348 (390). Các số đã gồm khối Hướng dẫn về nhà thu gọn (mục 10). Số cũ (3.153 / 6.625) là trước khi thêm khối này.

## 7. Câu hỏi cho Huy (cập nhật sau BA co-review)

Đã có khuyến nghị BA, chờ Huy/Captain duyệt:
1. **Phương án A hay B?** **Huy đã chọn A** (một cột, 3 tab Soạn | Xem như giáo án | So sánh). B để sau.
2. **Loại bài:** mockup có ô chọn 4 loại lúc tạo bài; **Đề xuất – chờ duyệt** vì đổi hợp đồng và prompt Toán đang đóng băng (mục 10).
3. **Tab "Xem như giáo án" là màn duyệt trước khi xuất?** Khuyên **có**.
4. **Mở một hoạt động một lúc?** Khuyên **có**; mở mặc định hoạt động có "Nên soát", nếu không thì hoạt động 2.
5. **Thanh ký hiệu toán trên bàn phím?** Khuyên **có**.
6. **Còn lại cho Huy: chính sách bản quyền hình** (mục 4c): app không kèm/gợi ý ảnh SGK, hình riêng tư theo tài khoản, dòng lưu ý khi tải (câu chữ do Captain/Huy chốt), không tự điền nguồn vào mô tả. Cần Huy duyệt, có thể cần ý kiến pháp lý.
7. **Thời lượng phút từng hoạt động**: giữ hiển thị gọn ở tiêu đề khối, **không đổi quy tắc bắt buộc** trong đợt này.

Đã trả lời bởi BA (không còn hỏi Huy): bảng 2 cột cho cả 4 hoạt động (mục 0.1), nhãn bước (0.3), hình do GV tự thêm / AI không sinh / không Pencil (0.6), Năng lực số không vào MVP (0.5).

## 8. Câu hỏi còn mở cho BA / Techlead / Captain

**BA / Captain**
1. P0 đổi nghĩa c) thành phát biểu kiến thức + ví dụ mẫu (chỉ đổi prompt): chờ Captain/Techlead chốt. Trước đó UI không hứa "nội dung ghi bảng".
2. Chữ chính xác của 4 nhãn bước theo văn bản 5512: BA sẽ hỏi GV; trước đó dùng nhãn editor.
3. Câu lưu ý khi tải hình: Captain/Huy chốt. Chính sách bản quyền: Huy duyệt, cân nhắc pháp lý.
4. Loại bài: cần BA kiểm lại số 11/32 và 2/12 (UI UX tự đo) và chốt 4 giá trị (mục 10).
5. Đề AI sinh phải tự dùng được bằng chữ, không tham chiếu "Hình n" (C15, BA đề xuất): cần đưa vào prompt.

**Techlead**
1. Lưu hình: nơi lưu, riêng tư theo tài khoản, giới hạn dung lượng/nén. Số liệu mẫu: HK2 114 tệp / 3,0 MB (lớn nhất 151 KB), HK1 40 tệp / 1,42 MB (lớn nhất 578 KB); 0–32 hình/bài. Schema hiện không có chỗ cho hình và bảng.
2. Công thức: lưu `$…$` hay cấu trúc; xuất OMML trong `docx.ts` (hiện không có Math/Table/ImageRun); MathML trên Safari/iPad cần kiểm thật.
3. Ký hiệu ⋮̸ (không chia hết): một chuỗi (⋮ + U+0338) hay token riêng; kiểm font trên iPad và Word.
4. Bảng trong ô: 7/18 (HK1) và 9 bảng lồng (HK2) nằm trong ô GV–HS: lưu dạng `bảng` riêng trong ô hay chỉ ở c)?
5. `field-save` giới hạn 4.000 ký tự/ô: không ô mẫu nào vượt (tối đa 2.434), cần đo lại khi thêm công thức đánh dấu.
6. **Soạn lại (revise) khi đã có hình/bảng:** giữ hình hay bỏ? Cách báo GV trước nếu hình có thể không còn khớp văn bản mới.
7. Một hàm dựng bảng GV–HS dùng chung cho Xem và Word; `ORGANIZATION_STEP_FIELDS` là nguồn nhãn duy nhất.

## 9. Chưa làm

- Chưa thử trên iPad thật (Safari, MathML, bàn phím thật, Pencil, Photos/Files picker); kích thước bàn phím là ước lượng.
- (Mục 11 đã vẽ trạng thái chờ So sánh.) Chưa có mockup cho So sánh (diff) và khung chọn hình thật; chạm ảnh chỉ mở bảng minh hoạ.
- Mockup dùng 2 bài minh hoạ trung tính tự soạn (Biểu đồ cột, Quan hệ chia hết), không phải bài mẫu thật; hình là SVG tự vẽ.
- Chưa mô phỏng "nội dung ghi bảng" (chờ P0 đổi nghĩa c)), chưa có file .docx mẫu để so Xem với Word (mới có yêu cầu).

## 10. Bổ sung sau khi Huy chọn phương án A: Hướng dẫn về nhà và Loại bài

Chạy trong cùng `app.html`; các trạng thái cũ vẫn dùng được. Mockup chỉ Toán lớp 6–9, dữ liệu là bài minh hoạ tự soạn và hình SVG tự vẽ (không ảnh/nhãn SGK, không tên sách).

### 10.1 Hướng dẫn về nhà (HVN)

**Làm gì, vì sao.** Mẫu có phần hướng dẫn về nhà ở cuối bài (HK1 2,8% số từ, HK2 có ở một số bài). Thêm thành một phần tách riêng, **mặc định bật**, 2–3 ý ngắn, xoá được cả phần.

**Trạng thái**

| Trạng thái | Soạn | Xem | Word |
|---|---|---|---|
| Bật (mặc định) | Khối gập sau 4 hoạt động, trước IV: tiêu đề + số ý. Mở ra: mỗi ý một ô 16 px (cao ≥44 px) + nút xoá ý 44 px; nút "Thêm ý"; dòng "Hiện ở cuối bản Xem và bản Word."; nút nhỏ "Xoá phần này" (cao 44 px) | Mục "Hướng dẫn về nhà" cuối tài liệu, danh sách gạch đầu dòng ngắn, kiểu mục kết của Phụ lục IV | Cùng nội dung, cùng thứ tự (một hàm dựng `hvnPaper()` cho Xem và Xem trước Word) |
| Đã xoá | Hộp nét đứt: "Chưa có phần này trong bản Xem và bản Word." + nút "Thêm hướng dẫn về nhà" | Không hiện | Không xuất; xem trước Word ghi "Không xuất (đã xoá phần này)" |
| Thêm lại | Khôi phục các ý đã có (nếu chưa có thì một ô trống) | | |

- Gợi ý, không chặn: quá 3 ý hiện dòng "Nên giữ 2–3 ý để gọn."; ô trống không xuất.
- Mục lục (rail và chip) có "Hướng dẫn về nhà" khi đang bật.
- **Xem trước Word:** nút "Xuất Word" (thanh trên và cuối trang) mở bảng "Xem trước Word": thứ tự phần trong file (Thông tin, I, II, III với bảng 2 cột A–D, HVN) và đoạn HVN đúng như sẽ xuất; nút "Tải file .docx" là mô phỏng.
- Tham số: `?hvn=off` (đã xoá), `?hvn=edit` (mở sẵn khối), `?word=1` (xem trước Word), kết hợp `?hvn=off&word=1`.

**Đo chiều cao thêm (mockup, 820 px / 390 px)**
- Soạn, khối HVN thu gọn: **+74 / +74 px**; mở 3 ý: **+362 / +434 px**; trạng thái đã xoá (hộp nút thêm): 92 / 122 px.
- Xem: HVN 3 ý cộng **105 px** ở 820 (3.625 → 3.730), **100 px** ở 390 (5.248 → 5.348).
- Soạn toàn trang (1 hoạt động mở): 3.251 px (820), 3.633 px (390), đã gồm HVN thu gọn.

**Câu hỏi mở (BA / Techlead):**
1. Lưu ở đâu: trường mới trong hợp đồng (danh sách ý) hay nằm trong "Điều chỉnh"? Đổi schema và Word export.
2. AI có sinh sẵn 2–3 ý, hay để GV tự nhập? Mockup chỉ minh hoạ nội dung do GV sửa; nếu AI sinh thì đổi prompt Toán (đang đóng băng).
3. Vị trí: mockup đặt sau hoạt động D, trước "IV. Điều chỉnh sau bài dạy" ở Soạn; ở Xem/Word là mục cuối. IV có xuất ra Word không? Hiện bản Xem chưa có IV.
4. Giới hạn: 3 ý chỉ là gợi ý; có cần giới hạn cứng số ý và số ký tự mỗi ý (4.000 ký tự/ô hiện tại)?
5. Có cần HVN theo từng loại bài (ví dụ Ôn tập)?

### 10.2 Loại bài khi tạo giáo án

**Làm gì, vì sao.** Ô chọn Loại bài trong form "Tạo giáo án mới" (`?view=create`). 4 lựa chọn là thẻ radio lớn (cao 64 px, rộng 302–340 px), mặc định **Bài mới**. Lý do: mẫu có bài không phải bài học mới (số UI UX tự đo: HK2 11/32, HK1 2/12; BA chưa kiểm lại).

| Loại bài | Dòng gợi ý dưới ô chọn (1 dòng) |
|---|---|
| Bài mới (mặc định) | Đủ 4 hoạt động, có kiến thức mới. |
| Luyện tập chung | Nhiều bài tập củng cố, ít kiến thức mới. |
| Ôn tập | Hệ thống kiến thức và bài tập tổng hợp. |
| Thực hành trải nghiệm | Thực hành, đo đạc, làm sản phẩm. |

- Form: Lớp (6–9, nút 44 px), Tên bài, Số tiết, Phút mỗi tiết, Loại bài, nút "Tạo giáo án". Chỉ Toán, không chọn môn.
- Loại bài đã chọn hiện là chip trung tính ở đầu Soạn và Xem (cạnh "v1"). Trong Thông tin chung (bấm Sửa) có dòng "Loại bài" kèm nhãn **Đề xuất – chờ duyệt**; màn Soạn chỉ hiển thị, không đổi sau khi tạo.
- Dưới form có hộp nét đứt **Đề xuất – chờ duyệt**: "Khác nhau theo loại bài trong editor" (B chia theo kiến thức mới / theo dạng bài; B hệ thống theo chủ đề; B là các bước thực hành, c) là sản phẩm). Ghi rõ: đổi hợp đồng và prompt Toán đang đóng băng, chưa duyệt schema; **tên 4 hoạt động giữ nguyên**. Mockup không đổi nội dung editor theo loại bài.
- Tham số: `?view=create&type=bai-moi|luyen-tap-chung|on-tap|thuc-hanh` (form); `?type=…` (editor có chip).
- Đo: form ở 820 px cao 1.180 px (vừa một màn, không cuộn), 1180 px: 989, 390 px: 1.381. Dòng gợi ý vừa một dòng ở 360 px cho cả 4 loại.

**Câu hỏi mở (BA / Captain / Techlead):**
1. Đổi hợp đồng: thêm trường `lessonType` (4 giá trị); BA trước đó nêu 2 giá trị (Bài học mới / Luyện tập–Ôn tập), nay 4 giá trị theo Huy. Chốt tên và mã.
2. Prompt Toán đang đóng băng: mỗi loại cần prompt/khung riêng (số hoạt động con, nghĩa c)). Ai chốt và khi nào?
3. Có sửa được loại bài sau khi tạo (Soạn lại)? Mockup: chỉ đọc.
4. "Thực hành trải nghiệm" có cùng khung 4 hoạt động A–D không? Tên 4 hoạt động giữ nguyên.
5. BA kiểm lại số 11/32 và 2/12 trước khi dùng làm lý do.

### 10.3 Cái chưa làm / lưu ý

- Chưa mô phỏng nội dung editor khác nhau theo loại bài (chỉ mô tả, Đề xuất – chờ duyệt).
- "Tải file .docx" và xem trước Word chỉ là mô phỏng thứ tự và nội dung; chưa có file thật để so với bản Xem.
- Chưa thử trên iPad thật; khối HVN và thẻ radio kiểm bằng Chrome headless ở 820×1180, 1180×820, 1280, 390.


## 11. Trạng thái chờ / tải (loading) và thông báo không tải được

Chạy trong cùng `app.html` (tham số ở `index.html` mục 2b và `README.md`). Chỉ Toán, dữ liệu minh hoạ tự soạn, hình SVG tự vẽ. Mọi thứ trong mục này là **Đề xuất, chưa duyệt**, trừ mẫu lưu "Đang lưu" / "Chưa lưu được" + biểu tượng thử lại: giữ nguyên, không thiết kế lại. Giữ nguyên 4 tên hoạt động, chip Nên soát, hai câu nhắc đã duyệt và dòng "theo khung Phụ lục IV · GV tự thẩm định".

### 11.1 Quyết định: skeleton hay spinner

| | Skeleton (hàng khung xám) | Spinner (vòng xoay) |
|---|---|---|
| Danh sách lần đầu | Hợp: biết trước hình dạng (6 hàng, 4 cột), giữ đúng chỗ | Không nói gì về nội dung sắp có; màn trắng với vòng xoay giữa trang |
| Dịch chuyển bố cục | Không (đo: bảng 375 px đều ở skeleton và ở dữ liệu thật; hàng 56 px desktop/iPad, 84 px ở 390) | Có: khi dữ liệu về, cả trang nhảy |
| Cảm giác chờ | Nhanh hơn, có cấu trúc | Chậm hơn, không có mốc |
| Hợp nhất | Tải nội dung có hình dạng biết trước (danh sách, mở giáo án, Xem, So sánh) | Hành động ngắn tại chỗ trên một nút (< vài giây): Tạo, Xuất, Soạn lại, Lưu |

**Chọn: skeleton cho mọi lần tải nội dung (danh sách, mở giáo án, tab Xem, So sánh), spinner chỉ đặt trong nút khi hành động ngắn tại chỗ.** Lý do: danh sách "Giáo án của tôi" là bảng 6 hàng có hình dạng biết trước, nên hàng khung xám đúng kích thước hàng thật (56 px, 84 px ở 390) cho GV thấy ngay "đang có danh sách đến", và khi dữ liệu về không có gì nhảy (đo chênh 0 px ở cả 820, 1180 và 390). Hiện tại màn này vẫn chớp dòng "Chưa có tiết nào…" ở lần vẽ đầu vì `recent` khởi tạo `[]` rồi mới đọc dữ liệu, nên GV tưởng mất giáo án; skeleton chặn đúng lỗi nhìn này. Spinner không báo trước hình dạng, gây nhảy bố cục, và không hợp với việc tải cả màn. Việc dài (tạo/soạn lại 20–60 giây) không dùng riêng spinner nào: dùng thanh tiến trình không xác định + số giây đã chạy + nội dung cũ vẫn hiện (mục 11.4), vì spinner trơn 60 giây không cho biết còn sống hay đã treo.

### 11.2 Bảng kiểm các chỗ thiếu trạng thái chờ

Đường dẫn trong repo `giaoanai` (đọc, branch `cursor/ga-35-home-figma-9254`, HEAD 964e75d), thư mục gốc `apps/web/src/`. Tìm `loading|skeleton|spinner|aria-busy|animation` trong `src/` không có kết quả; không có `loading.tsx` trong `app/`.

| # | Chỗ | Hiện tại (file) | Đề xuất | Ngưỡng |
|---|---|---|---|---|
| 1 | Danh sách "Giáo án của tôi" lần đầu | `components/home/home-view.tsx`: `recent` bắt đầu `[]`, điền trong `useEffect` từ `lib/recent-plans.ts` (sessionStorage) → lần vẽ đầu hiện câu "Chưa có tiết nào…" dù có dữ liệu. `recent-plan-list.tsx` bảng 5 cột, hàng `role=link` | **Skeleton 6 hàng** đúng cột/chiều cao hàng; số tiết cũng là skeleton; nút Tạo tiết mới vẫn bấm được; `aria-busy` + câu trạng thái ẩn "Đang tải danh sách giáo án." | Hiện sau **300 ms**, ở lại tối thiểu **500 ms**; chữ "Đang tải lâu hơn bình thường." ở **8 s**; nút Thử lại ở **15 s**; thất bại sau **30 s** |
| 2 | Danh sách → mở một giáo án | `recent-plan-list.tsx`: `router.push('/editor/{jobId}')`, không báo gì | Hàng bấm đổi nền xanh nhạt + "Đang mở…" kèm vòng xoay nhỏ ở cột Cập nhật, các hàng khác vẫn bấm được (bấm hàng khác thì mở hàng đó) | Ngay lập tức (không trễ 300 ms: là phản hồi bấm) |
| 3 | Mở giáo án | `components/editor/editor-view.tsx`: `busy` khởi tạo `true`; thẻ giáo án chưa có nên trang rỗng rồi nhảy; nếu không có: "Chưa có giáo án cho job này." | **Skeleton editor**: thanh trên (nút Xuất Word tắt), chip mục lục, 3 tab (tắt), dòng "theo khung Phụ lục IV · GV tự thẩm định" hiện luôn, khối I/II, 4 hoạt động với **tên cố định hiện ngay**, chỉ nội dung là khung xám; vùng lưu trống (chưa có gì để lưu) | 300 ms / 500 ms; 8 s chữ chờ lâu; 15 s Thử lại + Về danh sách |
| 4 | Tạo giáo án (form → editor) | `generate-plan-form.tsx`: nút `busy ? "Đang tạo…" : "Tạo & mở editor"`, `disabled`, Dialog `allowClose={!busy}`; lỗi là chuỗi thô, dự phòng "Không tạo được giáo án" | Nút "Đang tạo…" + vòng xoay, ô nhập khoá; sau đó **màn Đang tạo** (11.4): thanh không xác định, "Đang soạn 4 hoạt động.", "Thường mất 20–60 giây.", "Đã chạy m:ss", 4 hoạt động tên cố định dạng khung, **Về danh sách** (luôn được), **Dừng tạo** (Đề xuất, cần BE) | Nút bận tức thì; màn Đang tạo khi POST xong; "Lâu hơn dự kiến…" ở **60 s**; dừng ở **120 s** |
| 5 | Soạn lại (cả giáo án) | `editor-view.tsx`: `runJob` + `setBusy`, nút chỉ `disabled`, thẻ "Trạng thái job" có Job id và chữ "Đang tạo / soạn lại, vui lòng chờ…" (lời đệm) | Giữ nội dung cũ hiện nguyên, chỉ đọc; nút "Đang soạn lại…" + vòng xoay; **thanh trạng thái nổi ở đáy** (không đẩy bố cục): "Đang soạn lại giáo án · m:ss", "Nội dung hiện tại vẫn hiện bên dưới. Thường mất 20–60 giây.", **Dừng** (Đề xuất). Nút Xuất Word tắt trong lúc soạn | Bận tức thì; thanh đáy ngay; 60 s chữ lâu; 120 s dừng |
| 6 | Soạn lại phiếu / tạo phiếu | `components/plan/worksheet-panel.tsx`: `disabled={busy}`, nhãn không đổi | Cùng mẫu 5 (nhãn "Đang soạn lại…" + thanh đáy). Phiếu không nằm trong mockup này | như 5 |
| 7 | Lưu | Prototype đã duyệt: mẫu "Đang lưu" / "Chưa lưu được" + biểu tượng thử lại đã duyệt | **Giữ nguyên, tái dùng**. Chỉ thêm: khi đang tải giáo án (3) vùng lưu để trống, không hiện "Đã lưu" giả | Theo mẫu đã duyệt |
| 8 | Xuất Word | `components/export/export-word-button.tsx`: `disabled={busy \|\| !allowed}`; `editor-view.tsx` `exportLessonDocx` rồi `window.location.assign`; thất bại: "Xuất Word thất bại" | Nút "Đang xuất…" + vòng xoay, `aria-busy`; thanh đáy "Đang tạo file Word…" / "File sẽ tải về khi xong"; xong: "Đã xuất giao-an-….docx" + **Tải lại** + đóng; thất bại: dòng "Chưa xuất được file Word / Chưa có file để tải. Bấm Thử lại." Giữ nguyên dòng lý do chặn xuất hiện có (guardrail/403) | Nút bận tức thì; đề xuất thêm: 8 s chữ "Đang chuẩn bị file lâu hơn bình thường.", 30 s dừng cho Thử lại (mockup chưa vẽ riêng hai mốc này, chỉ mô tả) |
| 9 | Tab Xem như giáo án | Không có trạng thái chờ; hiện dựng ngay từ dữ liệu có sẵn | Chỉ cần khi bản Xem lấy từ server: **skeleton bảng 2 cột** đúng cột A–D (xem `50-xem-loading`); khi dựng cục bộ thì không hiện gì | 300 ms / 500 ms |
| 10 | Tab So sánh | `components/plan/plan-diff.tsx`: diff phía client, tức thì | Chỉ khi bản trước tải từ server: **skeleton hai cột** "Bản trước / Bản mới" (xem `51-compare-loading`) | 300 ms / 500 ms |
| 11 | Tải hình lên | Không có trong app hiện tại; mockup có bảng Thêm hình | Thanh tiến độ có phần trăm ("Đang tải lên 62%") + **Dừng**; hình khung xám (`.imgph`) cho hình đang tải ở tab Xem; lỗi: "Chưa tải được hình / Hình chưa được thêm vào giáo án. Bấm Thử lại." Tên file giữ trong ô | Thanh có % ngay; Dừng luôn có |
| 12 | Hình trong tab Xem | `<img>` không có chỗ giữ | Đặt `width`/`height` (khung xám nền) để không nhảy khi hình về | không trễ |

### 11.3 Quy tắc thời gian (một bộ cho cả app)

| Quy tắc | Giá trị | Lý do |
|---|---|---|
| Trễ trước khi hiện skeleton / chỉ báo tải nội dung | **300 ms** | Tải nhanh (< 300 ms) không nháy khung xám |
| Thời gian hiện tối thiểu một khi đã hiện | **500 ms** | Tránh nháy "hiện rồi mất" |
| Phản hồi bấm (đang mở hàng, nút bận) | **0 ms** | Phải thấy ngay là đã nhận bấm |
| Chữ chờ lâu | **8 s**: "Đang tải lâu hơn bình thường." | Báo còn đang chạy |
| Nút Thử lại cho tải nội dung | **15 s** (cùng chỗ chữ chờ lâu) | Cho GV tự hành động |
| Thất bại tải danh sách / mở giáo án | **30 s** → "Chưa tải được…" + Thử lại | Có kết thúc rõ |
| Tạo / soạn lại | gợi ý **"Thường mất 20–60 giây."** ngay từ đầu; số giây đã chạy từ 0; **60 s** "Lâu hơn dự kiến. Chờ thêm hoặc về danh sách; giáo án sẽ vào danh sách khi xong."; **120 s** dừng: "Chưa tạo xong sau 2 phút nên bản này đã dừng. Bấm Thử lại để tạo lại." | Việc dài, GV cần biết bình thường là bao lâu |
| Xuất Word | **8 s** chữ lâu, **30 s** thất bại | File nhỏ, thường vài giây |
| Chuyển động | shimmer 1,4 s, vòng xoay 0,9 s, thanh không xác định 1,5 s; **tắt hết khi giảm chuyển động** | Xem 11.6 |

- Không vẽ danh sách "bước" giả (đang đọc yêu cầu… đang soạn…) vì BE chưa trả bước; chỉ hiện thanh không xác định + số giây. Nếu BE trả `job.stage` thì hiện đúng tên bước (Đề xuất, cần BE).
- Rời trang khi đang tạo: nút **Về danh sách** luôn bấm được. Cần BE giữ job chạy tiếp và cho vào danh sách (trạng thái Nháp/Đang tạo) — câu hỏi 2 ở 11.8.
- Chống bấm đúp: nút bận bị tắt, ô nhập chỉ đọc (soạn lại) hoặc khoá (form), nút Xuất Word tắt khi đang soạn lại hoặc đang xuất.
- Skeleton không nhận tiêu điểm; các điều khiển có thật (Tạo tiết mới, Về danh sách) vẫn tab tới được.

### 11.4 Màn "Đang tạo" và Soạn lại (việc dài)

- **Tạo:** màn riêng thay form. Thẻ: loại bài · Toán lớp N – tên bài; tiêu đề "Đang tạo giáo án"; thanh không xác định; "Đang soạn 4 hoạt động."; "Thường mất 20–60 giây."; "Đã chạy m:ss" (cập nhật mỗi giây, đề xuất **không** đặt trong vùng đọc tự động để trình đọc không đọc mỗi giây); nút **Về danh sách** và **Dừng tạo** (Đề xuất). Dưới thẻ là bốn hàng khung xám với **tên 4 hoạt động cố định**, đúng nơi nội dung sẽ vào: khi xong chỉ thay khung bằng chữ, không nhảy.
- **Soạn lại:** nội dung cũ giữ nguyên, chỉ đọc; thanh nổi ở đáy (rộng tối đa 640 px, ≥44 px mỗi nút, không đẩy bố cục). Khi xong (đề xuất, chưa vẽ): thanh đóng, đưa tiêu điểm về đầu bản mới. Khi hỏng: thanh chuyển vàng "Chưa soạn lại được" + Thử lại; **bản cũ còn nguyên**.
- **Dừng / Dừng tạo** vẽ nét đứt kèm nhãn Đề xuất vì chưa chắc BE huỷ được job; nếu không huỷ được thì bỏ nút, giữ "Về danh sách".

### 11.5 Bản không tải được (chữ và hành vi)

Mẫu duyệt: nói **việc nào chưa xảy ra + làm gì tiếp**. Không lời đệm, không "lỗi / sai / máy chủ / 400 / validation / chuẩn Bộ", không "!". Nền vàng nhạt (không đỏ), biểu tượng cảnh báo, `role="alert"`, tiêu đề đậm + một dòng.

| Chỗ | Tiêu đề | Dòng dưới | Nút |
|---|---|---|---|
| Danh sách | Chưa tải được danh sách giáo án | Chưa có giáo án nào hiện ra. Bấm Thử lại. | Thử lại |
| Mở giáo án | Chưa mở được giáo án này | Chưa có nội dung nào hiện ra. Bấm Thử lại hoặc về danh sách. | Thử lại · Về danh sách |
| Tạo | Chưa tạo được giáo án | Chưa có giáo án nào để mở. Bấm Thử lại để tạo lại. | Thử lại · Sửa yêu cầu · Về danh sách |
| Tạo quá lâu (120 s) | Chưa tạo xong giáo án | Chưa tạo xong sau 2 phút nên bản này đã dừng. Bấm Thử lại để tạo lại. | Thử lại · Sửa yêu cầu · Về danh sách |
| Form tạo | Chưa tạo được giáo án | Chưa mở editor. Bấm Tạo giáo án để thử lại. | Tạo giáo án |
| Soạn lại | Chưa soạn lại được | Giáo án giữ nguyên bản hiện tại. Bấm Thử lại. | Thử lại |
| Xuất Word | Chưa xuất được file Word | Chưa có file để tải. Bấm Thử lại. | Thử lại |
| Tải file đã xuất | Đã xuất giao-an-….docx | Chưa thấy file? Bấm Tải lại. | Tải lại |
| Tải hình | Chưa tải được hình | Hình chưa được thêm vào giáo án. Bấm Thử lại. | Thử lại |
| Lưu (đã duyệt) | Chưa lưu được | Chưa lưu được nên thao tác này chưa chạy. Bấm biểu tượng thử lại ở đầu giáo án. | biểu tượng thử lại (giữ) |

- Nút Thử lại cao **44 px** (đo 103×44), Về danh sách 44, Sửa yêu cầu 44; nút trong thanh đáy cũng ≥44 px.
- Khi tải thất bại: tiêu đề nhận **tiêu điểm** (`tabindex=-1`, viền khi focus) để trình đọc đọc ngay; Thử lại chạy lại ngay và hiện lại skeleton.
- Danh sách trống (không phải lỗi): "Chưa có giáo án nào. Bấm “+ Tạo tiết mới” để tạo giáo án đầu tiên." (hiện tại: "…để sinh KHBĐ." — đề nghị bỏ viết tắt).
- Cần đổi trong app: `lib/api-error.ts` dự phòng `Lỗi API ${status}` (lộ chữ "Lỗi" và mã số); `editor-view.tsx` hiện chuỗi thô "Không đọc được job", "Không chạy được job", "Xuất Word thất bại"; `generate-plan-form.tsx` "Không tạo được giáo án"; thẻ có "Job id" và "vui lòng chờ…". Thay bằng bảng trên, nguyên nhân kỹ thuật chỉ ghi log.

### 11.6 Trợ năng

- **Vùng tải:** `aria-busy="true"` trên bảng/khung đang tải, đổi `false` khi có dữ liệu. Skeleton là trang trí (`aria-hidden`), không đọc từng khung.
- **Thông báo:** một vùng `role="status"` (`aria-live=polite`) ẩn bằng CSS (đọc được, không thấy) có sẵn trong trang từ đầu, chữ đổi theo trạng thái: "Đang tải danh sách giáo án." → (xong) vùng trống; "Đang mở giáo án."; "Đang xuất Word."… Thay chữ trong vùng có sẵn, không chèn vùng mới (trình đọc mới đọc).
- **Thất bại:** `role="alert"` + chuyển tiêu điểm vào tiêu đề thông báo. Thành công (đã xuất) dùng `role="status"`, không cướp tiêu điểm. Đếm giây không nằm trong vùng đọc.
- **Giảm chuyển động** (`prefers-reduced-motion: reduce`, hoặc `&motion=reduce` để xem): shimmer tắt (khung xám tĩnh), vòng xoay thành vòng tĩnh kèm chữ, thanh không xác định thành thanh tĩnh một đoạn; chữ "Đang…" luôn có nên không dựa riêng vào chuyển động.
- **Tiêu điểm / bàn phím:** nút giữ nguyên vị trí khi chuyển sang bận (`aria-disabled` và nhãn "Đang…" để người dùng không mất chỗ); skeleton không chiếm tab.
- **Màu:** thông báo không chỉ dựa vào màu (có biểu tượng + chữ); chữ ≥12 px trong thanh đáy, ≥13 px còn lại (chưa đo lại tương phản; dùng token màu đã có).
- **Mục tiêu bấm:** mọi nút trong trạng thái chờ/thất bại ≥44×44 px (kiểm bằng script ở 820, 1180, 1280, 390: không còn nút dưới 44).

### 11.7 Số đo và ảnh

- **Không dịch chuyển bố cục (danh sách):** bảng skeleton = bảng dữ liệu: 375 px ở 820, 1180 (và 1280); 506 px ở 390; hàng 56 px (820–1280) và 84 px (390); chiều cao trang bằng nhau ở 820 (1.180) và 1180 (820).
- Thanh đáy: cao 61–66 px ở 820/1180, 73–134 px ở 390 (xuống dòng); rộng tối đa 640 px; không đẩy nội dung.
- Soạn lại: trang cao 2.894 (820) / 3.128 (390), nội dung cũ không đổi.
- Mở giáo án (skeleton): 1.180 ở 820 (vừa một màn), 1.057 ở 390.
- Ảnh Chrome headless ở 4 cỡ, tên `<cỡ>-NN-<tên>.png` trong `shots/`:
  `30-list-loading` · `31-list-loading-reduced-motion` · `32-list-loading-long` · `33-list-error` · `34-list-empty` · `35-list-ready` · `36-list-row-opening` · `37-editor-opening` · `38-editor-opening-error` · `39-generating` · `40-generating-long` · `41-generating-error` · `42-generating-timeout` · `43-revising` · `44-revise-error` · `45-exporting` · `46-exported` · `47-export-error` · `48-create-busy` · `49-create-error` · `50-xem-loading` · `51-compare-loading` · `52-upload-progress` · `53-upload-error` · `54-saving-approved`.
- Demo: tham số tĩnh (`?view=list&state=loading|loading-long|error|empty|ready|row-opening`, `?state=opening|opening-error|generating|generating-long|generating-error|generating-timeout|revising|revise-error|exporting|exported|export-error|xem-loading|compare-loading`, `?view=create&state=busy|error`, `?add=1&state=uploading|upload-error`, `&motion=reduce`, `&t=giây`) và **LIVE** `?live=1` (độ trễ thật: danh sách 300 ms/500 ms/8 s; mở hàng; tạo 10 s; soạn lại 9 s; xuất 2,5 s), `&fail=1` (luôn thất bại để thử Thử lại), `&delay=ms` (đổi thời gian chờ, mặc định 1.400).

### 11.8 Câu hỏi mở và chưa làm

1. **BE danh sách:** danh sách hiện đọc `sessionStorage` (`lib/recent-plans.ts`), chưa có API. Khi có, cần phân trang/giới hạn? Skeleton 6 hàng đủ một màn iPad portrait.
2. **Rời trang khi đang tạo:** job có chạy tiếp và hiện trong danh sách (trạng thái Nháp hay thêm "Đang tạo")? Câu "giáo án sẽ vào danh sách khi xong" chỉ đúng nếu BE làm vậy.
3. **Huỷ job:** BE có huỷ được không? Nếu không thì bỏ nút Dừng/Dừng tạo.
4. **Bước:** BE có trả `job.stage`? Nếu có thì hiện tên bước thật; nếu không, giữ thanh không xác định.
5. **Hết thời gian chờ:** `lib/poll-job.ts` hiện poll không giới hạn (400 ms → tối đa 2 s); cần giới hạn 120 s như trên.
6. **Xem / So sánh từ server?** Hiện cả hai dựng ở client nên skeleton chỉ cần khi chuyển sang nguồn server.
7. Chưa thử trên iPad thật; chuyển động và LIVE chỉ kiểm bằng Chrome headless. Trạng thái LIVE là giả lập, không phải độ trễ của BE thật.
8. Chưa vẽ phiếu bài tập (worksheet) và đăng nhập/chuyển trang khác ngoài danh sách–editor.
