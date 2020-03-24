import React from "react";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CreateForm from "./Components/CreateForm";
import GetTrades from "./Components/GetTrades";
import GetTradeById from "./Components/GetTradeById";
import Login from "./Components/Login";
import Register from "./Components/Register";

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/createTrade" component={CreateForm} />
        <Route exact path="/getTrades" component={GetTrades} />
        <Route exact path="/getTradeById" component={GetTradeById} />
        <Route exact path="/register" component={Register} />
      </div>
    </Router>
  );
}

export default App;
