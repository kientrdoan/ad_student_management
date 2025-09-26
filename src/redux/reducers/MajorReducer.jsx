import { GET_ALL_MAJOR } from "../types/MajorType";


const stateDefault = {
  major_detail: {},
  majors: []
};

export const MajorReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_MAJOR: {
      state.majors = action.majors;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};