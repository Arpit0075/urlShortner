import React from "react";
import { useState } from "react";

function Register() {
  const [userRegister, setuserRegister] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const [tempPassword, setTempPassword] = useState("");

  const [confirm, setConfirm] = useState({
    err: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserRegister((prev) => ({ ...prev, [name]: value }));
  };

  //post request to register user
  const hanldeSubmit = async (e) => {
    e.preventDefault();

    const deployedUrl = "https://urlshortner-react.herokuapp.com/register";

    const response = await fetch(deployedUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userRegister),
    });

    const data = await response.json();
    setMessage(data.message);

    //after 2 secs it will disappear
    setTimeout(() => {
      setMessage("");
    }, 2000);

    // now do whatever you want with the data
    //console.log(data);
    setuserRegister({ name: "", email: "", password: "" });
    localStorage.setItem("authToken", data.authToken);
  };

  //post req to activate route
  const activateAccount = async (e) => {
    e.preventDefault();

    const deployedUrl = "https://urlshortner-react.herokuapp.com/activate";

    const response = await fetch(deployedUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authToken: localStorage.getItem("authToken"),
      },
      body: JSON.stringify({ tempPassword }),
    });

    const data = await response.json();

    setTempPassword("");

    setConfirm({ ...confirm, err: data.err, message: data.message });
    setTimeout(() => {
      setConfirm({ ...confirm, err: "", message: "" });
    }, 3000);

    localStorage.removeItem("authToken");
  };

  return (
    <div>
      <form onSubmit={hanldeSubmit}>
        <h3> Register</h3>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Name
          </label>
          <div className="col-sm-10">
            <input
              type="name"
              className="form-control"
              onChange={handleChange}
              name="name"
              value={userRegister.name}
            />
          </div>
        </div>
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
              value={userRegister.email}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              className="form-control"
              onChange={handleChange}
              name="password"
              value={userRegister.password}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <div className="message">{message}</div>

      {/* div for account activation */}

      <div className="row mb-3 my-5">
        <h3>Enter one time pin below to activate your account</h3>
        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
          One time password
        </label>
        <div className="col-sm-10">
          <input
            type="password"
            className="form-control"
            onChange={(e) => {
              setTempPassword(e.target.value);
            }}
            value={tempPassword}
          />
        </div>
      </div>
      <button onClick={activateAccount} className="btn btn-primary">
        Activate account
      </button>

      {/* showing message to confirm data received from backend */}
      <p>{confirm.message}</p>
      <p>{confirm.err}</p>
    </div>
  );
}

export default Register;
