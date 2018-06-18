import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getInitialFlightData } from "./DataProvider"; 

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: getInitialFlightData()
    };

    this.columns = [{
      Header: "Origin",
      accessor: "origin"
    }, {
      Header: "Flight",
      accessor: "flight"
    }, {
      Header: "Arrival",
      accessor: "arrival"
    }, {
      Header: "State",
      accessor: "state"
    }];

    this.eventSource = new EventSource("http://localhost:5000/events");
  }

  componentDidMount() {
    this.getUpdates();
  }

  /*
  getUpdates() {
    setTimeout(()=>{
      let newData = this.state.data.map((item) => 
        {if (item.flight == "I768") {
          item.state = "A";
        } 
        return item; } );
      this.setState(Object.assign({}, {data: newData}));
    }, 10000)
  }
  */

  updateFlightState(flightState) {
    let newData = this.state.data.map((item) => 
    {if (item.flight === flightState.flight) {
      item.state = flightState.state;
    } 
    return item; } );

    this.setState(Object.assign({}, {data: newData}));
  }

  removeFlight(flightInfo) {
    let newData = this.state.data.filter((item) => item.flight !== flightInfo.flight);

    this.setState(Object.assign({}, {data: newData}));
  }

  getUpdates() {
    this.eventSource.addEventListener("flightStateUpdate", (e) => this.updateFlightState(JSON.parse(e.data)));
    this.eventSource.addEventListener("flightRemoval", (e) => this.removeFlight(JSON.parse(e.data)));
    this.eventSource.addEventListener("closedConnection", (e) => this.stopUpdates());
  }

  stopUpdates() {
    this.eventSource.close();
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.stopUpdates()}>Stop updates</button>
        <ReactTable
            data={this.state.data}
            columns={this.columns}
          />
      </div>
    );
  }
}

export default App;
