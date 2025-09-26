import { BaseService } from "./BaseService";

export class DepartmentService extends BaseService {
  constructor() {
    super();
  }

  getAll = () => {
    return this.get_token("/admins/departments/");
  };

  addDepartment = (payload) => {
    return this.post_token(`/admins/departments/`, payload)
  }

  editDepartment = (payload) => {
    return this.put(`/admins/departments/`, payload)
  }
}

export const departmentService = new DepartmentService();