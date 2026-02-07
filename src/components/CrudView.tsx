"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PromptCard } from "@/components/PromptCard";
import { PromptForm } from "@/components/PromptForm";
import { ItemCard } from "@/components/ItemCard";
import { ItemForm } from "@/components/ItemForm";
import type { Prompt } from "@/types/prompt";
import { promptsToMarkdown } from "@/lib/prompt-to-md";
import { Plus, Download, LayoutList, LayoutGrid } from "lucide-react";

type ViewMode = "list" | "card";

type CrudType = "prompt" | "agent" | "mcp";

interface CrudViewProps {
  title: string;
  apiPath: string;
  addButtonLabel: string;
  emptyMessage: string;
  downloadFilename: string;
  listAriaLabel: string;
  addDialogTitle: string;
  type: CrudType;
}

export function CrudView({
  title,
  apiPath,
  addButtonLabel,
  emptyMessage,
  downloadFilename,
  listAriaLabel,
  addDialogTitle,
  type,
}: CrudViewProps) {
  const [items, setItems] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  const fetchItems = useCallback(async () => {
    const res = await fetch(apiPath);
    if (res.ok) {
      const data = (await res.json()) as Prompt[];
      setItems(data);
    }
    setLoading(false);
  }, [apiPath]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDownloadAllMd = () => {
    const md = promptsToMarkdown(items);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const itemLabel = type === "prompt" ? "프롬프트" : type === "agent" ? "에이전트" : "MCP";

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        </header>

        <section className="mb-6 flex flex-wrap items-center gap-2" aria-label={`${title} 기능`}>
          {items.length > 0 && (
            <>
              <div className="flex rounded-md border border-input" role="group" aria-label="보기 방식">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="min-h-[44px] min-w-[44px] rounded-r-none border-0"
                  aria-label="리스트 보기"
                  aria-pressed={viewMode === "list"}
                >
                  <LayoutList className="size-5" aria-hidden />
                </Button>
                <Button
                  variant={viewMode === "card" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("card")}
                  className="min-h-[44px] min-w-[44px] rounded-l-none border-0"
                  aria-label="카드 보기"
                  aria-pressed={viewMode === "card"}
                >
                  <LayoutGrid className="size-5" aria-hidden />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadAllMd}
                className="min-h-[44px] shrink-0 gap-2"
                aria-label={`전체 ${downloadFilename} 다운로드`}
              >
                <Download className="size-5" aria-hidden />
                전체 .md 다운로드
              </Button>
            </>
          )}
          <Button onClick={() => setAddOpen(true)} className="min-h-[44px] shrink-0 gap-2" aria-label={addButtonLabel}>
            <Plus className="size-5" aria-hidden />
            {addButtonLabel}
          </Button>
        </section>

        {loading ? (
          <p className="py-8 text-muted-foreground">불러오는 중…</p>
        ) : items.length === 0 ? (
          <section className="rounded-xl border border-dashed py-12 text-center text-muted-foreground" aria-label={`${itemLabel} 없음`}>
            <p className="mb-4">{emptyMessage}</p>
            <Button onClick={() => setAddOpen(true)} variant="outline" className="min-h-[44px]">
              {addButtonLabel}
            </Button>
          </section>
        ) : (
          <ul
            className={viewMode === "list" ? "mt-6 flex flex-col gap-2" : "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2"}
            aria-label={listAriaLabel}
          >
            {items.map((item) => (
              <li key={item.id}>
                {type === "prompt" ? (
                  <PromptCard prompt={item} onUpdated={fetchItems} onDeleted={fetchItems} variant={viewMode} />
                ) : (
                  <ItemCard
                    item={item}
                    apiBase={apiPath}
                    itemLabel={itemLabel}
                    onUpdated={fetchItems}
                    onDeleted={fetchItems}
                    variant={viewMode}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {type === "prompt" ? (
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{addDialogTitle}</DialogTitle>
            </DialogHeader>
            <div className="min-h-[200px] pt-2">
              <PromptForm
                key={addOpen ? "add-open" : "add-closed"}
                onSuccess={() => {
                  setAddOpen(false);
                  fetchItems();
                }}
                onCancel={() => setAddOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{addDialogTitle}</DialogTitle>
            </DialogHeader>
            <div className="min-h-[200px] pt-2">
              <ItemForm
                apiBase={apiPath}
                key={addOpen ? "add-open" : "add-closed"}
                onSuccess={() => {
                  setAddOpen(false);
                  fetchItems();
                }}
                onCancel={() => setAddOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
