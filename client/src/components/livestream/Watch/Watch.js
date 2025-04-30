import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useSocket from "use-socket.io-client";
import './Watch.css';

const Watch = () => {
  let { broadcasterId } = useParams();

  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
      },
    ],
  };

  const ENDPOINT = "http://127.0.0.1:4004";
  const [socket] = useSocket(ENDPOINT);

  let peerConnection;
  const videoRef = useRef();

  useEffect(() => {
    socket.on("offer", (id, description) => {
      peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answer", id, peerConnection.localDescription);
        });
      peerConnection.ontrack = (event) => {
        videoRef.current.srcObject = event.streams[0];
      };
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    });
  }, [socket]);

  useEffect(() => {
    socket.on("candidate", (id, candidate) => {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });
  }, [socket]);

  useEffect(() => {
    socket.on("disconnectPeer", () => {
      peerConnection.close();
    });
  }, [socket]);

  useEffect(() => {
    window.onunload = window.onbeforeunload = () => {
      socket.emit("watcher-disconnect");
      peerConnection.close();
      socket.close();
    };
  }, [window]);

  const handleWatcher = () => {
    socket.emit("watcher", broadcasterId);
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
            <div className="display-body">
              <video className="video" autoPlay={true} ref={videoRef} controls controlsList="nopause fullscreen" />
            </div>
            <button className="btn btn-success" onClick={() => handleWatcher()}>
              Connect
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Watch;
