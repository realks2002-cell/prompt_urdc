"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project, ProjectStep } from "@/types/project";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStepContent, setNewStepContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProject = useCallback(async () => {
    const res = await fetch(`/api/projects/${id}`);
    if (res.ok) {
      const data = (await res.json()) as Project;
      setProject(data);
    } else {
      setProject(null);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleUpdateProject = async (updates: Partial<Project>) => {
    if (!project) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = (await res.json()) as Project;
        setProject(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddStep = async () => {
    const content = newStepContent.trim();
    if (!content || !project) return;
    const newStep: ProjectStep = {
      id: crypto.randomUUID(),
      content,
    };
    await handleUpdateProject({
      steps: [...project.steps, newStep],
    });
    setNewStepContent("");
  };

  const handleRemoveStep = async (stepId: string) => {
    if (!project) return;
    await handleUpdateProject({
      steps: project.steps.filter((s) => s.id !== stepId),
    });
  };

  const handleTitleChange = (title: string) => {
    if (!project) return;
    setProject((prev) => (prev ? { ...prev, title } : null));
  };

  const handleTitleBlur = () => {
    if (!project) return;
    handleUpdateProject({ title: project.title });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-muted-foreground">불러오는 중…</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-muted-foreground">프로젝트를 찾을 수 없습니다.</p>
          <Link href="/project">
            <Button variant="link" className="mt-2 min-h-[44px] px-0">
              목록으로
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4">
          <Link
            href="/project"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            프로젝트 목록
          </Link>
          <Input
            value={project.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={handleTitleBlur}
            className="text-2xl font-bold sm:text-3xl"
            aria-label="프로젝트 제목"
          />
        </header>

        <section className="space-y-6" aria-label="단계별 내용">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">단계 추가</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label htmlFor="new-step" className="sr-only">
                새 단계 내용
              </Label>
              <Textarea
                id="new-step"
                value={newStepContent}
                onChange={(e) => setNewStepContent(e.target.value)}
                placeholder="단계 내용을 입력하세요"
                rows={3}
                className="min-h-[80px] w-full"
                aria-label="단계 내용"
              />
              <Button
                onClick={handleAddStep}
                disabled={!newStepContent.trim() || saving}
                className="min-h-[44px] gap-2"
              >
                <Plus className="size-4" aria-hidden />
                단계 추가
              </Button>
            </CardContent>
          </Card>

          {project.steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  단계별 내용 ({project.steps.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {project.steps.map((step, index) => (
                    <li
                      key={step.id}
                      className="flex gap-3 rounded-lg border bg-muted/30 p-3"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium"
                        aria-hidden
                      >
                        {index + 1}
                      </span>
                      <p className="min-w-0 flex-1 break-words whitespace-pre-wrap pt-1 text-sm">
                        {step.content}
                      </p>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="단계 삭제"
                        className="shrink-0 min-h-[44px] min-w-[44px] text-destructive hover:text-destructive"
                        onClick={() => handleRemoveStep(step.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
