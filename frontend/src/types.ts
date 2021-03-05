export interface Item {
  id: number;
  likes: number[];
  thought: string;
  updatedAt: Date;
}

export interface Token {
  userId: number;
  exp: number;
  iat: number;
}
