# Spec FE: Dòng nhắc soát lại (post-generation review note)

GiaoAnBuddy / GiaoAn AI · UI UX Designer · **v1.1**, 26/09/2026
Trạng thái thiết kế: **Huy đã duyệt prototype**. Hành vi xoá nhắc đã chỉnh theo **AC v2.1** (xem §0).
Người nhận: Dev FE (`apps/web`, Next.js).

> **v1.1 (26/09/2026).** Gộp trả lời của BE (Q-BE1, 2, 3, 6, 7), UX (Q-UX1) và BA (Q-BA2, 3, 5). Luật nối vị trí mới theo Q-BA2 (§3.2, §3.3, C21), prototype cập nhật theo và có thêm `?state=mixed3`. Quy tắc cho ticket lưu chỉnh tay (§0, §5.1). Đếm "chỗ" theo nhóm (§3.1). Home dùng `postgenSummary`, phase 2 (§2.2, §4.5, C15). `span.field` đổi thành đường dẫn field thật và bỏ thuật toán đổi offset (§2.6, §2.7). Revise luôn đặt `postgenWarnings = carried.kept` (§2.8). Thêm dòng báo khi ack lỗi mạng (§2.3, §3.4, §4.2, E14, C22). §11 tách thành "đã chốt" và "còn mở". Q-BA4 vẫn mở, E17 giữ nguyên.

| Nguồn | Đường dẫn |
| --- | --- |
| Prototype (nguồn sự thật cho giao diện và copy) | https://lequanghuy.github.io/giaoan-review-note-proto/ (bản sao: https://giaoan-review-note-proto.vercel.app/) · file `review-note.html` trong repo `lequanghuy/giaoan-review-note-proto` |
| AC của BA | `/workspace/ga-postgen-check/ac-v2.md`. Dòng 2 của file ghi **"BA v2.1, 26/09/2026. v2.1 chỉnh S5, S6, A7…"**, nên đây chính là AC v2.1. Không có file v2.1 riêng trên box, trên Notion hay trong PR #24. |
| Hợp đồng BE | PR #24 `lequanghuy/giaoanai` (draft, chưa merge), nhánh `cursor/postgen-check-repair`, head `becaec0`: https://github.com/lequanghuy/giaoanai/pull/24 |
| Spec BE | `/workspace/ga-postgen-check/be-spec.md` (mục "Bổ sung theo AC v2") |
| Ảnh chụp | https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/ (bảng ở §13) |

---

## 0. Thay đổi so với prototype cũ (commit 75d0113)

**Quy tắc AC v2.1, S5:**
> Nhắc ở một hoạt động chỉ mất khi giáo viên bấm "Đã soát", hoặc khi `revise-plan` làm thay đổi nội dung hoạt động đó. Chỉnh tay chưa có chỗ lưu. Khi có tính năng lưu chỉnh tay thì áp cùng quy tắc (ticket riêng).

- Prototype cũ coi việc gõ sửa trong phần được nhắc là đã soát. **Đã bỏ hành vi này.** Gõ sửa tay (chưa lưu) KHÔNG làm mất nhắc, chip hay dòng tóm tắt.
- Đã thêm state `?state=nopos`: BE không trả vị trí câu, nên chỉ hiện chip, không gạch chân.
- Đã thêm nút demo "Mô phỏng soạn lại (HĐ đang nhắc đổi nội dung)" trong panel Demo. Nút này mô phỏng quy tắc (b): revise làm đổi hoạt động thì nhắc của hoạt động đó mất.
- **v1.1 (Q-BA2):** đổi cách nối vị trí khi một loại có từ 2 vị trí trở lên và còn loại khác, hoặc khi có cả hoạt động và mục (§3.2). Mọi câu đã duyệt trong §3.3 giữ nguyên chữ. Thêm state `?state=mixed3` (HĐ2, HĐ3 số liệu + HĐ4 nội dung + Phẩm chất câu chữ).
- Mọi thứ khác giữ nguyên như bản Huy đã duyệt.

**Chỉnh tay có lưu:** hiện chưa có. `LessonPlanEditor` chỉ đổi state cục bộ, không có endpoint lưu. Quy tắc dưới đây dành cho **ticket lưu chỉnh tay sau này, không thuộc PR #24**. BA đã chốt (Q-BA3), thay cho câu "áp cùng quy tắc với revise":
- Hoạt động có thay đổi **không** đủ để xoá mọi nhắc của hoạt động đó, vì sửa chỗ khác không chứng tỏ GV đã soát câu bị nhắc.
- **Nhắc có span:** chỉ mất khi đoạn văn bản của span bị đổi hoặc bị xoá. Nếu đoạn còn nguyên thì giữ nhắc và BE tính lại offset theo văn bản mới.
- **Nhắc không có span:** giữ tới khi GV bấm "Đã soát".
- BE log `postgen_warning_cleared_by_edit` kèm lý do (`reason: "span_changed"`).
- Test của ticket đó: (1) sửa một câu khác trong hoạt động có nhắc thì nhắc còn; (2) sửa đúng câu bị nhắc thì nhắc mất; (3) nhắc không có span vẫn còn sau khi lưu.
- FE chỉ cần hiển thị lại theo `postgenWarnings` mà BE trả sau khi lưu.

---

## 1. Phạm vi

**Trong phạm vi**
1. Dòng tóm tắt (summary note) ở đầu thân giáo án, trong editor.
2. Chip tại chỗ ("Nên soát …") và nút "Đã soát" ở từng hoạt động hoặc mục.
3. Gạch chân chấm cho câu cần soát, kèm tooltip "Nên soát lại câu này", khi BE có `span` hợp lệ.
4. Dòng "Đã soát xong các chỗ được nhắc", tự mất sau khoảng 4 giây.
5. Dòng phụ ở Home (thẻ hoặc hàng giáo án). **Phase 2**, cần field `postgenSummary` trên `GET /jobs` (§4.5).
6. Dòng nhắc ở màn Xuất file.
7. Gọi `POST /plans/:id/warnings/:warningId/ack` và đọc `plan.postgenWarnings`.

**Ngoài phạm vi (không làm)**
- Nút X, nút đóng, hay endpoint xoá. Không có.
- Toast riêng. Toast "Giáo án đã soạn xong" + "Mở" giữ nguyên.
- Nhắc tới hạn mức hay lượt. Bước kiểm tra không trừ hạn mức (Q2, S6).
- In dòng nhắc vào Word/PDF. Không bao giờ in.
- Tầng 2 (LLM chấm), chạy lại R1–R4 sau revise (S5, ngoài phạm vi BE), lưu chỉnh tay.
- Hiện mã quy tắc (R1–R4) hay câu nguyên văn do hệ thống bắt. BE không trả câu.

---

## 2. Hợp đồng API (PR #24, head `becaec0`)

> PR #24 còn **draft**. Tên field dưới đây lấy nguyên văn từ code trong PR. Type nằm ở `packages/shared/src/postgen-warning.ts` và được export từ `@giaoan/shared`.
>
> **Q-BE7 (BE đã trả lời):** khi merge, #24 không đổi tên field nào. Sau đó chỉ có hai thay đổi đã biết: (1) giá trị `span.field` đổi sang đường dẫn field thật, shape `PostgenSpan` giữ nguyên (§2.6); (2) item của `GET /jobs` có thêm field `postgenSummary` (§2.2).

### 2.1 Type

```ts
// packages/shared/src/postgen-warning.ts (PR #24)
export const POSTGEN_CATEGORIES = ["so_lieu", "noi_dung", "cau_chu"] as const
export type PostgenCategory = (typeof POSTGEN_CATEGORIES)[number]
export const POSTGEN_RULE_CODES = ["R1", "R2", "R3", "R4"] as const
export type PostgenRuleCode = (typeof POSTGEN_RULE_CODES)[number]

export interface PostgenActivityLocation { kind: "activity"; index: number }
export interface PostgenSectionLocation  { kind: "section";  key: string }
export type PostgenLocation = PostgenActivityLocation | PostgenSectionLocation

/** Character offsets in one text field. Omitted when the sentence cannot be placed. */
export interface PostgenSpan { field: string; start: number; end: number }

export interface PostgenWarning {
  id: string                 // "Stable hash of location + ruleCode + span" — sha256 hex, 16 ký tự
  location: PostgenLocation
  category: PostgenCategory
  ruleCode: PostgenRuleCode
  span?: PostgenSpan
  acknowledgedAt?: string    // ISO; "Set by POST .../ack. The row stays."
}

// packages/shared/src/lesson-plan.ts: thêm field tuỳ chọn trên LessonPlan
postgenWarnings?: PostgenWarning[]  // "Absent on plans saved before this field, and on plans with nothing to review."
```

### 2.2 Dữ liệu nằm ở đâu

| Nguồn | Hình dạng | Ghi chú |
| --- | --- | --- |
| `GET /plans/:id` | `{ plan: LessonPlan, jobId }`, trong đó có `plan.postgenWarnings?` | Cột DB `lesson_plans.postgen_warnings` (jsonb, nullable, migration `0002_postgen_warnings.sql`) thắng bản trong `document`. **Mảng rỗng thì field bị bỏ.** |
| `GET /jobs/:id` (job `generatePlan` / `revisePlan` đã xong) | `result: LessonPlan`, có `result.postgenWarnings?` | Khi ack, BE cập nhật cả `ai_jobs.result` nếu job đó đúng là phiên bản head (`samePlanResult`). |
| `GET /jobs` (danh sách Home, `RecentJobSummary`) | PR #24: **không có**. Dự kiến thêm `postgenSummary?: { openCount: number, places: { location: PostgenLocation, category: PostgenCategory }[] }` | Q-BE1: làm trong PR BE riêng, ngay sau khi #24 merge. `places` không trùng, theo thứ tự trong giáo án. Không còn nhắc mở thì bỏ field. `openCount` = số cặp `(location, category)` còn mở, trùng cách đếm "chỗ" (Q-BA5, §3.1). **Tên field là dự kiến, xác nhận khi merge.** Home dùng field này ở phase 2 (§4.5). |
| Export (`POST` export, body `{ lessonPlanId, version?, format? }`) | Server render từ phiên bản đã lưu | PR #24 không đụng renderer, nên cảnh báo không vào file. |

- `location.index` là **chỉ số 0-based** trong `plan.activities`. Tên hiển thị là `Hoạt động ${index + 1}`, khớp heading `Hoạt động {index + 1}` trong `activity-editor.tsx`.
- `location.key` (từ `check-plan.ts` → `sectionHits`) chỉ có 5 giá trị: `objectives.knowledge`, `objectives.competencies`, `objectives.qualities`, `teachingAids`, `adjustments`.
- Ở mục (section) chỉ chạy R1. Nhưng R1 có nhánh câu "trong cùng phía … không bằng nhau", nhánh này trả `ruleCode: "R4"`, `category: "noi_dung"`. Vì vậy một mục có thể mang `cau_chu` hoặc `noi_dung`.
- **Nhắc còn mở** là `w.acknowledgedAt === undefined`. Cảnh báo đã ack **vẫn nằm trong mảng**, FE phải tự lọc.

### 2.3 Endpoint "Đã soát"

`POST /plans/:id/warnings/:warningId/ack`. Không có body, chưa có auth (TODO GA-34).

| Kết quả | Body | FE xử lý |
| --- | --- | --- |
| 200 lần đầu | `{ warning: PostgenWarning }`, có `acknowledgedAt` | Thay phần tử theo `id` trong state, tính lại UI. |
| 200 lần sau (idempotent) | `{ warning }` với `acknowledgedAt` cũ | Như trên. BE không log lần hai. |
| 400 | `{ error: "Mã cảnh báo không hợp lệ" }` (id không khớp `/^[a-f0-9]{16}$/`) | Không được xảy ra. Log lỗi dev, giữ chip. |
| 404 | `{ error: "Không tìm thấy cảnh báo" }` (không có plan, hoặc id không nằm ở phiên bản **head**) | Gọi lại `GET /plans/:id`, render lại theo head. |
| Lỗi mạng / 5xx | – | Giữ chip, bật lại nút, hiện dòng nhỏ dưới chip "Chưa lưu được, thầy cô bấm lại giúp nhé" (`aria-live="polite"`, không toast). Xem Q-UX1, §4.2, §7.4. |

Ack chỉ tác động lên **phiên bản head**. BE ghi log `postgen_warning_ack` (warningId, ruleCode, category, planId). FE **không** tự log và **không** lưu ack vào localStorage. Nguồn sự thật là server.

### 2.4 Ánh xạ quy tắc → loại → copy

| `ruleCode` | Khi nào (theo PR #24, `check-plan.ts` / `located-hit.ts`) | `category` | Chữ hiển thị |
| --- | --- | --- | --- |
| R1 | lộ prompt / lộ nháp (danh sách `rules/r1-patterns.ts`) | `cau_chu` | "câu chữ" |
| R2 | Pythagore (Toán 8) | `so_lieu` | "số liệu" |
| R3 | góc nội tiếp, góc ở tâm (Toán 9) | `so_lieu` | "số liệu" |
| R4 | số đo cùng một hình (`r4Category`: lý do có "cùng một hình" / "Pythagore" / "cung"), đáp số ghép cặp (`pairedHits`) | `so_lieu` | "số liệu" |
| R4 | "trong cùng phía … không bằng nhau", hai góc nhọn có tổng 180°, quan hệ song song sai (không có số) | `noi_dung` | "nội dung" |

**FE chỉ dùng `category`, không bao giờ dùng `ruleCode` để hiển thị.** `ruleCode` chỉ để debug.

| `category` | Từ trong tóm tắt | Nhãn chip | Thứ tự |
| --- | --- | --- | --- |
| `so_lieu` | số liệu | Nên soát số liệu | 0 |
| `noi_dung` | nội dung | Nên soát nội dung | 1 |
| `cau_chu` | câu chữ | Nên soát câu chữ | 2 |
| giá trị lạ | nội dung (dự phòng) | Nên soát nội dung | 1 |

`category` lạ (ngoài `POSTGEN_CATEGORIES`): hiển thị như `noi_dung` và `console.warn` một lần. Xem Q-BA1.

### 2.5 Tên vị trí

| `location` | Tóm tắt / Xuất file | Home (dạng ngắn) | Neo cuộn tới (DOM) | Chỗ đặt chip |
| --- | --- | --- | --- | --- |
| `activity`, index i | `Hoạt động {i+1}` | `HĐ{i+1}` | khung hoạt động i | dưới header hoạt động, trên phần a) b) c) d) |
| `section` `objectives.knowledge` | `mục Kiến thức` | `Kiến thức` | khối "Kiến thức" (`obj-knowledge`) | dưới nhãn khối, trên nội dung |
| `section` `objectives.competencies` | `mục Năng lực` | `Năng lực` | khối "Năng lực" | như trên |
| `section` `objectives.qualities` | `mục Phẩm chất` | `Phẩm chất` | khối "Phẩm chất" | như trên |
| `section` `teachingAids` | `mục Thiết bị dạy học và học liệu` | `Thiết bị dạy học và học liệu` | khối II | như trên |
| `section` `adjustments` | `mục Điều chỉnh sau bài dạy` | `Điều chỉnh sau bài dạy` | khối IV | như trên |

Tên vị trí phải "ghi đúng như tiêu đề trong giáo án" (Copy 1). Cảnh báo ở hoạt động con (`span.field` bắt đầu bằng `subActivities.{k}.`, ví dụ `subActivities.0.products`) vẫn thuộc **hoạt động cha** (`location.kind = "activity"`). Chip đặt ở hoạt động cha, gạch chân đặt trong field tương ứng của hoạt động con k.

**Dự phòng vị trí:** nếu `index` nằm ngoài `plan.activities`, `key` không có trong bảng, hoặc `kind` lạ, thì **bỏ qua** cảnh báo đó trong UI (không đếm, không link) và `console.warn`. Xem Q-BE4.

### 2.6 `span` (vị trí câu)

**Hợp đồng (Q-BE2, BE đã chốt):** `span.field` là **đường dẫn tới một field thật** của hoạt động hoặc mục. `start` và `end` là offset ký tự **trong chính field đó** (end loại trừ, đơn vị code unit UTF-16, vì BE lấy bằng `String.indexOf` trong Node). Không dùng chỉ số câu. Chuỗi tổng hợp `"activity"` (`activityBlock`) bị bỏ, nên FE không phải chép định dạng nhãn `**…**` nào và cũng không cần thuật toán đổi offset.

| `location` | Ví dụ `span.field` | Offset tính trên |
| --- | --- | --- |
| `activity` | `content`, `objectives`, `products`, `organization.assignTask`, `organization.performTask`, `organization.reportDiscussion`, `organization.conclude` | `plan.activities[index].<field>` |
| `activity` (hoạt động con k) | `subActivities.0.products`, `subActivities.1.content`, … | `plan.activities[index].subActivities[k].<field>` |
| `section` (mảng) | `objectives.knowledge`, `objectives.competencies`, `objectives.qualities`, `teachingAids` | `plan.<mảng>.join("\n")`, như PR #24 hiện tại (xem Q-BE8) |
| `section` | `adjustments` | `plan.adjustments ?? ""` |

**Tiến độ:** việc đổi sang đường dẫn field thật nằm trong ticket tiếp theo (thu hẹp span R4) và **phải ship trước UI dòng nhắc**. PR #24 hiện vẫn trả `"activity"` / `"subActivities.{k}"` (offset trên chuỗi ghép) và `"products"`.

**Điều kiện gạch chân.** Chỉ gạch chân khi cả ba điều đều đúng. Sai một điều thì chỉ hiện chip (không gạch chân; chip và tóm tắt giữ nguyên):
1. Có `span`, và `span.field` trỏ tới một field **có thật** trên hoạt động, hoạt động con hoặc mục đó.
2. `start`, `end` là số nguyên và `0 ≤ start < end ≤ text.length`, với `text` là giá trị field (mảng thì `join("\n")`).
3. `text` **chưa đổi** so với lúc tải từ server. Nếu GV đã gõ sửa field đó (chưa lưu) thì bỏ gạch chân của field đó.

**Span kiểu cũ:** nếu nhận `span.field = "activity"` hoặc `"subActivities.{k}"` (offset trên chuỗi ghép, từ trước khi ticket thu hẹp span ship) thì **chỉ hiện chip**, không đổi offset.

**Field mảng:** với mục, offset hiện tính trên `join("\n")`. Chỉ gạch chân khi đoạn nằm trọn trong một phần tử (không vắt qua `"\n"`). Nếu BE chuyển sang trỏ tới từng phần tử (ví dụ `objectives.qualities.0`, offset tính trong phần tử) thì cách hiển thị không đổi. Nên viết `resolveSpan` nhận được cả hai dạng cho tới khi Q-BE8 có câu trả lời.

### 2.7 JSON ví dụ (`GET /plans/:id`)

Id tính đúng theo `postgenWarningId` của PR (sha256 của `JSON.stringify({ location, ruleCode, span })`, lấy 16 ký tự hex đầu) trên dữ liệu mẫu, với span theo hợp đồng field thật (§2.6).

```json
{
  "jobId": "job_…",
  "plan": {
    "id": "plan_…",
    "version": 1,
    "subject": "toan",
    "grade": 7,
    "lessonTitle": "Góc tạo bởi một đường thẳng cắt hai đường thẳng song song",
    "status": "done",
    "activities": ["… 4 hoạt động …"],
    "postgenWarnings": [
      {
        "id": "150fff5f51bee797",
        "location": { "kind": "activity", "index": 1 },
        "category": "so_lieu",
        "ruleCode": "R4",
        "span": { "field": "content", "start": 80, "end": 169 }
      },
      {
        "id": "80c31392d32a8147",
        "location": { "kind": "activity", "index": 2 },
        "category": "noi_dung",
        "ruleCode": "R4"
      },
      {
        "id": "815ead5ee59511b7",
        "location": { "kind": "section", "key": "objectives.qualities" },
        "category": "cau_chu",
        "ruleCode": "R1",
        "span": { "field": "objectives.qualities", "start": 0, "end": 71 },
        "acknowledgedAt": "2026-09-26T02:40:11.000Z"
      }
    ]
  }
}
```
Kết quả trên UI: tóm tắt "Nên soát lại số liệu ở **Hoạt động 2** và nội dung ở **Hoạt động 3**". Phẩm chất đã soát nên bị lọc. HĐ2 có chip và gạch chân: span `content` [80, 169) là câu "Biết Â₁ = 65° thì B̂₁ (đồng vị với Â₁) bằng 110°, B̂₂ (trong cùng phía với Â₁) bằng 115°." trong `activities[1].content`. HĐ3 chỉ có chip vì không có `span`.

Id phụ thuộc vào span, nên cùng cảnh báo đó trên PR #24 hiện tại (span kiểu cũ `activity` 261–350) có id `c8ef9d1fce6c6ff0`. Luôn dùng id do server trả, không tự tính và không lưu id phía client.

### 2.8 Sau revise (`POST /jobs/revise-plan`, body `{ lessonPlanId, version, instructions }`)

Theo `process.ts` → `runRevisePlan`, BE làm như sau:
- `carryOverWarnings(head, next, head.postgenWarnings ?? [])` so **fingerprint** từng hoạt động hoặc mục. Fingerprint là `activityBlock` + các `subActivityBlock`, đã gộp khoảng trắng. Tên hoạt động và `durationMinutes` **không** nằm trong fingerprint.
- Hoạt động không đổi: giữ cảnh báo, giữ nguyên `id`, `span` và `acknowledgedAt`.
- Hoạt động đổi, hoặc chỉ số không còn: bỏ cảnh báo, log `postgen_warning_cleared_by_edit`.
- Phiên bản mới **không** được chạy lại R1–R4 (AC S5, ghi chú phạm vi). Revise không bao giờ thêm cảnh báo mới.
- **Q-BE6 (BE đã nhận):** BE luôn đặt tường minh `postgenWarnings = carried.kept` cho phiên bản mới, kể cả trên stub. Bị bỏ hết thì phiên bản mới không có field `postgenWarnings`. Sửa này vào #24 nếu Techlead đồng ý, không thì vào PR tiếp theo. Trước khi sửa vào code, trên stub các cảnh báo lẽ ra đã bị bỏ vẫn lọt sang bản mới, nên chưa kiểm hành vi revise trên stub được.

FE: khi job revise xong, đọc `result.postgenWarnings` (hoặc `GET /plans/:id`) rồi tính lại. Nếu số nhắc mở giảm từ > 0 xuống 0 **trong phiên làm việc này** thì hiện dòng "Đã soát xong các chỗ được nhắc" (§4.4).

---

## 3. Luật sinh copy

### 3.1 Chuẩn hoá và nhóm

1. `open = postgenWarnings.filter(w => !w.acknowledgedAt && locationHợpLệ(w))`
2. **Nhóm** theo `(location, category)`. Mỗi nhóm là **một "chỗ"**, **một chip** và **một nút "Đã soát"**. Bấm nút thì ack **mọi** `id` còn mở trong nhóm. Nhiều span trong cùng nhóm thì gạch chân từng span.
   **Q-BA5 (BA chốt):** số "chỗ" = số chip = số lần bấm "Đã soát". Mỗi lần bấm, số giảm đúng một. Hai loại ở cùng HĐ2 hiện "Nên soát 2 chỗ · HĐ2". Cách đếm này trùng `postgenSummary.openCount` (§2.2).
3. Sắp xếp loại theo thứ tự `so_lieu` → `noi_dung` → `cau_chu`. Trong một loại, hoạt động đứng trước (index tăng dần), sau đó tới mục theo thứ tự giáo án: Kiến thức, Năng lực, Phẩm chất, Thiết bị dạy học và học liệu, Điều chỉnh sau bài dạy.

### 3.2 Nối vị trí (BA chốt Q-BA2)

**`joinVa`:**
- 1 phần tử: `A`
- 2 phần tử: `A và B`
- 3 phần tử trở lên: `A, B và C` (dấu phẩy, "và" trước phần tử cuối, không có dấu phẩy trước "và")

**Cụm vị trí của một loại** (`locPhrase`) là **một danh sách phẳng**, nối bằng `joinVa`:
- Hoạt động đứng trước (index tăng dần), sau đó tới mục (theo thứ tự giáo án, §3.1).
- Hoạt động đầu ghi đầy đủ `Hoạt động n`, các hoạt động sau **chỉ ghi số**.
- Mục đầu tiên ghi `mục <tên>`, các mục sau **chỉ ghi tên**.

| Vị trí trong một loại | Cụm vị trí |
| --- | --- |
| HĐ2 | Hoạt động 2 |
| HĐ2, HĐ3 | Hoạt động 2 và 3 |
| HĐ2, HĐ3, HĐ4 | Hoạt động 2, 3 và 4 |
| Phẩm chất | mục Phẩm chất |
| Kiến thức, Phẩm chất | mục Kiến thức và Phẩm chất |
| HĐ2, Phẩm chất | Hoạt động 2 và mục Phẩm chất |
| HĐ2, HĐ3, Phẩm chất | Hoạt động 2, 3 và mục Phẩm chất |
| HĐ2, Kiến thức, Phẩm chất | Hoạt động 2, mục Kiến thức và Phẩm chất |

**Câu tóm tắt:** mỗi loại là một nhóm `"<từ loại> ở <cụm vị trí>"`, theo thứ tự loại.
- Nếu **có ít nhất một cụm vị trí chứa "và"** (tức một loại có từ 2 vị trí trở lên), nối các nhóm loại bằng `", "`.
- Nếu không, nối các nhóm loại bằng `joinVa`. Nhờ vậy các câu đã duyệt giữ nguyên.

```ts
const parts = groups.map(g => `${g.word} ở ${locPhrase(g.places)}`)
const hasVa = groups.some(g => g.places.length > 1)   // cụm vị trí của nhóm này có "và"
return "Nên soát lại " + (hasVa ? parts.join(", ") : joinVa(parts))
```

**Xuất file:** một cụm vị trí duy nhất theo cùng luật `locPhrase`, gồm mọi vị trí không trùng, không ghi loại và không có link. Ví dụ "Còn 3 chỗ nên soát ở Hoạt động 2, 3 và mục Phẩm chất".

**AC (Q-BA2):** không câu tóm tắt hay dòng Xuất file nào được có chữ "và" ở hai cấp khác nhau (vừa trong cụm vị trí, vừa giữa các nhóm loại). Mỗi cụm vị trí có tối đa một chữ "và" dùng để nối. Kiểm bằng bảng §3.3 (C21).

**Lưu ý:** chữ "và" nằm sẵn trong tên mục ("Thiết bị dạy học và học liệu") là một phần của tiêu đề, không phải chữ nối. Nó không tính khi xét "cụm có chứa và" và không tính trong C21. Điều kiện dùng dấu phẩy là **có một loại có từ 2 vị trí trở lên** (`places.length > 1`), không phải tìm chuỗi "và" trong câu.

### 3.3 Bảng ví dụ (thước đo khi test)

| Nhắc còn mở (vị trí · loại) | Tiêu đề tóm tắt | Chip | Home | Xuất file |
| --- | --- | --- | --- | --- |
| HĐ2 · số liệu | Nên soát lại số liệu ở Hoạt động 2 | HĐ2: Nên soát số liệu | Nên soát số liệu · HĐ2 | Còn 1 chỗ nên soát ở Hoạt động 2 · Xem lại |
| HĐ2, HĐ3 · số liệu | Nên soát lại số liệu ở Hoạt động 2 và 3 | HĐ2, HĐ3: Nên soát số liệu | Nên soát 2 chỗ · HĐ2, HĐ3 | Còn 2 chỗ nên soát ở Hoạt động 2 và 3 · Xem lại |
| HĐ2, HĐ3, HĐ4 · số liệu | Nên soát lại số liệu ở Hoạt động 2, 3 và 4 | 3 chip "Nên soát số liệu" | Nên soát 3 chỗ · HĐ2, HĐ3, HĐ4 | Còn 3 chỗ nên soát ở Hoạt động 2, 3 và 4 · Xem lại |
| HĐ2 số liệu + HĐ3 nội dung | Nên soát lại số liệu ở Hoạt động 2 và nội dung ở Hoạt động 3 | HĐ2 số liệu; HĐ3 nội dung | Nên soát 2 chỗ · HĐ2, HĐ3 | Còn 2 chỗ nên soát ở Hoạt động 2 và 3 · Xem lại |
| HĐ2 số liệu + Phẩm chất câu chữ | Nên soát lại số liệu ở Hoạt động 2 và câu chữ ở mục Phẩm chất | HĐ2 số liệu; Phẩm chất câu chữ | Nên soát 2 chỗ · HĐ2, Phẩm chất | Còn 2 chỗ nên soát ở Hoạt động 2 và mục Phẩm chất · Xem lại |
| Phẩm chất · câu chữ | Nên soát lại câu chữ ở mục Phẩm chất | Nên soát câu chữ | Nên soát câu chữ · Phẩm chất | Còn 1 chỗ nên soát ở mục Phẩm chất · Xem lại |
| HĐ2 số liệu + HĐ3 nội dung + Phẩm chất câu chữ | Nên soát lại số liệu ở Hoạt động 2, nội dung ở Hoạt động 3 và câu chữ ở mục Phẩm chất (không đổi) | 3 chip | Nên soát 3 chỗ · HĐ2, HĐ3, Phẩm chất | Còn 3 chỗ nên soát ở Hoạt động 2, 3 và mục Phẩm chất · Xem lại (**v1.1**) |
| HĐ2, HĐ3 số liệu + Phẩm chất câu chữ (**v1.1**) | Nên soát lại số liệu ở Hoạt động 2 và 3, câu chữ ở mục Phẩm chất | 3 chip | Nên soát 3 chỗ · HĐ2, HĐ3, Phẩm chất | Còn 3 chỗ nên soát ở Hoạt động 2, 3 và mục Phẩm chất · Xem lại |
| HĐ2, HĐ3 số liệu + HĐ4 nội dung + Phẩm chất câu chữ (**v1.1**, `mixed3`) | Nên soát lại số liệu ở Hoạt động 2 và 3, nội dung ở Hoạt động 4, câu chữ ở mục Phẩm chất | 4 chip | Nên soát 4 chỗ · HĐ2, HĐ3, HĐ4, Phẩm chất | Còn 4 chỗ nên soát ở Hoạt động 2, 3, 4 và mục Phẩm chất · Xem lại |
| Kiến thức + Phẩm chất · câu chữ (**v1.1**) | Nên soát lại câu chữ ở mục Kiến thức và Phẩm chất | 2 chip | Nên soát 2 chỗ · Kiến thức, Phẩm chất | Còn 2 chỗ nên soát ở mục Kiến thức và Phẩm chất · Xem lại |
| HĐ2 số liệu + Kiến thức, Phẩm chất câu chữ (**v1.1**) | Nên soát lại số liệu ở Hoạt động 2, câu chữ ở mục Kiến thức và Phẩm chất | 3 chip | Nên soát 3 chỗ · HĐ2, Kiến thức, Phẩm chất | Còn 3 chỗ nên soát ở Hoạt động 2, mục Kiến thức và Phẩm chất · Xem lại |
| HĐ2 số liệu + HĐ2 nội dung | Nên soát lại số liệu ở Hoạt động 2 và nội dung ở Hoạt động 2 | HĐ2: 2 chip | Nên soát 2 chỗ · HĐ2 | Còn 2 chỗ nên soát ở Hoạt động 2 · Xem lại |
| HĐ2 · số liệu, không có span | Nên soát lại số liệu ở Hoạt động 2 | chip, không gạch chân | Nên soát số liệu · HĐ2 | Còn 1 chỗ nên soát ở Hoạt động 2 · Xem lại |
| 0 nhắc mở (lúc tải trang) | (không hiện gì) | – | (không có dòng phụ) | (không có dòng) |
| từ ≥1 xuống 0 trong phiên | Đã soát xong các chỗ được nhắc (khoảng 4 giây rồi mất) | – | – | – |

Các câu đã duyệt (dòng 1–6, câu tóm tắt dòng 7, dòng "HĐ2 số liệu + HĐ2 nội dung", "không có span", 0 nhắc, soát xong) **giữ nguyên từng chữ**. v1.1 chỉ đổi cột Xuất file của dòng 7 và thêm các dòng có đánh dấu **v1.1**. Prototype có dữ liệu cho `one`, `two`, `three`, `mixed`, `phamchat`, `nopos`, `mixed3`. Dòng "HĐ2, HĐ3 số liệu + Phẩm chất câu chữ" chính là `mixed3` sau khi bấm "Đã soát" ở HĐ4. Hai dòng có mục Kiến thức suy ra từ luật, prototype không có dữ liệu cho chúng.

Quy tắc Home và Xuất file:
- **Home:** đúng 1 chỗ thì `Nên soát {từ loại} · {tên ngắn}`. Từ 2 chỗ trở lên thì `Nên soát {N} chỗ · {các tên ngắn, không trùng, nối bằng ", "}`.
- **Xuất file:** `Còn {N} chỗ nên soát ở {cụm vị trí không trùng, không có loại, không link}` + ` · ` + nút `Xem lại`. Cụm vị trí dùng cùng luật §3.2, ví dụ "Hoạt động 2 và mục Phẩm chất", "Hoạt động 2, 3 và mục Phẩm chất".
- `N` = số nhóm `(location, category)` còn mở (Q-BA5), bằng `postgenSummary.openCount`.

### 3.4 Copy cố định (nguyên văn)

| Vị trí | Copy |
| --- | --- |
| Dòng phụ dưới tiêu đề tóm tắt | Hệ thống đã tự kiểm tra và còn chỗ chưa chắc chắn. Thầy cô xem nhanh trước khi dùng. |
| Nút | Đã soát |
| Tooltip / mô tả của câu gạch chân | Nên soát lại câu này |
| Soát xong | Đã soát xong các chỗ được nhắc |
| Ack lỗi mạng / 5xx (dòng nhỏ dưới chip, Q-UX1) | Chưa lưu được, thầy cô bấm lại giúp nhé |
| aria-label nút "Đã soát" | `Đã soát, {Hoạt động n | Phẩm chất …}` |
| aria-label link chỉ có số | `Hoạt động n` |
| Dòng helper (có sẵn, giữ nguyên) | theo khung Phụ lục IV · GV tự thẩm định |

**Không được xuất hiện trong copy hiển thị cho GV:** "chuẩn Bộ", "sai", "lỗi", "lượt", mã quy tắc (R1–R4), "AI" (trong copy dòng nhắc), "KT", "&", "Đã sinh", "job", "Meta". Nên thêm một unit test quét các chuỗi của feature này.

---

## 4. Component và token

Font Inter 14px, line-height 1.5. Primary #2563EB (hover #1D4ED8), green #059669. Bo góc: **12** (dòng tóm tắt), **20** (chip, nút "Đã soát"), **8** (dòng Xuất file). Màu amber lấy đúng từ prototype:

| Token | Giá trị |
| --- | --- |
| amber-50 | #FFFBEB |
| amber-200 | #FDE68A |
| amber-300 | #FCD34D |
| amber-400 (ring shadow) | rgba(251,191,36,.45) |
| amber-500 | #F59E0B |
| amber-600 | #D97706 |
| amber-700 | #B45309 |
| amber-800 | #92400E |
| slate-600 / 700 / 800 | #475569 / #334155 / #1E293B |
| blue-700 (link) / blue-800 (link hover) | #1D4ED8 / #1E40AF |
| gray-50 / 200 / 400 | #F9FAFB / #E5E7EB / #9CA3AF |

Icon "soát" (`i-look`, viewBox 24, stroke 2, round):
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v3.2"/><path d="M11 14h.01"/>
</svg>
```
Icon check (nút "Đã soát"): `<path d="M5 12.5l4.5 4.5L19 7.5"/>`, stroke 2.5. Icon check-circle (soát xong): `<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16 10"/>`.

### 4.1 Dòng tóm tắt (`ReviewSummaryNote`)
- **Vị trí:** đầu thân giáo án, ngay sau dòng helper "v1 · theo khung Phụ lục IV · GV tự thẩm định", trước "I. Mục tiêu". Nằm trong vùng cuộn của editor.
- **Markup:** `<div role="note" aria-labelledby="rv-title" tabindex="-1">` chứa icon, `<p id="rv-title">` (có link) và `<p>` dòng phụ.
- **Style:** `display:flex; align-items:flex-start; gap:10px; padding:10px 14px; margin:0 0 14px; background:#FFFBEB; border:1px solid #FDE68A; border-radius:12px; color:#334155; scroll-margin-top:16px`.
  - Icon 18×18, màu #B45309, `margin-top:2px`.
  - Tiêu đề: 14px/600, #1E293B, line-height 1.5.
  - Dòng phụ: 13px, #475569, line-height 1.5, `margin-top:2px`.
  - Link vị trí là `<button type="button">`: #1D4ED8, 600, `text-decoration: underline 1px; text-underline-offset:3px`. Hover: #1E40AF, độ dày gạch 2px.
  - Link chỉ có số ("3", "4"): mở rộng vùng bấm bằng `::before` (left/right −5px, top/bottom −4px).
- Không có nút đóng. Không đỏ, không rung, luôn có icon kèm chữ.
- Tiêu đề **tính lại ngay** sau mỗi ack hoặc sau khi nhận plan mới.

### 4.2 Chip tại chỗ (`ReviewChip`)
- **Hàng chip:** `display:flex; gap:8px; flex-wrap:wrap`.
  - Ở hoạt động: `padding:10px 16px 0`. Nằm **giữa** header hoạt động và phần a–d, nên vẫn thấy khi hoạt động thu gọn (lúc đó thêm `padding-bottom:10px`).
  - Ở khối mục: `padding:8px 14px 0`, dưới nhãn khối.
- **Chip:** `inline-flex; gap:6px; padding:3px 4px 3px 9px; border-radius:20px; background:#FFFBEB; border:1px solid #FDE68A; color:#92400E; 12px/600; line-height:1.4`. Icon `i-look` 13px, màu #B45309. Chữ: "Nên soát số liệu" / "Nên soát nội dung" / "Nên soát câu chữ".
- **Nút "Đã soát"** (nằm trong chip): `<button type="button">`, `inline-flex; gap:4px; padding:2px 9px; min-height:24px; border-radius:20px; background:#fff; border:1px solid #FDE68A; color:#334155; 12px/600`. Icon check 12px, màu #059669. Hover: nền #F9FAFB, viền #FCD34D. Trong lúc chờ API: `disabled` + `aria-busy="true"`.
- **Dòng báo khi ack lỗi** (Q-UX1): `<p class="rv-ackfail" aria-live="polite">` nằm trong hàng chip, ngay dưới chip (`flex-basis:100%`). Style: `margin:0; font-size:12px; font-weight:500; line-height:1.4; color:#92400E` (7.09:1 trên nền trắng), không icon, không nền. Copy: "Chưa lưu được, thầy cô bấm lại giúp nhé". Phần tử luôn có trong DOM (rỗng) để aria-live hoạt động. Chỉ đổ chữ khi ack lỗi mạng hoặc 5xx. Bấm "Đã soát" lại thì xoá chữ ngay; nếu lại lỗi thì đổ chữ lại sau một tick để trình đọc màn hình đọc lại. Ack thành công thì chip và dòng này cùng mất. Không toast. Prototype **không có** state lỗi mạng, nên dòng này chỉ mô tả ở spec.

### 4.3 Gạch chân và tooltip (`ReviewUnderline`)
- **Style:** `text-decoration: underline dotted #D97706; text-decoration-thickness:2px; text-underline-offset:4px; text-decoration-skip-ink:none; cursor:help; border-radius:2px`. Hover: nền #FFFBEB.
- Tooltip "Nên soát lại câu này". Mô tả cho trình đọc màn hình: `aria-describedby` trỏ tới phần tử ẩn có chữ "Nên soát lại câu này".
- **Lưu ý khi cài trong code thật:** các field trong `apps/web` là `<Textarea>`, không style được một đoạn chữ bên trong textarea. Cách đề xuất (không đổi giao diện đã duyệt):
  1. **Lớp phản chiếu (backdrop).** Đặt sau textarea một `div aria-hidden` có cùng font, padding, `white-space:pre-wrap` và `word-wrap`, chữ trong suốt. Đoạn cần soát bọc `<mark class="rv-sus">` chỉ để vẽ gạch chấm. Textarea nền trong suốt, đồng bộ `scrollTop`.
  2. **Hover:** bắt `mousemove` trên textarea và so với `getClientRects()` của `<mark>`. Trùng vùng thì hiện tooltip (không dùng `title` gốc, vì textarea che mất).
  3. **Bàn phím / focus:** khi con trỏ (`selectionStart`) nằm trong `[start,end)`, hiện tooltip ngay dưới đoạn đó và nối `aria-describedby` của textarea tới tooltip (`role="tooltip"`). Rời vùng thì ẩn. Esc cũng ẩn.
  4. Nếu chưa làm kịp backdrop thì cách tạm chấp nhận được là **chỉ hiện chip** (giống `nopos`). Không được làm gãy việc gõ sửa.
- Giáo án sau khi xuất (Word/PDF) không có gạch chân. Thêm `@media print { .rv-note, .rv-chiprow, .rv-sus { display:none / text-decoration:none } }` phòng khi in từ trình duyệt.

### 4.4 Dòng "Đã soát xong"
- Tái dùng khung tóm tắt ở trạng thái `is-done`: `align-items:center; background:#fff; border-color:#E5E7EB; padding:8px 14px`. Icon check-circle #059669 (không có margin-top). Chữ 13px/500 #334155: "Đã soát xong các chỗ được nhắc". Không có dòng phụ.
- Chỉ hiện khi số nhắc mở **chuyển từ > 0 xuống 0 trong phiên** (do ack hoặc revise). Mở trang mà đã 0 thì không hiện.
- Sau 4000ms: `opacity` về 0 trong 0.6s (`transition: opacity .6s ease`), thêm 650ms thì ẩn hẳn. Có `prefers-reduced-motion: reduce` thì ẩn luôn ở 4000ms, không fade.
- Đồng thời đẩy chữ vào vùng `role="status" aria-live="polite"` ẩn. Vùng này luôn có trong DOM, không phải thẻ tóm tắt.

### 4.5 Dòng phụ Home (`ReviewHint` trong hàng hoặc thẻ giáo án)
- **Style:** `display:flex; align-items:center; gap:5px; margin-top:3px; 12px/500; color:#B45309; line-height:1.3`. Icon `i-look` 13px.
- Đặt dưới tên tiết. Badge **vẫn là "Đã soạn"**. Nếu job `status === "flagged"` (guardrail SGK) thì badge "Cần xem lại" được ưu tiên, **dòng phụ vẫn hiện**.
- Nút mở hàng có `aria-describedby` trỏ tới chữ của dòng phụ. Mở từ hàng này thì vào editor và focus dòng tóm tắt.
- **Nguồn dữ liệu (phase 2, phụ thuộc PR BE `postgenSummary`, Q-BE1):** lấy từ `postgenSummary` trên item của `GET /jobs` (§2.2).
  - `places.length === 1`: `Nên soát {từ loại} · {tên ngắn}`, ví dụ "Nên soát số liệu · HĐ2", "Nên soát câu chữ · Phẩm chất" (tên ngắn theo §2.5).
  - `places.length ≥ 2`: `Nên soát {openCount} chỗ · {tên ngắn không trùng, theo thứ tự của places, nối ", "}`, ví dụ "Nên soát 2 chỗ · HĐ2, HĐ3", "Nên soát 2 chỗ · HĐ2" (hai loại cùng HĐ2).
  - Không có `postgenSummary`: không có dòng phụ.
- **Trước khi PR BE đó merge, Home KHÔNG hiện dòng phụ.** Không gọi `GET /plans/:id` cho từng hàng để bù.

### 4.6 Dòng Xuất file (`ReviewExportLine`)
- **Style:** `display:flex; align-items:center; flex-wrap:wrap; gap:6px 8px; margin:0 0 12px; padding:8px 12px; background:#fff; border:1px solid #E5E7EB; border-radius:8px; 13px; color:#475569`. Rộng bằng khung xem trước (794px, `max-width:100%`).
  - Icon 15px, màu #B45309.
  - Dấu "·" màu #9CA3AF, `aria-hidden`.
  - Nút "Xem lại": #1D4ED8, 600, gạch chân (offset 3px), padding 2px, bo 4px.
- **Vị trí:** trên khung xem trước file (theo prototype). Nếu màn đang dùng chỉ có nút `ExportWordButton` thì đặt ngay trên nhóm nút xuất.
- **Nút xuất vẫn bật.** Tải file **không** đổi trạng thái nhắc. Dòng nhắc không bao giờ vào file.
- "Xem lại": mở editor, cuộn dòng tóm tắt vào giữa màn hình (`block:center`) và focus nó.

---

## 5. Trạng thái và lưu trữ

### 5.1 Từng cảnh báo (server)

```
            ┌────────── POST …/ack ──────────┐
 [open] ────┤                                 ├──► [acknowledged]  (acknowledgedAt, vẫn nằm trong mảng)
            └── revise đổi nội dung HĐ/mục ──► [cleared] (không còn trong postgenWarnings của phiên bản mới)
 Gõ sửa tay chưa lưu        → không đổi gì (vẫn open)
 Tải lại trang / xuất file  → không đổi gì
 revise KHÔNG đổi HĐ/mục đó → giữ nguyên (open hoặc acknowledged được mang sang, cùng id)
 Lưu chỉnh tay (chưa có, ticket riêng, Q-BA3):
   nhắc có span     → [cleared] chỉ khi đoạn của span bị đổi/xoá; còn nguyên thì giữ, BE tính lại offset
   nhắc không span  → giữ tới khi bấm "Đã soát"
```

Quy tắc lưu chỉnh tay ở trên thay cho câu "áp cùng quy tắc với revise" của AC v2.1 và dành cho ticket sau, không thuộc PR #24. Chi tiết, log `postgen_warning_cleared_by_edit` (`reason: "span_changed"`) và 3 test nằm ở §0.

### 5.2 Dòng tóm tắt (client)

| Trạng thái | Điều kiện | Hiển thị |
| --- | --- | --- |
| `hidden` | lúc tải có 0 nhắc mở, hoặc hết thời gian của `done` | không render (vùng aria-live vẫn trong DOM) |
| `showing` | ≥ 1 nhắc mở | tóm tắt + dòng phụ, chip, gạch chân |
| `done` | vừa chuyển từ ≥ 1 xuống 0 trong phiên | "Đã soát xong các chỗ được nhắc" 4s → fade → `hidden` |

Chuyển trạng thái: `showing` sang `showing` khi ack một phần hoặc revise bỏ một phần (tính lại câu). `showing` sang `done` khi hết. `done` sang `hidden`.

### 5.3 Lưu trữ
- Nguồn sự thật là `plan.postgenWarnings` từ server (`lesson_plans.postgen_warnings`, theo **từng phiên bản**). Không dùng localStorage cho trạng thái nhắc. Prototype dùng localStorage chỉ để giả lập.
- Giữ state cảnh báo **tách khỏi** bản `plan` mà GV đang sửa (`LessonPlanEditor` spread `plan` khi `onChange`). Lấy từ plan server, cập nhật theo response của ack hoặc plan mới sau revise.
- **Tải lại:** `GET /plans/:id` hoặc `GET /jobs/:id` đều đã có `acknowledgedAt`, nên nhắc đã soát không hiện lại.
- **Xuất file:** không gọi gì liên quan. Quay lại editor thì nhắc vẫn còn.
- **Đổi phiên bản:** ack chỉ tác động lên head. Nếu editor đang xem bản cũ (không phải head) thì **ẩn nút "Đã soát"**, chỉ hiện tóm tắt và chip ở chế độ đọc. Gặp 404 thì tải lại head.

---

## 6. Tương tác

| Hành động | Kết quả |
| --- | --- |
| Bấm link vị trí trong tóm tắt | Mở hoạt động nếu đang thu gọn (`aria-expanded="true"`). Cuộn `scrollIntoView({block:"start", behavior: reduced ? "auto" : "smooth"})`, `scroll-margin-top` 16px (khối mục 48px). `focus({preventScroll:true})` vào khung đích (`tabindex="-1"`). Viền nhấn: `border-color:#F59E0B; box-shadow:0 0 0 4px rgba(251,191,36,.45)` trong 2000ms, transition .35s (tắt khi reduced motion). |
| Bấm "Đã soát" | Nút `disabled` + `aria-busy`. Gọi ack cho mọi id của nhóm (song song). Thành công thì bỏ chip và gạch chân của nhóm, tính lại tóm tắt, Home và Xuất file. Focus chuyển về khung hoạt động hoặc mục đó (`tabindex=-1`, `preventScroll`) để không mất focus. Hết nhắc thì sang `done`. Lỗi mạng hoặc 5xx: giữ chip và gạch chân, bật lại nút (focus vẫn ở nút), hiện "Chưa lưu được, thầy cô bấm lại giúp nhé" dưới chip (§4.2). |
| Gõ sửa trong field được nhắc | **Không đổi trạng thái nhắc.** Chỉ bỏ gạch chân của field vừa sửa (offset có thể lệch, §2.6 điều 3). Chip và tóm tắt giữ nguyên. |
| Revise xong | Tính lại từ `postgenWarnings` mới. Không toast mới. Hết nhắc thì sang `done`. |
| Bấm hàng Home có dòng phụ | Mở editor và focus dòng tóm tắt. |
| "Xem lại" ở Xuất file | Như trên. |
| Tải Word/PDF | Không đổi gì. |

---

## 7. Khả năng tiếp cận (WCAG 2.1 AA)

1. **`role="note"`** cho dòng tóm tắt, `aria-labelledby` trỏ tới tiêu đề. Không dùng `role="alert"`, không tự đọc lúc tải trang.
2. **Bàn phím:** mọi link vị trí và nút "Đã soát" là `<button>` thật, Tab tới được theo thứ tự DOM, Enter/Space kích hoạt. Không có bẫy focus.
3. **Focus-visible:** `outline:2px solid #2563EB; outline-offset:2px; border-radius:4px` (tương phản 5.17:1 trên nền trắng). Khung tóm tắt có `tabindex=-1`: `:focus` không outline, `:focus-visible` có outline.
4. **aria-live:** một vùng `role="status" aria-live="polite"` ẩn (`sr-only`) luôn có trong DOM. Chỉ đẩy "Đã soát xong các chỗ được nhắc" vào đó. Riêng dòng "Chưa lưu được, thầy cô bấm lại giúp nhé" (ack lỗi) có `aria-live="polite"` của chính nó, nằm cạnh chip (§4.2, Q-UX1).
5. **Tooltip:** không chỉ hiện khi hover. Phải có khi focus hoặc khi con trỏ nằm trong đoạn (§4.3), `role="tooltip"`, nối qua `aria-describedby`, Esc để ẩn.
6. **Tương phản** (đã đo):

| Cặp màu | Tỉ lệ |
| --- | --- |
| Tiêu đề #1E293B / #FFFBEB | 14.11:1 |
| Dòng phụ #475569 / #FFFBEB | 7.31:1 |
| Link #1D4ED8 / #FFFBEB | 6.46:1 |
| Chữ chip #92400E / #FFFBEB | 6.84:1 |
| Chữ "Đã soát" #334155 / #FFFFFF | 10.35:1 |
| Dòng phụ Home #B45309 / #FFFFFF | 5.02:1 (trên nền hover #EFF6FF: 4.61:1) |
| Dòng Xuất file #475569 / #FFFFFF | 7.58:1 |
| Dòng ack lỗi #92400E / #FFFFFF | 7.09:1 |
| Gạch chân chấm #D97706 / #FFFFFF (không phải chữ) | 3.19:1 (≥ 3:1) |
| Icon amber #B45309 / #FFFBEB | 4.84:1 |
| Icon check #059669 / #FFFFFF | 3.77:1 |

   Viền nhấn #F59E0B (2.15:1) chỉ là hiệu ứng tạm thời, luôn đi kèm việc focus chuyển tới khung. Không dựa vào nó để truyền thông tin.
7. **Không truyền nghĩa chỉ bằng màu:** luôn có icon và chữ "Nên soát …".
8. `prefers-reduced-motion`: cuộn tức thì, không transition ring, không fade.
9. Link chỉ có số có `aria-label="Hoạt động n"`. Nút "Đã soát" có `aria-label="Đã soát, Hoạt động n"`.

---

## 8. Mobile (375px, breakpoint `max-width:720px`)

- Editor `padding:12px 12px 120px`. Sidebar ẩn. Badge a/b/c/d ở header hoạt động ẩn. Header hoạt động `min-height:48px`.
- Tóm tắt: `padding:10px 12px; gap:8px`. Tiêu đề line-height 1.6, được xuống dòng tự nhiên.
- Link vị trí có vùng chạm ≥ 44px: `::after` cao 44px, căn giữa theo chiều dọc, mở rộng ngang 4–6px.
- Hàng chip `padding:10px 12px 0`. Chip `padding:4px 4px 4px 10px`. Nút "Đã soát" `min-height:36px; padding:4px 12px` + `::after` 44px.
- Nút ở topbar `min-height:44px`. Home ẩn cột Môn/Khối/Cập nhật, dòng phụ xuống dòng dưới tên tiết.
- Xuất file: panel xếp dưới khung xem trước. Dòng nhắc vẫn nằm trên khung xem trước.

---

## 9. Trường hợp biên

| # | Tình huống | Hành vi |
| --- | --- | --- |
| E1 | Không có `postgenWarnings` hoặc mảng rỗng | Không render gì. Plan cũ trước migration được coi như không có cảnh báo. |
| E2 | Tất cả đã `acknowledgedAt` lúc tải | Không render (không hiện "Đã soát xong"). |
| E3 | `span` thiếu, sai kiểu, `start ≥ end`, vượt độ dài, `field` không tồn tại, đoạn vắt qua hai phần tử của mục dạng mảng, hoặc span kiểu cũ `activity` / `subActivities.{k}` (§2.6) | Chỉ hiện chip, không gạch chân. |
| E4 | GV gõ sửa field có gạch chân (chưa lưu) | Text field khác bản server nên bỏ gạch chân của field đó (§2.6 điều 3). Chip và tóm tắt giữ nguyên. Tải lại thì text server về như cũ và gạch chân quay lại. |
| E5 | `category` lạ | Coi như `noi_dung`, `console.warn` (Q-BA1). |
| E6 | `location` lạ hoặc ngoài phạm vi | Bỏ qua, `console.warn` (Q-BE4). |
| E7 | Nhiều cảnh báo cùng `(location, category)` | Một chip, gạch chân từng span. "Đã soát" ack tất cả id trong nhóm. |
| E8 | Hai loại ở cùng một hoạt động | Hai chip trong cùng hàng, theo thứ tự loại. Tóm tắt lặp lại vị trí (xem bảng §3.3). |
| E9 | Cảnh báo nằm trong hoạt động con (`span.field = "subActivities.{k}.<field>"`) | Chip ở hoạt động cha, gạch chân trong field đó của hoạt động con k. |
| E10 | Hoạt động đang thu gọn | Chip vẫn thấy. Bấm link thì hoạt động mở ra. |
| E11 | Job `flagged` (SGK) và có nhắc | Banner flagged và dòng tóm tắt cùng hiện. Home: badge "Cần xem lại", dòng phụ vẫn có. |
| E12 | Job `blocked` | Không có nội dung giáo án, nên không hiện nhắc. |
| E13 | Ack bị 404 | Tải lại `GET /plans/:id` rồi render lại. |
| E14 | Ack lỗi mạng hoặc 5xx | Giữ chip, bật lại nút, hiện "Chưa lưu được, thầy cô bấm lại giúp nhé" dưới chip (`aria-live="polite"`). Không toast (Q-UX1). |
| E15 | Ack một phần trong nhóm nhiều id bị lỗi | Giữ chip với các id còn mở và hiện cùng dòng báo như E14. Bấm lại chỉ gửi các id đó. |
| E16 | Revise bỏ hết nhắc | Hiện "Đã soát xong…" nếu đang ở editor lúc job xong. |
| E17 | Revise viết lại gần như cả giáo án (instructions chung) | Mọi hoạt động đổi fingerprint, nên mọi nhắc đều mất, kể cả chỗ GV chưa xem (Q-BA4). |
| E18 | Đang xem phiên bản cũ | Ẩn "Đã soát" (ack chỉ tác động lên head). Chỉ đọc. |
| E19 | `check_error` ở BE | `postgenWarnings` rỗng, không có nhắc (đường lỗi hiếm, đã có log). |
| E20 | Nhiều tab | Tab kia chỉ cập nhật khi focus lại hoặc tải lại (đọc từ server). |
| E21 | `GET /jobs` chưa có `postgenSummary` (trước PR BE của Q-BE1) | Home không có dòng phụ. Editor và Xuất file vẫn đủ. |

---

## 10. Checklist nghiệm thu (ánh xạ AC v2.1)

| # | Kiểm tra | AC |
| --- | --- | --- |
| C1 | Có ≥ 1 cảnh báo mở thì hiện dòng tóm tắt amber, `role="note"`, không chặn thao tác nào, nút xuất vẫn bật | Q1, S3, S3b, Copy 6 |
| C2 | Tiêu đề đúng từng dòng của bảng §3.3 (1, 2, 3+ vị trí; nhiều loại; mục) | Copy 1 |
| C3 | Dòng phụ đúng nguyên văn | Copy 2 |
| C4 | Mỗi vị trí là một nút riêng, cuộn tới + focus + viền nhấn 2 giây, hoạt động thu gọn thì mở ra | Copy 1 (thiết kế đã duyệt) |
| C5 | Chip "Nên soát số liệu / nội dung / câu chữ" + nút "Đã soát" đặt đúng hoạt động hoặc mục | Copy 3, S4 |
| C6 | Có span hợp lệ thì gạch chân chấm + tooltip "Nên soát lại câu này" (hover **và** focus). Không có hoặc sai span thì chỉ chip | S4, Copy 3 |
| C7 | Loại lấy từ `category`: `so_lieu` (R2/R3/R4 có số), `noi_dung` (R4 không số), `cau_chu` (R1). Không hiện mã quy tắc, không có chữ "sai" | S4, Copy 3 |
| C8 | Bấm "Đã soát" gọi `POST /plans/:id/warnings/:warningId/ack`, tóm tắt tính lại ngay | S5, A7 |
| C9 | **Gõ sửa tay không làm mất nhắc** (chip, tóm tắt, Home, Xuất file đều giữ) | S5 (v2.1) |
| C10 | Revise đổi nội dung hoạt động thì nhắc ở đó mất. Hoạt động không đổi thì giữ (kể cả đã soát) | S5 |
| C11 | Tải lại trang: nhắc chưa soát vẫn còn, nhắc đã soát không quay lại | S5 |
| C12 | Tải Word/PDF: file không có nhắc hay gạch chân. Quay lại editor thì nhắc vẫn còn | S5, Copy 6 |
| C13 | Không có nút X hay nút đóng | S5 |
| C14 | Soát hết thì hiện "Đã soát xong các chỗ được nhắc", tự mất sau khoảng 4 giây, được đọc qua aria-live | Copy 4 |
| C15 | **Phase 2 (sau PR BE `postgenSummary`):** Home có badge "Đã soạn" + dòng phụ lấy từ `postgenSummary`, đúng dạng §4.5. Guardrail SGK thì badge "Cần xem lại" và dòng phụ vẫn hiện. **Trước đó:** Home không có dòng phụ | Copy 5 |
| C16 | Xuất file: "Còn N chỗ nên soát ở … · Xem lại" (chỉ vị trí, không loại). "Xem lại" focus vào tóm tắt | Copy 6 |
| C17 | Không có toast mới, không nhắc hạn mức hay lượt | Q2, S6 |
| C18 | Quét copy: không có từ cấm (§3.4) | Copy 3 + quy ước sản phẩm |
| C19 | 375px: vùng chạm ≥ 44px, không tràn ngang, khớp ảnh `mobile-*` | thiết kế đã duyệt |
| C20 | Bàn phím + trình đọc màn hình: đi hết vòng Tab tóm tắt → chip → "Đã soát", focus không mất sau ack | thiết kế đã duyệt |
| C21 | Không câu tóm tắt hay dòng Xuất file nào có chữ "và" ở hai cấp khác nhau. Mỗi cụm vị trí có tối đa một "và". Đúng từng dòng bảng §3.3, kể cả các dòng **v1.1** | Q-BA2 |
| C22 | Ack lỗi mạng hoặc 5xx: chip còn, nút bật lại, dòng "Chưa lưu được, thầy cô bấm lại giúp nhé" hiện dưới chip và được đọc qua aria-live polite. Không toast. Bấm lại thành công thì dòng mất cùng chip | Q-UX1 |
| C23 | Mỗi lần bấm "Đã soát", số "chỗ" ở Xuất file (và ở Home khi có `postgenSummary`) giảm đúng một | Q-BA5 |

---

## 11. Câu hỏi

### 11.1 Đã chốt (v1.1)

| # | Câu hỏi | Trả lời | Ghi vào |
| --- | --- | --- | --- |
| Q-BE1 | Home không có dữ liệu cảnh báo trên `GET /jobs` | PR BE riêng ngay sau khi #24 merge: `postgenSummary?: { openCount, places: { location, category }[] }`, không trùng, theo thứ tự giáo án, bỏ khi không còn nhắc. Tên field dự kiến. Home dùng ở phase 2, trước đó không có dòng phụ | §2.2, §4.5, C15, E21 |
| Q-BE2 | `span.field` là chuỗi tổng hợp `activityBlock` | `span.field` là đường dẫn field thật, offset trong field. Làm ở ticket thu hẹp span R4, ship trước UI. Span kiểu cũ thì chỉ hiện chip | §2.6, §2.7, E3, §12 |
| Q-BE3 | Offset field mảng tính trên `join("\n")` | Đóng. PR hiện tại giữ `join("\n")` cho `objectives.*` / `teachingAids`. Còn một câu nhỏ, chuyển sang Q-BE8 | §2.6 |
| Q-BE6 | Stub mang `postgenWarnings` của head sang bản revise | BE nhận: luôn đặt `postgenWarnings = carried.kept`, kể cả trên stub. Vào #24 nếu Techlead đồng ý, không thì PR sau | §2.8 |
| Q-BE7 | Merge #24 có đổi tên field không | Không. Về sau chỉ đổi giá trị `span.field` (shape giữ nguyên) và thêm `postgenSummary` vào `GET /jobs` | §2 |
| Q-UX1 | Ack lỗi mạng | Giữ chip, bật lại nút, dòng nhỏ dưới chip "Chưa lưu được, thầy cô bấm lại giúp nhé", `aria-live="polite"`, không toast | §2.3, §3.4, §4.2, §6, §7, E14, E15, C22 |
| Q-BA2 | Hai chữ "và" khi nhiều vị trí và nhiều loại | Cụm vị trí trong một loại là một danh sách phẳng. Có cụm chứa "và" thì nối các loại bằng dấu phẩy, không thì giữ `joinVa`. Xuất file dùng cùng luật cụm vị trí | §3.2, §3.3, C21, prototype `mixed3` |
| Q-BA3 | Lưu chỉnh tay xoá mọi nhắc của hoạt động? | Không. Nhắc có span chỉ mất khi đoạn của span bị đổi hoặc xoá (còn nguyên thì giữ, tính lại offset). Nhắc không span giữ tới khi bấm "Đã soát". Log `postgen_warning_cleared_by_edit` kèm lý do. Dành cho ticket lưu chỉnh tay, không thuộc #24 | §0, §5.1 |
| Q-BA5 | Đếm "chỗ" theo nhóm hay theo vị trí | Theo nhóm `(vị trí, loại)`. Số chỗ = số chip = số lần bấm "Đã soát". "Nên soát 2 chỗ · HĐ2" giữ nguyên. Trùng `postgenSummary.openCount` | §3.1, §3.3, C23 |

### 11.2 Còn mở

**Cho BE**
- **Q-BE4.** Có thể phát sinh `location.kind` hoặc `key` khác 5 key hiện có không? FE đang bỏ qua giá trị lạ.
- **Q-BE5.** Ack chỉ tác động lên head. Nếu GV mở bản cũ, FE đang ẩn "Đã soát". Có muốn cho ack trên bản cũ không?
- **Q-BE8 (mới, từ Q-BE3).** Với mục dạng danh sách (`objectives.*`, `teachingAids`), sau ticket thu hẹp span, path sẽ trỏ tới từng phần tử (ví dụ `objectives.qualities.0`, offset tính trong phần tử) hay giữ `objectives.qualities` với offset trên `join("\n")`? FE sẽ nhận được cả hai (§2.6).
- **Tên `postgenSummary`:** xác nhận tên và shape khi PR BE của Q-BE1 merge.

**Cho BA / Huy**
- **Q-BA1.** `category` lạ: đang hiện như "nội dung". Hay nên ẩn?
- **Q-BA4 (đang chờ Huy chốt qua Captain).** Revise với yêu cầu chung thường viết lại cả giáo án, nên fingerprint mọi hoạt động đổi và mọi nhắc mất, trong khi bản mới không được chạy lại R1–R4. BA khuyến nghị chạy lại R1–R4 (chỉ tầng code, không gọi thêm LLM) trên các hoạt động hoặc mục bị đổi sau revise, và không hiện "Đã soát xong…" khi bản revise có nhắc mới (chi tiết trong `fe-spec-qba-answers.md`). Tới khi chốt, E17 giữ nguyên.

---

## 12. Ghi chú cài đặt (gợi ý)

- Hàm thuần (có unit test): `openWarnings(plan)`, `groupWarnings(open)`, `locPhrase(places)` (danh sách phẳng, §3.2), `summaryParts(groups)` (trả mảng text + link để render, nối bằng dấu phẩy khi có cụm chứa "và"), `homeHint(postgenSummary)`, `exportLine(groups)`, `resolveSpan(plan, warning, currentFields)`. Test bằng đúng bảng §3.3 (kể cả các dòng v1.1 và kiểm C21) và các span sai ở E3.
- `resolveSpan`: tách `span.field` theo dấu chấm và đọc giá trị thật trên hoạt động (`content`, `organization.assignTask`, `subActivities.0.products`) hoặc mục (mảng thì `join("\n")`, hoặc một phần tử nếu path có chỉ số, xem Q-BE8). Trả `null` (chỉ chip) khi field không có, offset sai, text đã đổi so với bản server, hoặc span kiểu cũ `activity` / `subActivities.{k}`. Không có thuật toán đổi offset.
- Component: `ReviewSummaryNote`, `ReviewChipRow`, `ReviewUnderlineTextarea` (backdrop), `ReviewHint`, `ReviewExportLine`, và một vùng `aria-live` dùng chung trong editor.
- API client: `ackPostgenWarning(planId, warningId)` → `POST /plans/${planId}/warnings/${warningId}/ack`.
- Không đụng `lib/wait-copy.ts` / toast xong.

---

## 13. Ảnh chụp và URL prototype

Ảnh chụp từ prototype đã cập nhật bằng headless Chrome (1280×800 desktop; 375×812 @2x mobile; `&embed=1` để ẩn panel review). v1.1 chụp lại cả bộ. Ảnh của các câu đã duyệt không đổi, có thêm 6 ảnh `mixed3`. URL prototype nên mở kèm `&embed=1` nếu muốn ẩn panel Demo.

Gốc ảnh: `https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/`
Gốc prototype: `https://lequanghuy.github.io/giaoan-review-note-proto/`

| Trạng thái | Ảnh | Prototype |
| --- | --- | --- |
| 1 chỗ · số liệu · HĐ2 (tóm tắt) | [desktop-one.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-one.png) | [?state=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one) |
| 1 chỗ: chip + gạch chân tại HĐ2 | [desktop-one-chip.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-one-chip.png) | [?state=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one) (cuộn tới HĐ2) |
| 2 loại · HĐ2 số liệu + HĐ3 nội dung | [desktop-two.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-two.png) | [?state=two](https://lequanghuy.github.io/giaoan-review-note-proto/?state=two) |
| 3 vị trí · "Hoạt động 2, 3 và 4" | [desktop-three.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-three.png) | [?state=three](https://lequanghuy.github.io/giaoan-review-note-proto/?state=three) |
| Nhiều loại · HĐ2 + mục Phẩm chất | [desktop-mixed.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-mixed.png) | [?state=mixed](https://lequanghuy.github.io/giaoan-review-note-proto/?state=mixed) |
| **v1.1 dấu phẩy (Q-BA2)** · HĐ2, 3 số liệu + HĐ4 nội dung + Phẩm chất câu chữ | [desktop-mixed3.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-mixed3.png) | [?state=mixed3](https://lequanghuy.github.io/giaoan-review-note-proto/?state=mixed3) |
| mixed3: chip "Nên soát nội dung" + gạch chân tại HĐ4 | [desktop-mixed3-hd4.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-mixed3-hd4.png) | [?state=mixed3](https://lequanghuy.github.io/giaoan-review-note-proto/?state=mixed3) (cuộn tới HĐ4) |
| mixed3 sau "Đã soát" HĐ4: "…Hoạt động 2 và 3, câu chữ ở mục Phẩm chất" | [desktop-mixed3-after-ack-hd4.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-mixed3-after-ack-hd4.png) | [?state=mixed3](https://lequanghuy.github.io/giaoan-review-note-proto/?state=mixed3) → "Đã soát" ở HĐ4 |
| Câu chữ · mục Phẩm chất | [desktop-phamchat.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-phamchat.png) | [?state=phamchat](https://lequanghuy.github.io/giaoan-review-note-proto/?state=phamchat) |
| **Chỉ chip, không có vị trí câu** (tóm tắt) | [desktop-nopos.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-nopos.png) | [?state=nopos](https://lequanghuy.github.io/giaoan-review-note-proto/?state=nopos) |
| **Chỉ chip** tại HĐ2 (không gạch chân) | [desktop-nopos-chip.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-nopos-chip.png) | [?state=nopos](https://lequanghuy.github.io/giaoan-review-note-proto/?state=nopos) |
| Bấm link "Hoạt động 3", viền nhấn | [desktop-two-link-highlight.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-two-link-highlight.png) | [?state=two](https://lequanghuy.github.io/giaoan-review-note-proto/?state=two) → bấm "Hoạt động 3" |
| Bấm link chỉ có số "4", viền nhấn | [desktop-three-link-highlight.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-three-link-highlight.png) | [?state=three](https://lequanghuy.github.io/giaoan-review-note-proto/?state=three) → bấm "4" |
| Bấm link "Phẩm chất", viền nhấn | [desktop-mixed-link-phamchat.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-mixed-link-phamchat.png) | [?state=mixed](https://lequanghuy.github.io/giaoan-review-note-proto/?state=mixed) → bấm "Phẩm chất" |
| **AC v2.1:** gõ sửa HĐ2, chip vẫn còn | [desktop-one-edit-keeps-chip.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-one-edit-keeps-chip.png) | [?state=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one) → gõ vào b) Nội dung |
| **AC v2.1:** gõ sửa HĐ2, tóm tắt vẫn còn | [desktop-one-edit-keeps-note.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-one-edit-keeps-note.png) | như trên |
| "Đã soát" HĐ2 trong `two`, tóm tắt tính lại | [desktop-two-after-ack-hd2.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-two-after-ack-hd2.png) | [?state=two](https://lequanghuy.github.io/giaoan-review-note-proto/?state=two) → "Đã soát" ở HĐ2 |
| Revise đổi HĐ2, tóm tắt còn HĐ3 | [desktop-two-after-revise-hd2.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-two-after-revise-hd2.png) | [?state=two](https://lequanghuy.github.io/giaoan-review-note-proto/?state=two) → Demo "Mô phỏng soạn lại" |
| Revise đổi HĐ2: câu đã viết lại, hết chip | [desktop-two-after-revise-hd2-section.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-two-after-revise-hd2-section.png) | như trên |
| **Soát xong** (ngay sau "Đã soát" cuối cùng) | [desktop-done-message.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-done-message.png) | [?state=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one) → "Đã soát" |
| Soát xong (state demo) | [desktop-reviewed.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-reviewed.png) | [?state=reviewed](https://lequanghuy.github.io/giaoan-review-note-proto/?state=reviewed) |
| Home · 1 chỗ + hàng guardrail "Cần xem lại" (phase 2) | [desktop-home.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-home.png) | [?state=home&plan=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=home&plan=one) |
| Home · dạng đếm "Nên soát 2 chỗ · HĐ2, HĐ3" (phase 2) | [desktop-home-two.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-home-two.png) | [?state=home&plan=two](https://lequanghuy.github.io/giaoan-review-note-proto/?state=home&plan=two) |
| Xuất file · 1 chỗ | [desktop-export.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-export.png) | [?state=export&plan=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=export&plan=one) |
| Xuất file · HĐ2 + mục Phẩm chất | [desktop-export-mixed.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-export-mixed.png) | [?state=export&plan=mixed](https://lequanghuy.github.io/giaoan-review-note-proto/?state=export&plan=mixed) |
| Home · mixed3 "Nên soát 4 chỗ · HĐ2, HĐ3, HĐ4, Phẩm chất" (phase 2) | [desktop-home-mixed3.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-home-mixed3.png) | [?state=home&plan=mixed3](https://lequanghuy.github.io/giaoan-review-note-proto/?state=home&plan=mixed3) |
| Xuất file · mixed3 "Còn 4 chỗ nên soát ở Hoạt động 2, 3, 4 và mục Phẩm chất" | [desktop-export-mixed3.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-export-mixed3.png) | [?state=export&plan=mixed3](https://lequanghuy.github.io/giaoan-review-note-proto/?state=export&plan=mixed3) |
| Ghi chú thiết kế (panel) | [desktop-design-notes.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-design-notes.png) | [?state=one&notes=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one&notes=1) |
| Mobile 375 · `one` đầu trang | [mobile-one-top.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-one-top.png) | [?state=one&embed=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one&embed=1) (khung 375) hoặc [?state=one&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one&mobile=1) |
| Mobile 375 · `one` tóm tắt | [mobile-one.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-one.png) | như trên |
| Mobile 375 · `one` chip + gạch chân | [mobile-one-chip.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-one-chip.png) | như trên |
| Mobile 375 · `mixed` | [mobile-mixed.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-mixed.png) | [?state=mixed&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=mixed&mobile=1) |
| Mobile 375 · `mixed3` | [mobile-mixed3.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-mixed3.png) | [?state=mixed3&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=mixed3&mobile=1) |
| Mobile 375 · chỉ chip | [mobile-nopos-chip.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-nopos-chip.png) | [?state=nopos&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=nopos&mobile=1) |
| Mobile 375 · soát xong | [mobile-done-message.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-done-message.png) | [?state=one&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one&mobile=1) → "Đã soát" |
| Mobile 375 · Home | [mobile-home.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-home.png) | [?state=home&plan=two&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=home&plan=two&mobile=1) |
| Mobile 375 · Xuất file | [mobile-export.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-export.png) | [?state=export&plan=one&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=export&plan=one&mobile=1) |

Tooltip "Nên soát lại câu này" trong prototype là `title` gốc của trình duyệt, headless Chrome không chụp được. Hành vi tooltip khi focus trong sản phẩm theo §4.3 và §7.5.
