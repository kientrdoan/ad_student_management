import { GET_ALL_COURSE } from "../types/CourseType";

const stateDefault = {
  course_detail: {},
  courses: []
};

export const CourseReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_COURSE: {
      state.courses = action.courses;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};