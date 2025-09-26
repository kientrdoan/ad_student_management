/* eslint-disable no-unused-vars */

import { majorService } from "../../../service/MajorService";
import { GET_ALL_MAJOR } from "../types/MajorType";


export const getAllMajorAction = () => {
  return async (dispatch) => {
    try {
      const result = await majorService.getAll();
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_MAJOR,
          majors: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const addMajorAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await majorService.addMajor(payload);
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


export const editMajorAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await majorService.addDepartment(payload);
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