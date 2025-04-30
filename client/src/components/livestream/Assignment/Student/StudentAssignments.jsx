import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { firestoreDB } from "../../../../config/firebaseconfig";
import SingleResp from "../SingleResp";

const StudentAssignments = () => {
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
        setAssignmentList(list.data().arr.reverse());
      });
  }, []);

  const goToAssignment = (title) => {
    setRedirectId(title);
  };

  if (redirectId) {
    return <Redirect to="/assignment/resp" />;
  }
  return ("Single Resp");
  //   <div>
  //     <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
  //       <div className="container">
  //         <div className="page-header-content pt-4">
  //           <div className="row align-items-center justify-content-between">
  //             <div className="col-auto mt-4">
  //               <h1 className="page-header-title">
  //                 <div className="page-header-icon">
  //                   <i data-feather="file"></i>
  //                 </div>
  //                 Classroom Name Here - Student's End
  //               </h1>
  //               <div className="page-header-subtitle">
  //                 Classroom Description here. Lorem ipsum dolor sit amet
  //                 consectetur adipisicing elit. Consequuntur mollitia labore
  //                 hic, molestiae quaerat, vel dolore error vero natus accusamus
  //                 a quod adipisci, officia ipsa tempore nisi reiciendis. Soluta,
  //                 vero!
  //               </div>
  //             </div>
  //             <div className="col-12 col-xl-auto mt-4">4th May 2021</div>
  //           </div>
  //         </div>
  //       </div>
  //     </header>
  //     <div className=" mt-n10 w-75 mx-auto">
  //       <div className="card">
  //         <div className="card-header">Assignments till now :</div>
  //         <div className="card-body">
  //           <div className="container">
  //             <div>
  //               {assignmentList.map((a_id, i) => {
  //                 return (
  //                   <div key={i} 
  //                   className="w-50 hover-invert shadow my-2 pointer h5 p-2" >
  //                     <Link
  //                       to={{
  //                         pathname: "/assignment/resp",
  //                         state: { assignmentId: a_id },
  //                       }}
  //                       // onClick={() => goToAssignment(a_id)}
  //                     >
  //                       {a_id}
  //                     </Link>
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default StudentAssignments;
