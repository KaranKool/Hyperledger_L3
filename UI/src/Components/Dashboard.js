import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="vertical-menu">
          <Link to="/createTrade">Create Trade</Link>
          <Link to="/getTrades">Get Trades</Link>
          <Link to="/getTradeById">Get Trade by Id</Link>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
