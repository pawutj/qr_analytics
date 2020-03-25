import React, { Component } from "react";
import { Table } from "reactstrap";
import "../../app/app.css";

class QRstatComp_table_3 extends Component {
  render() {
    console.log(this.props.data);
    let data = Array.from(this.props.data);
    return (
      <div>
        <div
          style={{
            color: "#F29258",
            textAlign: "center",
            marginTop: "3%",
            marginBottom: "3%"
          }}
        >
          <h2>Coming soon</h2>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>State</th>
              <th>SubState</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr>
                <td>{d.date}</td>
                <td>{d.time}</td>
                <td>{d.state}</td>
                <td>{d.suburb}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default QRstatComp_table_3;
