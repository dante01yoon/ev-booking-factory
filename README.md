# ev-booking-factory — 코덱스로 만드는 소프트웨어 팩토리

이슈를 넣으면 PR이 나오는 작업 라인을 코덱스(Codex CLI)로 만든 예제입니다.
시연 앱은 서울 충전소 예약 학습용 웹 앱이고, 하네스(AGENTS.md·가드 훅·검증 훅)가 이미 들어 있는 상태에서 팩토리를 위에 쌓았습니다.

```text
이슈 ─▶ 분류 ─┬─ fix ───▶ 재현 테스트(빨강) ─▶ 수정(초록) ─▶ 리뷰 ─▶ 전후 화면 ─▶ PR
              ├─ spec ──▶ 스펙 문서 ─▶ 초안 PR (사람이 정할 것 정리)
              └─ need-info / human ─▶ 질문 댓글만 (코드 수정 없음)
                                                         머지는 사람이 합니다
```

## 파일

| 파일 | 역할 |
|---|---|
| `AGENTS.md` 「소프트웨어 팩토리 규칙」 | 어떤 이슈를 어디로 보낼지 정한 분류 표와 공통 규칙 |
| `.agents/skills/factory-*` | 공정 하나당 스킬 하나 (triage·repro·fix·review·spec). `agents/openai.yaml`에서 자동 호출을 꺼 두어 라인이 부를 때만 실행 |
| `scripts/factory.sh` | 라인. GitHub 쓰기(라벨·댓글·PR)는 스크립트가, 코드 작업은 `codex exec`가 맡음 |
| `scripts/factory/*.schema.json` | 분류·리뷰 결과를 JSON으로 받기 위한 `--output-schema` |
| `scripts/shot.mjs` | 고치기 전(main)과 고친 뒤(작업 폴더) 화면을 같은 동작으로 찍음 |
| `.codex/hooks.json` | 하네스: 테스트 파일 보호(PreToolUse), 끝내기 전 테스트·타입 검사(Stop) |

## 실행

Node.js 24, `gh`(로그인), `jq`, Codex CLI가 필요합니다.

```sh
npm ci
cp .env.example .env
npx playwright install chromium

./scripts/factory.sh triage            # 분류만 보기 (GitHub에 쓰지 않음)
./scripts/factory.sh run               # 분류 반영 → fix 전부 → spec 전부
./scripts/factory.sh fix 1             # 이슈 하나만
```

`scripts/factory.sh`는 이슈마다 `.factory/wt/issue-<번호>`에 git worktree를 만들고, `--dangerously-bypass-hook-trust`는 그 폴더의 `.codex`가 main과 같을 때만 씁니다.

## 데이터

충전소 정보는 공공데이터포털 「한국환경공단 전기자동차 충전소 정보」에서 받은 서울 일부입니다. 결제는 토스페이먼츠 공식 문서에 공개된 테스트 키만 씁니다(실제 결제 없음).
