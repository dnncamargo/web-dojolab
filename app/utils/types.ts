export type student = {
  id: string;
  name: string;
  createdAt: string;
  classroomId: string;
  badges?: string[];
  isActive: boolean;
};

export type classroom = {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
};

export type team = {
  id: string;
  name: string;
  createdAt: string;
  members: string[];
  classroomId: string;
  isActive: boolean;
};

export type badge = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  isActive: boolean;
};

export type criteria = {
  id: string
  description: string
  evaluationType: "integer" | "boolean"
  scoringType: "individual" | "team"
  weight: number;
  points?: number;
  observations?: string
}

export type task = {
  id: string;
  briefDescription: string;
  status: "not_started" | "doing" | "done";
  observations?: string
};

export type board = {
  id: string;
  teamId: string;
  tasks: task[];
};

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
  graded: boolean
  assessment?: criteria[]
  status:   ActivityStatus
  timed: boolean
  kanban: boolean
  workflow?: board[]
  taskBoard?: task[]
  descriptionType: "richtext" | "interactive"
  results?: scoringResult[]
  tags?: string[]
  date: Date
  podium?: podium
  createdAt: Date
  finalizedAt?: Date
}

export type scoringResult = {
  criteriaId: string;
  targetId: string; // pode ser aluno ou equipe
  targetType: "student" | "team";
  value: number | boolean; // depende do evaluationType
};

export type podiumEntry = {
  id: string; // ID do aluno ou da equipe
  score: number; // Pontuação total alcançada
  placement: number
};

export type podium = {
  studentPodium: podiumEntry[];
  teamPodium: podiumEntry[];
};

/* type report = {
  id: string;

}

type observation = {
  id: string;
  tags: string[];
  studentId: string;
  classroomId: string;
  involvedEntityIds: string[];
  activityId?: string;
  date: Date;
  createdAt: Date
} */