export type student = {
  id: string;
  name: string;
  classId: string;
  badge?: string;
};

export type classroom = {
  id: string;
  name: string;
  createdAt: any;
};

export type team = {
  id: string;
  name: string;
  members: student[];
  classId: string;
};