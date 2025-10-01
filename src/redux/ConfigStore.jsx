import {applyMiddleware, combineReducers, createStore} from 'redux';
import { thunk } from 'redux-thunk';
import { UserReducer } from './reducers/UserRedeucer';
import { DepartmentReducer } from './reducers/Department';
import { MajorReducer } from './reducers/MajorReducer';
import { ClassReducer } from './reducers/ClassReducer';
import { StudentReducer } from './reducers/StudentReducer';
import { TeacherReducer } from './reducers/TeacherReducer';
const dummyReducer = (state = {}, ) => state;

const rootReducer = combineReducers({
  // Add your reducers here
  UserReducer,
  DepartmentReducer,
  MajorReducer,
  ClassReducer,
  StudentReducer,
  TeacherReducer,
  dummy: dummyReducer
})

export const store= createStore(
  rootReducer, applyMiddleware(thunk)
);