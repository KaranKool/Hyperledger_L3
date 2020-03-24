import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Select from "./Select";
import Input from "./Input";
import { host, port } from "../host.json";

class Register extends Component {
  constructor(props) {
    super(props);
    var orgs = [];
    if (!localStorage.org1) {
      orgs.push("Org1");
    }
    if (!localStorage.org2) {
      orgs.push("Org2");
    }
    this.state = {
      redirect: false,
      isLoading: false,
      org: "",
      name: "",
      message: "",
      orgOptions: orgs
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect refresh to="/" />;
    }
  };

  joinChannel() {
    const org = localStorage.getItem("org").toLocaleLowerCase();
    fetch(`http://${host}:${port}/channels/mychannel/peers`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem(org)
      }),
      body: JSON.stringify({
        peers: [`peer0.${org}.example.com`, `peer1.${org}.example.com`]
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.installCC(org);
      })
      .catch(err => console.log(err));
  }

  installCC(org) {
    this.setState({ message: "Installing Chaincode" });
    fetch(`http://${host}:${port}/chaincodes`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem(org)
      }),
      body: JSON.stringify({
        peers: [`peer0.${org}.example.com`, `peer1.${org}.example.com`],
        chaincodeName: "mycc",
        chaincodePath: "./artifacts/src/github.com/example_cc/node",
        chaincodeType: "node",
        chaincodeVersion: "v0"
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ redirect: true });
      })
      .catch(err => console.log(err));
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    const user = {
      username: this.state.name,
      orgName: this.state.org
    };
    var formBody = [];
    for (var property in user) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(user[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    this.setState({ message: "Creating User" });
    fetch(`http://${host}:${port}/users`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      }),
      body: formBody
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("org", user.orgName);
        const token = data.token;
        localStorage.setItem(user.orgName.toLowerCase(), token);
        if (localStorage.org1 ? !localStorage.org2 : localStorage.org2) {
          this.setState({ message: "Creating Channel" });
          fetch(`http://${host}:${port}/channels`, {
            method: "POST",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            }),
            body: JSON.stringify({
              channelName: "mychannel",
              channelConfigPath: "../artifacts/channel/mychannel.tx"
            })
          })
            .then(res => res.json())
            .then(data => {
              console.log(data);
              this.setState({ message: "Joining Channel" });
              this.joinChannel();
            })
            .catch(err => console.log(err));
        } else {
          this.setState({ message: "Joining Channel" });
          this.joinChannel();
        }
      })
      .catch(err => console.log(err));
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    var loading = this.state.isLoading;
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-4">
          <div className="container">
            <p className="navbar-brand">Hyperledger L3</p>
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
        {loading ? (
          <p className="h2 text-info">Loading: {this.state.message}</p>
        ) : null}
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                {this.renderRedirect()}
                <h1 className="display-4 text-center">Register User</h1>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <Select
                      title={"Organisation:"}
                      name="org"
                      options={this.state.orgOptions}
                      value={this.state.org}
                      placeholder={"Select Organisation"}
                      handleChange={this.onChange}
                    />
                    <Input
                      type={"string"}
                      title={"Username:"}
                      name="name"
                      value={this.state.name}
                      placeholder={"Enter Name"}
                      handleChange={this.onChange}
                    />
                  </div>
                  <Link to="/">
                    <button
                      type="button"
                      className="btn btn-info mt-4"
                      disabled={this.state.isLoading}
                    >
                      Back
                    </button>
                  </Link>
                  <span> &emsp;&emsp;&emsp;&emsp;</span>
                  <button
                    type="submit"
                    className="btn btn-success mt-4"
                    onClick={e => this.onSubmit(e)}
                    disabled={this.state.isLoading}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
