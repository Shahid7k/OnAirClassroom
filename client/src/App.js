import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Join from "./components/livestream/Join/Join";
import Broadcast from "./components/livestream/Broadcast/Broadcast";
import Watch from "./components/livestream/Watch/Watch";
import Login from "./components/auth/Login";

//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import { setAuthToken } from "./utilities/setAuthToken";
import CodeRunner from "./components/livestream/Assignment/CodeRunner/CodeRunner";
import Assignment from "./components/livestream/Assignment/Assignment";
// import AssignmentResp from "./components/livestream/Assignment/AssignmentResp";
import AllAssignments from "./components/livestream/Assignment/AllAssignments";
import SingleResp from "./components/livestream/Assignment/SingleResp";
import AllResponses from "./components/livestream/Assignment/AllResponses";
import SingleStudentResp from "./components/livestream/Assignment/SingleStudentResp";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={Join} />
          <Route path="/login" exact component={Login} />
          <Route path="/broadcast" component={Broadcast} />
          <Route path="/watch/:broadcasterId" component={Watch} />
          <Route path="/:classId/allAssignments" component={AllAssignments} />
          <Route path="/a/:a_id/allResponses" component={AllResponses} />
          <Route path="/assignment/:a_id/resp" component={SingleResp} />
          <Route path="/assignment/:a_id/s_resp/:s_id" component={SingleStudentResp} />
          <Route path="/assignment" component={Assignment} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
