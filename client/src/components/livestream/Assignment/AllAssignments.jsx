import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { firestoreDB } from "../../../config/firebaseconfig";
// import AllResponses from "./AllResponses";
// import StudentAssignments from "../Student/StudentAssignments";

const AllAssignments = () => {
  const [assignmentList, setAssignmentList] = useState([]);
  const [redirectId, setRedirectId] = useState(null);
  useEffect(() => {
    firestoreDB
      .collection("classroom")
      .doc("classIdHere")
      .collection("assignmentsList")
      .doc("list")
      .get()
      .then((list) => {
        console.log("LIST", list.data());
        setAssignmentList(list.data().arr);
      });
  }, []);

  const goToAssignment = (title) => {
    setRedirectId(title);
  };

  const isStudent = true;

  // if (isStudent) {
  //   return <StudentAssignments />;
  // }

  const assignmentList1 = [
    { title: "Unit 1 Assignment", time: "19th May 2021" },
    { title: "Unit 2 Assignment ", time: "30th May 2021" },
    { title: "Mid 1 - Assignment 1", time: "7th June 2021" },
  ];

  return (
    <div>
        <main>
                    <header class="page-header page-header-light bg-gradient-primary-to-secondary text-white mb-4 border border-bottom">
                        <div class="container">
                            <div class="page-header-content pt-4">
                                <div class="row align-items-center justify-content-between">
                                    <div class="col-auto mt-4">
                                        <div class="page-header-titles  display-4">
                                            <div class="page-header-icon"><i data-feather="layout"></i></div>
                                            Assignments till now :
                                        </div>
                                        <div class="page-header-subtitle text-white">Advanced Web Technologies</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    {/* <!-- Main page content--> */}
                      </main>
      {/* <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-3">
        <div className="container">
          <div className="page-header-content pt-4">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto mt-4">
                <h1 className="page-header-title">
                  <div className="page-header-icon">
                    <i data-feather="file"></i>
                  </div>
                  Advanced Web Technology
                </h1>
                <div className="page-header-subtitle">
                  It is designed to equip the students with the advanced
                  knowledge of creating rich-featured websites and web portals
                  using JavaScript, PHP, CMS, and their frameworks.
                </div>
              </div>
              <div className="col-12 col-xl-auto mt-4">4th May 2021</div>
            </div>
          </div>
        </div>
      </header> */}
      <div className=" mx-auto">
        <div className="cards">
          {/* <div className="card-headers display-4 pl-5 ">Assignments till now :</div> */}
          {/* <div className="h4 pl-5">jjj</div> */}
          <div className="card-bodys">
            <div className="container  ">
              <div className=" px-4">
                {assignmentList.map((resp, i) => {
                  return (
                    <Link
                      to={`/a/${resp.a_id}/allresponses`}
                      className="no-text-decor"
                    >
                      <div
                        key={i}
                        className="w-100 hover-invert shadow my-2 pointer pt-4 px-4 pb-2 d-flex m-3 border rounded"
                      >
                        <div className="assignment-icon">
                          <i className="bi bi-journal-text bg-primary text-white rounded-circle p-1 px-2 h2"></i>
                        </div>
                        <div className="assignment-title ml-3 h5 bold">
                          <div className="">{resp.title}</div>
                          <div className="h6 color-grey p-0-5">{resp.time}</div>
                        </div>
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

export default AllAssignments;
