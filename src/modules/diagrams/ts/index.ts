export interface DiagramDetails {
  nodes: string;
  edges: string;
}

export interface DiagramBody extends DiagramDetails {
  name: string;
  course: number;
  user: number;
}

export interface Diagram extends DiagramBody {
  createdAt: Date;
  editedAt: Date;
  diagramID: number;
  courseName: string;
}

export type DiagramCreate = [
  Diagram["user"],
  Diagram["name"],
  Diagram["course"],
  DiagramDetails["nodes"],
  DiagramDetails["edges"]
]

