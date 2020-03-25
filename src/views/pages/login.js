// import external modules
import React, { Component } from "react";
import { NavLink,Redirect  } from "react-router-dom";

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



class Login extends Component {
   state = {
      isChecked: true,
      email:'',
      pass:'',
      redirect: false,
      uuid:'',
      user_id:'',
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


   passChange = e => {
     this.setState({pass:e.target.value})
   }

   postData =() => {
             console.log("AA")
             fetch('https://yourqr.today/api/v1/user.login', {
                 method: 'POST',
                 headers : new Headers(),
                 body:JSON.stringify({c_email:this.state.email
                                     ,c_passwd:this.state.pass
                                     })
             }).then((res) => res.json())
             .then((data) =>  {console.log(data)
                              if(data.success==true){
                                localStorage.setItem('user_id', data.c_data.id)
                                localStorage.setItem('uuid', data.c_uuid);
                                localStorage.setItem('email', data.c_data.c_email);
                                this.setState({redirect:true   })
                            }else {
                                this.setState({c_data:data.c_data})
                            }


         })
}


   render() {
     if(this.state.redirect)
      return (<Redirect to ={{pathname:'../../qr'
                                                      }}
                                                        />
              )
      else
      return (
         <div className="container">
            <Row className="full-height-vh">
               <Col xs="12" className="d-flex align-items-center justify-content-center">
                  <Card className="gradient-indigo-purple text-center width-400">
                     <CardBody>
                        <h2 className="white py-4">Login</h2>
                        <h3>{this.state.c_data}</h3>
                        <Form className="pt-2">
                           <FormGroup>
                              <Col md="12">
                                 <Input
                                    type="email"
                                    className="form-control"
                                    value = {this.state.email}
                                    onChange = {this.emailChange}
                                    placeholder="Email"
                                    required
                                 />
                              </Col>
                           </FormGroup>

                           <FormGroup>
                              <Col md="12">
                                 <Input
                                    type="password"
                                    className="form-control"
                                    value = {this.state.pass}
                                    onChange = {this.passChange}
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
                                          Remember Me
                                       </Label>
                                    </div>
                                 </Col>
                              </Row>
                           </FormGroup>
                           <FormGroup>
                              <Col md="12">
                                 <Button type="button" color="danger" block className="btn-pink btn-raised" onClick = {this.postData}>
                                    Submit
                                 </Button>
                                 <Button type="button" color="secondary" block className="btn-raised">
                                    Cancel
                                 </Button>
                              </Col>
                           </FormGroup>
                        </Form>
                     </CardBody>
                     <CardFooter>
                        <div className="float-left">
                           <NavLink to="/pages/forgot-password" className="text-white">
                              Forgot Password?
                           </NavLink>
                        </div>
                        <div className="float-right">
                           <NavLink to="/pages/register" className="text-white">
                              Register Now
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

export default Login;
