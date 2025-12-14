import { BaseService } from "./BaseService";

export class MajorService extends BaseService {
  constructor() {
    super();
  }

  getAll = (payload) => {
    return this.get_token(`/admins/majors/`, payload);
  };

  addMajor = (payload) => {
    return this.post_token(`/admins/majors/`, payload)
  }

  editMajor = (id, payload) => {
    return this.put_token(`/admins/majors/${id}`, payload)
  }

  deleteMajor = (id) => {
    return this.delete_token(`/admins/majors/${id}`)
  }
}

export const majorService = new MajorService();