import { BaseService } from "./BaseService";

export class SubjectService extends BaseService {
  constructor() {
    super();
  }

  getAllSubject = (payload) => {
    return this.get_token(`/admins/subjects/`, payload);
  };

  getSubject = (id) => {
    return this.get_token(`/admins/subjects/${id}`);
  };

  getSubjectByMajor = (major_id) => {
    return this.get_token(`/admins/majors/subjects/${major_id}`);
  };

  addSubject = (payload) => {
    return this.post_token(`/admins/subjects/`, payload)
  }

  editSubject = (id, payload) => {
    return this.put(`/admins/subjects/${id}`, payload)
  }

  deleteSubject = (id) => {
    return this.delete(`/admins/subjects/${id}`)
  }
}

export const subjectService = new SubjectService();