export interface Project {
  id: string;  // UUIDを使用するためstringに変更
  title: string;
  description: string;
  image: string;
  link?: string;
  technologies: string[];
  position: [number, number, number];
  rotation: [number, number, number];
  createdAt: string;
  updatedAt: string;
  creator_name: string;  // 作成者の名前を追加
}
