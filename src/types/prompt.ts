/** URDC 프롬프트 한 건 타입 */
export interface Prompt {
  id: string;
  title: string;
  description?: string;
  /** U: Role (역할) */
  role: string;
  /** R: Task (과제/요청) */
  task: string;
  /** D: Domain (도메인) */
  domain: string;
  /** C: Constraint (제약) */
  constraint: string;
  createdAt: string;
  updatedAt: string;
}
