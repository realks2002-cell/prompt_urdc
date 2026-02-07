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
  Vercel 대시보드 → 프로젝트 → Storage → Blob 생성 후, 생성된 토큰을 Environment Variables에 `BLOB_READ_WRITE_TOKEN`으로 추가하세요.
