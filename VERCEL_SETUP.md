# Vercel 배포 및 Blob Storage 설정 가이드

## 🚀 Vercel 배포 방법

### 1단계: GitHub에 푸시

```bash
git add .
git commit -m "Add error logging and Vercel Blob support"
git push origin main
```

### 2단계: Vercel에 프로젝트 연결

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **Add New...** → **Project** 클릭
3. GitHub 저장소 선택: `prompt_urdc`
4. **Import** 클릭
5. **Deploy** 클릭 (환경 변수는 나중에 설정)

첫 배포는 **저장 기능이 작동하지 않습니다** (Blob Storage 미설정).

---

## 💾 Vercel Blob Storage 설정

### 3단계: Blob Storage 생성

1. Vercel Dashboard에서 프로젝트 선택
2. 상단 탭에서 **Storage** 클릭
3. **Create Database** 버튼 클릭
4. **Blob** 선택
5. Database Name: `prompt-urdc-blob` (또는 원하는 이름)
6. **Create** 클릭

### 4단계: 환경 변수 자동 연결 확인

Blob을 생성하면 자동으로 다음 환경 변수가 추가됩니다:
- `BLOB_READ_WRITE_TOKEN`

확인 방법:
1. 프로젝트 → **Settings** → **Environment Variables**
2. `BLOB_READ_WRITE_TOKEN` 존재 확인 ✅

### 5단계: 재배포

환경 변수가 추가되었으므로 재배포가 필요합니다:

**방법 1: Vercel Dashboard**
1. **Deployments** 탭
2. 최신 배포의 ⋯ 메뉴 클릭
3. **Redeploy** 클릭

**방법 2: Git Push**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## ✅ 설정 확인

재배포 후:

1. **Vercel 사이트 접속**
2. 프롬프트 추가 시도
3. **성공하면**: 저장 완료! 🎉
4. **실패하면**: Vercel Dashboard → Deployments → Functions → 로그 확인

### 로그 확인 방법

Vercel Dashboard → 프로젝트 → **Deployments** → 최신 배포 선택 → **Functions** 탭

성공 시 로그:
```
[Store] Vercel Blob에 저장 시도 (2개 항목)
[Blob] 저장 성공: data/prompts.json
[API] 프롬프트 생성 성공: abc-123-...
```

실패 시 로그:
```
⚠️  Vercel 환경이지만 BLOB_READ_WRITE_TOKEN이 설정되지 않았습니다!
[Store] 로컬 파일 저장 실패: Error: EROFS: read-only file system
```

---

## 🔧 로컬 개발 (Blob 없이)

로컬에서는 Blob 없이 `data/` 폴더의 JSON 파일을 사용합니다:

```bash
npm install
npm run dev
```

→ `data/prompts.json` 파일에 저장됨 ✅

---

## 🔐 로컬에서 Vercel Blob 테스트 (선택)

1. Vercel Dashboard → Settings → Environment Variables
2. `BLOB_READ_WRITE_TOKEN` 값 복사
3. 프로젝트에 `.env.local` 파일 생성:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```
4. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

→ 로컬에서도 Vercel Blob 사용 가능!

---

## 📊 데이터 마이그레이션

로컬 데이터를 Vercel Blob으로 옮기려면:

1. `data/prompts.json` 내용 복사
2. Vercel 사이트에서 수동으로 프롬프트 추가

또는 Vercel Blob API를 사용해 자동 마이그레이션 스크립트 작성 가능.

---

## ❓ 문제 해결

### 저장이 안 돼요
- Vercel Dashboard → Settings → Environment Variables에서 `BLOB_READ_WRITE_TOKEN` 확인
- 없으면 Storage → Blob 다시 생성
- 재배포 필요 (환경 변수 변경 후)

### "read-only file system" 에러
- Vercel Blob이 설정되지 않았거나
- 환경 변수가 반영되지 않음 → 재배포 필요

### Blob 비용이 걱정돼요
- Vercel Blob: 무료 티어 1GB/월
- 이 앱은 텍스트만 저장 → 수천 개 프롬프트도 1MB 미만
- 걱정 없이 사용 가능! 🎉

---

## 🎯 요약

1. ✅ GitHub에 푸시
2. ✅ Vercel에 배포
3. ✅ Storage → Blob 생성
4. ✅ `BLOB_READ_WRITE_TOKEN` 자동 추가 확인
5. ✅ 재배포
6. ✅ 저장 기능 테스트

끝! 🚀
