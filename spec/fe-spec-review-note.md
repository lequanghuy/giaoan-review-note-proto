# Spec FE: Dòng nhắc soát lại (post-generation review note)

GiaoAnBuddy / GiaoAn AI · UI UX Designer · 26/09/2026
Trạng thái thiết kế: **Huy đã duyệt prototype**. Hành vi xoá nhắc đã chỉnh theo **AC v2.1** (xem §0).
Người nhận: Dev FE (`apps/web`, Next.js).

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
- Mọi thứ khác giữ nguyên như bản Huy đã duyệt.

**Chỉnh tay có lưu:** hiện chưa có. `LessonPlanEditor` chỉ đổi state cục bộ, không có endpoint lưu. Theo AC v2.1, khi có tính năng lưu thì áp cùng quy tắc với revise: lưu xong mà nội dung hoạt động hoặc mục đổi thì BE bỏ các nhắc ở đó (`carryOverWarnings`). FE chỉ cần hiển thị lại theo `postgenWarnings` mới. Ticket đó làm riêng, xem Q-BA3.

---

## 1. Phạm vi

**Trong phạm vi**
1. Dòng tóm tắt (summary note) ở đầu thân giáo án, trong editor.
2. Chip tại chỗ ("Nên soát …") và nút "Đã soát" ở từng hoạt động hoặc mục.
3. Gạch chân chấm cho câu cần soát, kèm tooltip "Nên soát lại câu này", khi BE có `span` hợp lệ.
4. Dòng "Đã soát xong các chỗ được nhắc", tự mất sau khoảng 4 giây.
5. Dòng phụ ở Home (thẻ hoặc hàng giáo án).
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
| `GET /jobs` (danh sách Home, `RecentJobSummary`) | **Không có** thông tin cảnh báo | PR #24 không đổi `RecentJobSummary`. Xem Q-BE1. |
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
| Lỗi mạng / 5xx | – | Giữ chip, bật lại nút, xem §7.4. |

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

Tên vị trí phải "ghi đúng như tiêu đề trong giáo án" (Copy 1). Cảnh báo có `span.field = "subActivities.{k}"` vẫn thuộc **hoạt động cha** (`location.kind = "activity"`). Chip đặt ở hoạt động cha, gạch chân đặt trong hoạt động con k.

**Dự phòng vị trí:** nếu `index` nằm ngoài `plan.activities`, `key` không có trong bảng, hoặc `kind` lạ, thì **bỏ qua** cảnh báo đó trong UI (không đếm, không link) và `console.warn`. Xem Q-BE4.

### 2.6 `span` (vị trí câu). Quan trọng: offset tính trên chuỗi nào

PR #24 dùng **offset ký tự** (`start`, `end`, end loại trừ, đơn vị code unit UTF-16, vì BE lấy bằng `String.indexOf` trong Node). Không dùng chỉ số câu. Giá trị `span.field` có trong code hiện tại:

| `span.field` | Offset tính trên chuỗi | Nguồn |
| --- | --- | --- |
| `"activity"` | chuỗi **tổng hợp** `activityBlock(activity)` (`apps/api/src/ai/postgen/activity-text.ts`), không phải một field thật | R1 + R2/R3/R4 ở hoạt động |
| `"subActivities.{k}"` | chuỗi tổng hợp `subActivityBlock(activity.subActivities[k])` | R1–R4 ở hoạt động con |
| `"products"` | `activity.products`, offset trực tiếp | R4 đáp số ghép cặp (Toán 7) |
| `"objectives.knowledge"` / `"objectives.competencies"` / `"objectives.qualities"` / `"teachingAids"` | `plan.<mảng>.join("\n")` | R1 ở mục |
| `"adjustments"` | `plan.adjustments ?? ""` | R1 ở mục |

`activityBlock` ghép như sau (nối bằng `"\n"`):
```
**Mục tiêu.** {objectives}
**Nội dung.** {content}
**Sản phẩm.** {products}
**Tổ chức thực hiện.**
- Giao nhiệm vụ: {organization.assignTask}
- Thực hiện nhiệm vụ: {organization.performTask}
- Báo cáo thảo luận: {organization.reportDiscussion}
- Kết luận/nhận định: {organization.conclude}
```
`subActivityBlock` có cùng dạng, dùng field của hoạt động con.

**Thuật toán FE đổi span về field thật** (chỉ tạm dùng tới khi BE trả offset theo field thật, xem Q-BE2):

```ts
type Seg = { path: string; prefix: string; value: string }
function blockSegments(a: TeachingActivity | TeachingSubActivity): Seg[] {
  return [
    { path: "objectives", prefix: "**Mục tiêu.** ", value: a.objectives },
    { path: "content", prefix: "**Nội dung.** ", value: a.content },
    { path: "products", prefix: "**Sản phẩm.** ", value: a.products },
    { path: "", prefix: "**Tổ chức thực hiện.**", value: "" },
    { path: "organization.assignTask", prefix: "- Giao nhiệm vụ: ", value: a.organization.assignTask },
    { path: "organization.performTask", prefix: "- Thực hiện nhiệm vụ: ", value: a.organization.performTask },
    { path: "organization.reportDiscussion", prefix: "- Báo cáo thảo luận: ", value: a.organization.reportDiscussion },
    { path: "organization.conclude", prefix: "- Kết luận/nhận định: ", value: a.organization.conclude },
  ]
}
/** Trả về field thật + offset trong field đó, hoặc null (chỉ hiện chip). */
function locateInBlock(segs: Seg[], start: number, end: number) {
  let pos = 0
  for (const s of segs) {
    const valueStart = pos + s.prefix.length
    const valueEnd = valueStart + s.value.length
    if (s.path && start >= valueStart && end <= valueEnd) {
      return { path: s.path, start: start - valueStart, end: end - valueStart }
    }
    pos = valueEnd + 1 // "\n"
  }
  return null
}
```
Với field dạng mảng (`objectives.*`, `teachingAids`), duyệt từng phần tử và cộng `length + 1` cho mỗi `"\n"`. Chỉ nhận khi đoạn nằm trọn trong **một** phần tử.

**Điều kiện span hợp lệ.** Chỉ gạch chân khi tất cả đều đúng, sai một điều thì chỉ hiện chip (nhãn ở hoạt động, không gạch chân):
1. Có `span`; `start`, `end` là số nguyên; `0 ≤ start < end ≤ độ dài chuỗi gốc`.
2. `span.field` là một trong các giá trị ở bảng trên, và field đó tồn tại (ví dụ `subActivities[k]` có thật).
3. Sau khi đổi, đoạn nằm trọn trong phần giá trị của một field thật (không dính nhãn `**…**`, không vắt qua `"\n"` giữa hai field).
4. Giá trị hiện tại của field đó **trùng** giá trị server đã trả. Nếu GV đã gõ sửa field (chưa lưu), offset có thể lệch, nên **bỏ gạch chân của field đó** nhưng **giữ chip và tóm tắt**.

### 2.7 JSON ví dụ (`GET /plans/:id`)

Id và offset dưới đây tính đúng theo thuật toán của PR (`postgenWarningId`, `activityBlock`) trên dữ liệu mẫu.

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
        "id": "c8ef9d1fce6c6ff0",
        "location": { "kind": "activity", "index": 1 },
        "category": "so_lieu",
        "ruleCode": "R4",
        "span": { "field": "activity", "start": 261, "end": 350 }
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
Kết quả trên UI: tóm tắt "Nên soát lại số liệu ở **Hoạt động 2** và nội dung ở **Hoạt động 3**". Phẩm chất đã soát nên bị lọc. HĐ2 có chip và gạch chân: offset 261 thuộc `content` (tiền tố tới `content` dài 181, vậy offset trong `content` là 80). HĐ3 chỉ có chip vì không có `span`.

### 2.8 Sau revise (`POST /jobs/revise-plan`, body `{ lessonPlanId, version, instructions }`)

Theo `process.ts` → `runRevisePlan`, BE làm như sau:
- `carryOverWarnings(head, next, head.postgenWarnings ?? [])` so **fingerprint** từng hoạt động hoặc mục. Fingerprint là `activityBlock` + các `subActivityBlock`, đã gộp khoảng trắng. Tên hoạt động và `durationMinutes` **không** nằm trong fingerprint.
- Hoạt động không đổi: giữ cảnh báo, giữ nguyên `id`, `span` và `acknowledgedAt`.
- Hoạt động đổi, hoặc chỉ số không còn: bỏ cảnh báo, log `postgen_warning_cleared_by_edit`.
- Phiên bản mới **không** được chạy lại R1–R4 (AC S5, ghi chú phạm vi). Revise không bao giờ thêm cảnh báo mới.
- Bị bỏ hết thì phiên bản mới không có field `postgenWarnings`.

FE: khi job revise xong, đọc `result.postgenWarnings` (hoặc `GET /plans/:id`) rồi tính lại. Nếu số nhắc mở giảm từ > 0 xuống 0 **trong phiên làm việc này** thì hiện dòng "Đã soát xong các chỗ được nhắc" (§4.4).

---

## 3. Luật sinh copy

### 3.1 Chuẩn hoá và nhóm

1. `open = postgenWarnings.filter(w => !w.acknowledgedAt && locationHợpLệ(w))`
2. **Nhóm** theo `(location, category)`. Mỗi nhóm là **một "chỗ"**, **một chip** và **một nút "Đã soát"**. Bấm nút thì ack **mọi** `id` còn mở trong nhóm. Nhiều span trong cùng nhóm thì gạch chân từng span.
3. Sắp xếp loại theo thứ tự `so_lieu` → `noi_dung` → `cau_chu`. Trong một loại, hoạt động đứng trước (index tăng dần), sau đó tới mục theo thứ tự giáo án: Kiến thức, Năng lực, Phẩm chất, Thiết bị dạy học và học liệu, Điều chỉnh sau bài dạy.

### 3.2 Nối vị trí (hàm `joinVa`, giữ đúng theo prototype)

- 1 phần tử: `A`
- 2 phần tử: `A và B`
- 3 phần tử trở lên: `A, B và C` (dấu phẩy, "và" trước phần tử cuối, không có dấu phẩy trước "và")

**Cụm vị trí của một loại** (`locPhrase`):
- Hoạt động: phần tử đầu ghi đầy đủ `Hoạt động n`, các phần tử sau **chỉ ghi số** (`2 và 3`, `2, 3 và 4`).
- Mục: `mục ` + joinVa(tên mục), ví dụ `mục Phẩm chất`, `mục Kiến thức và Phẩm chất`.
- Có cả hoạt động và mục: `[cụm hoạt động] và [cụm mục]` (đúng như prototype, xem Q-BA2).

**Câu tóm tắt:** `"Nên soát lại " + joinVa( các nhóm theo loại: "<từ loại> ở <cụm vị trí>" )`

### 3.3 Bảng ví dụ (thước đo khi test)

| Nhắc còn mở (vị trí · loại) | Tiêu đề tóm tắt | Chip | Home | Xuất file |
| --- | --- | --- | --- | --- |
| HĐ2 · số liệu | Nên soát lại số liệu ở Hoạt động 2 | HĐ2: Nên soát số liệu | Nên soát số liệu · HĐ2 | Còn 1 chỗ nên soát ở Hoạt động 2 · Xem lại |
| HĐ2, HĐ3 · số liệu | Nên soát lại số liệu ở Hoạt động 2 và 3 | HĐ2, HĐ3: Nên soát số liệu | Nên soát 2 chỗ · HĐ2, HĐ3 | Còn 2 chỗ nên soát ở Hoạt động 2 và 3 · Xem lại |
| HĐ2, HĐ3, HĐ4 · số liệu | Nên soát lại số liệu ở Hoạt động 2, 3 và 4 | 3 chip "Nên soát số liệu" | Nên soát 3 chỗ · HĐ2, HĐ3, HĐ4 | Còn 3 chỗ nên soát ở Hoạt động 2, 3 và 4 · Xem lại |
| HĐ2 số liệu + HĐ3 nội dung | Nên soát lại số liệu ở Hoạt động 2 và nội dung ở Hoạt động 3 | HĐ2 số liệu; HĐ3 nội dung | Nên soát 2 chỗ · HĐ2, HĐ3 | Còn 2 chỗ nên soát ở Hoạt động 2 và 3 · Xem lại |
| HĐ2 số liệu + Phẩm chất câu chữ | Nên soát lại số liệu ở Hoạt động 2 và câu chữ ở mục Phẩm chất | HĐ2 số liệu; Phẩm chất câu chữ | Nên soát 2 chỗ · HĐ2, Phẩm chất | Còn 2 chỗ nên soát ở Hoạt động 2 và mục Phẩm chất · Xem lại |
| Phẩm chất · câu chữ | Nên soát lại câu chữ ở mục Phẩm chất | Nên soát câu chữ | Nên soát câu chữ · Phẩm chất | Còn 1 chỗ nên soát ở mục Phẩm chất · Xem lại |
| HĐ2 số liệu + HĐ3 nội dung + Phẩm chất câu chữ | Nên soát lại số liệu ở Hoạt động 2, nội dung ở Hoạt động 3 và câu chữ ở mục Phẩm chất | 3 chip | Nên soát 3 chỗ · HĐ2, HĐ3, Phẩm chất | Còn 3 chỗ nên soát ở Hoạt động 2 và 3 và mục Phẩm chất · Xem lại (luật prototype, xem Q-BA2) |
| HĐ2 số liệu + HĐ2 nội dung | Nên soát lại số liệu ở Hoạt động 2 và nội dung ở Hoạt động 2 | HĐ2: 2 chip | Nên soát 2 chỗ · HĐ2 | Còn 2 chỗ nên soát ở Hoạt động 2 · Xem lại |
| HĐ2 · số liệu, không có span | Nên soát lại số liệu ở Hoạt động 2 | chip, không gạch chân | Nên soát số liệu · HĐ2 | Còn 1 chỗ nên soát ở Hoạt động 2 · Xem lại |
| 0 nhắc mở (lúc tải trang) | (không hiện gì) | – | (không có dòng phụ) | (không có dòng) |
| từ ≥1 xuống 0 trong phiên | Đã soát xong các chỗ được nhắc (khoảng 4 giây rồi mất) | – | – | – |

Quy tắc Home và Xuất file:
- **Home:** đúng 1 chỗ thì `Nên soát {từ loại} · {tên ngắn}`. Từ 2 chỗ trở lên thì `Nên soát {N} chỗ · {các tên ngắn, không trùng, nối bằng ", "}`.
- **Xuất file:** `Còn {N} chỗ nên soát ở {cụm vị trí không trùng, không có loại, không link}` + ` · ` + nút `Xem lại`. Cụm vị trí dùng cùng luật §3.2, ví dụ "Hoạt động 2 và mục Phẩm chất".
- `N` = số nhóm `(location, category)` còn mở.

### 3.4 Copy cố định (nguyên văn)

| Vị trí | Copy |
| --- | --- |
| Dòng phụ dưới tiêu đề tóm tắt | Hệ thống đã tự kiểm tra và còn chỗ chưa chắc chắn. Thầy cô xem nhanh trước khi dùng. |
| Nút | Đã soát |
| Tooltip / mô tả của câu gạch chân | Nên soát lại câu này |
| Soát xong | Đã soát xong các chỗ được nhắc |
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
- **Thiếu dữ liệu:** `GET /jobs` không trả cảnh báo (Q-BE1). Chưa có field thì không hiện dòng phụ.

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
 Lưu chỉnh tay (chưa có)    → khi có: như revise (ticket riêng)
```

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
| Bấm "Đã soát" | Nút `disabled` + `aria-busy`. Gọi ack cho mọi id của nhóm (song song). Thành công thì bỏ chip và gạch chân của nhóm, tính lại tóm tắt, Home và Xuất file. Focus chuyển về khung hoạt động hoặc mục đó (`tabindex=-1`, `preventScroll`) để không mất focus. Hết nhắc thì sang `done`. |
| Gõ sửa trong field được nhắc | **Không đổi trạng thái nhắc.** Chỉ bỏ gạch chân của field vừa sửa (offset có thể lệch, §2.6 điều 4). Chip và tóm tắt giữ nguyên. |
| Revise xong | Tính lại từ `postgenWarnings` mới. Không toast mới. Hết nhắc thì sang `done`. |
| Bấm hàng Home có dòng phụ | Mở editor và focus dòng tóm tắt. |
| "Xem lại" ở Xuất file | Như trên. |
| Tải Word/PDF | Không đổi gì. |

---

## 7. Khả năng tiếp cận (WCAG 2.1 AA)

1. **`role="note"`** cho dòng tóm tắt, `aria-labelledby` trỏ tới tiêu đề. Không dùng `role="alert"`, không tự đọc lúc tải trang.
2. **Bàn phím:** mọi link vị trí và nút "Đã soát" là `<button>` thật, Tab tới được theo thứ tự DOM, Enter/Space kích hoạt. Không có bẫy focus.
3. **Focus-visible:** `outline:2px solid #2563EB; outline-offset:2px; border-radius:4px` (tương phản 5.17:1 trên nền trắng). Khung tóm tắt có `tabindex=-1`: `:focus` không outline, `:focus-visible` có outline.
4. **aria-live:** một vùng `role="status" aria-live="polite"` ẩn (`sr-only`) luôn có trong DOM. Chỉ đẩy "Đã soát xong các chỗ được nhắc" vào đó.
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
| E3 | `span` thiếu, sai kiểu, `start ≥ end`, vượt độ dài, vắt qua hai field, dính nhãn, `field` lạ | Chỉ hiện chip, không gạch chân. |
| E4 | GV gõ sửa field có gạch chân (chưa lưu) | Bỏ gạch chân của field đó. Chip và tóm tắt giữ nguyên. Tải lại thì text server về như cũ và gạch chân quay lại. |
| E5 | `category` lạ | Coi như `noi_dung`, `console.warn` (Q-BA1). |
| E6 | `location` lạ hoặc ngoài phạm vi | Bỏ qua, `console.warn` (Q-BE4). |
| E7 | Nhiều cảnh báo cùng `(location, category)` | Một chip, gạch chân từng span. "Đã soát" ack tất cả id trong nhóm. |
| E8 | Hai loại ở cùng một hoạt động | Hai chip trong cùng hàng, theo thứ tự loại. Tóm tắt lặp lại vị trí (xem bảng §3.3). |
| E9 | Cảnh báo nằm trong hoạt động con | Chip ở hoạt động cha, gạch chân trong hoạt động con k. |
| E10 | Hoạt động đang thu gọn | Chip vẫn thấy. Bấm link thì hoạt động mở ra. |
| E11 | Job `flagged` (SGK) và có nhắc | Banner flagged và dòng tóm tắt cùng hiện. Home: badge "Cần xem lại", dòng phụ vẫn có. |
| E12 | Job `blocked` | Không có nội dung giáo án, nên không hiện nhắc. |
| E13 | Ack bị 404 | Tải lại `GET /plans/:id` rồi render lại. |
| E14 | Ack lỗi mạng hoặc 5xx | Giữ chip, bật lại nút. Không toast (Q-UX1). |
| E15 | Ack một phần trong nhóm nhiều id bị lỗi | Giữ chip với các id còn mở. Bấm lại chỉ gửi các id đó. |
| E16 | Revise bỏ hết nhắc | Hiện "Đã soát xong…" nếu đang ở editor lúc job xong. |
| E17 | Revise viết lại gần như cả giáo án (instructions chung) | Mọi hoạt động đổi fingerprint, nên mọi nhắc đều mất, kể cả chỗ GV chưa xem (Q-BA4). |
| E18 | Đang xem phiên bản cũ | Ẩn "Đã soát" (ack chỉ tác động lên head). Chỉ đọc. |
| E19 | `check_error` ở BE | `postgenWarnings` rỗng, không có nhắc (đường lỗi hiếm, đã có log). |
| E20 | Nhiều tab | Tab kia chỉ cập nhật khi focus lại hoặc tải lại (đọc từ server). |

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
| C15 | Home: badge "Đã soạn" + dòng phụ đúng dạng. Guardrail SGK thì badge "Cần xem lại" và dòng phụ vẫn hiện | Copy 5 |
| C16 | Xuất file: "Còn N chỗ nên soát ở … · Xem lại" (chỉ vị trí, không loại). "Xem lại" focus vào tóm tắt | Copy 6 |
| C17 | Không có toast mới, không nhắc hạn mức hay lượt | Q2, S6 |
| C18 | Quét copy: không có từ cấm (§3.4) | Copy 3 + quy ước sản phẩm |
| C19 | 375px: vùng chạm ≥ 44px, không tràn ngang, khớp ảnh `mobile-*` | thiết kế đã duyệt |
| C20 | Bàn phím + trình đọc màn hình: đi hết vòng Tab tóm tắt → chip → "Đã soát", focus không mất sau ack | thiết kế đã duyệt |

---

## 11. Câu hỏi mở

**Cho BE (PR #24)**
- **Q-BE1 (chặn Home).** `GET /jobs` (`RecentJobSummary`) không có thông tin cảnh báo, nên Home không hiện được "Nên soát … · HĐ2" nếu không gọi `GET /plans/:id` cho từng hàng. Đề nghị BE thêm một field tóm tắt cảnh báo còn mở vào mỗi item (tên field do BE chọn), gồm số chỗ, `category` và `location` không trùng. Có được không, và làm trong PR #24 hay ticket khác?
- **Q-BE2.** `span.field = "activity"` / `"subActivities.{k}"` là offset trên chuỗi tổng hợp `activityBlock`, không phải field thật. FE phải chép lại định dạng nhãn, nên BE đổi nhãn là gãy. Đề nghị BE trả `span.field` là đường dẫn field thật (ví dụ `content`, `organization.assignTask`, `subActivities.0.products`) kèm offset trong field đó, hoặc export hàm `activityBlock`/segment từ `@giaoan/shared`. Nếu giữ nguyên, BE cam kết giữ định dạng và báo trước khi đổi.
- **Q-BE3.** Với field mảng (`objectives.*`, `teachingAids`), xác nhận offset tính trên `join("\n")` là hợp đồng lâu dài.
- **Q-BE4.** Có thể phát sinh `location.kind` hoặc `key` khác 5 key hiện có không? FE đang bỏ qua giá trị lạ.
- **Q-BE5.** Ack chỉ tác động lên head. Nếu GV mở bản cũ, FE đang ẩn "Đã soát". Có muốn cho ack trên bản cũ không?
- **Q-BE6.** `revisePlan` của stub (`apps/api/src/ai/stub.ts`) trả `{ ...plan, … }`, tức là mang theo `postgenWarnings` của head. Trong `runRevisePlan`, khi `carried.kept` rỗng thì `saved = next`, nên trên stub các cảnh báo đáng lẽ đã bị bỏ vẫn lọt sang phiên bản mới. Bản Grok dựng plan mới nên không bị. Đề nghị BE luôn đặt hoặc bỏ `postgenWarnings` một cách tường minh theo `carried.kept`, để FE test trên stub cho đúng.
- **Q-BE7.** PR #24 còn draft. Khi merge có đổi tên field nào không? FE sẽ code theo `@giaoan/shared` của nhánh `cursor/postgen-check-repair` @ `becaec0`.

**Cho BA / Huy**
- **Q-BA1.** `category` lạ: đang hiện như "nội dung". Hay nên ẩn?
- **Q-BA2.** Copy khi một loại có ≥ 2 hoạt động **và** có thêm loại khác, hoặc có cả hoạt động và mục. Theo luật đã duyệt, câu sẽ là "Nên soát lại số liệu ở Hoạt động 2 và 3 và câu chữ ở mục Phẩm chất" (hai chữ "và"). Giữ như vậy, hay đổi dấu nối giữa các loại thành dấu phẩy, ví dụ "…Hoạt động 2 và 3, câu chữ ở mục Phẩm chất"? Tương tự ở Xuất file: "Còn 3 chỗ nên soát ở Hoạt động 2 và 3 và mục Phẩm chất". Đề xuất gộp hoạt động và mục thành một danh sách: "ở Hoạt động 2, 3 và mục Phẩm chất". FE làm theo luật của prototype đã duyệt cho tới khi có quyết định.
- **Q-BA3.** Khi có tính năng lưu chỉnh tay: AC v2.1 nói "áp cùng quy tắc". Theo `carryOverWarnings`, **bất kỳ** thay đổi nào trong hoạt động đều xoá mọi nhắc của hoạt động đó, kể cả khi GV sửa chỗ khác. Chấp nhận?
- **Q-BA4.** Revise với yêu cầu chung thường viết lại cả giáo án, nên fingerprint mọi hoạt động đổi và mọi nhắc mất, trong khi bản mới không được chạy lại R1–R4. Chấp nhận rủi ro này cho MVP?
- **Q-BA5.** "Chỗ" ở Home và Xuất file đang đếm theo nhóm `(vị trí, loại)`: 2 loại ở HĐ2 là "2 chỗ · HĐ2". Hay đếm theo vị trí?

**Cho UX (tôi)**
- **Q-UX1.** Ack lỗi mạng: hiện chỉ giữ chip và bật lại nút, không có copy báo lỗi (không thêm toast, tránh chữ "lỗi"). Nếu cần sẽ bổ sung một dòng nhỏ cạnh chip, gửi Huy duyệt riêng.

---

## 12. Ghi chú cài đặt (gợi ý)

- Hàm thuần (có unit test): `openWarnings(plan)`, `groupWarnings(open)`, `summaryParts(groups)` (trả mảng text + link để render), `homeHint(groups)`, `exportLine(groups)`, `resolveSpan(plan, warning, currentFields)`. Test bằng đúng bảng §3.3 và các span sai ở E3.
- Component: `ReviewSummaryNote`, `ReviewChipRow`, `ReviewUnderlineTextarea` (backdrop), `ReviewHint`, `ReviewExportLine`, và một vùng `aria-live` dùng chung trong editor.
- API client: `ackPostgenWarning(planId, warningId)` → `POST /plans/${planId}/warnings/${warningId}/ack`.
- Không đụng `lib/wait-copy.ts` / toast xong.

---

## 13. Ảnh chụp và URL prototype

Ảnh chụp từ prototype đã cập nhật bằng headless Chrome (1280×800 desktop; 375×812 @2x mobile; `&embed=1` để ẩn panel review). URL prototype nên mở kèm `&embed=1` nếu muốn ẩn panel Demo.

Gốc ảnh: `https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/`
Gốc prototype: `https://lequanghuy.github.io/giaoan-review-note-proto/`

| Trạng thái | Ảnh | Prototype |
| --- | --- | --- |
| 1 chỗ · số liệu · HĐ2 (tóm tắt) | [desktop-one.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-one.png) | [?state=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one) |
| 1 chỗ: chip + gạch chân tại HĐ2 | [desktop-one-chip.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-one-chip.png) | [?state=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one) (cuộn tới HĐ2) |
| 2 loại · HĐ2 số liệu + HĐ3 nội dung | [desktop-two.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-two.png) | [?state=two](https://lequanghuy.github.io/giaoan-review-note-proto/?state=two) |
| 3 vị trí · "Hoạt động 2, 3 và 4" | [desktop-three.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-three.png) | [?state=three](https://lequanghuy.github.io/giaoan-review-note-proto/?state=three) |
| Nhiều loại · HĐ2 + mục Phẩm chất | [desktop-mixed.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-mixed.png) | [?state=mixed](https://lequanghuy.github.io/giaoan-review-note-proto/?state=mixed) |
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
| Home · 1 chỗ + hàng guardrail "Cần xem lại" | [desktop-home.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-home.png) | [?state=home&plan=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=home&plan=one) |
| Home · dạng đếm "Nên soát 2 chỗ · HĐ2, HĐ3" | [desktop-home-two.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-home-two.png) | [?state=home&plan=two](https://lequanghuy.github.io/giaoan-review-note-proto/?state=home&plan=two) |
| Xuất file · 1 chỗ | [desktop-export.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-export.png) | [?state=export&plan=one](https://lequanghuy.github.io/giaoan-review-note-proto/?state=export&plan=one) |
| Xuất file · HĐ2 + mục Phẩm chất | [desktop-export-mixed.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-export-mixed.png) | [?state=export&plan=mixed](https://lequanghuy.github.io/giaoan-review-note-proto/?state=export&plan=mixed) |
| Ghi chú thiết kế (panel) | [desktop-design-notes.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/desktop-design-notes.png) | [?state=one&notes=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one&notes=1) |
| Mobile 375 · `one` đầu trang | [mobile-one-top.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-one-top.png) | [?state=one&embed=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one&embed=1) (khung 375) hoặc [?state=one&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one&mobile=1) |
| Mobile 375 · `one` tóm tắt | [mobile-one.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-one.png) | như trên |
| Mobile 375 · `one` chip + gạch chân | [mobile-one-chip.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-one-chip.png) | như trên |
| Mobile 375 · `mixed` | [mobile-mixed.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-mixed.png) | [?state=mixed&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=mixed&mobile=1) |
| Mobile 375 · chỉ chip | [mobile-nopos-chip.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-nopos-chip.png) | [?state=nopos&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=nopos&mobile=1) |
| Mobile 375 · soát xong | [mobile-done-message.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-done-message.png) | [?state=one&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=one&mobile=1) → "Đã soát" |
| Mobile 375 · Home | [mobile-home.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-home.png) | [?state=home&plan=two&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=home&plan=two&mobile=1) |
| Mobile 375 · Xuất file | [mobile-export.png](https://lequanghuy.github.io/giaoan-review-note-proto/spec/shots/mobile-export.png) | [?state=export&plan=one&mobile=1](https://lequanghuy.github.io/giaoan-review-note-proto/?state=export&plan=one&mobile=1) |

Tooltip "Nên soát lại câu này" trong prototype là `title` gốc của trình duyệt, headless Chrome không chụp được. Hành vi tooltip khi focus trong sản phẩm theo §4.3 và §7.5.
