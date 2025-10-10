/* eslint-disable no-unused-vars */

import { classService } from "../../../service/ClassService";
import { GET_ALL_CLASS } from "../types/ClassType";



export const getAllClassAction = () => {
  return async (dispatch) => {
    try {
      const result = await classService.getAllClass();
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_CLASS,
          classes: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const addClassAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await classService.addClass(payload);
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


export const editClassAction = (id, payload) => {
  return async (dispatch) => {
    try {
      const result = await classService.editClass(id, payload);
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