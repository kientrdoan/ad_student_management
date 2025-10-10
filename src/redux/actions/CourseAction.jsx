/* eslint-disable no-unused-vars */

import { courseService } from "../../../service/CourseService";
import { GET_ALL_COURSE } from "../types/CourseType";



export const getAllCourseAction = () => {
  return async (dispatch) => {
    try {
      const result = await courseService.getAllCourse();
      console.log("result", result.data);
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_COURSE,
          courses: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const getCourseAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await courseService.getCourse(id);
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

export const addCourseAction = (payload) => {
  return async (dispatch) => {
    try {
      const result = await courseService.addCourse(payload);
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


export const editCourseAction = (id, payload) => {
  return async (dispatch) => {
    try {
      const result = await courseService.editCourse(id, payload);
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


export const deleteCourseAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await courseService.deleteCourse(id);
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