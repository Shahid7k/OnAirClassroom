import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";
import { firestoreDB } from "../../../config/firebaseconfig";
import SingleResp from "./SingleResp";

const AllResponses = ({ titleOfAssignment }) => {
  const [countOfResponses, setCountOfResponses] = useState(0);
  const [responses, setResponses] = useState([]);

  const params = useParams();
  console.log("useParam", params);
  const { a_id } = params;
  const [redirectToSingle, setRedirectToSingle] = useState(null);
  useEffect(() => {
    firestoreDB
      .collection("classroom")
      .doc("classIdHere")
      .collection("assignment")
      .doc(a_id)
      .collection("responses")
      .get()
      .then((resp) => {
        console.log("Student RESP", resp);
        resp.docs.map((t) => responses.push(t.id));
        setCountOfResponses(resp.size);
      });
  }, []);

  const redirectToSingleResp = (title) => {
    setRedirectToSingle(title);
  };

  //   if (redirectToSingle) {
  //     return <SingleResp assignmentID={redirectToSingle} role={'teacher'} />;
  //   }

  return (
    <div>
      <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
        <div className="container">
          <div className="page-header-content pt-4">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto mt-4">
                <h1 className="page-header-title">
                  <div className="page-header-icon">
                    <i data-feather="file"></i>
                  </div>
                  Assignment - Responses
                </h1>
                <div className="page-header-subtitle">
                  Some Text related to responses here..
                </div>
              </div>
              <div className="col-12 col-xl-auto mt-4">4th May 2021</div>
            </div>
          </div>
        </div>
      </header>
      <div className=" mt-n10 w-75 mx-auto">
        <div className="card">
          <div className="card-header">
            Total Responses : {" " + countOfResponses}
          </div>
          <div className="card-body">
            <div className="container">
              <div className="">
                {responses.map((resp, i) => {
                  return (
                    <Link
                      key={i}
                      to={`/assignment/${a_id}/s_resp/${resp}`}
                      className="no-text-decor"
                    >
                      <div className="w-50 hover-invert shadow my-2 pointer h5 p-2" >
                        {resp}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllResponses;
