import { GET_ALL_TEACHER } from "../types/TeacherType";


const stateDefault = {
  teacher_detail: {},
  teachers: []
};

export const TeacherReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_TEACHER: {
      state.teachers = action.teachers;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};