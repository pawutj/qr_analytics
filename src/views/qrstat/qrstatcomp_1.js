import React,{Component} from "react"
import { Bar } from "react-chartjs-2";
import '../../app/app.css';
import {
   BarData,

} from "./chartData";

class QRstatComp_1 extends Component {

  render(){
    return (
      <div>
       
        <Bar height={400} data={this.props.data} options={BarData.options} />
      </div>
    )
  }
}

export default QRstatComp_1
