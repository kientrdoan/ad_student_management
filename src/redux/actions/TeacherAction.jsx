/* eslint-disable no-unused-vars */

import { teacherService } from "../../../service/TeacherService";
import { GET_ALL_TEACHER, GET_ALL_TEACHER_BY_DEPARTMENT } from "../types/TeacherType";

export const getAllTeacherAction = (statusFilter) => {
  return async (dispatch) => {
    try {
      var payload = {}
      if(statusFilter !== "all"){
        payload = {
          is_deleted: statusFilter==="active"? 0 : 1,
        }
      }
      const result = await teacherService.getAllTeacher(payload);
      console.log("result", result.data);
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_TEACHER,
          teachers: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const getTeacherAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await teacherService.getTeacher(id);
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

export const getTeacherByDepartmentAction = (department_id) => {
  return async (dispatch) => {
    try {
      const result = await teacherService.getTeacherByDepartment(department_id);
      console.log("result", result.data);
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_TEACHER_BY_DEPARTMENT,
          teacher_departments: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const addTeacherAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await teacherService.addTeacher(payload);
      console.log("result", result)
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};


export const editTeacherAction = (id, payload) => {
  return async (dispatch) => {
    try {
      const result = await teacherService.editTeacher(id, payload);
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


export const deleteTeacherAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await teacherService.deleteTeacher(id);
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