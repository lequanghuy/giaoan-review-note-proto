# Checklist ui-ux-pro-max (mockup)

| Check | Result |
|---|---|
| Contrast text (g800 on g50 / white) | Pass — token hiện tại ≥4.5:1 (cùng app) |
| Touch ≥44 | Pass trên tab/btn/Thử lại/Về danh sách (820); demo chrome nút 36px chỉ điều khiển mockup |
| CLS / reserved layout | Pass — tab + tên HĐ cố định + khung thân trước data |
| Reduced motion | Pass — `html.rm` → `::after` animation `none`; spinner tĩnh |
| Focus / aria | Pass — `aria-busy`, `role=status` live-region; error `role=alert` + focus `#errTitle` |
| Loading Indicators (no flash) | Spec: 300ms delay option + min 500ms; row feedback 0ms |
| Content Jumping | Shell giữ geometry khi ready |
| Không dark mode | Pass |
