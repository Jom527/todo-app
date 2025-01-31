import { Priority } from "../enums/priority";
import { Status } from "../enums/status";

export class UpdatePriorityResponse {
  id: number;
  priority: Priority;
}

export class UpdateStatusResponse {
  id: number;
  status: Status;
}

export class UpdateTaskTypeResponse {
  id: number;
  isScheduled: boolean;
}
