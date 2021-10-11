import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function Login() {
  const history = useHistory();
  const [userLogin, setuserLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserLogin((prev) => ({ ...prev, [name]: value }));
  };

  const hanldeSubmit = async (e) => {
    e.preventDefault();
    try {
      //const deployedUrl = "https://password-reset123.herokuapp.com/login";

      const localUrl = "http://localhost:3001/login";

      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userLogin),
      });

      const data = await response.json();

      // now do whatever you want with the data
      //console.log(data);
      //if we get authToken in response then we store it in local storage and redirect user to private route
      if (data.authToken) {
        localStorage.setItem("authToken", data.authToken);
        history.push("/private");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h3>Welcome to our Home Page</h3>
      <form onSubmit={hanldeSubmit}>
        <h3>Login</h3>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              type="email"
              className="form-control"
              onChange={handleChange}
              name="email"
              value={userLogin.email}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              className="form-control"
              onChange={handleChange}
              name="password"
              value={userLogin.password}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <Link to="/forgotPassword">
        <button className="btn btn-primary my-3">Forgot Password</button>
      </Link>
      <div className="message"></div>
    </div>
  );
}

export default Login;
