import React,{Component} from "react"
import { Table } from 'reactstrap';
import '../../app/app.css';
import { X } from "react-feather";

class QRstatComp_table_1 extends Component {

  render(){
    console.log(this.props.data)
    let data = Array.from(this.props.data);
    data = data.length>10?data.slice(0,10):data
      return (

      <div>
        <div style = {{color:"#F29258" , textAlign:"center" , marginTop:"3%", marginBottom:"3%"}}>
        <h4 style  = {{color:"#000000"}}>Lastest Scan</h4>
        </div>
        <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>

          </tr>
        </thead>
        <tbody>
        {data.map((d) =>
          <tr>
            <td>{d.d}</td>
            <td>{d.t}</td>

          </tr>
        )
        }
        </tbody>
      </Table>

      </div>
    )
  }
}

export default QRstatComp_table_1
