import React,{Component} from "react"
import { Table } from 'reactstrap';
import '../../app/app.css';

class QRstatComp_5 extends Component {

  render(){
    console.log(this.props.data)
    let data = Array.from(this.props.data);
      return (

      <div>
        <div style = {{color:"#F29258" , textAlign:"center" , marginTop:"3%", marginBottom:"3%"}}>
        <h2>Coming soon</h2>
        </div>
        <Table>
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
        {data.map((d) =>
          <tr>
            <td>{d.c_fname}</td>
            <td>{d.c_lname}</td>
            <td>{d.c_phone_no}</td>
            <td>{d.c_email}</td>
          </tr>
        )
        }
        </tbody>
      </Table>

      </div>
    )
  }
}

export default QRstatComp_5
