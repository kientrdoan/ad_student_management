import { BaseService } from "./BaseService";

export class SemesterService extends BaseService {
  constructor() {
    super();
  }

  getAllSemester = (payload) => {
    return this.get_token(`/admins/semesters/`, payload);
  };

  getSemester = (id) => {
    return this.get_token(`/admins/semesters/${id}`);
  };

  getCurrentSemester = () => {
    return this.get_token(`/admins/current-semesters`);
  };

  addSemester = (payload) => {
    return this.post_token(`/admins/semesters/`, payload)
  }

  editSemester = (id, payload) => {
    return this.put_token(`/admins/semesters/${id}`, payload)
  }

  deleteSemester = (id) => {
    return this.delete_token(`/admins/semesters/${id}`)
  }
}

export const semesterService = new SemesterService();