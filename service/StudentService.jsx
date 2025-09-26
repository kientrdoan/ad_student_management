import { BaseService } from "./BaseService";

export class StudentService extends BaseService {
  constructor() {
    super();
  }

  getAll = () => {
    return this.get_token("/admins/students/");
  };

  addStudent = (payload) => {
    return this.post_token(`/admins/students/`, payload)
  }

  editStudent = (payload) => {
    return this.put(`/admins/students/${payload.id}`, payload)
  }
}

export const studentService = new StudentService();