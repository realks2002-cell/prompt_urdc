"use client";

import { CrudView } from "@/components/CrudView";

export default function AgentPage() {
  return (
    <main className="min-h-screen bg-background">
      <CrudView
        title="Agent"
        apiPath="/api/agents"
        addButtonLabel="새 에이전트"
        emptyMessage="등록된 에이전트가 없습니다."
        downloadFilename="agents.md"
        listAriaLabel="에이전트 목록"
        addDialogTitle="새 에이전트 추가"
        type="agent"
      />
    </main>
  );
}
