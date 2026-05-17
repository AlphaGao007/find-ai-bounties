# Feishu Bitable Schema

Use four flat tables. Keep headers stable so users can import/update Feishu Bitable reliably.

## 任务日历

Headers:

```text
任务ID,任务名称,主办方/平台,来源大类,类型,方向标签,当前状态,行动优先级,报名开始时间,报名截止时间,提交截止时间,评审/决赛时间,奖金/奖池,单项最高奖励,适合AI辅助程度,推荐参与方式,参与门槛,官方链接,公告/规则链接,信息来源,最近核验时间,可信度,风险/注意事项,备注
```

Guidance:

- `任务ID`: stable ID. Prefer official IDs, e.g. `DF-1165`, `TIANCHI-532467`, `CNVD-801`, `TCH-41`.
- `当前状态`: use `可报名`, `今日截止`, `长期开放`, or `待人工确认`. Avoid `已截止` in the task calendar.
- `报名截止时间`: signup deadline only.
- `提交截止时间`: deliverable/submission deadline. Can differ from signup deadline.
- `报名开始时间`, `报名截止时间`, `提交截止时间`: must be treated as date/datetime fields in delivered artifacts. Use exact values like `2026-06-20 23:59` in CSV, true Excel date/datetime cells in XLSX, and Feishu Bitable `DateTime` fields (`type=5`, `date_formatter="yyyy-MM-dd HH:mm"`) when importing/creating Bitable tables.
- `评审/决赛时间`: non-actionable schedule notes.
- `可信度`: `官方明确`, `官方但日期不全`, `长期入口`, or `待人工确认`.
- `风险/注意事项`: include authorization, eligibility, login, copyright, data-use, or deadline caveats.

## 来源监控

Headers:

```text
来源ID,来源名称,所属主体,来源类型,覆盖类型,官网/入口,监控页,检查频率,是否需要登录,是否有RSS/API,最近检查时间,推荐抓取方式,可信度,备注
```

Use one row per platform/source, not one row per task. Include sources with zero current tasks if they are strategically important and need future monitoring.

## 补全记录

Headers:

```text
记录ID,来源,本轮处理,新增/修正数量,纳入规则,剔除规则,代表链接,最近核验时间,备注
```

Use this table to explain why the current refresh differs from a prior version. Record source-specific fixes such as "DataFountain allowed but expired excluded" or "Tencent signEnd corrected".

## 字段说明

Headers:

```text
项目,说明
```

Include concise operational definitions: status, priority, expiration filter, date conventions, recommended Feishu views, and safety reminders.

## Suggested Views

Create or suggest these views after import:

- `可报名任务`: `当前状态` is `可报名` or `今日截止`.
- `7天内截止`: `报名截止时间` or `提交截止时间` within 7 days.
- `AI安全赏金`: `来源大类` contains `安全赏金` or `类型` contains `安全`.
- `算法竞赛`: `来源大类` contains `算法竞赛`.
- `AI应用/黑客松`: `类型` contains `应用` or `黑客松` or `Agent`.
- `长期赏金入口`: `当前状态` is `长期开放`.
- `待人工确认`: `可信度` is `待人工确认` or `官方但日期不全`.

## Delivery Files

When possible, deliver:

- `国内AI赏金奖励任务日历_v{n}_{YYYY-MM-DD}.xlsx`
- `任务日历_v{n}.csv`
- `来源监控_v{n}.csv`
- `补全记录_v{n}.csv`
- Optional rendered previews for visual QA.

## Date Field Delivery Requirements

The task calendar has three operational date fields:

```text
报名开始时间,报名截止时间,提交截止时间
```

Delivery rules:

- **CSV**: keep the human-readable canonical format `YYYY-MM-DD HH:mm` (or blank when unknown). CSV has no native date type, so this is the transfer format.
- **XLSX**: these three columns must be actual spreadsheet date/datetime cells, not text cells. Recommended display format: `yyyy-mm-dd hh:mm`.
- **Feishu Bitable**: these three columns must be DateTime fields: `type=5`, `ui_type=DateTime`, with `property.date_formatter="yyyy-MM-dd HH:mm"` and `auto_fill=false`.
- If using all-text fields for initial low-risk import, immediately convert these three fields to DateTime before final delivery, and re-check that sorting/filtering by date works.
- Include date-format verification in the final summary.
