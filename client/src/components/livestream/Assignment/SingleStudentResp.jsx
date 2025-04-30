import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { firestoreDB } from "../../../config/firebaseconfig";

const SingleStudentResp = () => {
  const [quesData, setQuesData] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [docLink, setDocLink] = useState("");
  const [marks, setMarks] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);

  const params = useParams();
  const {a_id, s_id} = params;
  console.log("PARAMS:",params)
  useEffect(() => {
    const loadPage = async () =>{
        const responses = firestoreDB.collection("classroom").doc("classIdHere").collection("assignment").doc(a_id).collection('responses')
        const singleResp = await responses.doc(s_id).get();
        console.log("ResponseStudent : ",singleResp.data())
        console.log("Ssss");

    }
    loadPage();
    console.log("dddd");

  }, []);

  const isTeacher = true

  return ( "Single Stud resp");
//     <div>
//       <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
//         <div className="container">
//           <div className="page-header-content pt-4">
//             <div className="row align-items-center justify-content-between">
//               <div className="col-auto mt-4">
//                 <h1 className="page-header-title">
//                   <div className="page-header-icon">
//                     <i data-feather="file"></i>
//                   </div>
//                   Assignment
//                 </h1>
//                 <div className="page-header-subtitle">
//                   Classroom : Advanced Web Technologies
//                 </div>
//               </div>
//               <div className="col-12 col-xl-auto mt-4">
//                 {new Date().toDateString()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//       <div className=" mt-n10 w-75 mx-auto">
//         <div className="card border-dark">
//           <div className="card-header">
//             <div className="d-flex justify-content-between">
//               <div>All questions are mandatory.</div>
//               <div className="">{`Total marks : ${totalMarks}`}</div>
//             </div>
//           </div>
//           <div className="card-body">
//             <div className="container">
//               <div>
//               {quesData.map((ques, qid) => {
//                   return (
//                     <div key={qid} className="py-3">
//                       <div className="h6">Q . {ques.body.data}</div>
//                       <div>
//                         {ques.type.endsWith("mcq") ? (
//                           ques.body.optionData.map((op, i) => {
//                             return (
//                               <div key={i} className="mx-2 p-1">
//                                 <input
//                                   type="radio"
//                                   name={"optionFor" + qid}
//                                   id={"optionFor" + qid}
//                                   value={op}
//                                   checked={op === ques.ans}
//                                   disabled={isTeacher}
//                                   onChange={() => handleSelectOption(qid)}
//                                 />{" "}
//                                 {op}
//                               </div>
//                             );
//                           })
//                         ) : ques.type.match("text") ? (
//                           <textarea
//                             className="p-1 mx-3 w-50"
//                             type="text"
//                             name={qid}
//                             id={`textAnsFor${qid}`}
//                             quesnumber={qid}
//                             value={quesData[qid].ans}
//                             readOnly={isTeacher}
//                             onChange={handleTextAnswerChange}
//                           />
//                         ) : (
//                           <CodeRunner
//                             quesNumber={qid}
//                             codeDef={ques.ans}
//                             saveCodeAsAns={handleCodeAnswerChange}
//                           />
//                         )}
//                       </div>
//                         <div>
//                           <code className=" text-dark code mx-2">
//                             Marks for this Ques
//                             <input
//                               type="number"
//                               className="mx-1"
//                               name={qid}
//                               onChange={handleChangeMarks}
//                             />
//                             <span
//                               className="btn btn-outline-success pointer mx-2 px-1 py-0"
//                               onClick={calcTotal}
//                             >
//                               <i className="bi bi-check"></i>
//                             </span>
//                           </code>
//                         </div>
//                       <hr />
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
};

export default SingleStudentResp;
