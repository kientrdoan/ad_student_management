import { GET_ALL_CLASS } from "../types/ClassType";
import { GET_ALL_STUDENT } from "../types/StudentType";


const stateDefault = {
  student_detail: {},
  students: []
};

export const StudentReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_STUDENT: {
      state.students = action.students;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};