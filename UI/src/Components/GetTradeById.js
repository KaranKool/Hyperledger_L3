import React, { Component } from "react";
import Header from "./Header";
import Input from "./Input";
import { host, port } from "../host.json";

class GetTradeById extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradeId: "",
      trade: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.alphanumMethod = this.alphanumMethod.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    const tradeId = this.state.tradeId;
    const org = localStorage.getItem("org");
    const orgToken = localStorage.getItem(org);
    fetch(
      `http://${host}:${port}/channels/mychannel/chaincodes/mycc?peer=peer0.` +
        org +
        ".example.com&fcn=query&args=%5B%22" +
        tradeId +
        "%22%5D",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + orgToken
        }
      }
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ trade: data });
      });
  }

  renderTableData() {
    var tradeId;
    if (this.state.trade.fromParty) {
      tradeId = this.state.tradeId;
    }
    const { fromParty, toParty, amount, tradeDate, status } = this.state.trade; //destructuring
    return (
      <tr key={tradeId}>
        <td>{tradeId}</td>
        <td>{fromParty}</td>
        <td>{toParty}</td>
        <td>{amount}</td>
        <td>{tradeDate}</td>
        <td>{status}</td>
      </tr>
    );
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value });
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
        <form className="container" onSubmit={this.handleChange}>
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
          <input type="submit" />
        </form>
        <div>
          <h1 id="title">Trades Table</h1>
          <table id="trades">
            <tbody>
              <tr>
                <th>Trade Id</th>
                <th>From Party</th>
                <th>To Party</th>
                <th>Amount</th>
                <th>Trade Date</th>
                <th>Status</th>
              </tr>
              {this.renderTableData()}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default GetTradeById;
