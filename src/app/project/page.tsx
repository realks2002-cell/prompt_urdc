"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/types/project";
import { Plus, Trash2 } from "lucide-react";

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const data = (await res.json()) as Project[];
      setProjects(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async () => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "새 프로젝트" }),
    });
    if (res.ok) {
      const project = (await res.json()) as Project;
      window.location.href = `/project/${project.id}`;
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("이 프로젝트를 삭제할까요?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) fetchProjects();
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Project
          </h1>
          <Button
            onClick={handleCreate}
            className="min-h-[44px] shrink-0 gap-2"
            aria-label="새 프로젝트 생성"
          >
            <Plus className="size-5" aria-hidden />
            새 프로젝트
          </Button>
        </header>

        {loading ? (
          <p className="py-8 text-muted-foreground">불러오는 중…</p>
        ) : projects.length === 0 ? (
          <section
            className="rounded-xl border border-dashed py-12 text-center text-muted-foreground"
            aria-label="프로젝트 없음"
          >
            <p className="mb-4">등록된 프로젝트가 없습니다.</p>
            <Button onClick={handleCreate} variant="outline" className="min-h-[44px]">
              새 프로젝트 생성
            </Button>
          </section>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2" aria-label="프로젝트 목록">
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/project/${project.id}`} className="block h-full">
                  <Card className="h-full transition-colors hover:bg-accent/50">
                    <CardHeader className="flex flex-row items-start justify-between gap-2">
                      <CardTitle className="text-base break-words">
                        {project.title}
                      </CardTitle>
                      <div className="flex shrink-0 gap-1" onClick={(e) => e.preventDefault()}>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label="삭제"
                          className="min-h-[44px] min-w-[44px] text-destructive hover:text-destructive"
                          onClick={(e) => handleDelete(e, project.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                      단계 {project.steps.length}개
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
