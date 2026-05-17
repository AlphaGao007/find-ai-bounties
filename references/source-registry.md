# Source Registry

Treat this file as a seed list, not ground truth. Always re-check current status from official pages/APIs.

## High-Priority Current-Task Sources

### DataFountain

- Entry: `https://www.datafountain.cn/competitions`
- Detail pattern: `https://www.datafountain.cn/competitions/{id}`
- Useful special pages can carry stricter phase deadlines than the list page.
- Known trap: list cards may still expose `allowed`/`可报名` for old or no-date items. Filter by actual signup/submission dates.
- Dedup rule: keep concrete competition IDs as task rows; use special/aggregate pages only as rules links or notes.
- Check multiple pages, not just page 1. Exclude old training/no-reward tasks unless the user asks for learning tasks.

### 阿里云天池

- Entry: `https://tianchi.aliyun.com/competition/programmingList`
- List API seed: `/v3/proxy/competition/api/race/page?visualTab={tab}&raceName=&pageNum={page}&isActive=1`
- Detail API seed: `/v3/proxy/competition/api/race/getDetail?raceId={raceId}`
- Detail page pattern: `https://tianchi.aliyun.com/competition/entrance/{raceId}`
- Tabs commonly map to AI大模型赛, 数据算法赛, 工程开发赛, 日常学习赛.
- Known trap: series cards and task cards can duplicate the same race. Deduplicate by `raceId`.
- Include tasks with future signup/submission deadlines and a reward signal: cash bonus, prize, certificate, academic publication/conference reward, or clear AI/algorithm task value.

### CNVD 网络安全众测平台

- Entry: `https://zc.cnvd.org.cn/project/index`
- List API seed: `https://zc.cnvd.org.cn/project/list/{page}`
- Filter idea: `state=3` for current testing/open projects when available.
- Detail pattern: `https://zc.cnvd.org.cn/project/details?id={id}`
- Known trap: homepage cards can show only a subset. Use the project list endpoint and detail pages.
- For AI-focused rows, include project names containing `开源大模型`, `大模型应用`, `智能体应用`, or other AI-specific wording.
- Record invitation limits such as `仅对受邀请的测试人员开放报名`.

### 腾讯云黑客松

- Entry: `https://tch.cloud.tencent.com/`
- Detail pattern: `https://tch.cloud.tencent.com/contest/{id}`
- The page may expose SSR/page data with contest fields such as `signStart`, `signEnd`, `eventStart`, and `eventEnd`.
- Known trap: signup deadline can be much earlier than event end. Use `signEnd` for `报名截止时间`; put event end in `提交截止时间` only when rules imply it.
- Exclude contests whose `signEnd` is before the as-of date.

### 华为云大赛/算法挑战

- Entry: `https://developer.huaweicloud.com/competition`
- Algorithm challenge entry can appear under Huawei Cloud hackathon pages.
- Known trap: long-running platform pages do not mean the currently visible concrete challenge is open.
- Include only concrete current challenges with future signup/submission dates. Otherwise keep Huawei in `来源监控`, not `任务日历`.

## Standing Bounty/SRC Sources

Include as `长期开放` task rows when the official program currently accepts submissions. Do not invent a deadline.

- ByteSRC: `https://security.bytedance.com/`
- Alibaba ASRC: `https://security.alibaba.com/`
- Tencent TSRC: `https://security.tencent.com/`
- Huawei Bug Bounty / PSIRT: `https://bugbounty.huawei.com/`
- Baidu BSRC: `https://bsrc.baidu.com/`
- 360SRC: `https://security.360.cn/`
- MiSRC: `https://sec.xiaomi.com/`
- vivoSRC: `https://security.vivo.com.cn/`
- BILISRC: `https://security.bilibili.com/`
- DJI Security Response Center: `https://security.dji.com/`
- 补天: `https://www.butian.net/`

For standing bounty programs, record the official rules link, eligible product scope, reward basis, and authorization warning. If a program has a temporary AI-specific special campaign, create a separate dated task row for the campaign.

## Other Competition/Reward Sources To Monitor

- 琶洲算法大赛: `https://www.aicompetition-pz.com/`
- CICAS 全国人工智能应用场景创新挑战赛: `https://www.cicas.cn/`
- 数字中国创新大赛: `https://www.dcic-china.com/`
- Gitee Reward: `https://gitee.com/gitee_reward?dir=desc&sort=money`
- 飞桨 AI Studio: `https://aistudio.baidu.com/competition`
- 科大讯飞 AI开发者大赛: `https://challenge.xfyun.cn/competition`
- ModelScope events/challenges: `https://modelscope.cn/events`
- 扣子/Coze and 火山引擎 developer events: monitor official community/activity pages.

## Search Queries

Use official-domain searches first, then broader search/news if needed:

- `site:datafountain.cn competitions AI 可报名 奖金`
- `site:tianchi.aliyun.com competition 大模型 奖金 报名`
- `site:zc.cnvd.org.cn 大模型 安全众测 2026`
- `site:tch.cloud.tencent.com 黑客松 AI 报名`
- `site:developer.huaweicloud.com competition 算法挑战赛 报名`
- `AI 大赛 2026 报名 奖金 site:gov.cn OR site:edu.cn`

## Exclusion Checklist

Exclude a task row if any condition applies:

- Signup/submission deadline is before the as-of date.
- Only event end is in the future but signup already ended.
- It is a historical result, finals notice, winner list, media recap, or next-year reference.
- It has no reward/prize/bounty signal and is merely a course/baseline, unless user requested learning tasks.
- It is outside authorization scope for security testing.
