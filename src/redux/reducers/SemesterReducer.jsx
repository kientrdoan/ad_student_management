import { GET_ALL_SEMESTER, GET_CURRENT_SEMESTER } from "../types/SemesterType";

const stateDefault = {
  semester_detail: {},
  current_semester: {},
  semesters: []
};

export const SemesterReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_SEMESTER: {
      state.semesters = action.semesters;
      return { ...state };
    }

    case GET_CURRENT_SEMESTER: {
      state.current_semester = action.current_semester;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};