import React,{Component} from "react"
import {Pie } from "react-chartjs-2";
import '../../app/app.css';
import {
   PieData
} from "./chartData";


class QRstatComp_4 extends Component {
  render(){
    return (
      <div>
        
        <Pie height={400} data={this.props.data} options={PieData.options} />
      </div>
    )
  }
}

export default QRstatComp_4
