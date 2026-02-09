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
  role: "",
  task: "",
  domain: "",
  constraint: "",
};

interface PromptFormProps {
  initial?: Prompt;
  submitLabel?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function PromptForm({
  initial,
  submitLabel = "추가",
  onSuccess,
  onCancel,
}: PromptFormProps) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          title: initial.title,
          description: initial.description ?? "",
          role: initial.role,
          task: initial.task,
          domain: initial.domain,
          constraint: initial.constraint,
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
    if (isEdit && (!form.role.trim() || !form.task.trim() || !form.domain.trim() || !form.constraint.trim())) {
      setError("역할, 과제, 도메인, 제약을 모두 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      if (initial) {
        const res = await fetch(`/api/prompts/${initial.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "수정 실패");
        }
      } else {
        const res = await fetch("/api/prompts", {
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
        <Label htmlFor="prompt-title">제목</Label>
        <Input
          id="prompt-title"
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="프롬프트 제목"
          required
          aria-required="true"
          minLength={1}
          className="min-h-[44px] w-full"
          autoComplete="off"
        />
      </div>
      {/* 새 프롬프트 추가 시: 프롬프트 내용 입력창 (과제 R에 저장) */}
      {!initial && (
        <div className="space-y-2">
          <Label htmlFor="prompt-task-add">프롬프트 내용 (선택)</Label>
          <Textarea
            id="prompt-task-add"
            value={form.task}
            onChange={(e) => update("task", e.target.value)}
            placeholder="프롬프트를 입력하거나 붙여넣으세요"
            rows={6}
            className="min-h-[120px] w-full font-mono text-sm"
            aria-label="프롬프트 내용"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="prompt-desc">{initial ? "설명 (선택)" : "메모 (선택)"}</Label>
        <Textarea
          id="prompt-desc"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder={initial ? "간단한 설명" : "용도·출처 등 짧은 메모"}
          rows={2}
          className="min-h-[44px] w-full"
          aria-label="설명 또는 메모"
        />
      </div>
      {/* 수정 시에만 URDC 필드 표시 */}
      {initial && (
        <>
          <div className="space-y-2">
            <Label htmlFor="prompt-role">역할 (U)</Label>
            <Textarea
              id="prompt-role"
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              placeholder="AI의 역할"
              required
              aria-required="true"
              rows={2}
              className="min-h-[44px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt-task">과제 (R)</Label>
            <Textarea
              id="prompt-task"
              value={form.task}
              onChange={(e) => update("task", e.target.value)}
              placeholder="요청할 작업"
              required
              aria-required="true"
              rows={2}
              className="min-h-[44px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt-domain">도메인 (D)</Label>
            <Textarea
              id="prompt-domain"
              value={form.domain}
              onChange={(e) => update("domain", e.target.value)}
              placeholder="도메인/분야"
              required
              aria-required="true"
              rows={2}
              className="min-h-[44px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt-constraint">제약 (C)</Label>
            <Textarea
              id="prompt-constraint"
              value={form.constraint}
              onChange={(e) => update("constraint", e.target.value)}
              placeholder="제약 조건"
              required
              aria-required="true"
              rows={2}
              className="min-h-[44px]"
            />
          </div>
        </>
      )}
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
