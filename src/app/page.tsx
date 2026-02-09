import { CrudView } from "@/components/CrudView";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <CrudView
        title="CRUD"
        apiPath="/api/prompts"
        addButtonLabel="새 프롬프트"
        emptyMessage="등록된 프롬프트가 없습니다."
        downloadFilename="urdc-prompts.md"
        listAriaLabel="프롬프트 목록"
        addDialogTitle="새 프롬프트 추가"
        type="prompt"
      />
    </main>
  );
}
