import React, { PureComponent } from "react";
import { Card, CardBody, Media } from "reactstrap";
import classnames from "classnames";
import PropTypes from 'prop-types';

class MinimalStatisticsBG extends PureComponent {
   render() {
      
      let iconLeft;
      let iconRight;
      let textDirection;

      if (this.props.iconSide === "right") {
         iconRight = this.props.children;
      } else {
         iconLeft = this.props.children;
         textDirection = "text-right";
      }
      return (
         <Card className={classnames(this.props.cardBgColor)}>
            <CardBody className="px-2 py-3" >
               <Media>
                  {iconLeft}
                  <Media body className={classnames("white", textDirection)}>
                     
                     <h4 className={classnames("mb-1", this.props.statisticsColor)}>{this.props.statistics}</h4>
                     <div style = {{lineHeight:0.7}}>
                     
                     <span>{this.props.text}</span>
                     </div>
                     
                  </Media>
                  {iconRight}
               </Media>
            </CardBody>
         </Card>
      );
   }
}

MinimalStatisticsBG.propTypes = {
   iconSide: PropTypes.string,   
   cardBgColor: PropTypes.string,
   statisticsColor: PropTypes.string,
   statistics: PropTypes.string,
   text: PropTypes.string,
 };

export default MinimalStatisticsBG;
