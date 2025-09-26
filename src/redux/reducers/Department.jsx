import { GET_ALL } from "../types/DepartmentType";

const stateDefault = {
  department_detail: {},
  departments: []
};

export const DepartmentReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL: {
      console.log("action.departments", action.departments);
      state.departments = action.departments;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};