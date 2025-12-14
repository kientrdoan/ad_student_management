import { GET_ALL_TIME_SLOT } from "../types/TimeSlotType";


const stateDefault = {
  time_slots: []
};

export const TimeSlotReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_TIME_SLOT: {
      state.time_slots = action.time_slots;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};