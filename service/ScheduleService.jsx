import { BaseService } from "./BaseService";

export class ScheduleService extends BaseService {
  constructor() {
    super();
  }

  setSchedule = () => {
    return this.post_token("/admins/schedule");
  };

  resetSchedule = (semester_id) => {
    return this.post_token(`/admins/reset/${semester_id}`);
  };
}

export const scheduleService = new ScheduleService();