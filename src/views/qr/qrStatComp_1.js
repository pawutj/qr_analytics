import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";

import * as Icon from "react-feather";

import { StaticCardData } from "../cards/staticCardData";
import { AdvancedCardData } from "../cards/advancedCardData";

import MinimalStatisticsChart from "../../components/cards/minimalStatisticsWithChartCard";
import ProductsSalesChartCard from "../../components/cards/productsSalesChartCard";

import MonthlySalesStatisticsBarChartCard from "../../components/cards/monthlySalesStatisticsBarChartCard";
import ShoppingCartCard from "../../components/cards/shoppingCartCard";

import VisitSalesStatisticsCard from "../../components/cards/visitSalesStatistics";
import WeeklyStatisticsLineChartCard from "../../components/cards/weeklyStatisticsLineChartCard";

import HobbiesStatisticsBarChartCard from "../../components/cards/hobbiesStatisticsBarChartCard";
import UserListCard from "../../components/cards/userListCard";
import ProjectStatsDonutChartCard from "../../components/cards/projectStatsDonutChartCard";


import { Button, ButtonGroup, ButtonToolbar } from "reactstrap";

// Styling

class QRStatComp extends Component {
  constructor() {
      super();
      this.state = {
        text: 'Please wait. Loading.',
        ProductsSalesData : {
           labels: [1, 2, 3, 4, 5, 6, 7,8],
           series: [[0,0,0,0,0,0,0,0]]
        }
      };
    }


  componentDidMount() {
    var temp
    fetch('https://myqr.thaicrowd.com/api/v1/qr.checkqr/1063')
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          // console.log(responseJson.c_data[0]['count(*)'])
          temp = this.state.ProductsSalesData
          temp.series[0][6] =  responseJson.c_data[0]['count(*)']
          console.log(this.state.ProductsSalesData)

        }).then(() =>{
          this.setState({ ProductsSalesData: temp } )
        })
        .catch((error) => {
          console.error(error);
        });

    }


   render() {
      return (

        <Fragment>
    <p>{this.state.ProductsSalesData.series[0][6]}</p>
                <Row>
                   <Col sm="12">
                      <ProductsSalesChartCard
                         productsSalesData={this.state.ProductsSalesData}
                         cardTitle="Products Sales"
                         salesText="Sales"
                         visitText="Visits"
                      />
                   </Col>
                </Row>
</Fragment>


      );

   }
}

export default QRStatComp;
