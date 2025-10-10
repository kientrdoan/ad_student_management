import { GET_ALL_ROOM } from "../types/RoomType";

const stateDefault = {
  room_detail: {},
  rooms: []
};

export const RoomReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_ROOM: {
      state.rooms = action.rooms;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};