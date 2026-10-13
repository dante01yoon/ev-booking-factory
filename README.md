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

## 설치

macOS 기준(Windows는 WSL에서 같은 명령). 라인이 라벨·댓글·PR을 만들기 때문에 **내 계정으로 포크**해서 씁니다.

```sh
brew install node@24 gh jq            # Node.js 24, GitHub CLI, jq
npm install -g @openai/codex          # Codex CLI (촬영: 0.162.1)
gh auth login                         # GitHub 로그인
codex login                           # 챗GPT 계정 로그인

gh repo fork dante01yoon/ev-booking-factory --clone
cd ev-booking-factory
gh repo set-default <내아이디>/ev-booking-factory   # 이슈·PR을 내 포크에 만들도록
npm ci
npx playwright install chromium       # 전후 화면 찍기용
cp .env.example .env                  # 토스 공식 문서 테스트 키 (실제 결제 없음)
npm run test:rules                    # 114개 통과하면 준비 완료
```

처음 한 번은 이 폴더에서 `codex`를 실행해 **Trust and continue**(폴더 신뢰)와 **Trust all and continue**(훅 신뢰)를 고른 뒤 종료합니다.

포크에는 이슈가 복사되지 않으니 연습용 이슈를 만듭니다.

```sh
gh issue create -t "충전소 검색이 대소문자를 구분해요" -b "검색창에 sk를 입력하면 1곳만, SK를 입력하면 2곳만 나와요. 기대: 대소문자 상관없이 3곳 모두"
gh issue create -t "예약 취소 기능을 넣어 주세요" -b "내 예약 카드에 취소 버튼이 있으면 좋겠습니다. 돌려받을 예약금도 미리 보여 주세요."
gh issue create -t "예약 버튼이 가끔 안 눌려요" -b "어떨 때는 예약 버튼이 회색이라 안 눌립니다."
```

## 사용법

| 명령 | 하는 일 | GitHub에 쓰는 것 |
|---|---|---|
| `./scripts/factory.sh triage` | 열린 이슈 분류만 보기 (dry-run) | 없음 |
| `./scripts/factory.sh triage --apply` | 분류 결과를 라벨로, 정보 부족 이슈에 질문 댓글 | 라벨·댓글 |
| `./scripts/factory.sh fix 1` | 재현 테스트 → 수정 → 리뷰 → 전후 화면 → PR | 브랜치·PR |
| `./scripts/factory.sh spec 2` | 코드 수정 없이 스펙 문서 → 초안 PR | 브랜치·초안 PR |
| `./scripts/factory.sh run` | 위 과정을 열린 이슈 전체에 (영상 기준 8분 35초) | 전부 |

결과물: PR 본문(원인·바꾼 것·증거·사람이 정할 것·전후 화면·리뷰), `.factory/triage.json`(분류), `.factory/wt/issue-N/`(이슈별 worktree, 브랜치 `factory/issue-N`), `.factory/wt/issue-N/.factory/*.log`(공정별 코덱스 기록), `.factory/log.tsv`(공정별 시각).

다시 돌리려면 `gh issue edit 1 --remove-label factory:fix`, `git worktree remove --force .factory/wt/issue-1`, `git branch -D factory/issue-1`. 머지는 사람이 합니다.

`scripts/factory.sh`는 이슈마다 `.factory/wt/issue-<번호>`에 git worktree를 만들고, `--dangerously-bypass-hook-trust`는 그 폴더의 `.codex`가 main과 같을 때만 씁니다.

## 데이터

충전소 정보는 공공데이터포털 「한국환경공단 전기자동차 충전소 정보」에서 받은 서울 일부입니다. 결제는 토스페이먼츠 공식 문서에 공개된 테스트 키만 씁니다(실제 결제 없음).
