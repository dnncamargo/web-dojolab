export type student = {
  id: string;
  name: string;
  createdAt: string;
  classId: string;
  badge?: string;
  active: boolean;
};

export type classroom = {
  id: string;
  name: string;
  createdAt: string;
  active: boolean;
};

export type team = {
  id: string;
  name: string;
  createdAt: string;
  members: string[];
  classId: string;
  active: boolean;
};