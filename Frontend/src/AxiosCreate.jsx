import axios from "axios";

const getTokenFromLocalStorage = (type) => {
  const persistedLoginData = localStorage.getItem("persist:logindata");
  const loginData = persistedLoginData ? JSON.parse(persistedLoginData) : {};

  let loginInfo;

  if (type === "user") {
    loginInfo = loginData.userlogin ? JSON.parse(loginData.userlogin).LoginInfo[0] : null;
  } 

  console.log(`Token for ${type}:`, loginInfo?.Token || '');
  return loginInfo ? loginInfo.Token : '';
};

const SampleUrl = 'http://localhost:5000';

export const basicRequest = axios.create({
  baseURL: SampleUrl,
});

export const UserTokenRequest = axios.create({
  baseURL: SampleUrl,
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage("user")}` },
});


