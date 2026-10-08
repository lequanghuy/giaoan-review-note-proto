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

`?motion=reduce` hoặc checkbox: tắt quay spinner.

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
