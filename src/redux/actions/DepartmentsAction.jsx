/* eslint-disable no-unused-vars */

import { departmentService } from "../../../service/DepartmentService";
import { GET_ALL } from "../types/DepartmentType";

export const getAllAction = (statusFilter) => {
  return async (dispatch) => {
    var payload = {};
    try {
      if (statusFilter !== "all") {
        payload = {
          is_deleted: statusFilter === "active" ? 0 : 1,
        };
      } 
      const result = await departmentService.getAll(payload);
      if (result.status === 200) {
        dispatch({
          type: GET_ALL,
          departments: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const addDepartmentAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await departmentService.addDepartment(payload);
      console.log("result", result.data);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
      // if (result.status=== 400) {
      //   return { success: false, error: result.data.message };
      // }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const editDepartmentAction = (id, payload) => {
  return async (dispatch) => {
    try {
      const result = await departmentService.editDepartment(id, payload);
      console.log("result", result);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const deleteDepartmentAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await departmentService.deleteDepartment(id);
      console.log("result", result);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};
