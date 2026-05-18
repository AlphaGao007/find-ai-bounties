# Find CN AI Bounties

一个可复用的 agent skill，用来查找、核验、整理国内与国际 AI 赏金/奖励任务，并输出适合导入飞书多维表格的任务日历。

## 能做什么

- 搜索并核验国内与国际 AI 相关赏金、奖励、算法赛、黑客松、AI 安全众测、SRC 漏洞奖励、开源悬赏任务。
- 纳入国际 AI 竞赛/黑客松/安全赏金聚合源，并用 `地域范围` 区分 `国内`、`国际`、`待确认`。
- 优先使用官方页面、官方接口或已登录页面，避免只看首页卡片导致漏项。
- 过滤“页面显示可报名但日期已过”的任务。
- 区分报名截止、提交截止和活动结束时间。
- 输出 4 张飞书多维表格适配表：任务日历、来源监控、补全记录、字段说明。
- 提供校验脚本，检查过期任务、重复 ID、缺字段和错误状态。

## 适用场景

当你想让 agent 做这些事情时，可以使用这个 skill：

```text
Use $find-cn-ai-bounties to build a current Feishu Bitable-ready calendar of domestic and international AI bounty and reward tasks.
```

也适合这些需求：

- 更新国内与国际 AI 赏金任务日历
- 补全 DataFountain、天池、CNVD、腾讯、华为、阿里、字节、ML Contests、AI赛事通、BBRadar、Huntr 等来源
- 检查已有任务表里哪些已经过期
- 生成可导入飞书多维表格的 CSV/XLSX
- 给其他 agent 一个统一的数据抓取和清洗口径

## 安装

把这个仓库放到你的 agent 支持的 skills 目录或等价插件目录下即可。不同 agent 的目录名可能不同，关键是让它能读取仓库里的 `SKILL.md`。

给 agent 的安装提示词：

```text
请安装这个 skill：https://github.com/AlphaGao007/find-cn-ai-bounties 。把仓库克隆到你当前运行环境的 skills 目录或等价的 agent skill/plugin 目录，确认能读取 SKILL.md 后，在需要查找、核验、更新国内与国际 AI 赏金奖励任务日历时使用 $find-cn-ai-bounties。
```

如果你的 agent 使用本地 skills 目录，可以这样放置：

```bash
cd ~/.agents/skills
git clone https://github.com/AlphaGao007/find-cn-ai-bounties.git
```

这是公开仓库；agent 所在环境可以直接克隆。若你使用的是私有 fork 或镜像，再配置对应的 GitHub 登录或访问令牌。

如果已经存在同名目录，可以进入目录后更新：

```bash
cd ~/.agents/skills/find-cn-ai-bounties
git pull
```

## 目录结构

```text
find-cn-ai-bounties/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── feishu-bitable-schema.md
│   └── source-registry.md
└── scripts/
    └── validate_calendar.mjs
```

## 核心规则

以用户当前日期为准。任务只有满足下面任一条件，才应该进入 `任务日历`：

- 报名截止或提交截止日在今天或以后。
- 官方长期赏金/SRC/漏洞奖励项目仍接受提交。
- 官方页面确认正在开放，但缺少明确截止日期，此时标为 `待人工确认`。

排除这些任务：

- 报名或提交截止早于当前日期。
- 页面仍显示 `可报名`、`allowed`，但真实日期已经过期。
- 只有活动结束时间在未来，报名已经结束。
- 历史结果、决赛通知、获奖名单、媒体复盘。
- 没有奖励/奖金/奖品/学术奖励信号的普通训练或 baseline。

## 输出表结构

默认输出 4 张表：

- `任务日历`：每行一个可行动任务或长期赏金入口。
- `来源监控`：每行一个需要持续监控的平台/来源。
- `补全记录`：记录本轮新增、修正、剔除原因。
- `字段说明`：字段定义、导入建议和安全提醒。

字段详情见：

- `references/feishu-bitable-schema.md`
- `references/source-registry.md`

## 校验

生成或修改 `任务日历.csv` 后，运行：

```bash
node scripts/validate_calendar.mjs path/to/任务日历.csv --as-of 2026-05-17
```

校验会检查：

- 必需字段是否存在
- `任务ID` 是否重复
- 是否有已过期的 dated row
- `地域范围` 是否为 `国内`、`国际`、`待确认`
- 是否混入 `已截止`、`复盘参考`、`近30天结束` 等状态
- DataFountain、天池、CNVD、腾讯云黑客松、长期入口等分类数量

## 重点来源

当前 seed list 覆盖：

- DataFountain
- 阿里云天池
- CNVD 网络安全众测平台
- 腾讯云黑客松
- 华为云大赛平台
- ByteSRC、ASRC、TSRC、BSRC、360SRC、MiSRC、vivoSRC、BILISRC、DJI Security Response Center
- 补天、Gitee Reward、CICAS、数字中国创新大赛、琶洲算法大赛、飞桨 AI Studio、ModelScope 等
- AI赛事通 / CompeteHub、ML Contests、AIContestHub、Challenge Hunt、VoidScraper、BBRadar、Bounty Navigator、Huntr

这些来源会变化，使用时必须重新核验官方页面或接口。

## 安全提醒

安全赏金和 SRC 任务必须严格遵守授权范围。AI 可以辅助测试计划、代码阅读、报告整理和复现说明，但不能提交未经人工复现的 AI 生成漏洞报告。
