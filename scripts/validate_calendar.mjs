#!/usr/bin/env node
import fs from "node:fs";

const requiredTaskHeaders = [
  "任务ID",
  "任务名称",
  "主办方/平台",
  "来源大类",
  "类型",
  "方向标签",
  "当前状态",
  "行动优先级",
  "报名截止时间",
  "提交截止时间",
  "官方链接",
  "最近核验时间",
  "可信度",
  "风险/注意事项",
];

const operationalDateHeaders = ["报名开始时间", "报名截止时间", "提交截止时间"];

function usage() {
  console.error("Usage: validate_calendar.mjs <任务日历.csv> [--as-of YYYY-MM-DD]");
  process.exit(2);
}

const args = process.argv.slice(2);
if (!args[0] || args[0].startsWith("--")) usage();

let asOfLabel = new Date().toISOString().slice(0, 10);
let asOf = new Date(`${asOfLabel}T00:00:00+08:00`);
for (let i = 1; i < args.length; i += 1) {
  if (args[i] === "--as-of" && args[i + 1]) {
    asOfLabel = args[i + 1];
    asOf = new Date(`${args[i + 1]}T00:00:00+08:00`);
    i += 1;
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const input = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    const next = input[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cellValue) => cellValue !== ""));
}

function parseDate(value) {
  const match = String(value || "").match(/(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?/);
  if (!match) return null;
  const [, y, m, d, hh = "23", mm = "59"] = match;
  return new Date(`${y}-${m}-${d}T${hh}:${mm}:00+08:00`);
}

const csvPath = args[0];
const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
if (rows.length < 1) {
  console.error("No rows found.");
  process.exit(1);
}

const [headers, ...dataRows] = rows;
const missingHeaders = requiredTaskHeaders.filter((header) => !headers.includes(header));
const objects = dataRows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));

const duplicateIds = [];
const seen = new Set();
for (const item of objects) {
  const id = item["任务ID"];
  if (!id) continue;
  if (seen.has(id)) duplicateIds.push(id);
  seen.add(id);
}

const badStatuses = objects.filter((item) => /已截止|复盘参考|近30天结束/.test(item["当前状态"] || ""));
const badDateFormatRows = objects.flatMap((item) =>
  operationalDateHeaders
    .filter((header) => item[header] && !parseDate(item[header]))
    .map((header) => ({ id: item["任务ID"], field: header, value: item[header] })),
);
const expiredRows = objects.filter((item) => {
  if (/长期开放/.test(item["当前状态"] || "")) return false;
  const deadline = parseDate(item["报名截止时间"] || item["提交截止时间"]);
  return deadline ? deadline < asOf : false;
});

const missingIds = objects.filter((item) => !item["任务ID"] || !item["任务名称"]);
const summary = objects.reduce(
  (acc, item) => {
    const id = item["任务ID"] || "";
    if (id.startsWith("DF-")) acc.dataFountain += 1;
    else if (id.startsWith("TIANCHI-")) acc.tianchi += 1;
    else if (id.startsWith("CNVD-")) acc.cnvd += 1;
    else if (id.startsWith("TCH-")) acc.tencentHackathon += 1;
    else if (/长期开放/.test(item["当前状态"] || "")) acc.longTerm += 1;
    else acc.other += 1;
    return acc;
  },
  { dataFountain: 0, tianchi: 0, cnvd: 0, tencentHackathon: 0, longTerm: 0, other: 0 },
);

const result = {
  file: csvPath,
  asOf: asOfLabel,
  taskRows: objects.length,
  missingHeaders,
  duplicateIds,
  missingIds: missingIds.map((item) => item["任务ID"] || item["任务名称"] || "(blank)"),
  badStatusRows: badStatuses.map((item) => item["任务ID"]),
  badDateFormatRows,
  expiredRows: expiredRows.map((item) => ({
    id: item["任务ID"],
    name: item["任务名称"],
    signupDeadline: item["报名截止时间"],
    submissionDeadline: item["提交截止时间"],
  })),
  counts: summary,
};

console.log(JSON.stringify(result, null, 2));

if (missingHeaders.length || duplicateIds.length || missingIds.length || badStatuses.length || badDateFormatRows.length || expiredRows.length) {
  process.exit(1);
}
