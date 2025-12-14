import { BaseService } from "./BaseService";

export class DepartmentService extends BaseService {
  constructor() {
    super();
  }

  getAll = (payload) => {
    return this.get_token(`/admins/departments/`, payload);
  };

  addDepartment = (payload) => {
    return this.post_token(`/admins/departments/`, payload)
  }

  editDepartment = (id, payload) => {
    return this.put_token(`/admins/departments/${id}`, payload)
  }

  deleteDepartment = (id) => {
    return this.delete_token(`/admins/departments/${id}`)
  }
}

export const departmentService = new DepartmentService();