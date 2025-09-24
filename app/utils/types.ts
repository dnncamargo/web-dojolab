export type student = {
  id: string;
  name: string;
  classId: string;
  badge?: string;
  active: boolean;
};

export type classroom = {
  id: string;
  name: string;
  createdAt: any;
  active: boolean;
};

export type team = {
  id: string;
  name: string;
  members: student[];
  classId: string;
  active: boolean;
};