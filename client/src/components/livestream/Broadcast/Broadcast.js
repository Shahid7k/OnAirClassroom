import React, { useEffect, useState, useRef } from "react";
import useSocket from "use-socket.io-client";
import axios from "axios";

import useUserMedia from "../useUserMedia/useUserMedia";

const Broadcast = () => {
  const [broadcaster, setBroadcaster] = useState("");
  const [name, setName] = useState("");
  const [peerConnections, setPeerConnections] = useState({});
  const [numberOfViewers, setNumberOfViewers] = useState(0);
  const [broadcastLaunched, setBroadcastLaunched] = useState(false);
  const [constraints, setConstraints] = useState({
    audio: true,
    video: { facingMode: "user" },
  });

  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
      },
    ],
  };

  const ENDPOINT = "http://127.0.0.1:4004";
  const [socket] = useSocket(ENDPOINT);

  const videoRef = useRef();
  const mediaStream = useUserMedia(constraints);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  useEffect(() => {
    socket.on("broadcaster", (id) => {
      setBroadcaster(id);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("watcher", (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;

      setPeerConnections({...peerConnections});
      let stream = videoRef.current.srcObject;

      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offer", id, peerConnection.localDescription);
        });
      console.log(peerConnections);
      console.log(Object.keys(peerConnections));
      setNumberOfViewers(Object.keys(peerConnections).length);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("answer", (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("candidate", (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });
  }, [socket]);

  useEffect(() => {
    socket.on("disconnectPeer", (id) => {
      peerConnections[id].close();
      delete peerConnections[id];
      setNumberOfViewers(Object.keys(peerConnections).length);
    });
  }, [socket]);

  useEffect(() => {
    window.onunload = window.onbeforeunload = () => {
      disconnectBroadcaster();
      socket.close();
    };
  }, [window]);

  const handleCanPlay = () => {
    videoRef.current.play();
  };

  const handleNewBroadcaster = () => {
    socket.emit("broadcaster", socket.id);
  };

  const launchBroadcast = async () => {
    try {
      let response = await axios.post(
        `http://localhost:4004/api/broadcasters/new/${broadcaster}`,
        {
          username: name,
        }
      );
      setBroadcastLaunched(true);
      let broadcasterData = response.data.payload;
      socket.emit("new-broadcaster", broadcasterData);
      return broadcasterData;
    } catch (error) {
      console.log("err:", error);
    }
  };

  const disconnectBroadcaster = async () => {
    try {
      let offTheAir = await axios.patch(
        `http://localhost:4004/api/broadcasters/${broadcaster}`,
        {
          broadcaster_active: "false",
        }
      );
      socket.emit("stop-broadcaster");
      return offTheAir;
    } catch (error) {
      console.log("err:", error);
    }
  };

  const shareScreen = async () => {
    try {
      console.log(peerConnections);
      console.log(Object.keys(peerConnections));
      navigator.mediaDevices.getDisplayMedia({ cursor: true }).then((str) => {
        const screenTrack = str.getTracks()[0];

        Object.keys(peerConnections).forEach((key) =>
          peerConnections[key]
            .getSenders()
            .find((s) => s.track.kind === "video")
            .replaceTrack(screenTrack)
        );
        const userVideoTrack = videoRef.current.srcObject.getTracks().find((track) => track.kind === "video");
        screenTrack.onended = () =>{
          Object.keys(peerConnections).forEach((key) =>
          peerConnections[key]
            .getSenders()
            .find((s) => s.track.kind === "video")
            .replaceTrack(userVideoTrack)
        );
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
        <div class="container">
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
          <div class="card-header">Example Card</div>
          <div class="card-body">
            <video
              className="video"
              autoPlay={true}
              muted
              ref={videoRef}
              onCanPlay={handleCanPlay}
              playsInline
              muted
            />
            <div className="name-input">
              <input
                placeholder="Enter your username"
                className="form-control joinInput"
                type="text"
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="my-3">
              <button
                className="btn btn-dark"
                onClick={() => handleNewBroadcaster()}
              >
                Connect
              </button>
              <button
                disabled={broadcastLaunched ? true : false}
                className="btn btn-primary mx-3"
                onClick={(e) => (!name ? e.preventDefault : launchBroadcast())}
              >
                Start Broadcast
              </button>
              <button
                className="btn btn-danger"
                onClick={() => disconnectBroadcaster()}
              >
                End Broadcast
              </button>
              <button className="ml-3 btn btn-danger" onClick={shareScreen}>
                Share Screen
              </button>
            </div>
            <h3>Viewers: {numberOfViewers}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Broadcast;
