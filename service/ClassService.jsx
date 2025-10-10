import { BaseService } from "./BaseService";

export class ClassService extends BaseService {
  constructor() {
    super();
  }

  getAllClass = () => {
    return this.get_token("/admins/classes/");
  };

  addClass = (payload) => {
    return this.post_token(`/admins/classes/`, payload)
  }

  editClass = (id, payload) => {
    return this.put(`/admins/classes/${id}`, payload)
  }
}

export const classService = new ClassService();