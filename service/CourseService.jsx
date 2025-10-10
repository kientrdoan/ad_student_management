import { BaseService } from "./BaseService";

export class CourseService extends BaseService {
  constructor() {
    super();
  }

  getAllCourse = () => {
    return this.get_token("/admins/courses/");
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
}

export const courseService = new CourseService();