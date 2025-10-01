/* eslint-disable no-unused-vars */

import { teacherService } from "../../../service/TeacherService";
import { GET_ALL_TEACHER } from "../types/TeacherType";

export const getAllTeacherAction = () => {
  return async (dispatch) => {
    try {
      const result = await teacherService.getAllTeacher();
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