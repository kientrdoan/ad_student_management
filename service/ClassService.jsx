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
    return this.put_token(`/admins/classes/${id}`, payload)
  }

  deleteClass = (id) => {
    return this.delete_token(`/admins/classes/${id}`)
  }
}

export const classService = new ClassService();