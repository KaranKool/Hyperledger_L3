import React, { Component } from "react";
import Header from "./Header";
import { host, port } from "../host.json";

/* Import Components */
import Input from "./Input";

class CreateForm extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    this.state = {
      tradeId: "",
      fromParty: "",
      toParty: "",
      amount: "",
      tradeDate: date,
      isButton: false,
      message: ""
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.alphaMethod = this.alphaMethod.bind(this);
    this.alphanumMethod = this.alphanumMethod.bind(this);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.setState({ isButton: true });
    const org = localStorage.getItem("org").toLocaleLowerCase();
    const orgToken = localStorage.getItem(org);
    fetch(`http://${host}:${port}/channels/mychannel/chaincodes/mycc`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + orgToken
      }),
      body: JSON.stringify({
        peers: ["peer0.org1.example.com", "peer0.org2.example.com"],
        fcn: "createTrade",
        args: [
          this.state.tradeId.toString(),
          this.state.fromParty.toString(),
          this.state.toParty.toString(),
          this.state.amount.toString(),
          this.state.tradeDate.toString()
        ]
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          message: `Trade created successfully with trade Id: ${this.state.tradeId}`
        });
      })
      .catch(err => console.log(err));
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      tradeId: "",
      fromParty: "",
      toParty: "",
      amount: ""
    });
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  alphaMethod(e) {
    const re = /[a-zA-Z]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }

  alphanumMethod(e) {
    const re = /[0-9a-zA-Z]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <h1>Create Trade Form</h1>
        <h3 id="output">{this.state.message}</h3>
        <br />
        <form className="container" onSubmit={this.handleFormSubmit}>
          <Input
            type={"string"}
            title={"TradeId:"}
            name="tradeId"
            value={this.state.tradeId}
            placeholder={"Enter Trade ID"}
            maxLength={10}
            minLength={10}
            onKeyPress={e => this.alphanumMethod(e)}
            handleChange={this.handleInput}
          />
          <Input
            type={"string"}
            title={"From:"}
            name="fromParty"
            value={this.state.fromParty}
            placeholder={"Enter Sending Party Name"}
            onKeyPress={e => this.alphaMethod(e)}
            handleChange={this.handleInput}
          />
          <Input
            type={"string"}
            title={"To:"}
            name="toParty"
            value={this.state.toParty}
            placeholder={"Enter Receiving Party Name"}
            onKeyPress={e => this.alphaMethod(e)}
            handleChange={this.handleInput}
          />
          <Input
            type={"number"}
            title={"Amount"}
            name="amount"
            value={this.state.amount}
            placeholder={"Enter the amount"}
            handleChange={this.handleInput}
          />
          <button type="submit" disabled={this.state.isButton}>
            Submit
          </button>
          <button
            type="button"
            onClick={this.handleClearForm}
            disabled={this.state.isButton}
          >
            Reset
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default CreateForm;
