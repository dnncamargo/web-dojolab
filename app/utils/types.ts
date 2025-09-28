export type student = {
  id: string;
  name: string;
  createdAt: string;
  classroomId: string;
  badges?: string[];
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

export type badge = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  active: boolean;
};

export type criteria = {
  id: string
  description: string
  evaluationType: "integer" | "boolean"
  scoringType: "individual" | "team"
  points?: number
  observations?: string
}

export type ActivityStatus =
  | "not_assigned"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled"

export type activity = {
  id: string
  title: string
  description?: string
  classroomId?: string
  assessment: criteria[]
  status:   ActivityStatus
  timeConfig?: {
    mode: "chronometer" | "alarm"
    value: number // em minutos
  }
  //results?: number
  date: Date;
  createdAt: Date
}