/* eslint-disable no-unused-vars */

import { semesterService } from "../../../service/SemesterService";
import Semester from "../../pages/Semester";
import { GET_ALL_SEMESTER, GET_CURRENT_SEMESTER } from "../types/SemesterType";


export const getAllSemesterAction = () => {
  return async (dispatch) => {
    try {
      const result = await semesterService.getAllSemester();
      console.log("result", result.data);
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_SEMESTER,
          semesters: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const getSemesterAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await semesterService.getSemester(id);
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

export const getCurrentSemesterAction = () => {
  return async (dispatch) => {
    try {
      const result = await semesterService.getCurrentSemester();
      console.log("result", result.data);
      if (result.status === 200) {
        dispatch({
          type: GET_CURRENT_SEMESTER,
          current_semester: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const addSemesterAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await semesterService.addSemester(payload);
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


export const editSemesterAction = (id, payload) => {
  return async (dispatch) => {
    try {
      const result = await semesterService.editSemester(id, payload);
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


export const deleteSemesterAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await semesterService.deleteSemester(id);
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