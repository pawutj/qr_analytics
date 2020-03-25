import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import "../../app/app.css";
import { PieData } from "./chartData";

class QRstatComp_3 extends Component {
  render() {
    return (
      <div>
        <div style={{ color: "#F29258", textAlign: "center", marginTop: "3%" }}>
          <h2>Coming soon</h2>
        </div>
        <Pie height={400} data={this.props.data} options={PieData.options} />
      </div>
    );
  }
}

export default QRstatComp_3;
