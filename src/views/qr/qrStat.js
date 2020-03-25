import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
import '../../app/app.css';
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
import QRStatComp_1 from "./qrStatComp_1";
import QRStatComp_2 from "./qrStatComp_2";
import { Button, ButtonGroup, ButtonToolbar } from "reactstrap";

// Styling

class QRStat extends Component {
  state = { rSelected: [] };

onRadioBtnClick = (rSelected) => {
   this.setState({ rSelected });
}
   render() {
      return (
         <Fragment>
         <div>
           <ButtonGroup>
              <Button
                 color="primary"
                 onClick={() => this.onRadioBtnClick(1)}
                 active={this.state.rSelected === 1}
              >
                 One
              </Button>
              <Button
                 color="primary"
                 onClick={() => this.onRadioBtnClick(2)}
                 active={this.state.rSelected === 2}
              >
                 Two
              </Button>
              <Button
                 color="primary"
                 onClick={() => this.onRadioBtnClick(3)}
                 active={this.state.rSelected === 3}
              >
                 Three
              </Button>
           </ButtonGroup>
           <p>Selected: {this.state.rSelected}</p>
        </div>

        { (this.state.rSelected ==1)?
        <QRStatComp_1 /> : null

        }

        { (this.state.rSelected ==2)?
        <QRStatComp_2 /> : null

        }


         </Fragment>
      );
   }
}

export default QRStat;
