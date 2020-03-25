import React, { Component } from "react";
import { Table } from "reactstrap";
import "../../app/app.css";

const formatDate = (name, date) => `${name.replace(/\//g, "/")} / ${date}`;

class QRstatComp_5 extends Component {
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
        ></div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date / Time</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr>
                <td>{`${d.name1}`}</td>
                <td>{formatDate(d.date1, d.time1)}</td>
                <td>{d.c_phone_no}</td>
                <td>{d.c_email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default QRstatComp_5;
