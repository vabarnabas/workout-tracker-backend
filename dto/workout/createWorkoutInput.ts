import { Workout } from '@prisma/client';

export interface CreateWorkoutInput extends Workout {
  planId: string;
}
