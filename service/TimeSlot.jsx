import { BaseService } from "./BaseService";

export class TimeSlotService extends BaseService {
  constructor() {
    super();
  }

  getTimeSlotByCourse = (course_id) => {
    return this.get_token(`/admins/time-slot/${course_id}`);
  };

  updateDateTimeSlotByCourse = (course_id, payload) => {
    return this.put_token(`/admins/time-slot/${course_id}`, payload);
  };
}

export const timeSlotService = new TimeSlotService();
