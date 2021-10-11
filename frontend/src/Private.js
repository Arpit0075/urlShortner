import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Private() {
  let history = useHistory();

  //state for sending url to backend
  const [enterurl, setEnterurl] = useState("");

  //setting state for urls getting from backend
  const [urls, setUrls] = useState([]);

  //for clicks
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const localUrl = "http://localhost:3001/private";

        const res = await fetch(localUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authToken: localStorage.getItem("authToken"),
          },
        });
        const data = await res.json();
        //console.log(data);
        setUrls(data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const shortenUrl = async (e) => {
    e.preventDefault();

    try {
      const localUrl = "http://localhost:3001/private";

      const res = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("authToken"),
        },
        body: JSON.stringify({ url: enterurl }),
      });
      const data = await res.json();
      setEnterurl("");
      //console.log(data);
      let arr = [...urls];
      arr.push(data);
      setUrls(arr);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Welcome!</h1>

      {/* input to enter url */}
      <div className="row mb-3 my-5">
        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
          Enter Url
        </label>
        <div className="col-sm-8">
          <input
            type="name"
            className="form-control"
            onChange={(e) => {
              setEnterurl(e.target.value);
            }}
            value={enterurl}
          />
        </div>
      </div>
      <button onClick={shortenUrl} className="btn btn-primary">
        Shorten url
      </button>

      {/* display all the user's url */}

      <h3 className="m-3">User Data</h3>
      {urls.map((url) => {
        return (
          <div
            style={{
              backgroundColor: "wheat",
              maxWidth: "330px",
              margin: "auto",
              borderRadius: "12px",
              marginBottom: "5px",
            }}
            key={url._id}
          >
            <p>
              URL:
              <a href={url.url} target="_blank" rel="noreferrer">
                {url.url}
              </a>
            </p>
            <p>
              Shorteded URL:
              <a
                onClick={() => {
                  setClicks(clicks + 1);
                }}
                href={url.shortenedUrl}
                target="_blank"
                rel="noreferrer"
              >
                {url.shortenedUrl}
              </a>
            </p>
            <p>Clicks: {clicks}</p>
          </div>
        );
      })}

      <button
        onClick={() => {
          localStorage.removeItem("authToken");
          history.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Private;
