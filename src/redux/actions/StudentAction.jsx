/* eslint-disable no-unused-vars */

import { studentService } from "../../../service/StudentService";
import { GET_ALL_STUDENT } from "../types/StudentType";



export const getAllStudentAction = () => {
  return async (dispatch) => {
    try {
      const result = await studentService.getAll();
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


export const editClassAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await studentService.editStudent(payload);
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