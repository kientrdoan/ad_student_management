import { BaseService } from "./BaseService";

export class ClassService extends BaseService {
  constructor() {
    super();
  }

  getAll = () => {
    return this.get_token("/admins/classes/");
  };

  addStudent = (payload) => {
    return this.post_token(`/admins/classes/`, payload)
  }

  editStudent = (payload) => {
    return this.put(`/admins/classes/${payload.id}`, payload)
  }
}

export const classService = new ClassService();