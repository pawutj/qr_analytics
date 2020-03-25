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

   render() {
      return (
        <Fragment>
        <Row className="row-eq-height">
           <Col sm="12" md="4">
              <ProjectStatsDonutChartCard
                 projectStatsDonutChartData={AdvancedCardData.ProjectStatsDonutChartData}
                 cardTitle="Projects Stats"
                 cardSubTitle="Project Tasks"
              />
           </Col>
        </Row>


</Fragment>
      );
   }
}

export default QRStatComp;
