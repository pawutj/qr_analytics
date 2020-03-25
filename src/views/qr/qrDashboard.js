import React, { Component, Fragment } from "react";
import '../../app/app.css';
import QRComp from "./qrComp.js"

import {  Button } from "reactstrap";
import { Link ,Redirect} from "react-router-dom";
import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
class QRDashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      qr_list :[],
      popoverOpen: false,
      startqr:false
    }
  }

  componentDidMount(){
    
    if(!(localStorage.getItem('user_id')=='null' || localStorage.getItem("user_id") == 'undefined')){
      console.log(localStorage.getItem('user_id'))

      let fetch_string = "https://yourqr.today/api/v1/report.qr_list?user_id="+localStorage.getItem('user_id')
        fetch(fetch_string)
          .then((response) => response.json())
          .then(data => {
                     this.setState({qr_list:data.c_data})
                     console.log(this.state.qr_list)
                     if(data.c_data.length == 0)
                     this.setState({popoverOpen:false,startqr:true})
                     console.log(data)
                   }
                  )
                }
  }

   render() {
     if(localStorage.getItem("user_id")== 'null' || localStorage.getItem("user_id") == 'undefined' || localStorage.getItem("user_id") == ''||localStorage.getItem("user_id") == undefined) 
      return (<Redirect to ={{pathname:'../pages/login'
                            }}
                                                        />
              )
      else
      return (
         <Fragment>
           <div style ={{marginTop:70,marginLeft:20}}>
          <h1>QR Code Analytics</h1>
          <p>รายงานแสดงผลสถิติการสแกน QR Code ที่สร้างทั้งหมด</p>

          </div>


          <div style = {{marginLeft:25}}>
          <Link to = '/qrcreate'>
          <Button color="warning" id = "Popover1">Create QR Code</Button>
          </Link>
          </div>
          <div style = {{marginLeft:25}}>
          {this.state.startqr&&<p><font className = "flash">เริ่มต้นสร้าง QR Code ที่วัดผลได้</font></p>}
          {this.state.startqr&&<p><font className = "flash">คลิ๊ก ปุ่ม Create QR Code ได้เลย</font></p>}
          </div>
          <Popover
              
               isOpen={this.state.popoverOpen}
               target="Popover1"
               placement='right-start'
               
            >
              
               <PopoverBody>
                  
                  
               </PopoverBody>
            </Popover>
           
        <div style  = {{marginLeft:20}}>
        {this.state.qr_list.map(q =>
          <div style ={containner}>
            <QRComp data = {q} />
          </div>
        )
        }
        </div>

         </Fragment>
      );
   }
}

const containner = {
  backgroundColor:'#F5F7FA',

};

export default QRDashboard;
