import React, { useState } from 'react'

const Question = ({ saveQues }) => {
    const [type, setType] = useState('')
    const [countOfOptions, setCountOfOptions] = useState(0)
    const [data, setData] = useState()
    const [isSaved, setIsSaved] = useState(false);
    const [optionData, setOptionData] = useState([])
    
    const setNewQuesType = (typeOfQues) => {
        setType(typeOfQues);
    }
    const handleSetCountOfOptions = (e) =>{
        setCountOfOptions(Number.parseInt(e.target.value));
       
        // setOptionData(new Array(countOfOptions));
        console.log(typeof e.target.value, countOfOptions)
    }

    const newOption = () => {
        return `<li className="option">
            <input type="text" name="" id="" />
        </li>`
    }
    const handledataChange = (e) =>{
        setData(e.target.value);
    }
    const handleChangeOptionText = (e) =>{
        const arr = [...optionData];
        arr[e.target.name]=e.target.value;
        setOptionData(arr);
    }
    const handleSave = () =>{
        // const data = {
        //     type,
        //     body:{
        //         data,optionData
        //     }
        // }
        saveQues({
            type,
            body:{
                data,optionData
            }
        });
        setIsSaved(true);
    }

    return (
        <div className="w-75 py-3 px-4">
            {
                type === '' ? (
                <div className="text-center w-75"> Select the type of Question
                    <div className="bg-link d-flex flex-wrap justify-content-around  h3">
                        <button className="btn p-4 m-1 border hover-btn-assignment" onClick={() => setNewQuesType('mcq')} > <span className="h4  hover-white">MCQ</span>  </button>
                        <button className="btn p-4 m-1 border hover-btn-assignment" onClick={() => setNewQuesType('text')} > <span className="h4  hover-white">Text</span>  </button>
                        <button className="btn p-4 m-1 border hover-btn-assignment" onClick={() => setNewQuesType('coding')} > <span className="h4  hover-white">Coding</span>  </button>
                    </div>
                </div>
                )
                    :
                <div className="question">
                    <div className="ques-header w-100">
                        <textarea type="text" className="w-100 p-1" placeholder="Write the question here..." name="data" id="" value={data} onChange={handledataChange} readOnly={isSaved} />
                    </div>
                    {
                        type === 'mcq' && 
                        (
                            <div className="mcq-options">
                            { countOfOptions===0? <div>
                                Number of options:
                                <div>
                                    <button className="btn" value={2} onClick={handleSetCountOfOptions} >2</button>
                                    <button className="btn" value={3} onClick={handleSetCountOfOptions} >3</button>
                                    <button className="btn" value={4} onClick={handleSetCountOfOptions} >4</button>
                                    <button className="btn" value={5} onClick={handleSetCountOfOptions} >5</button>
                                </div>
                            </div>: <div>
                                {([...Array(countOfOptions)]).map((op, i)=>{
                                    console.log("i",i)
                                    return (
                                        <div key={i} >
                                            <input type="text" className="form-group form-group-lg my-1" name={i} value={optionData[i]} onChange={handleChangeOptionText} placeholder={`option ${i+1}`} />
                                            {/* <hr/>
                                            <Option  /> */}
                                        </div>
                                    );
                                })}
                            </div>
                            }
                        </div>
                        )
                    }
                </div>
            }
            <button className="btn btn-primary p-0 px-1 mt-1" onClick={handleSave} disabled={isSaved} >{ isSaved? ' Saved ' : ' Save ' }</button>
        <hr/>
        </div>
    )
}

export default Question
