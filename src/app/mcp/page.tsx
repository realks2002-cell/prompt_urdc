"use client";

import { CrudView } from "@/components/CrudView";

export default function McpPage() {
  return (
    <main className="min-h-screen bg-background">
      <CrudView
        title="MCP"
        apiPath="/api/mcps"
        addButtonLabel="새 MCP"
        emptyMessage="등록된 MCP가 없습니다."
        downloadFilename="mcps.md"
        listAriaLabel="MCP 목록"
        addDialogTitle="새 MCP 추가"
        type="mcp"
      />
    </main>
  );
}
