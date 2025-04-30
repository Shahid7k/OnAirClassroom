import React, { useEffect } from 'react'
import { firestoreDB } from '../../../config/firebaseconfig'

const AssignmentResp = () => {
  
  useEffect(() => {
      firestoreDB
      .collection("classroom")
      .doc("classIdHere")
      .collection("assignment")
      .doc("assignmentIDHERE")
  }, [])

  return (
    <div>
      
    </div>
  )
}

export default AssignmentResp
