import { BaseService } from "./BaseService";

export class SemesterService extends BaseService {
  constructor() {
    super();
  }

  getAllSemester = () => {
    return this.get_token("/admins/semesters/");
  };

  getSemester = (id) => {
    return this.get_token(`/admins/semesters/${id}`);
  };

  addSemester = (payload) => {
    return this.post_token(`/admins/semesters/`, payload)
  }

  editSemester = (id, payload) => {
    return this.put(`/admins/semesters/${id}`, payload)
  }

  deleteSemester = (id) => {
    return this.delete(`/admins/semesters/${id}`)
  }
}

export const semesterService = new SemesterService();