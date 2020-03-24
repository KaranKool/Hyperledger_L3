import React, { Component } from "react";
import Header from "./Header";
import { host, port } from "../host.json";

class GetTrades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trades: []
    };
  }

  componentDidMount() {
    const org = localStorage.getItem("org").toLocaleLowerCase();
    const orgToken = localStorage.getItem(org);
    fetch(
      `http://${host}:${port}/channels/mychannel/chaincodes/mycc?peer=peer0.` +
        org +
        ".example.com&fcn=queryAll&args=%5B%5D",
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
        this.setState({ trades: data });
      });
  }

  renderTableData() {
    return this.state.trades.map(trade => {
      const tradeId = trade.Key;
      const tradeRecord = trade.Record;
      const { fromParty, toParty, amount, tradeDate, status } = tradeRecord; //destructuring
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
    });
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <h1 id="title">Trade Table</h1>
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
      </React.Fragment>
    );
  }
}

export default GetTrades;
