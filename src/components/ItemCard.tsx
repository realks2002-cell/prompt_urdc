"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Prompt } from "@/types/prompt";
import { ItemForm } from "@/components/ItemForm";
import { promptToMarkdown, safeFileName } from "@/lib/prompt-to-md";
import { Pencil, Trash2, Download } from "lucide-react";

type CardVariant = "card" | "list";

interface ItemCardProps {
  item: Prompt;
  apiBase: string;
  itemLabel: string;
  onUpdated: () => void;
  onDeleted: () => void;
  variant?: CardVariant;
}

export function ItemCard({ item, apiBase, itemLabel, onUpdated, onDeleted, variant = "card" }: ItemCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`이 ${itemLabel}를 삭제할까요?`)) return;
    const res = await fetch(`${apiBase}/${item.id}`, { method: "DELETE" });
    if (res.ok) onDeleted();
  };

  const handleDownloadMd = () => {
    const md = promptToMarkdown(item);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeFileName(item.title)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isList = variant === "list";

  return (
    <>
      <Card className={isList ? "flex flex-row items-center gap-3 py-3 pr-2" : "flex flex-col"}>
        <CardHeader className={isList ? "flex flex-1 flex-row items-center justify-between gap-2 py-0 pr-0" : "flex flex-row items-start justify-between gap-2"}>
          <div className="min-w-0 flex-1">
            <CardTitle className={`break-words ${isList ? "text-sm font-medium" : "text-base"}`}>
              {item.title}
            </CardTitle>
            {isList && item.task?.trim() && (
              <p className="mt-0.5 truncate text-muted-foreground text-xs">
                {item.task?.trim()}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1">
            <Button variant="outline" size="icon-sm" aria-label="수정" onClick={() => setEditOpen(true)} className="min-h-[44px] min-w-[44px]">
              <Pencil className="size-4" />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="MD 다운로드" onClick={handleDownloadMd} className="min-h-[44px] min-w-[44px]">
              <Download className="size-4" />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="삭제" onClick={handleDelete} className="min-h-[44px] min-w-[44px] text-destructive hover:text-destructive">
              <Trash2 className="size-4" />
            </Button>
          </div>
        </CardHeader>
        {!isList && (
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">내용</span>
              <p className="mt-0.5 break-words whitespace-pre-wrap">{item.task || "—"}</p>
            </div>
          </CardContent>
        )}
        {!isList && (
          <CardFooter className="mt-auto border-t pt-4 text-muted-foreground text-xs">
            수정: {new Date(item.updatedAt).toLocaleString("ko-KR")}
          </CardFooter>
        )}
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{itemLabel} 수정</DialogTitle>
          </DialogHeader>
          <ItemForm
            apiBase={apiBase}
            initial={item}
            submitLabel="저장"
            onSuccess={() => {
              setEditOpen(false);
              onUpdated();
            }}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
