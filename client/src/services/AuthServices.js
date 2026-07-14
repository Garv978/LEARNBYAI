import API from '../api';
import VerifyEmail from '../pages/VerifyEmail';

export const register = (userData) =>{
  return API.post("/auth/register", userData)
};

export const login = (userData) =>{
  return API.post("/auth/login", userData)
};

export const logout = (userData) => {
  return API.delete("/auth/logout", userData);
}
export const refresh = () =>{
  return API.post('/auth/refresh', userData)
}
export const verifyEmail = (userData) =>{
  return API.post('/auth/verify-email', userData)
}
