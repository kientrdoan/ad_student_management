/* eslint-disable no-unused-vars */

import { timeSlotService } from "../../../service/TimeSlot";
import { GET_ALL_TIME_SLOT } from "../types/TimeSlotType";

export const getAllTimeSlotAction = (course_id) => {
  return async (dispatch) => {
    try {
      const result = await timeSlotService.getTimeSlotByCourse(course_id);
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_TIME_SLOT,
          time_slots: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const updateDateTimeSlotAction = (course_id, payload) => {
  return async (dispatch) => {
    try {
      const result = await timeSlotService.updateDateTimeSlotByCourse(course_id, payload);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

