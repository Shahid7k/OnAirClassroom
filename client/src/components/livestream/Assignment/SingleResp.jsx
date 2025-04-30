import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { firebase, firestoreDB } from "../../../config/firebaseconfig";
import CodeRunner from "./CodeRunner/CodeRunner";

const SingleResp = ({ role, location }) => {
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
        data: "Write a Javascript code snippet explaining Object Destructuring.",
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
  console.log("useParam", params);
  const [quesData, setQuesData] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [docLink, setDocLink] = useState("");
  // const idFromLinkProps = location.state?(location.state.assignmentId):undefined;
  // const answerSetInitialState = [{}];
  // const [ansSet, setAnsSet] = useState();
  const [submittedFlag, setSubmittedFlag] = useState(false);
  const [newPageData, setNewPageData] = useState(false);
  const [marks, setMarks] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [fileURL, setFileURL] = useState("f");
  const [fileType, setFileType] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState(!false);

  const isTeacher = role === "teacher";
  // const assignmentId = assignmentID ? assignmentID : (idFromLinkProps?idFromLinkProps:'Assignment00');
  const assignmentId = params.a_id;
  console.log("ARR", quesData, assignmentId);
  useEffect(() => {
    console.log("Upload to localstorage here..");
    const localSt = localStorage.getItem("quesData");
    if (
      !isTeacher &&
      localSt &&
      JSON.parse(localSt).assignmentId === assignmentId
    ) {
      setQuesData(JSON.parse(localSt).quesData);
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
            console.log("else > RESPO SING", respDB.data());
            setQuesData([...respDB.data().ques]);
            setTitle(respDB.data().title);
            const len = respDB.data().ques.length;
            const marksArr = [];
            [...Array(len)].map(() => {
              marksArr.push(0);
            });
            setMarks(len?[0]:marksArr);
            setType(respDB.data().type);
            setDocLink(respDB.data().docLink);
            console.log("Comments", respDB.data());
            if (respDB.data().comments) {
              setComments(respDB.data().comments);
            }
          }
        });
    }
    firestoreDB
      .collection("classroom")
      .doc("classIdHere")
      .collection("assignment")
      .doc(assignmentId)
      .collection("responses")
      .doc("studentId2")
      .get()
      .then((respDB) => {
        if (respDB.exists) {
          console.log("RESPO SING", respDB.data());
          setTitle(respDB.data().title);
          const len = respDB.data().response.length;
          const marksArr = [];
          [...Array(len)].map(() => {
            marksArr.push(0);
          });
          setMarks(marksArr);
          setType(respDB.data().type);
          setDocLink(respDB.data().docLink);
          console.log("Comments", respDB.data());
          if (respDB.data().comments) {
            setComments(respDB.data().comments);
          }
        }
      });
  }, []);

  useEffect(() => {
    firestoreDB
      .collection("classroom")
      .doc("classIdHere")
      .collection("assignment")
      .doc(assignmentId)
      .collection("responses")
      .doc("studentId2")
      .get()
      .then((respDB) => {
        console.log("respDB", respDB);
        if (respDB.data() && respDB.data().comments) {
          setComments(respDB.data().comments.reverse());
        }
      });
  }, [commentText]);

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
    localStorage.setItem(
      "quesData",
      JSON.stringify({ quesData, assignmentId })
    );
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
    localStorage.setItem(
      "quesData",
      JSON.stringify({ quesData, assignmentId })
    );
  };

  const handleCodeAnswerChange = (qid, code) => {
    setNewPageData(true);
    setQuesData([
      ...quesData.slice(0, qid),
      { ...quesData[qid], ans: code },
      ...quesData.slice(qid + 1),
    ]);

    localStorage.setItem(
      "quesData",
      JSON.stringify({ quesData, assignmentId })
    );
  };

  const onFileChange = async (e) => {
    e.preventDefault();
    // const fileURL = "";
    if (type === "fileUpload") {
        setUploadingDoc(true);
      const file = e.target.file.files[0];
      setFileType(file.type);
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      setFileURL(await fileRef.getDownloadURL());
      console.log("ONFILECHANGE", file);
    //   setUploadingDoc(false);
    }
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
      .set(
        {
          response: quesData,
          title,
          type,
          docLink: {
            url: type === "fileUpload" ? fileURL : "",
            type: fileType,
          },
        },
        { merge: true }
      );

    setSubmittedFlag(true);
  };

  const addToMarks = (e) => {
    const val = e.target.value;
  };

  const handleChangeMarks = async (e) => {
    const { name, value } = e.target;
    const qid = Number.parseInt(name);
    if (Number.parseFloat(value) !== NaN) await addToArray(qid, value);
    await calcTotal();
  };
  const addToArray = async (qid, value) => {
    if (!Number.isNaN(value)) {
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

  const onSubmitComment = async (e) => {
    e.preventDefault();
    const studentResp = firestoreDB
      .collection("classroom")
      .doc("classIdHere")
      .collection("assignment")
      .doc(assignmentId)
      .collection("responses")
      .doc("studentId2");

    const prevComms = await studentResp.get();
    studentResp.set(
      {
        comments: prevComms.data().comments
          ? [
              ...prevComms.data().comments,
              { username: "studentId2", commentText, time: new Date() },
            ]
          : [{ username: "studentId2", commentText, time: new Date() }],
      },
      { merge: true }
    );

    setCommentText("");
  };

  const handleChangeComment = (e) => {
    e.preventDefault();
    setCommentText(e.target.value);
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
      <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-0">
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
              <div className="col-12 col-xl-auto mt-4">
                {new Date().toDateString()}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className=" w-75 mx-auto">
        <div className="cards border-darks">
          <div className="card-headers">
            <div className="d-flex justify-content-between">
              {/* <div>All questions are mandatory.</div> */}
              {isTeacher && (
                <div className="">{`Total marks : ${totalMarks}`}</div>
              )}
            </div>
          </div>
          <div className="card-body">
            <div className="container">
              <div>
                {quesData.map((ques, qid) => {
                  return (
                    <div key={qid} className="py-3 px-3 shadow-sm inset-shadow my-4">
                      <div className="h5">Q {qid+1} . {ques.body.data}</div>
                      <div className="">
                        {ques.type.endsWith("mcq") ? (
                          ques.body.optionData.map((op, i) => {
                            return (
                              <div key={i} className="mx-2 p-1 pl-5">
                                <input
                                  type="radio"
                                  name={"optionFor" + qid}
                                  id={"optionFor" + qid}
                                  value={op}
                                  checked={op === ques.ans}
                                  disabled={isTeacher}
                                  className=" form-check-input"
                                  onChange={() => handleSelectOption(qid)}
                                />{" "}
                                <label htmlFor={"optionFor"+qid} className="form-check-label"> {op} </label>
                              </div>
                            );
                          })
                        ) : ques.type.match("text") ? (
                          <textarea
                            className="p-1 ml-4 w-75 form-control"
                            type="text"
                            name={qid}
                            id={`textAnsFor${qid}`}
                            quesnumber={qid}
                            value={quesData[qid].ans}
                            readOnly={isTeacher}
                            placeholder='Write your answer here...'
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
                            <span
                              className="btn btn-outline-success pointer mx-2 px-1 py-0"
                              onClick={calcTotal}
                            >
                              <i className="bi bi-check"></i>
                            </span>
                          </code>
                        </div>
                      )}
                      {/* <hr />   */}
                    </div>
                  );
                })}
                {type === "fileUpload" && (
                  <div>
                    <div className="ques-part text-center shadow p-1 my-2">
                      <div className="h5 py-3">Mid 1 Assignment </div>
                      {docLink.type && docLink.type.includes("image") && (
                        <div className="img-container p-2">
                          <img src={docLink.url} max-width="100%" />
                        </div>
                      )}
                      <div className="mb-2 ">
                        <a
                          className="bg-outline-primary rounded p-1 no-text-decor"
                          href={docLink.url}
                        >
                          {docLink.type && docLink.type.includes("image")
                            ? "View Fullscreen"
                            : "Click here to download"}
                        </a>
                      </div>
                    </div>
                    <div className="ans-part p-3 shadow">
                      {isTeacher ? (
                        <div className="">
                          <a
                            className="bg-outline-primary rounded p-1 no-text-decor"
                            href={docLink.url}
                          >
                            {docLink.type && docLink.type.includes("image")
                              ? "View Fullscreen"
                              : "Click here to download"}
                          </a>
                        </div>
                      ) : (
                        <form onSubmit={onFileChange}>
                          <div className="h4 bold my-3">Upload your answer</div>
                          <input
                            type="file"
                            name="file"
                            id=""
                            className="form-group"
                            placeholder="Attach"
                          />
                          <button className="btn bg-outline-primary border" disabled={uploadingDoc}>
                            {`Upload${!uploadingDoc?'ing':''}`}
                          </button>
                          {/* {
                              uploadingDoc && '......'
                          } */}
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {isTeacher ? (
                <div className="h6">{`Total marks : ${totalMarks}`}</div>
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
          <div className="card-footer container">
            <div className="h5">Comments</div>
            <div className="container">
              <div className="input-comment">
                <input
                  type="text"
                  name="comment"
                  id=""
                  className="w-75 m-1"
                  value={commentText}
                  onChange={handleChangeComment}
                  placeholder="Write your comment here.."
                />
                <button
                  className="btn btn-outline-info m-1"
                  onClick={onSubmitComment}
                >
                  Comment
                </button>
              </div>
              <div className="all-comments">
                {comments.map((comm, i) => {
                  return (
                    <div className="m-1 bg-white" key={i}>
                      <div className="h6">
                        {comm.username}
                        <code>{comm.time}</code>
                      </div>
                      <div className="comment">{comm.commentText}</div>
                    </div>
                  );
                })}
                <div className="m-1 bg-white" >
                      <div className="h6">
                        Mike
                        <code className="mx-5">19 May 2021, 6:40 AM </code>
                      </div>
                      <div className="comment">Greetings ma'am, Can we respond to Coding questions in the language of our choice?</div>
                    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleResp;
