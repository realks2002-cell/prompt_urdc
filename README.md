# URDC 프롬프트 관리

URDC 형식(역할 U, 과제 R, 도메인 D, 제약 C)으로 프롬프트를 저장·관리하는 웹 앱입니다.

- **기술**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **저장**: `data/prompts.json` 파일에 JSON으로 저장
- **기능**: 랜딩 페이지에서 목록 조회, 추가, 수정, 삭제 (CRUD)

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

## 프로덕션 빌드

```bash
npm run build
npm start
```

## 데이터

- **로컬**: 프로젝트 루트의 `data/prompts.json`, `data/agents.json`, `data/mcps.json`에 JSON으로 저장됩니다.
- **Vercel 배포**: 환경 변수 `BLOB_READ_WRITE_TOKEN`을 설정하면 [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)에 자동으로 저장됩니다.

## Vercel 배포

**⚡ 빠른 시작**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md) (5분 완성)
**📖 상세 가이드**: [VERCEL_SETUP.md](VERCEL_SETUP.md)

### 요약
1. GitHub에 푸시
2. Vercel에 배포
3. Storage → Blob 생성
4. 재배포

**중요**: Blob Storage를 생성하지 않으면 Vercel에서 저장이 작동하지 않습니다.
