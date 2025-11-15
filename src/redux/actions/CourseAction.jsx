/* eslint-disable no-unused-vars */

import axios from "axios";
import { courseService } from "../../../service/CourseService";
import { GET_ALL_COURSE } from "../types/CourseType";
import { DOMAIN } from "../../../utils/Config";



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


// export const setScheduleAction = (payload) => {
//   return async (dispatch) => {
//     try {
//       const result = await courseService.setSchedule(payload);
//       console.log("result", result.data);
//       if (result.status === 200) {
//         // dispatch({
//         //   type: GET_ALL_COURSE,
//         //   courses: result.data.data,
//         // });
//         return { success: true, data: result.data.data };
//       }
//     } catch (error) {
//       console.log("error", error);
//       return { success: false, error };
//     }
//   };
// };


export const setScheduleAction = (data) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("semester_id", data.semester_id);

    if (data.excel_file) formData.append("excel_file", data.excel_file);

    if (data.holiday_file) formData.append("holiday_file", data.holiday_file);
    
    if (data.population_size)
      formData.append("population_size", data.population_size);
    
    if (data.generations) formData.append("generations", data.generations);

    const res = await axios.post(`${DOMAIN}/admins/schedule/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true};
  } catch (err) {
    console.error("Error setScheduleAction:", err);
    return { success: false, message: "Lỗi khi chạy thuật toán xếp lịch!" };
  }
};



export const resetScheduleAction = (semester_id) => {
  return async (dispatch) => {
    try {
      const result = await courseService.resetSchedule(semester_id);
      console.log("result", result.data);
      if (result.status === 200) {
        // dispatch({
        //   type: GET_ALL_COURSE,
        //   courses: result.data.data,
        // });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};


export const getAllCourseBySemesterAction = (semester_id, statusFilter) => {
  return async (dispatch) => {
    try {
      var payload = {}
      if(statusFilter !== "all"){
        payload = {
          is_deleted: statusFilter === "active"? 0: 1,
        }
      }
      const result = await courseService.getAllCourseBySemester(semester_id, payload);
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