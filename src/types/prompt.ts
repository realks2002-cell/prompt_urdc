/** 프롬프트 한 건 타입 */
export interface Prompt {
  id: string;
  title: string;
  /** 프롬프트 내용 */
  task: string;
  createdAt: string;
  updatedAt: string;
}
