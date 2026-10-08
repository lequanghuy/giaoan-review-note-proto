# Spec · Đăng nhập GiaoAn AI (hi-fi mockup)

**Trạng thái:** Huy đã duyệt (07/10), xem ghi chú bên dưới · UI UX Designer  
**Mockup:** `./index.html` · Pages: https://lequanghuy.github.io/giaoan-review-note-proto/login/  
**Token:** giữ `--blue / --g* / Inter` hiện tại (Huy khóa). Không dark mode. Không teal/orange/Plus Jakarta.  
**Tham chiếu:** Figma `01 Login` (file `0W3eEEZTrgNJuR9Tm0iOO0`) chỉ có **Đăng nhập bằng Google** — đã lỗi thời so với yêu cầu Huy 07/10 (thêm email + mật khẩu). Mockup này làm mới, khớp chrome live (`PRODUCT_NAME = "GiaoAn AI"`).

## Ghi chú duyệt (Huy, 07/10)

- **Chỉ email.** Không có tên đăng nhập.
- **Tạo tài khoản tối thiểu:** email + mật khẩu + nhập lại, hoặc Google.
- **Gộp tài khoản theo email:** mỗi email chỉ có **một tài khoản**. Đăng nhập bằng Google mà email đó đã có tài khoản email/mật khẩu → **liên kết vào tài khoản đó**, không tạo tài khoản mới. Chỉ liên kết khi Google trả `email_verified = true`.
- **Ẩn “Quên mật khẩu?” ở MVP:** chưa có dịch vụ mail nên chưa gửi được link. Màn `forgot` / `forgot-sent` vẫn giữ trong mockup, đánh dấu **Sau, khi có dịch vụ mail**.

## Guidelines (ui-ux-pro-max `--domain ux`)

| Guideline | Áp dụng |
|---|---|
| Password Visibility | Nút Hiện/Ẩn ≥44px, `aria-label` đổi theo trạng thái |
| Focusable Error Summary | Banner `role=alert` `tabindex=-1` trên đầu form + link tới ô; giữ dòng dưới ô (NEW-02) |
| Error Messages / Placement | `aria-invalid` + `aria-describedby` + dòng `#92400E` dưới ô; viền `--amber` `#D97706` khi không focus |
| Accessible Authentication | `autocomplete`, cho phép paste; không chặn password manager; có Google (OAuth) |
| Touch ≥44 / input ≥16px | Nút, ô, Hiện/Ẩn; `font-size:16px` trên input (tránh zoom iOS) |
| Loading buttons | `aria-busy`, disable, chữ “Đang đăng nhập…” |

## 1. MVP vs sau

### MVP (đã duyệt 07/10)

1. Màn đăng nhập: logo **GiaoAn AI**, email, mật khẩu + Hiện/Ẩn, **Đăng nhập**, divider **hoặc**, **Đăng nhập bằng Google** (icon G chuẩn 4 màu + chữ, không tô lại G), **Tạo tài khoản**. Link **Quên mật khẩu?** **ẩn** ở MVP (mockup gắn tag “Ẩn ở MVP”).
2. Kiểm tra thiếu ô / email sai dạng: dòng ngắn dưới ô (pattern NEW-02) + tóm tắt trên đầu khi bấm Đăng nhập.
3. Thất bại xác thực (sai mật khẩu / không có tài khoản): **một** câu không tiết lộ ô nào sai; `role=alert` + focus; giữ nội dung ô.
4. Đang đăng nhập: spinner trên nút, không bấm trùng.
5. Tạo tài khoản (tối thiểu): email + mật khẩu + nhập lại, hoặc Google.
6. Một tài khoản / một email: Google cùng email với tài khoản email/mật khẩu sẵn có → liên kết vào tài khoản đó (cần `email_verified`).

### Sau (không vẽ đầy đủ)

- Đăng nhập bằng **tên đăng nhập** thay / kèm email  
- OTP điện thoại, magic link, passkey  
- SSO trường / Microsoft  
- 2FA  
- **Quên mật khẩu** (màn hỏi email + “Đã gửi link”): **Sau, khi có dịch vụ mail**. Mockup giữ sẵn `?state=forgot` / `forgot-sent`  
- Đặt lại mật khẩu **trong app** (sau khi bấm link)  
- Bắt buộc xác nhận email trước khi soạn  

## 2. States (mockup)

| `?state=` | UI |
|---|---|
| `main` | Form đăng nhập sạch |
| `missing` | Thiếu email + mật khẩu (tóm tắt + dòng dưới ô) |
| `invalid` | Email sai dạng |
| `wrong` | Banner “Chưa đăng nhập được” |
| `loading` | Nút `aria-busy` “Đang đăng nhập…” |
| `forgot` | Hỏi email, gửi link (**Sau, khi có dịch vụ mail**) |
| `forgot-sent` | Xác nhận đã gửi, câu trung tính (**Sau, khi có dịch vụ mail**) |
| `register` | Tạo tài khoản |
| `sample` | Mẫu dấu tiếng Việt để so sánh font (không phải màn thật) |

`?motion=reduce` hoặc checkbox: tắt quay spinner.  
`?mvp=1` hoặc checkbox “MVP sạch”: màn MVP thật (ẩn “Quên mật khẩu?” và ô ghi chú MVP/Sau). Ảnh chụp trạng thái dùng chế độ này.  
`?bg=b|b2|b-old|a|none`: nền họa tiết (mục 7, mặc định B; b2 / b-old / a giữ để tham khảo, không chọn). Kết hợp được với `?state=`.  
`?font=inter|bvp`: so sánh font (mục 8). Mặc định `inter`; chỉ tải Be Vietnam Pro khi chọn `bvp`.

## 3. Bảng copy

| Chỗ | Chữ |
|---|---|
| Tiêu đề thương hiệu | GiaoAn AI |
| Phụ đề | Soạn kế hoạch bài dạy theo khung Phụ lục IV |
| Nhãn | Email · Mật khẩu · Nhập lại mật khẩu |
| Nút chính | Đăng nhập |
| Google | Đăng nhập bằng Google |
| Divider | hoặc |
| Link | Tạo tài khoản · (Quên mật khẩu? ẩn ở MVP) |
| Thiếu email | Cần có email. |
| Thiếu mật khẩu | Cần có mật khẩu. |
| Email sai dạng | Nhập email đúng dạng, ví dụ ten@truong.edu.vn. |
| Tóm tắt thiếu | Chưa điền đủ |
| Auth fail (tiêu đề) | Chưa đăng nhập được |
| Auth fail (dòng) | Email hoặc mật khẩu chưa khớp. Kiểm tra lại hoặc dùng Google. |
| Loading | Đang đăng nhập… |
| Quên — nút (Sau) | Gửi link |
| Quên — OK tiêu đề (Sau) | Đã gửi link |
| Quên — OK dòng (Sau) | Nếu email có trong hệ thống, bạn sẽ nhận link trong vài phút. Kiểm tra cả hộp thư rác. |
| Hiện/Ẩn | aria-label: Hiện mật khẩu / Ẩn mật khẩu |

Không dùng: lỗi / sai / máy chủ / 400 / Thầy cô … giúp nhé.

## 4. A11y & form

- Mỗi ô có `<label for>`. Không dùng placeholder thay nhãn.  
- Password: `autocomplete="current-password"` (đăng nhập) / `new-password` (đăng ký); email: `username email` hoặc `email`.  
- Paste được; không `onpaste` prevent.  
- Hiện/Ẩn: nút riêng ≥44×44, `aria-pressed`, đổi `aria-label`.  
- Ô không hợp lệ: `aria-invalid="true"`, `aria-describedby="{id}-why"`, viền `#D97706` khi không focus (NEW-02).  
- Tóm tắt / auth fail: `role="alert" tabindex="-1"`, focus sau khi hiện; tóm tắt có link tới `#email` / `#password`.  
- Google: không đổi màu chữ cái G; nền trắng, viền g300.  
- Touch ≥44px; input ≥16px; không tràn ngang 375.

## 5. Acceptance criteria (đo được)

**Điều kiện:** WebKit 820×1180 (iPad UA) + spot 375 / 1180×820.

1. Màn chính có đủ: logo GiaoAn AI, email, mật khẩu + Hiện/Ẩn, Đăng nhập, hoặc + Google, Tạo tài khoản. Link “Quên mật khẩu?” **không hiện** ở MVP.  
2. Input `font-size` ≥ 16px; nút / Hiện/Ẩn / Google / Đăng nhập min-height ≥ 44px.  
3. Bấm Đăng nhập khi trống → ≤100ms thấy tóm tắt `role=alert` được focus + dòng dưới từng ô thiếu.  
4. Email `gv@` → dòng “Nhập email đúng dạng…”.  
5. Auth fail: đúng 1 banner không nói ô nào sai; ô vẫn giữ giá trị; focus vào banner.  
6. Loading: nút disabled + `aria-busy` + “Đang đăng nhập…”; không submit lần 2.  
7. Hiện mật khẩu đổi `type` text/password và `aria-label`.  
8. Gộp theo email: đăng nhập Google bằng email đã có tài khoản email/mật khẩu → vào **đúng tài khoản đó** (cùng danh sách giáo án), không có tài khoản thứ hai. Mỗi email = 1 bản ghi tài khoản.  
8b. (Sau, khi có dịch vụ mail) Quên MK: gửi → màn xác nhận trung tính (không “email không tồn tại”).  
9. `prefers-reduced-motion` / `?motion=reduce`: spinner không quay.  
10. Không có từ bị cấm trong copy visible.

## 6. Câu hỏi đã chốt (Huy, 07/10)

**Q1. Email thuần hay email / tên đăng nhập?**  
Mockup: **chỉ email** (khớp Google, dễ nhớ, autocomplete chuẩn).  
Khuyến nghị: MVP email; tên đăng nhập = Sau nếu giáo viên quen tài khoản trường không phải email.  
**Chốt:** chỉ email.

**Q2. Tạo tài khoản trong MVP hay chỉ Google + mời?**  
Mockup: **có tạo tài khoản tối thiểu** (email + MK + nhập lại) + Google.  
Khuyến nghị: giữ trong MVP để giáo viên không Gmail vẫn vào được; có thể ẩn sau feature flag nếu backend chưa sẵn.  
**Chốt:** có tạo tài khoản tối thiểu + gộp tài khoản Google cùng email.

**Q3. Quên mật khẩu: link email đủ cho MVP?**  
Khuyến nghị: **có** (màn hỏi + xác nhận). Đổi MK trong app = Sau.  
**Chốt:** chưa có dịch vụ mail → **ẩn link ở MVP**; màn quên MK = Sau, khi có dịch vụ mail.

## 7. Nền họa tiết (đã duyệt B (Huy, 09/10))

**Yêu cầu Huy 08/10:** màn Đăng nhập / Tạo tài khoản trông trơn quá → thêm nền họa tiết giáo dục. **Huy chọn B (09/10 00:19)** → B là **mặc định** khi không có `?bg=`. Chưa giao Dev FE; vào **PR FE-2** khi bắt đầu làm auth.

**Nét mới (Huy 09/10 00:24)** theo `ref/pencil-ref.jpg`: nét viền dày đều 2.4px, đầu/góc/khớp **tròn**, hình đơn giản kiểu hoạt hình.
- **Bút chì:** đầu tẩy bo tròn · đai kim loại = 2 vạch song song · 2 sọc dọc thân · mép gỗ gọt lượn sóng · ngòi chì nhỏ **tô đặc** (phần tô duy nhất).
- **Thước:** chữ nhật bo góc, vạch chia 2 độ dài. **Sách:** mở, gáy cong, mỗi trang 2 dòng.
- Nghiêng −40°, xếp nối tiếp theo **đường chéo**, lặp ô.

- **Cách làm:** 1 `<div class="bgpat" aria-hidden="true">` cố định sau thẻ; `background-image` = SVG data-URI (không ảnh raster). Độ mờ đặt ở `opacity` của cả nhóm (nét chồng không đậm thêm). Thẻ form vẫn nền **trắng đặc** (`#fff`). Không chuyển động. `pointer-events:none`.
- **Không nối mép:** họa tiết chạm mép ô được vẽ lặp ở ±ô (`<use>`); đã soi ở 820 và 375, không thấy đường nối.

| Biến thể | Nét | Ô lặp | SVG |
|---|---|---|---|
| `?bg=b` (**mặc định**, Huy chốt) | blue `#2563eb` · 17% (≈ `#d5e0f8` trên g50) · 2.4px · nét mới | 140px (120px khi ≤480px) | 1176 B (1300 B dạng URI) |
| `?bg=b2` (**không chọn**, giữ để tham khảo) | như B, thưa hơn | 200px (172px khi ≤480px) | 964 B (1052 B dạng URI) |
| `?bg=b-old` (**không chọn**, giữ để tham khảo) | B cũ, nét mảnh 2.2px | 140px (120px) | 822 B (918 B dạng URI) |
| `?bg=a` (**không chọn**, giữ để tham khảo) | xám g400 · 40% · thưa | 240px (180px) | 733 B (817 B dạng URI) |
| `?bg=none` | nền g50 trơn | — | — |

**Tương phản (WCAG):** họa tiết chỉ để trang trí, nằm ngoài thẻ: B/b2 1.27:1 so với g50 (cố ý mờ, không đổi so với B cũ). Chữ trên thẻ trắng không đổi: g900 17.7 · g800 14.7 · g700 10.3 · g600 7.6 · g500 4.83 (phụ đề, “hoặc”) · link blue 5.17 · chữ trắng trên nút 5.17 · lý do ô a800 7.09 · banner 9.94 · tag “Ẩn ở MVP” 6.87.

**Huy chốt B mới (nét dày, ô 140px), không dùng B2 · 09/10.** B là mặc định (`BG_DEFAULT='b'`). Chưa giao Dev FE; sẽ làm trong **FE-2**.

**Acceptance (nền):**
1. `.bgpat` có `aria-hidden="true"`, `pointer-events:none`, không có animation.
2. Không ảnh raster; mỗi SVG < 2 KB.
3. Thẻ form nền `#fff` đặc; mọi chữ trên thẻ ≥ 4.5:1.
4. 820×1180, 375: không thấy đường nối; họa tiết không lọt vào thẻ.
5. Không có `?bg=` → B; `?bg=none` trả về nền trơn.

## 8. So sánh font (chưa đổi token) · Huy 09/10

Chỉ để so sánh: **không đổi token, không đổi mặc định (Inter), không giao Dev FE.** `?font=bvp` tải Be Vietnam Pro 400/500/600/700 từ Google Fonts (`display=swap`). Inter vẫn tải như cũ. Mẫu dấu: `?state=sample`.

Đo trên WebKit, UA iPad, cache trống, qua 3 màn đăng nhập + tạo tài khoản + mẫu:

| | Inter (hiện tại) | Be Vietnam Pro |
|---|---|---|
| woff2 tải thật | **143 984 B** · 3 file (variable): latin 48 432 · vietnamese 10 280 · latin-ext 85 272 | **94 300 B** · 11 file (tĩnh): latin 53 008 (4 weight) · vietnamese 20 076 (4) · latin-ext 21 216 (3) |
| Chỉ vietnamese + latin | 58 712 B | 73 084 B |
| Dấu chồng HOA (Ặ Ễ Ỗ Ẩ) so với mép trên dòng, line-height 1.5 | còn dư 0.25–0.5px | vượt 0.25–0.75px (16/14/13/12px) |
| Ô nhập 16px | dư 11.75px trên, không cắt | dư 11.5px, không cắt |
| Bề rộng chữ | — | rộng hơn 3–7% |

- css2 bỏ qua `subset=`; trình duyệt tự chọn file theo `unicode-range`. Chữ ă/đ/ơ/ư/ỹ nằm trong cả vietnamese lẫn latin-ext nên file latin-ext luôn được tải.
- Dấu: không có dấu nào chạm dòng trên/dưới hay bị cắt ở cả hai font. Phần vượt mép của BVP không bị cắt vì không có `overflow:hidden`. Hỏi/ngã phân biệt được ở 13–16px với cả hai; dấu hỏi của BVP cao và rõ hơn một chút.
- Bố cục 375 & 820: không nút/nhãn nào xuống dòng thêm hay tràn; chiều cao mọi phần tử giống hệt. Phụ đề xuống 2 dòng ở 375 với cả hai font (như cũ).
- Tương phản: cùng màu nên các tỉ lệ không đổi. BVP trông đậm và rộng hơn một chút ở cùng weight.

**Đề xuất: giữ Inter.** Ở line-height 1.5, Inter hiển thị mọi dấu chồng gọn trong dòng và hỏi/ngã vẫn rõ ở 13–16px. BVP không sửa vấn đề nào đo được, mà đổi font sẽ phải đổi token khóa cho cả app.
