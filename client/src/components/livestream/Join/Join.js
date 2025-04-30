import React, { useEffect, useState } from "react";
import useSocket from "use-socket.io-client";
import { Link } from "react-router-dom";
import axios from "axios";
import LinksContainer from "../LinksContainer/LinksContainer";

const Join = () => {
  const [broadcasters, setBroadcasters] = useState([]);
  const [isStudent, setIsStudent] = useState(false);
  const ENDPOINT = "http://127.0.0.1:4004";
  const [socket] = useSocket(ENDPOINT);

  useEffect(() => {
    socket.on("active-broadcaster", (broadcaster) => {
      let broadcastersCopy = [...broadcasters, broadcaster];
      setBroadcasters(broadcastersCopy);
    });
  }, [socket, broadcasters]);

  const findActiveStreams = async () => {
    let activeStreams = await axios.get(
      `http://localhost:4004/api/broadcasters/active`
    );
    let streams = activeStreams.data.payload;
    setBroadcasters(streams);
  };

  useEffect(() => {
    findActiveStreams();
  }, []);

  const toggleRole = (e) =>{
    e.preventDefault();
    setIsStudent(!isStudent);
  }



  return !isStudent ? (
    <div class="container mt-3">
      <button className="btn btn-dark" onClick={toggleRole}>Toggle</button>
      <header class="card card-waves">
        <div class="card-body px-5 pt-5 pb-0">
          <div class="row align-items-center justify-content-between">
            <div class="col-lg-6">
              <h1 class="text-primary">How can we help?</h1>
              <p class="lead mb-4">
                Search our knowledge base to find answers, or contact us
                directly if you're having issues!
              </p>
              <div class="shadow rounded">
                <div class="input-group input-group-joined input-group-joined-xl border-0">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Search..."
                    aria-label="Search"
                    autofocus
                  />
                  <div class="input-group-append">
                    <span class="input-group-text">
                      <i data-feather="search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <img class="img-fluid" src="problem-solving-pana.svg" />
            </div>
          </div>
          <nav class="nav nav-borders">
            <a class="nav-link active ml-0" href="#!">
              Getting Started
            </a>
            <a class="nav-link" href="#!">
              Tutorials
            </a>
            <a class="nav-link" href="#!">
              Licensing
            </a>
            <a class="nav-link" href="#!">
              Terms &amp; Conditions
            </a>
            <a class="nav-link" href="#!">
              Support
            </a>
          </nav>
        </div>
      </header>
      <h4 class="mb-0 mt-5">Main Categories</h4>
      <hr class="mt-2 mb-4" />
      <h3> Available livestreams are listed below!</h3>
      <div className="join__links-container">
        <LinksContainer broadcasters={broadcasters} />{" "}
      </div>
      <div class="card">
        <div class="card-header"> Example Card </div>
        <div class="card-body">
          <Link to={`/broadcast`}>
            <button className={"btn btn-secondary"} type="submit">
              {" "}
              Start Broadcasting{" "}
            </button>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <>
      <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
        <div class="container">
          <button className="btn btn-dark" onClick={toggleRole}>Toggle</button>
          <div class="page-header-content pt-4">
            <div class="row align-items-center justify-content-between">
              <div class="col-auto mt-4">
                <h1 class="page-header-title">
                  <div class="page-header-icon">
                    <i data-feather="file"></i>
                  </div>
                  Blank Starter
                </h1>
                <div class="page-header-subtitle">
                  Use this blank page as a starting point for creating new pages
                  inside your project!
                </div>
              </div>
              <div class="col-12 col-xl-auto mt-4">
                Optional page header content
              </div>
            </div>
          </div>
        </div>
      </header>
      <div class="container mt-n10">
        <div class="card">
          <div class="card-header"> Example Card </div>
          <div class="card-body">
            <Link to={`/broadcast`}>
              <button className={"btn btn-secondary"} type="submit">
                {" "}
                Start Broadcasting{" "}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Join;
