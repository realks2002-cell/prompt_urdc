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

프롬프트 데이터는 프로젝트 루트의 `data/prompts.json`에 저장됩니다. 서버를 재시작해도 유지됩니다.
