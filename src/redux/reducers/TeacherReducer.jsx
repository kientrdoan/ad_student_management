import { GET_ALL_TEACHER, GET_ALL_TEACHER_BY_DEPARTMENT } from "../types/TeacherType";


const stateDefault = {
  teacher_detail: {},
  teachers: [],
  teacher_departments: []
};

export const TeacherReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_TEACHER: {
      state.teachers = action.teachers;
      return { ...state };
    }

    case GET_ALL_TEACHER_BY_DEPARTMENT: {
      state.teacher_departments = action.teacher_departments;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};