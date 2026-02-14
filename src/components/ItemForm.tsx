"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Prompt } from "@/types/prompt";

const defaultValues = {
  title: "",
  description: "",
  task: "",
};

interface ItemFormProps {
  apiBase: string;
  initial?: Prompt;
  submitLabel?: string;
  addDialogTitle?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function ItemForm({
  apiBase,
  initial,
  submitLabel = "추가",
  addDialogTitle = "새 항목 추가",
  onSuccess,
  onCancel,
}: ItemFormProps) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          title: initial.title,
          description: initial.description ?? "",
          task: initial.task,
        }
      : defaultValues
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    (field: keyof typeof form, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const isEdit = !!initial;
    if (!form.title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      if (initial) {
        const res = await fetch(`${apiBase}/${initial.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "수정 실패");
        }
      } else {
        const res = await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "저장 실패");
        }
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="item-title">제목</Label>
        <Input
          id="item-title"
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="제목"
          required
          aria-required="true"
          minLength={1}
          className="min-h-[44px] w-full"
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="item-task">내용</Label>
        <Textarea
          id="item-task"
          value={form.task}
          onChange={(e) => update("task", e.target.value)}
          placeholder="내용을 입력하거나 붙여넣으세요"
          rows={6}
          className="min-h-[120px] w-full font-mono text-sm"
          aria-label="내용"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="item-desc">메모 (선택)</Label>
        <Textarea
          id="item-desc"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="용도·출처 등 짧은 메모"
          rows={2}
          className="min-h-[44px] w-full"
          aria-label="메모"
        />
      </div>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" disabled={loading} className="min-h-[44px] min-w-[44px]">
          {loading ? "처리 중…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="min-h-[44px] min-w-[44px]">
            취소
          </Button>
        )}
      </div>
    </form>
  );
}
