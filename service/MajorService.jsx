import { BaseService } from "./BaseService";

export class MajorService extends BaseService {
  constructor() {
    super();
  }

  getAll = () => {
    return this.get_token("/admins/majors/");
  };

  addMajor = (payload) => {
    return this.post_token(`/admins/majors/`, payload)
  }

  editMajor = (id, payload) => {
    return this.put(`/admins/majors/${id}`, payload)
  }

  deleteMajor = (id) => {
    return this.delete(`/admins/majors/${id}`)
  }
}

export const majorService = new MajorService();