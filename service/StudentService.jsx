import { BaseService } from "./BaseService";

export class StudentService extends BaseService {
  constructor() {
    super();
  }

  getAll = () => {
    return this.get_token("/admins/students/");
  };

  getStudent = (id) => {
    return this.get_token(`/admins/students/${id}`);
  };

  addStudent = (payload) => {
    return this.post_token(`/admins/students/`, payload)
  }

  editStudent = (id, payload) => {
    return this.put(`/admins/students/${id}`, payload)
  }

  deleteStudent = (id) => {
    return this.delete(`/admins/students/${id}`)
  }
}

export const studentService = new StudentService();