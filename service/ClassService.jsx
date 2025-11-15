import { BaseService } from "./BaseService";

export class ClassService extends BaseService {
  constructor() {
    super();
  }

  getAllClass = (payload) => {
    return this.get_token(`/admins/classes/`, payload);
  };

  addClass = (payload) => {
    return this.post_token(`/admins/classes/`, payload)
  }

  editClass = (id, payload) => {
    return this.put(`/admins/classes/${id}`, payload)
  }

  deleteClass = (id) => {
    return this.delete(`/admins/classes/${id}`)
  }
}

export const classService = new ClassService();