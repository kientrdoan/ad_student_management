/* eslint-disable no-unused-vars */

import { subjectService } from "../../../service/Subject";
import { GET_ALL_SUBJECT } from "../types/SubjectType";



export const getAllSubjectAction = () => {
  return async (dispatch) => {
    try {
      const result = await subjectService.getAllSubject();
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_SUBJECT,
          subjects: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const getSubjectAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await subjectService.getSubject(id);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const addSubjectAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await subjectService.addSubject(payload);
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


export const editSubjectAction = (id, payload) => {
  return async (dispatch) => {
    try {
      const result = await subjectService.editSubject(id, payload);
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

export const deleteSubjectAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await subjectService.deleteSubject(id);
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