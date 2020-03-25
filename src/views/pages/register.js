// import external modules
import React, { Component } from "react";
import { NavLink,Redirect } from "react-router-dom";
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
   CardFooter,
   Modal,
   ModalHeader, 
   ModalBody, 
   ModalFooter 
} from "reactstrap";


class Register extends Component {
   
   constructor(props) {
      super(props);
      this.state = {
        modal: false
      };
  
      this.toggle = this.toggle.bind(this);
    }

    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
     
    }

    toggle_2() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      fetch('https://yourqr.today/api/v1/user.nonce', {
                method: 'POST',
                headers : new Headers(),
                body:JSON.stringify({c_email:this.state.email
                                    ,c_passwd:this.state.passwd
                                    })
            }).then((res) => res.json())
            .then((data) =>  {console.log(data)
                              if(data.success == false)
                              this.setState({'c_data':data.c_data})
                              else
                                this.setState({'modal' : true})



                              } 
            )
            .catch((err)=>console.log(err))
    }

   state = {
      isChecked: true,
      email: '',
      passwd:'',
      redirect:false,
      c_data:''
   };
   handleChecked = e => {
      this.setState(prevState => ({
         isChecked: !prevState.isChecked
      }));
   };
   emailChange = e =>{
     this.setState({email:e.target.value})
   }

   passwdChange = e =>{
     this.setState({passwd:e.target.value})
   }

  postData =() => {
            console.log("AA")
            fetch('https://yourqr.today/api/v1/user.nonce', {
                method: 'POST',
                headers : new Headers(),
                body:JSON.stringify({c_email:this.state.email
                                    ,c_passwd:this.state.passwd
                                    })
            }).then((res) => res.json())
            .then((data) =>  {console.log(data)
                              if(data.success == false)
                              this.setState({'c_data':data.c_data})
                              else
                                this.setState({'modal' : true})



                              } 
            )
            .catch((err)=>console.log(err))
        }


   render() {
      return (
         <div className="container">
            <Row className="full-height-vh">
               <Col xs="12" className="d-flex align-items-center justify-content-center">
                  <Card className="gradient-indigo-purple text-center width-400">
                     <CardBody>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                           <ModalHeader toggle={this.toggle}>Confirm Your Email</ModalHeader>
                           <ModalBody>
                           <div style={{marginLeft:'auto',marginRight:'auto',textAlign:'center'}}>
                           <p>We have send you an email to <b>{this.state.email}</b> to activate your account. Please check you inbox and use the activation link</p>

                           <p>เราได้ส่งอีเมล์ไปที่ {this.state.email} เพื่อเปิดใช้งานบัญชีของคุณ กรุณาตรวจสอบกล่องจดหมายของคุณ และใช้ลิงค์เปิดใช้งาน</p>
                           
                           </div>
                           </ModalBody>
                           <ModalFooter>
                              <Button color="secondary" onClick={()=>this.toggle_2()}>Resend Activation Link</Button>
                           </ModalFooter>
                        </Modal>
                        <h5 className="white ">Start Your Free Trial</h5>
                        <h2 className="white py-3"  >Register</h2>
                        <h3>{this.state.c_data}</h3>
                        <Form className="pt-2">
                           <FormGroup>
                              <Col md="12">
                                 <Input
                                    type='email'
                                    name="inputName"
                                    placeholder="Email"
                                    value ={this.state.email}
                                    onChange = {this.emailChange}
                                    required
                                 />
                              </Col>
                           </FormGroup>

                           <FormGroup>
                              <Col md="12">
                                 <Input
                                    type="password"
                                    className="form-control"
                                    value ={this.state.passwd}
                                    onChange = {this.passwdChange}
                                    placeholder="Password"
                                    required
                                 />
                              </Col>
                           </FormGroup>

                           <FormGroup>
                              <Row>
                                 <Col md="12">
                                    <div className="custom-control custom-checkbox mb-2 mr-sm-2 mb-sm-0 ml-3">
                                       <Input
                                          type="checkbox"
                                          className="custom-control-input"
                                          checked={this.state.isChecked}
                                          onChange={this.handleChecked}
                                          id="rememberme"
                                       />
                                       <Label className="custom-control-label float-left white" for="rememberme">
                                          I agree terms and conditions.
                                       </Label>
                                    </div>
                                 </Col>
                              </Row>
                           </FormGroup>
                           <FormGroup>
                              <Col md="12">
                                   <Button type="button" color="danger" block className="btn-pink btn-raised" onClick = { this.postData}>
                                    Submit
                                 </Button>
                                 <Button type="button" color="secondary" block className="btn-raised">
                                    Cancel
                                 </Button>
                              </Col>
                           </FormGroup>
                        </Form>

                        <h5 className="blue ">Free 30-Day trial</h5>
                     </CardBody>
                     <CardFooter>
                        <div className ="text-white">
                        Already have an account?
                           <NavLink to="/pages/login" className ="text-white">
                                {" "}Login Here
                           </NavLink>
                        </div>
                     </CardFooter>
                  </Card>
               </Col>
            </Row>
         </div>
      );
   }
}

export default Register;
