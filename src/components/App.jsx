import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import * as auth from "../utils/auth";

import "./styles/App.css";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleRegistration = ({ username, email, password, confirmPassword }) => {
    console.log("in handleRegistration");
    if (password === confirmPassword) {
      auth
        .register(username, password, email)
        .then(() => {
          // TODO: handle succesful registration
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
        //  TODO update: for now we just log the response data to the console
        console.log(data);
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
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin} />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
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
