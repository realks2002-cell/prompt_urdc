/** 프로젝트 한 건 */
export interface ProjectStep {
  id: string;
  content: string;
}

export interface Project {
  id: string;
  title: string;
  steps: ProjectStep[];
  createdAt: string;
  updatedAt: string;
}
