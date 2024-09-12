import { atom } from 'recoil';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
};

export const tasksState = atom<Task[]>({
  key: 'tasksState',
  default: [],
});

export const draggedTaskState = atom<string | null>({
  key: 'draggedTaskState',
  default: null,
});