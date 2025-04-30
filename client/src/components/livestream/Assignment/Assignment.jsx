import React, { useState } from "react";
import Question from "./Question/Question";
import { firebase, firestoreDB } from "../../../config/firebaseconfig";
import uuid from "react-uuid";
import nodemailer from "nodemailer";
// import sendmail from 'sendmail'
var sendmail = require("sendmail")({ silent: true });

const Assignment = () => {
  const [quesCardsCount, setQuesCardsCount] = useState(0);
  const [ques, setQues] = useState([]);
  const [submitFlag, setSubmitFlag] = useState(false);
  const [customAssignment, setCustomAssignment] = useState(false);
  const [title, setTitle] = useState("");
  const [fileURL, setFileURL] = useState("f");
const [fileType, setFileType] = useState('');

const [uploadingDoc, setUploadingDoc] = useState(false);
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addQues = () => {
    setQuesCardsCount(Number.parseInt(quesCardsCount) + 1);
    console.log("NUMBER:", quesCardsCount);
  };
  const addQuesToAssignment = (prop) => {
    setQues([...ques, prop]);
    console.log("Data :", ques);
  };

  const onFileChange = async (e) => {
    e.preventDefault();
    // const fileURL = "";
    if (!customAssignment) {
        setUploadingDoc(true);
      const file = e.target.file.files[0];
      setFileType(file.type);
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      setFileURL(await fileRef.getDownloadURL());
      console.log("ONFILECHANGE",file);
        setUploadingDoc(false);
    }
  };

  const handleSubmitAssignment = () => {
    let a_id = uuid().split("-");
    a_id = a_id[a_id.length - 1];
    const quesSetDB = firestoreDB
      .collection("classroom")
      .doc("classIdHere")
      .collection("assignment")
      .doc(a_id)
      .collection("questions")
      .doc("quesSet");

    quesSetDB.set({
      ques,
      title,
      type: customAssignment ? "custom" : "fileUpload",
      docLink: {url : customAssignment ? "" : fileURL, type: fileType }
    });

    const newAssignmentID = title;

    const assignmentList = firestoreDB
      .collection("classroom")
      .doc("classIdHere")
      .collection("assignmentsList")
      .doc("list");
    assignmentList.get().then((list) => {
      if (list.exists) {
        assignmentList.set({ arr: [...list.data().arr, { a_id, title }] });
      } else assignmentList.set({ arr: [{ a_id, title }] });
    });

    setSubmitFlag(true);
  };
  // console.log("SEND:",sendmail)

  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'onairclassroom@gmail.com',
  //     pass: 'onAirClassroom'
  //   }
  // });
  // const mailOptions = {
  //   from: 'onairclassroom@gmail.com',
  //   to: 'onairclassroom@gmail.com',
  //   subject: 'Sending Email using Node.js',
  //   text: 'That was easy!'
  // };

  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });

  console.log("Firebase", firestoreDB);
  if (submitFlag) {
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
                    You can now create your own custom assignment for the
                    students handcrafted by you !
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
              Create your custom Assignment here...{" "}
            </div>
            <div className="card-body">
              <div className="container">
                <div className="display-4 mx-5 px-5">
                  <div className="">
                    Assignment Created !
                    <img
                      className="mx-3 zoom-in-1s"
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
  else if (!customAssignment) {
    const HEADER_TEXT = "Choose your Assignment Type here...";
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
                    You can now create your own custom assignment for the
                    students handcrafted by you !
                  </div>
                </div>
                <div className="col-12 col-xl-auto mt-4">4th May 2021</div>
              </div>
            </div>
          </div>
        </header>
        <div className=" mt-n10 w-75 mx-auto">
          <div className="card">
            <div className="card-header">{HEADER_TEXT}</div>
            <div className="card-body">
              <div className="container">
                <div className="text-center">
                  <input
                    type="text"
                    className="form-control-lg form-control shadow my-3"
                    value={title}
                    onChange={handleTitleChange}
                    name=""
                    placeholder="Write the title of the Assignment"
                    id="title"
                  />
                </div>
                <div className="d-flex flex-wrap">
                  <div className="upload-assignment-container w-50 border border-primary">
                    <div className="display-4 text-center">Upload</div>
                    <div className="h6 mx-5 px-3">
                      Upload a document/image as an Assignment:
                    </div>
                    <form
                      className="px-5 pt-5 mx-4 mt-3 mb-1"
                      onSubmit={onFileChange}
                    >
                      <input
                        type="file"
                        name="file"
                        id=""
                        onChange={() => console.log("uploaded")}
                      />
                      <button className="btn btn-outline-primary m-1 px-2">
                        Upload{uploadingDoc && '...'}
                      </button>
                    </form>
                    <div
                        className="btn btn-primary mx-5 my-3 px-5"
                        onClick={handleSubmitAssignment}
                      >
                        Send
                      </div>
                  </div>
                  <div className="create-assignment-container w-50 ">
                    <div className="display-4 text-center">Create</div>
                    <div className="px-5 pt-5 mx-4 mt-3 mb-1">
                      <div
                        className="btn btn-primary mx-5 my-3 px-5"
                        onClick={() => setCustomAssignment(true)}
                      >
                        Create a Custom Assignment
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if( 2==4) return    <div className="alert-box w-25 float-right rounded w-small">
  <div className="bg-danger rounded text-white m-2">
      <div className="text p-3 rounded  d-flex justify-content-between">
       <div className="px-0 py-2 font-light-bold"> Assignment title is required before creating!
        </div>
        <i class="bi bi-x-lg pl-2"></i>  
      </div>
      <div className="white-line height-4px bg-white p-0 d-flex">
        <span className="w-75 height-4px">.</span>
        <div className="w-25 bg-dark height-4px">.</div>
      </div>
  </div>
</div>

  else if (customAssignment) {
    const HEADER_TEXT = "   Create your custom Assignment here...";
    return (
      <div>
        <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-4">
          <div className="container">
            <div className="page-header-content pt-4">
              <div className="row align-items-center justify-content-between">
                <div className="col-auto mt-4">
                  <div className="display-4 ">{HEADER_TEXT}</div>
                  <div className="page-header-subtitle ml-2">
                    You can now create your own custom assignment for the
                    students handcrafted by you !
                  </div>
                </div>
                <div className="col-12 col-xl-auto mt-4">4th May 2021</div>
              </div>
            </div>
          </div>
        </header>
        <div className=" w-75 mx-auto">
          <div className="">
            <div className="card-body">
              <div className="container">
                <div>
                  {[...Array(quesCardsCount)].map((ques, i) => {
                    return (
                      <div key={i} className="shadow my-2">
                        <Question saveQues={addQuesToAssignment} />
                      </div>
                    );
                  })}
                </div>
                <div className="code-box d-flex m-1 flex-wrap">
                  <button
                    className="btn btn-link hover-btn-assignment"
                    onClick={addQues}
                  >
                    Add Question
                  </button>
                </div>
              </div>
              {ques.length > 0 && (
                <div
                  className="btn btn-primary m-2"
                  onClick={handleSubmitAssignment}
                >
                  Create
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Assignment;
