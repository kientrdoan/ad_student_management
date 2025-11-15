import { BaseService } from "./BaseService";

export class TeacherService extends BaseService {
  constructor() {
    super();
  }

  getAllTeacher = (payload) => {
    return this.get_token(`/admins/teachers/`, payload);
  };

  getTeacher = (id) => {
    return this.get_token(`/admins/teachers/${id}`);
  };

  addTeacher = (payload) => {
    return this.post_token(`/admins/teachers/`, payload)
  }

  editTeacher = (id, payload) => {
    return this.put(`/admins/teachers/${id}`, payload)
  }

  deleteTeacher = (id) => {
    return this.delete(`/admins/teachers/${id}`)
  }
}

export const teacherService = new TeacherService();