import { GET_ALL_SUBJECT } from "../types/SubjectType";

const stateDefault = {
  subject_detail: {},
  subjects: []
};

export const SubjectReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_SUBJECT: {
      state.subjects = action.subjects;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};