import { BaseService } from "./BaseService";

export class StudentService extends BaseService {
  constructor() {
    super();
  }

  getAll = (paylpad) => {
    return this.get_token(`/admins/students`, paylpad);
  };

  getStudent = (id) => {
    return this.get_token(`/admins/students/${id}`);
  };

  addStudent = (payload) => {
    return this.post_token(`/admins/students/`, payload)
  }

  editStudent = (id, payload) => {
    return this.put_token(`/admins/students/${id}`, payload)
  }

  deleteStudent = (id) => {
    return this.delete_token(`/admins/students/${id}`)
  }
}

export const studentService = new StudentService();