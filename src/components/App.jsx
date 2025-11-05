import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../utils/token";

import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import * as auth from "../utils/auth";
import * as api from "../utils/api";

import "./styles/App.css";

function App() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // invoke the hook
  const location = useLocation();

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }
    // handle JWT
    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        //if response is successful, log the user in, save their data to state and navigate them to /ducks
        setIsLoggedIn(true);
        setUserData({ username, email });
      })
      .catch(console.error);
  }, []);
  // Since the dependency array is empty, the code in this useEffect will only be run when the App component first loads. It attempts to retrieve a JWT from local storage, and if it isn’t present, it returns without doing anything else

  const handleRegistration = ({ username, email, password, confirmPassword }) => {
    console.log("in handleRegistration");
    if (password === confirmPassword) {
      auth
        .register(username, password, email)
        .then(() => {
          // handle succesful registration
          navigate("/login");
        })
        .catch(console.error);
    }
  };

  // handleLogin accepts one parameter: an object with two properties.
  const handleLogin = ({ username, password }) => {
    // If username or password empty, return without sending a request.
    if (!username || !password) {
      return;
    }
    // We pass the username and password as positional arguments. The authorize function is set up to rename `username` to `identifier` before sending a request to the server, because that is what the API is expecting.
    auth
      .authorize(username, password)
      .then((data) => {
        // Verify that a jwt is included before logging the user in.
        if (data.jwt) {
          setToken(data.jwt); // save token to local storage
          setUserData(data.user); //save user's data to state
          setIsLoggedIn(true); //log the user in

          const redirectPath = location.state?.from?.pathname || "/ducks";
          navigate(redirectPath); //send them to /ducks
        }
      })
      .catch(console.error);
  };

  return (
    <Routes>
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile userData={userData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
            <div className="loginContainer">
              <Login handleLogin={handleLogin} />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
            <div className="registerContainer">
              <Register handleRegistration={handleRegistration} />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={isLoggedIn ? <Navigate to="/ducks" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
