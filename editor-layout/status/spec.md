# Editor gọn trạng thái (chờ Huy duyệt)

**Mockup:** `./index.html` · `?status=current` (giống prod 152dbba, theo ảnh Huy) | `?status=compact` (bản gọn) · `?state=done-new|done|generating|error|edited` · `?motion=reduce` · `?bare=1` ẩn thanh demo · `?hold=ms` (mặc định 5000; 0 = giữ banner để chụp).
**Token:** giữ token khóa + Inter. Không dark mode.

## Vấn đề (iPad, sau khi soạn xong)
Thứ tự hiện tại: tab → dòng “Đã soạn theo khung Phụ lục IV. GV tự thẩm định trước khi nộp.” → banner xanh “Giáo án đã soạn xong” → hàng “v11 theo khung Phụ lục IV · GV tự thẩm định” → thẻ “Trạng thái soạn” + nhãn “Đã soạn” → thẻ “Giáo án (Phụ lục IV)”. Có **2 tín hiệu trạng thái** và **2 dòng Phụ lục IV**. Ở ≥1100px còn thêm dòng Phụ lục IV thứ 3 trong cột Trạng thái.

## Bản gọn
1. **Một tín hiệu trạng thái.**
   - Vừa soạn xong: banner “Giáo án đã soạn xong” (`role=status`, `aria-live=polite`), tự thu sau 5 giây hoặc khi bấm × (44×44, `aria-label="Ẩn thông báo"`). Dừng hẹn giờ khi rê chuột / focus vào banner. Giảm chuyển động: thu ngay, không trượt. Bấm × thì focus về tab Soạn. Nếu banner đã cuộn khỏi màn, trang tự bù vị trí để nội dung không nhảy.
   - Sau đó: chỉ còn nhãn nhỏ **Đã soạn** (chấm xanh + chữ g700 trên nền gs) trong hàng meta.
   - Đang soạn: giữ thẻ tiến trình. Không có banner xong. Nhãn **Đang soạn** (chấm xanh dương).
   - Lỗi mở: giữ thẻ vàng như hiện nay. Bỏ dòng “Đã soạn theo khung…” phía trên (sai nghĩa khi chưa mở được); chỉ giữ dòng nhắc “Theo khung Phụ lục IV · GV tự thẩm định trước khi nộp.” dưới thẻ.
   - GV đã sửa: nhãn **Đã sửa · lưu hh:mm**.
   - Bỏ thẻ “Trạng thái soạn”.
2. **Một dòng Phụ lục IV**, gộp vào hàng meta dưới tab: `[v11] (Đã soạn) Theo khung Phụ lục IV · GV tự thẩm định trước khi nộp.` Ở 375 xuống dòng gọn: dòng 1 = phiên bản + nhãn, dòng 2 = câu nhắc (không còn dấu “·” mồ côi). Cột Trạng thái (≥1100px) chỉ ghi “Đã soạn” / “Đã sửa · lưu hh:mm” / “Đang soạn” / “Chưa mở được”.
3. **Không mất thông tin:** phiên bản (v11) · trạng thái (nhãn) · câu Phụ lục IV đầy đủ (bản dài “trước khi nộp”) · giờ lưu (nhãn Đã sửa). Chữ “Đã lưu” trên thanh công cụ thẻ Giáo án chỉ hiện khi **Đang lưu** / **Chưa lưu được** (có nút thử lại); lúc đã lưu thì giờ lưu nằm ở nhãn.

## Đo (WebKit, mock)
| | 820×1180 | 375×812 | 1180×820 |
|---|---|---|---|
| Mép trên thẻ Giáo án, hiện tại | 342 | 361 | 342 |
| Bản gọn, banner đang hiện | 202 | 227 | 202 |
| Bản gọn, sau khi thu | **145** | **170** | **145** |

Hàng meta cao 21px ở 820/1180, 46px (2 dòng) ở 375. Không cuộn ngang ở cả 3 cỡ. Banner thu sau 5 giây (đo 5.6 giây: đã biến mất); rê chuột thì giữ; × thì mất ngay, focus về “Soạn”.

**Tương phản:** meta g500 trên g50 4.63:1 · nhãn g700 trên gs 9.78 / trên blue-s 9.47 · chữ banner g800 trên gs 13.9. (Prod hiện tại: chữ banner green trên gs 3.58:1 và nhãn trắng trên green 3.77:1, cả hai dưới 4.5:1 cho chữ 12–14px. Bản gọn sửa luôn.)

## Chưa chắc / cần Huy chốt
- Bản đã sửa: lúc **Đang lưu** / **Chưa lưu được** vẫn hiện chữ trên thanh công cụ (cần nút thử lại ở đó). Nhãn meta khi đó giữ giờ lưu cuối.
- Trạng thái **flagged** (cần đối chiếu SGK) và **blocked** chưa vẽ trong mock này. Đề xuất: flagged dùng nhãn vàng “Cần đối chiếu SGK” trong cùng hàng meta, và giữ hộp cảnh báo GuardrailAlert (hiện nằm trong thẻ “Trạng thái soạn”) ngay dưới hàng meta.
- “Vừa soạn xong” chỉ hiện khi trang chứng kiến lần chuyển running → done; mở lại giáo án đã xong thì không hiện.
