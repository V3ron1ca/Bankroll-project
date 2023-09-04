import jwt_decode from "jwt-decode";
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

const getToken = () => {
  let token = localStorage.getItem("token");
  if (token == null) {
    return null;
  }
  let decodedToken = jwt_decode(token);
  //console.log("Decoded Token", decodedToken);
  let currentDate = new Date();

  // JWT exp is in seconds
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    //console.log("Token expired.");
    return null;
  } else {
    //console.log("Valid token");
    return token;
  }
};

export const isAuthrozied = () => {
    return getToken() != null;
}

export default getToken;
