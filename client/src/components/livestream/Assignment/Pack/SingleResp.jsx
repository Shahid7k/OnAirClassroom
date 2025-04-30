import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { firestoreDB } from "../../../config/firebaseconfig";
import CodeRunner from "./CodeRunner/CodeRunner";


const SingleResp = ({  role, location}) => {
  const arr = [
    {
      body: {
        data: "In Web Dev, what does M.E.R.N. Stack stand for? ",
        optionData: [
          "Mango Express Reacting No",
          "MongoDB Express React Node",
          "MongoDB Excellent Reaction Node",
          "MangoDB Express Reaction Node",
        ],
      },
      type: "mcq",
    },
    {
      body: {
        data: "What is a SPA - Single Page Application ?",
        optionData: [],
      },
      type: "text",
    },
    {
      body: {
        data:
          "Write a Javascript code snippet explaining Object Destructuring.",
        optionData: [],
      },
      type: "coding",
    },
    {
      body: {
        data: "How can you store data locally in the browser? ",
        optionData: [
          "document.localStorage",
          "document.sessionStorage",
          "Both of the above",
        ],
      },
      type: "mcq",
    },
    {
      body: {
        data: "What are cookies ?",
        optionData: [],
      },
      type: "text",
    },
    {
      body: {
        data: "Write a Python code snippet with basic Math operators.",
        optionData: [],
      },
      type: "coding",
    },
  ];
  const params = useParams();
  console.log("useParam",params);
  const [quesData, setQuesData] = useState([]);
  const [title, setTitle] = useState('');
  // const idFromLinkProps = location.state?(location.state.assignmentId):undefined;
  // const answerSetInitialState = [{}];
  // const [ansSet, setAnsSet] = useState();
  const [submittedFlag, setSubmittedFlag] = useState(false);
  const [newPageData, setNewPageData] = useState(false);
  const [marks, setMarks] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);

  const isTeacher = role === "teacher";
  // const assignmentId = assignmentID ? assignmentID : (idFromLinkProps?idFromLinkProps:'Assignment00');
  const assignmentId = params.a_id
  console.log("ARR", quesData, assignmentId);
  useEffect(() => {
    console.log("Upload to localstorage here..");
    if ( !isTeacher  && localStorage.getItem("quesData")) {
      setQuesData(JSON.parse(localStorage.getItem("quesData")));
    } else {
      firestoreDB
        .collection("classroom")
        .doc("classIdHere")
        .collection("assignment")
        .doc(assignmentId)
        .collection("questions")
        .doc("quesSet")
        .get()
        .then((respDB) => {
          if (respDB.exists) {
            console.log("RESPO_SING", respDB)
            setQuesData([...respDB.data().ques]);
            setTitle(respDB.data().title);
            const len = respDB.data().ques.length;
            const marksArr = [];
            [...Array(len)].map(() => {
              marksArr.push(0);
            });
            setMarks(marksArr);
          }
        });
    }
  }, []);

  const handleSelectOption = (...props) => {
    // console.log("PROPS:", props);
    setNewPageData(true);
    const opList = document.querySelectorAll(`#optionFor${props[0]}`);
    for (const op of opList) {
      if (op.checked) {
        setQuesData([
          ...quesData.slice(0, props[0]),
          { ...quesData[props[0]], ans: op.value },
          ...quesData.slice(props[0] + 1),
        ]);
        // console.log("OPTIONS:", op.value);
      }
    }
    localStorage.setItem("quesData", JSON.stringify(quesData));
  };

  const handleTextAnswerChange = (e) => {
    setNewPageData(true);
    const { name, value } = e.target;
    const qid = Number.parseInt(name);
    setQuesData([
      ...quesData.slice(0, qid),
      { ...quesData[qid], ans: value },
      ...quesData.slice(qid + 1),
    ]);
    localStorage.setItem("quesData", JSON.stringify(quesData));
  };

  const handleCodeAnswerChange = (qid, code) => {
    setNewPageData(true);
    setQuesData([
      ...quesData.slice(0, qid),
      { ...quesData[qid], ans: code },
      ...quesData.slice(qid + 1),
    ]);

    localStorage.setItem("quesData", JSON.stringify(quesData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    firestoreDB
      .collection("classroom")
      .doc("classIdHere")
      .collection("assignment")
      .doc(assignmentId)
      .collection("responses")
      .doc("studentId2")
      .set({ response: quesData, title });

    setSubmittedFlag(true);
  };

  const addToMarks = (e) => {
    const val = e.target.value;
  };

  const handleChangeMarks = async (e) => {
    const { name, value } = e.target;
    const qid = Number.parseInt(name);
    if(Number.parseFloat(value) !== NaN)
    await addToArray(qid, value);
    await calcTotal();
  };
  const addToArray = async (qid, value) => {
    if(!Number.isNaN(value)){
      setMarks([
        ...marks.slice(0, qid),
        Number.parseFloat(value),
        ...marks.slice(qid + 1),
      ]);
    }
    // console.log("TOTAL :", marks);
  };

  const calcTotal = async () => {
    let total = 0;
    marks.map((m) => (total += m));
    setTotalMarks(total);
  };

  if (submittedFlag) {
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
                    Assignment
                  </h1>
                  <div className="page-header-subtitle">
                    Classroom : Advanced Web Technologies
                  </div>
                </div>
                <div className="col-12 col-xl-auto mt-4">4th May 2021</div>
              </div>
            </div>
          </div>
        </header>
        <div className=" mt-n10 w-75 mx-auto">
          <div className="card">
            <div className="card-header"></div>
            <div className="card-body">
              <div className="container">
                <div className="display-4 mx-5 px-5">
                  <div className="">
                    Assignment Submitted !
                    <img
                      className="mx-3"
                      height="80px"
                      src="https://thumbs.gfycat.com/CrazyThisFrillneckedlizard-size_restricted.gif"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
                  Assignment
                </h1>
                <div className="page-header-subtitle">
                  Classroom : Advanced Web Technologies
                </div>
              </div>
              <div className="col-12 col-xl-auto mt-4">4th May 2021</div>
            </div>
          </div>
        </div>
      </header>
      <div className=" mt-n10 w-75 mx-auto">
        <div className="card border-dark">
          <div className="card-header">
            <div className="d-flex justify-content-between">
              <div>All questions are mandatory.</div>
              {
                isTeacher && <div className="">
                {`Total marks : ${totalMarks}`}
                </div>
              }
            </div>
          </div>
          <div className="card-body">
            <div className="container">
              <div>
                {quesData.map((ques, qid) => {
                  return (
                    <div key={qid} className="py-3">
                      <div className="h6">Q . {ques.body.data}</div>
                      <div>
                        {ques.type.endsWith("mcq") ? (
                          ques.body.optionData.map((op, i) => {
                            return (
                              <div key={i} className="mx-2 p-1">
                                <input
                                  type="radio"
                                  name={"optionFor" + qid}
                                  id={"optionFor" + qid}
                                  value={op}
                                  checked={op === ques.ans}
                                  disabled={isTeacher}
                                  onChange={() => handleSelectOption(qid)}
                                />{" "}
                                {op}
                              </div>
                            );
                          })
                        ) : ques.type.match("text") ? (
                          <textarea
                            className="p-1 mx-3 w-50"
                            type="text"
                            name={qid}
                            id={`textAnsFor${qid}`}
                            quesnumber={qid}
                            value={quesData[qid].ans}
                            readOnly={isTeacher}
                            onChange={handleTextAnswerChange}
                          />
                        ) : (
                          <CodeRunner
                            quesNumber={qid}
                            codeDef={ques.ans}
                            saveCodeAsAns={handleCodeAnswerChange}
                          />
                        )}
                      </div>
                      {isTeacher && (
                        <div>
                          <code className=" text-dark code mx-2">
                            Marks for this Ques
                            <input
                              type="number"
                              className="mx-1"
                              name={qid}
                              onChange={handleChangeMarks}
                            />
                            <span className="btn btn-outline-success pointer mx-2 px-1 py-0" onClick={calcTotal}>
                              <i className="bi bi-check"></i>
                            </span>
                          </code>
                        </div>
                      )}
                      <hr />
                    </div>
                  );
                })}
              </div>
              {isTeacher ? (
                <div className="h6">
                {`Total marks : ${totalMarks}`}
                </div>
              ) : (
                <div
                  className="btn btn-primary hover-btn-assignment border-primary"
                  onClick={handleSubmit}
                >
                  Submit Assignment
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleResp;
