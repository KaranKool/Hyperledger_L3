import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Select from "./Select";
import { host, port } from "../host.json";

class Login extends Component {
  constructor(props) {
    super(props);
    localStorage.removeItem("org");
    var orgs = [];
    if (localStorage.org1) {
      orgs.push("Org1");
    }
    if (localStorage.org2) {
      orgs.push("Org2");
    }
    this.state = {
      redirect: false,
      isInstantiated: false,
      isLoading: false,
      org: "",
      orgOptions: orgs,
      error: "",
      message: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
  }

  handleClearForm(e) {
    e.preventDefault();
    localStorage.clear();
    this.setState({
      redirect: false,
      org: "",
      orgOptions: [],
      error: ""
    });
  }

  instantiateCC() {
    if (localStorage.getItem("instantiated") === "1") {
      return;
    } else {
      fetch(`http://${host}:${port}/channels/mychannel/chaincodes`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("org1")
        }),
        body: JSON.stringify({
          chaincodeName: "mycc",
          chaincodeVersion: "v0",
          chaincodeType: "node",
          args: []
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          localStorage.setItem("instantiated",1)
          this.forceUpdate()
        })
        .catch(err => console.log(err));
    }
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      this.instantiateCC();
      if (localStorage.getItem("instantiated") === "1") {
        return <Redirect refresh to="/dashboard" />;
      }
    }
  };

  onSubmit(e) {
    e.preventDefault();
    if (!localStorage.org1 || !localStorage.org2) {
      this.setState({
        error: "Both Organisations must be Registered"
      });
      return;
    }
    this.setState({
      isLoading: true
    });
    const org = this.state.org;
    localStorage.setItem("org", org.toLowerCase());
    this.setState({ redirect: true });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { error } = this.state;
    var loading = this.state.isLoading;
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-4">
          <div className="container">
            <a className="navbar-brand" href="/">
              Hyperledger L3
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#mobile-nav"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>
        </nav>
        <p className="h3 text-warning">
          Please click Reset only on start of every new cycle
        </p>
        {loading ? (
          <p className="h2 text-info">Loading: Instantiating Chaincode</p>
        ) : null}
        {error ? <p className="h3 text-danger">Error: {error}</p> : null}
        <div className="login">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                {this.renderRedirect()}
                <h1 className="display-4 text-center">Log In</h1>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <Select
                      title={"Organisation:"}
                      name="org"
                      options={this.state.orgOptions}
                      value={this.state.org}
                      placeholder={"Select Org"}
                      handleChange={this.onChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success btn-block mt-3"
                    onClick={e => this.onSubmit(e)}
                    disabled={this.state.isLoading}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-info btn-block mt-3"
                    onClick={this.handleClearForm}
                    disabled={this.state.isLoading}
                  >
                    Reset
                  </button>
                  <br />
                  <Link to="/register">Register</Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
