import { GET_ALL_SUBJECT, GET_ALL_SUBJECT_BY_MAJOR } from "../types/SubjectType";

const stateDefault = {
  subject_detail: {},
  subjects: [],
  subjects_majors: [],
};

export const SubjectReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_SUBJECT: {
      state.subjects = action.subjects;
      return { ...state };
    }

    case GET_ALL_SUBJECT_BY_MAJOR: {
      console.log("reducer", action.subjects_majors)
      state.subjects_majors = action.subjects_majors;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};