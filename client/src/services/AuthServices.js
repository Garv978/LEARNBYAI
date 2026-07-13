import API from '../api';

export const register = (userData) =>{
  return API.post("/register", userData)
};

export const login = (userData) =>{
  return API.post("/login", userData)
};
