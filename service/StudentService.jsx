import { BaseService } from "./BaseService";

export class StudentService extends BaseService {
  constructor() {
    super();
  }

  getAll = (paylpad, class_id) => {
    return this.get_token(`/admins/students?class_id=${class_id}`, paylpad);
  };

  getStudent = (id) => {
    return this.get_token(`/admins/students/${id}`);
  };

  addStudent = (payload) => {
    return this.post_token(`/admins/students`, payload)
  }

  editStudent = (id, payload) => {
    return this.put(`/admins/students/${id}`, payload)
  }

  deleteStudent = (id) => {
    return this.delete(`/admins/students/${id}`)
  }
}

export const studentService = new StudentService();