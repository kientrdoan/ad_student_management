/* eslint-disable no-unused-vars */

import { departmentService } from "../../../service/DepartmentService";
import { GET_ALL } from "../types/DepartmentType";


export const getAllAction = () => {
  return async (dispatch) => {
    try {
      const result = await departmentService.getAll();
      console.log("result departments", result);
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
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};


export const editDepartmentAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await departmentService.addDepartment(payload);
      console.log("result", result.data);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};