export const BASE_URL = "https://api.nomoreparties.co";

// getContent accepts the token as an argument
export const getUserInfo = (token) => {
  // send a GET request to /users/me
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      // specify an authorization header with an appropriately formatted value
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  });
};
