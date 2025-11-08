import { BaseService } from "./BaseService";

export class CourseService extends BaseService {
  constructor() {
    super();
  }

  getAllCourse = () => {
    return this.get_token("/admins/courses/");
  };

  getAllCourseBySemester = (semester_id) => {
    return this.get_token(`/admins/courses/${semester_id}`);
  };

  getCourse = (id) => {
    return this.get_token(`/admins/courses/${id}`);
  };

  addCourse = (payload) => {
    return this.post_token(`/admins/courses/`, payload)
  }

  editCourse = (id, payload) => {
    return this.put(`/admins/courses/${id}`, payload)
  }

  deleteCourse = (id) => {
    return this.delete(`/admins/courses/${id}`)
  }

  setSchedule = (payload) => {
    return this.post_token(`/admins/schedule/`, payload);
  };

  resetSchedule = (semester_id) => {
    return this.post_token(`/admins/schedule/reset/${semester_id}/`);
  };
}

export const courseService = new CourseService();