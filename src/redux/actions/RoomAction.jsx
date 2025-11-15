/* eslint-disable no-unused-vars */

import { roomService } from "../../../service/RoomService";
import { GET_ALL_ROOM } from "../types/RoomType";


export const getAllRoomAction = (statusFilter) => {
  return async (dispatch) => {
    try {
      var payload = {}
      if (statusFilter !== "all"){
        payload = {
          is_active: statusFilter==='active'?1:0
        }
      }
      const result = await roomService.getAllRoom(payload);
      console.log("result", result.data);
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_ROOM,
          rooms: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const getRoomAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await roomService.getRoom(id);
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

export const addRoomAction = (payload) => {
  return async (dispatch) => {
    try {
      console.log("payload", payload)
      const result = await roomService.addRoom(payload);
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


export const editRoomAction = (id, payload) => {
  return async (dispatch) => {
    try {
      const result = await roomService.editRoom(id, payload);
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


export const deleteRoomAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await roomService.deleteRoom(id);
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