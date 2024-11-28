// 既存の型定義に追加
export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  technologies: string[];
  position: [number, number, number];
  rotation: [number, number, number];
  createdAt: string;
  updatedAt: string;
}

// ProjectWithUser型を追加
export interface ProjectWithUser extends Project {
  creatorName: string;
}