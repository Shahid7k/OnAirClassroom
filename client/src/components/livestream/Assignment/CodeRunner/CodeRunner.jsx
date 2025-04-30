import React, { useEffect, useState } from "react";
import "./CodeRunner.css";
import axios from "axios";
import encodeURL from "encodeurl";
import CodeEditor from "../CodeEditor/CodeEditor";

const outputInitialState = {
  build_exit_code: 0,
  build_memory: 0,
  build_result: "",
  build_stderr: "",
  build_stdout: "",
  build_time: "",
  connections: 0,
  exit_code: 0,
  id: "",
  language: "",
  memory: 0,
  note: null,
  result: "",
  status: "",
  stderr: "",
  stdout: "",
  time: "0.00",
};

const CodeRunner = ({quesNumber, saveCodeAsAns, codeDef}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(outputInitialState);
  const [lang, setLang] = useState("c");

  useEffect(() => {
    if(codeDef){
      setCode(codeDef);
    }
  }, [])

  const handleChangeCode = (newCode) => {
    setCode(newCode);
    saveCodeAsAns(quesNumber, newCode);
  };


  const handleRun = async () => {
    try {
      const codeEncoded = encodeURI(code).replaceAll(";", "%3B");
      console.log("ENCODE : ", encodeURL(code));
      console.log("codeeeee", codeEncoded.replace(";", "%3B"));
      setLoading(true);
      setOutput("");
      // const resp = await axios.post("http://api.paiza.io:80/runners/create?source_code=print(%22Hi%22)&language=python&api_key=guest");
      const resp = await axios.post(
        `http://api.paiza.io:80/runners/create?source_code=${codeEncoded}&language=${lang}&api_key=guest`
      );
      const { id, status } = resp.data;
      console.log("SUBMIT CODE RESP: ", resp);
      if (status === "completed") {
        setLoading(false);
      } else {
        while (true) {
          const newStatus = await axios.get(
            `http://api.paiza.io:80/runners/get_status?id=${id}&api_key=guest`
          );
          console.log("newStatus ", newStatus);
          if (newStatus.data.status === "completed") {
            setLoading(false);
            break;
          }
        }
      }
      const outputResp = await axios.get(
        `http://api.paiza.io:80/runners/get_details?id=${id}&api_key=guest`
      );
      console.log("Output : ", outputResp);
      // setOutput("OUTPU"+outputResp.data);
      setOutput(outputResp.data);
      console.log("STATE " + output);
    } catch (e) {
      console.log(e);
    }
  };
  const handleSelect = (e) => {
    console.log("SELECT : ", e.target.value);
    setLang(e.target.value);
  };

  return (
    <div>
      <div className="code-box d-flex m-1 flex-wrap">
        <div className="input ">
          <div>
            Language:
            <select
              className="m-1"
              name="language"
              id=""
              onChange={handleSelect}
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">Javascript</option>
            </select>
            <button
              className="btn btn-outline-success btn-sm m-1"
              onClick={handleRun}
            >
              Run
            </button>
          </div>
          <CodeEditor
            language={lang}
            code={code}
            onChangeCode={handleChangeCode}
          />
        </div>
        <div className="output-box mx-3 ">
          <div className="controls m-1">
            <span className="heading h5 m-1">Output</span>
          </div>
          <div className="output border b h6 p-1">
            {loading && "Loading..."}
            {output.status === "completed" && (
              <div className="">
                <div className="py-2 bg-light-grey"> {output.stdout} </div>{" "}
                <hr />
                Log:{" "}
                <span className="text-danger">
                  {" "}
                  {output.build_stderr || "----"}
                </span>
                <div className="mt-3">{`Result : ${output.result} in ${output.time}s`}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRunner;
