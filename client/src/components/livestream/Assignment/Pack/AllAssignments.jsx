import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { firestoreDB } from "../../../../config/firebaseconfig";
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

  if (redirectId) {
    return <AllResponses titleOfAssignment={redirectId} />;
  }
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
                  Classroom Name Here
                </h1>
                <div className="page-header-subtitle">
                  Classroom Description here. Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Consequuntur mollitia labore
                  hic, molestiae quaerat, vel dolore error vero natus accusamus
                  a quod adipisci, officia ipsa tempore nisi reiciendis. Soluta,
                  vero!
                </div>
              </div>
              <div className="col-12 col-xl-auto mt-4">4th May 2021</div>
            </div>
          </div>
        </div>
      </header>
      <div className=" mt-n10 w-75 mx-auto">
        <div className="card">
          <div className="card-header">Assignments till now :</div>
          <div className="card-body">
            <div className="container">
              <div>
                {assignmentList.map((resp, i) => {
                  return (
                    <Link to={`/${resp.a_id}/allresponses`} className="">
                      <div
                        key={i}
                        className="w-50 hover-invert shadow my-2 pointer h5 p-2"
                      >
                        {resp.title}
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
