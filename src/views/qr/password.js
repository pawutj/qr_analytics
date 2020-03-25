import React, { Component } from "react";
import { NavLink,Redirect  } from "react-router-dom";
import '../../app/app.css';
import {
   Row,
   Col,
   Input,
   Form,
   FormGroup,
   Button,
   Label,
   Card,
   CardBody,
   CardFooter
} from "reactstrap";


class Password extends Component{
    componentDidMount() {
        this.setState(()=> ({email:localStorage.getItem('email')}))
      }
    state = {
        isChecked: true,
        pass:'',
        redirect: false,
        uuid:'',
        user_id:'',
        c_data:'',
        email:''
     };
   
    
     passwordChange = e =>{
        this.setState({password:e.target.value})
    }

    postData = e => {
        console.log(this.state.password)
        const uuid = localStorage.getItem('uuid')
        console.log(uuid)
        fetch('https://yourqr.today/api/v1/user.nonce', {
            method: 'POST',
            headers : new Headers(),
            body:JSON.stringify({c_passwd:this.state.password
                                })
        }).then((res) => res.json())
        .then(data => {
            if(data.success == false){
                this.setState({'c_data':"กรุณาเลือก Forgot password เพื่อรับ OTP"})
            }else
            {
                this.setState(() => ({'c_data':"สำเร็จ"}))
            }
            console.log(data)
        })
    }

    render(){
        return (
            <div>
            <div style = {{ height:'600px',width:'280px',marginTop:"70px",marginLeft:'20px',marginRight:'20px'}}>
            <h1>Profile</h1>
            <h2>{this.state.c_data}</h2>
            <Input  
                    className="form-control"
                    value = {this.state.email}
                    disabled
                    style = {{margin:"5px"}}
            />

            <Input  
                    className="form-control"
                    value = {this.state.password}
                    onChange = {this.passwordChange}
                    placeholder="New Password"
                    style = {{margin:"5px"}}
                    required
            />
            {/* <h1>{this.state.password}</h1> */}

            <Button   style = {{margin:"5px"}} type="button" color="warning" block  onClick = {this.postData}>
                                    Submit
                                 </Button>

            </div>
            </div>
        )
    }
}

export default Password