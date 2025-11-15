/* eslint-disable no-unused-vars */

import { studentService } from "../../../service/StudentService";
import { GET_ALL_STUDENT } from "../types/StudentType";



export const getAllStudentAction = (statusFilter) => {
  return async (dispatch) => {
    try {
      var payload = {}
      if (statusFilter !== "all"){
         payload = {
          is_deleted: statusFilter === "active"? 0: 1,
        }
      }
      const result = await studentService.getAll(payload);
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_STUDENT,
          students: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const getStudentAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await studentService.getStudent(id);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const addStudentAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await studentService.addStudent(payload);
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


export const editStudentAction = (id, payload) => {
  return async (dispatch) => {
    try {
      const result = await studentService.editStudent(id, payload);
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

export const deleteStudentAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await studentService.deleteStudent(id);
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