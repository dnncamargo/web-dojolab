import { Timestamp } from 'firebase/firestore';

export interface student {
  id: string;
  name: string;
  classId?: string;
  badge?: string;
  createdAt?: Timestamp;
}