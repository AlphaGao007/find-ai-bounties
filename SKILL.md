---
name: find-ai-bounties
description: Find, verify, normalize, and package current domestic and international AI bounty, reward, hackathon, algorithm competition, AI security crowdsourcing, SRC bug bounty, and open-source reward tasks. Use when Codex is asked to discover latest AI-related bounty/reward opportunities, maintain a Feishu Bitable/Airtable-style calendar, refresh expired opportunities, distinguish domestic vs international tasks, compare sources such as DataFountain/Tianchi/CNVD/Tencent/Huawei/Alibaba/ByteDance/ML Contests/CompeteHub/BBRadar/Huntr, or produce CSV/XLSX tables for other agents to consume.
---

# Find AI Bounties

## Operating Rule

Always treat this as a freshness-sensitive research task. Browse or otherwise re-verify official pages/APIs before claiming a task is current. Do not rely on cached model knowledge or old workbook rows.

Use the user's current date and timezone. If unavailable, get the date first. A task is eligible for the task calendar only if it is one of:

- Current: signup or submission deadline is today or later.
- Long-term: an official bounty/SRC/reward program is standing and currently accepts submissions.
- Explicitly current but date-missing: official page says open now; mark `待人工确认` and explain the missing date.

Exclude tasks whose signup/submission deadline is before the as-of date, even if the page still shows `可报名`, `allowed`, or similar. Distinguish signup deadline, submission deadline, and event end date; do not use event end as signup deadline.

## Workflow

1. Define scope and date.
   - Default scope: domestic sources plus international official platforms and source-of-sources, all AI-related bounty/reward categories.
   - Default categories: algorithm competitions, AI application/hackathon tasks, AI security crowdsourcing, SRC/bug bounty, open-source issue rewards, developer challenges.
   - Record the as-of date/time in every table.
   - Add `地域范围` to task and source tables. Use only `国内`, `国际`, or `待确认`. Treat globally open or overseas aggregator opportunities as `国际`.

2. Sweep sources from official pages first.
   - Load `references/source-registry.md` for seed URLs, known APIs, and source-specific traps.
   - Use official pages, official APIs, or logged-in browser sessions when necessary.
   - For dynamic sites, inspect page data/API calls instead of only reading visible homepage cards.

3. Normalize into Feishu-ready flat tables.
   - Load `references/feishu-bitable-schema.md` for the 4-table schema.
   - Keep each row self-contained. Avoid merged cells, nested JSON, or multi-row notes.
   - Use concrete dates like `2026-06-20 23:59`; do not write vague relative dates without an exact date.
   - Treat `报名开始时间`, `报名截止时间`, and `提交截止时间` as real date/datetime fields, not plain text, when exporting to XLSX or importing to Feishu Bitable.
   - For aggregator/source-of-sources rows, do not create task rows until the underlying official opportunity is verified. Keep the aggregator in `来源监控` and cite it as a discovery source.

4. Deduplicate carefully.
   - Use official IDs when available: DataFountain competition ID, Tianchi raceId, CNVD project id, Tencent contest id.
   - If a source has both an aggregate page and per-track pages, keep track rows as tasks and mention the aggregate page in notes/rules link.
   - If multiple cards point to the same raceId/project id, keep one row.

5. Classify confidence and priority.
   - `官方明确`: official page gives status and deadline/reward.
   - `官方但日期不全`: official page confirms existence but lacks a key date.
   - `长期入口`: standing bounty/reward source, not a dated task.
   - `待人工确认`: a credible lead needs login/manual confirmation.
   - Use `P0` for immediate deadlines, `P1` for high-value or near-term work, `P2` for normal scheduling/long-term monitoring, `P3` for lower-value or uncertain leads.

6. Verify before delivery.
   - Run `scripts/validate_calendar.mjs <任务日历.csv> --as-of YYYY-MM-DD`.
   - Confirm no expired dated rows, no duplicate `任务ID`, no missing required headers, and no `已截止/复盘参考` task rows.
   - Confirm every task row has a valid `地域范围` value.
   - If exporting XLSX, inspect or render the workbook enough to confirm all 4 sheets exist and table headers are visible, and confirm the three deadline columns are true Excel date/datetime cells.
   - If creating Feishu Bitable directly, create/update the three deadline columns as DateTime fields (`type=5`, `date_formatter="yyyy-MM-dd HH:mm"`) before delivery.

## Output Contract

Produce these 4 Feishu Bitable-compatible tables:

- `任务日历`: one row per actionable task or long-term reward program.
- `来源监控`: one row per source/platform to monitor.
- `补全记录`: what was added, corrected, excluded, and why.
- `字段说明`: compact definitions and import/view suggestions.

For each refresh, summarize:

- Total task rows and source rows.
- Counts by major source, especially DataFountain, Tianchi, CNVD, Tencent/Huawei/Alibaba/ByteDance.
- Counts by `地域范围`: `国内`, `国际`, and `待确认`.
- Expired-row check result.
- Important exclusions, especially pages that still show open status despite expired dates.
- Date-format verification: confirm whether XLSX and/or Feishu Bitable date columns are real date/datetime fields.

## Source And Schema References

- Use `references/source-registry.md` when deciding what to search and how to avoid source-specific misses.
- Use `references/feishu-bitable-schema.md` when building CSV/XLSX output.
- Use `scripts/validate_calendar.mjs` after creating or editing `任务日历.csv`.

## Safety Notes

For security bounty/SRC rows, never suggest testing outside the authorized scope. AI can assist with triage, report drafting, code reading, and test planning, but every vulnerability report must be manually reproduced and verified before submission.
