import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
//import loginsvg from "../../img/undraw_Group_chat_unwm.svg";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import propTypes from "prop-types";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div class="bg-gradient-primary">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-10 col-lg-12 col-md-9">
            <div class="card o-hidden border-0 shadow-lg my-5">
              <div class="card-body p-0">
                <div class="row">
                  <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                  <div class="col-lg-6">
                    <div class="p-5">
                      <div class="text-center">
                        <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                      </div>
                      <form class="user" onSubmit={(e) => onSubmit(e)}>
                        <div class="form-group">
                          <input
                            type="email"
                            class="form-control form-control-user"
                            id="email"
                            placeholder="Enter Email Address"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            class="form-control form-control-user"
                            value={password}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <input
                          type="submit"
                          className="btn btn-primary btn-user btn-block"
                          value="Login"
                        />
                      </form>
                      <hr />
                      <div class="text-center">
                        <a class="small" href="forgot-password.html">
                          Forgot Password?
                        </a>
                      </div>
                      <div class="text-center">
                        <a class="small" href="register.html">
                          Create an Account!
                        </a>
                      </div>
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
};

Login.propTypes = {
  login: propTypes.func.isRequired,
  isAuthenticated: propTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
