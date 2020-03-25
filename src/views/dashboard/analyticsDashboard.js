import React, { Component } from "react";
import { Redirect  } from "react-router-dom";


class AnalyticsDashboard extends Component {
   render() {
      return (
         <Redirect to ={{pathname:'./qr'
                                                      }}
                                                        />
      );
   }
}

export default AnalyticsDashboard;
