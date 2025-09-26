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

  editMajor = (payload) => {
    return this.put(`/admins/majors/${payload.id}`, payload)
  }
}

export const majorService = new MajorService();