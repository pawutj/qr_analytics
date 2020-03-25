import React, { Component } from "react";
import MinimalStatisticsBG from "../../components/cards/minimalStatisticsBGCard";
import * as Icon from "react-feather";
import QRStatComp_1 from "./qrstatcomp_1.js";
import QRStatComp_2 from "./qrstatcomp_2.js";
import QRStatComp_3 from "./qrstatcomp_3.js";
import QRStatComp_4 from "./qrstatcomp_4.js";
import QRStatComp_5 from "./qrstatcomp_5.js";
import QRStatComp_1_table from "./qrstatcomp_1_table.js";
import QRStatComp_3_table from "./qrstatcomp_3_table.js";
import "../../app/app.css";
import { Redirect } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class QRStatis extends Component {
  constructor(props) {
    super(props);
    let d_end = new Date();
    let d_start = new Date();
    d_start.setTime(d_start.getTime() - 60 * 60 * 24 * 7 * 1000);
    d_end =
      d_end.getFullYear() +
      "-" +
      (d_end.getMonth() + 1) +
      "-" +
      d_end.getDate();
    d_start =
      d_start.getFullYear() +
      "-" +
      (d_start.getMonth() + 1) +
      "-" +
      d_start.getDate();
    this.state = {
      g1: false,
      g2: false,
      g3: false,
      g4: false,
      g5: false,
      location_table: [],
      data_1: {},
      data_3: {},
      data_4: {},
      data_5: {},
      data_scan_table: {},
      dropdownOpen: false,
      bottomValue: "7 Day",
      d_start: d_start,
      d_end: d_end,
      activeTab: "1",
      c_1: 0,
      c_2: 0,
      c_5: 0,
      c_4: "0 Devices",
      c_4_1: 0,
      c_4_2: 1,
      c_4_3: 0,
      c_3: "0 Location",
      c_3_1: "0",
      status: "สถิติการสแกน"
    };
  }

  componentDidMount() {
    this.summary_1();
    this.summary_2();
    if (this.props.location.state.t == true) this.click_5();
  }

  summary_1() {
    let fetch_string =
      "https://yourqr.today/api/v1/report.summary?qr_id=" +
      this.props.location.state.qr_id;

    fetch(fetch_string)
      .then(response => response.json())
      .then(data => {
        if (0 in data.c_data) {
          this.setState({ c_1: data.c_data[0].c_1 });
          this.setState({ c_2: data.c_data[0].c_2 });
          this.setState({ c_4: data.c_data[0].c_4 });
          this.setState({ c_4_1: data.c_data[0].c_4_1 });
          this.setState({ c_4_2: data.c_data[0].c_4_2 });
          const c_4_3 = (
            (data.c_data[0].c_4_1 / data.c_data[0].c_4_2) *
            100
          ).toFixed(0);
          this.setState({ c_4_3: c_4_3 });
          this.setState({ c_5: data.c_data[0].c_5 });
        }
      });
  }

  trim(s) {
    return s.length > 12 ? `${s.substring(0, 12)}...` : s;
  }

  summary_2() {
    let fetch_string =
      'https://yourqr.today/api/v1/report.stat_3?d_seen_start="' +
      this.state.d_start +
      '"&d_seen_end="' +
      this.state.d_end +
      '"&c_type=scan&qr_id=' +
      this.props.location.state.qr_id;

    fetch(fetch_string)
      .then(response => response.json())
      .then(data => {
        this.setState(state => ({ c_3_1: data.c_data.length }));
      });
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  toggle_2 = tab => {
    this.setState(
      {
        activeTab: tab
      },
      () => this.f_4()
    );
  };

  pad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }

  f_0 = () => {
    let fetch_string =
      'https://yourqr.today/api/v1/report.scan_table?d_seen_start="' +
      this.state.d_start +
      '"&d_seen_end="' +
      this.state.d_end +
      '"&c_type=scan&qr_id=' +
      this.props.location.state.qr_id;
    console.log(fetch_string);
    fetch(fetch_string)
      .then(response => response.json())
      .then(data => {
        console.log(data.c_data);
        this.setState(state => ({ data_scan_table: data.c_data }));
      });
  };

  f_1 = () => {
    let fetch_string =
      'https://yourqr.today/api/v1/report.stat?d_seen_start="' +
      this.state.d_start +
      '"&d_seen_end="' +
      this.state.d_end +
      '"&c_type=scan&qr_id=' +
      this.props.location.state.qr_id;
    // console.log(fetch_string)
    fetch(fetch_string)
      .then(response => response.json())
      .then(data => {
        // console.log(data.c_data)
        const data_set = data.c_data.map(d => d.c);
        const data_label = data.c_data.map(d => d.d);
        // console.log(data_set)
        // console.log(data_label)
        const a = Array(this.state.bottomValue == "7 Day" ? 7 : 30)
          .fill()
          .map((e, i) => i)
          .map(d => {
            let d_temp = new Date();
            d_temp.setTime(d_temp.getTime() - 60 * 60 * 24 * d * 1000);
            return d_temp;
          })
          .map(
            e =>
              e.getFullYear() +
              "-" +
              this.pad(e.getMonth() + 1) +
              "-" +
              this.pad(e.getDate())
          );

        const s_1 = {};
        for (let i = 0; i < data_set.length; i++) {
          s_1[data_label[i]] = data_set[i];
        }
        const b = a.map(c => (s_1[c] ? s_1[c] : 0));
        // console.log(a)
        // console.log(b)
        const c =
          this.state.bottomValue == "7 Day"
            ? Array(7)
                .fill()
                .map((e, i) => i)
                .map(x => `rgba(255, 141, 96, ${1 - x / 14})`)
            : Array(30)
                .fill()
                .map((e, i) => i)
                .map(x => `rgba(255, 141, 96, ${1 - x / 42})`);
        const data_temp = {
          labels: a.reverse(),
          datasets: [
            {
              label: "Total Scan",
              data: b.reverse(),
              backgroundColor: c.reverse(),
              borderColor: "rgba(148,159,177,1)",
              pointBackgroundColor: "rgba(148,159,177,1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(148,159,177,0.8)"
            }
          ]
        };

        this.setState(state => ({ data_1: data_temp }));
        // console.log(this.state.data_1)
      });
  };

  f_2 = () => {
    let fetch_string =
      'https://yourqr.today/api/v1/report.stat_2?d_seen_start="' +
      this.state.d_start +
      '"&d_seen_end="' +
      this.state.d_end +
      '"&c_type=scan&qr_id=' +
      this.props.location.state.qr_id;
    console.log(fetch_string);
    fetch(fetch_string)
      .then(response => response.json())
      .then(data => {
        // console.log(data.c_data)
        const data_set = data.c_data.map(d => d.c);
        const data_label = data.c_data.map(d => d.d);
        // console.log(data_set)
        // console.log(data_label)
        const a = Array(this.state.bottomValue == "7 Day" ? 7 : 30)
          .fill()
          .map((e, i) => i)
          .map(d => {
            let d_temp = new Date();
            d_temp.setTime(d_temp.getTime() - 60 * 60 * 24 * d * 1000);
            return d_temp;
          })
          .map(
            e =>
              e.getFullYear() +
              "-" +
              this.pad(e.getMonth() + 1) +
              "-" +
              this.pad(e.getDate())
          );
        const s_1 = {};
        for (let i = 0; i < data_set.length; i++) {
          s_1[data_label[i]] = data_set[i];
        }
        const b = a.map(c => (s_1[c] ? s_1[c] : 0));
        // console.log(a)
        // console.log(b)
        const c =
          this.state.bottomValue == "7 Day"
            ? Array(7)
                .fill()
                .map((e, i) => i)
                .map(x => `rgba(255, 141, 96, ${1 - x / 14})`)
            : Array(30)
                .fill()
                .map((e, i) => i)
                .map(x => `rgba(255, 141, 96, ${1 - x / 42})`);
        const data_temp = {
          labels: a.reverse(),
          datasets: [
            {
              label: "Unique Users",
              data: b.reverse(),
              backgroundColor: c.reverse(),
              borderColor: "rgba(148,159,177,1)",
              pointBackgroundColor: "rgba(148,159,177,1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(148,159,177,0.8)"
            }
          ]
        };

        this.setState(state => ({ data_2: data_temp }));
        console.log(this.state.data_2);
      });
  };

  f_5 = () => {
    let fetch_string =
      'https://yourqr.today/api/v1/report.stat_5?d_seen_start="' +
      this.state.d_start +
      '"&d_seen_end="' +
      this.state.d_end +
      '"&c_type=scan&qr_id=' +
      this.props.location.state.qr_id;
    console.log(fetch_string);
    fetch(fetch_string)
      .then(response => response.json())
      .then(data => {
        this.setState(state => ({ data_5: data.c_data.reverse() }));
      });
  };

  f_3 = () => {
    let fetch_string =
      'https://yourqr.today/api/v1/report.stat_3?d_seen_start="' +
      this.state.d_start +
      '"&d_seen_end="' +
      this.state.d_end +
      '"&c_type=scan&qr_id=' +
      this.props.location.state.qr_id;
    this.setState(state => ({ location_table: [] }));
    console.log(fetch_string);
    fetch(fetch_string)
      .then(response => response.json())
      .then(data => data.c_data)
      .then(data => data.map(t => ({ ...t, c: JSON.parse(t.c).coords })))
      .then(data =>
        data.map(t => {
          let state = "";
          let suburb = "";
          console.log(t.c.latitude, t.c.longitude);
          const s = `https://eu1.locationiq.com/v1/reverse.php?key=1fda8199f89beb&lat=${t.c.latitude}&lon=${t.c.longitude}&format=json`;
          fetch(s)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              if (!data.error) {
                state = data.address.state;
                suburb = data.address.suburb;
                const c = {
                  state: state,
                  suburb: suburb,
                  time: t.t,
                  date: t.d
                };
                this.setState(state => ({
                  location_table: [...state.location_table, c]
                }));
                console.log(this.state.location_table);
              }
            });
        })
      );
  };

  f_4 = () => {
    const fetch_string =
      'https://yourqr.today/api/v1/report.stat_4?d_seen_start="' +
      this.state.d_start +
      '"&d_seen_end="' +
      this.state.d_end +
      '"&c_type=scan&qr_id=' +
      this.props.location.state.qr_id +
      "&subtype=" +
      this.state.activeTab;

    fetch(fetch_string)
      .then(response => response.json())
      .then(data => {
        const data_set = data.c_data.map(d => d.c);
        const data_label = data.c_data.map(d => d.d);
        // console.log(data_set)
        // console.log(data_label)
        const data_temp = {
          labels: data_label,
          datasets: [
            {
              data: data_set,
              backgroundColor: [
                "rgba(0, 157, 160, 0.8)",
                "rgba(28, 188, 216, 0.8)",
                "rgba(255, 141, 96, 0.8)"
              ]
            }
          ]
        };
        return data_temp;
      })
      .then(data_temp => {
        this.setState(state => ({ data_4: data_temp }));
      });
  };

  click_1 = () => {
    this.setState(
      state => ({
        g1: !state.g1,
        g2: false,
        g3: false,
        g4: false,
        g5: false
      }),
      () => {
        this.f_1();
        this.f_0();
      }
    );
    this.setState({ status: "Total Scan" });
  };

  click_2 = () => {
    this.setState(
      state => ({
        g2: !state.g2,
        g1: false,
        g3: false,
        g4: false,
        g5: false
      }),
      () => this.f_2()
    );
    this.setState({ status: "Unique Users" });
  };

  click_3 = () => {
    this.setState(
      state => ({ g3: !state.g3, g1: false, g2: false, g4: false, g5: false }),
      () => {
        if (this.state.g3 == true) {
          this.f_3();
        }
      }
    );
    this.setState({ status: "Location" });
  };

  click_4 = () => {
    this.setState(
      state => ({ g4: !state.g4, g1: false, g2: false, g3: false, g5: false }),
      () => this.f_4()
    );
    this.setState({ status: "Browser & Platform & Devices " });
  };

  click_5 = () => {
    this.setState(
      state => ({ g5: !state.g5, g1: false, g2: false, g4: false, g3: false }),
      () => this.f_5()
    );
    this.setState({ status: "Identified Users" });
  };

  setValueBottom_1 = value => {
    this.setState(state => ({ bottomValue: value }));
    let d_end = new Date();
    let d_start = new Date();
    if (value == "7 Day") {
      d_start.setTime(d_start.getTime() - 60 * 60 * 24 * 7 * 1000);
    } else if (value == "30 Day") {
      d_start.setTime(d_start.getTime() - 60 * 60 * 24 * 30 * 1000);
    }
    d_end =
      d_end.getFullYear() +
      "-" +
      (d_end.getMonth() + 1) +
      "-" +
      d_end.getDate();
    d_start =
      d_start.getFullYear() +
      "-" +
      (d_start.getMonth() + 1) +
      "-" +
      d_start.getDate();
    this.setState(
      state => ({ d_start: d_start, d_end: d_end }),
      () => {
        this.f_1();
        this.f_2();
        this.f_3();
        this.f_4();
        this.f_5();
      }
    );
    console.log(d_end, d_start);
  };

  render() {
    if (localStorage.getItem("user_id") == "null")
      return <Redirect to={{ pathname: "../pages/login" }} />;
    else
      return (
        <div>
          <div style={{ marginTop: 70, marginLeft: 30 }}>
            <h1>Scan Statistics</h1>
            <p>{this.state.status}</p>
          </div>
          <div style={{ marginLeft: 20 }}>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret>{this.state.bottomValue}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem header></DropdownItem>
                <DropdownItem onClick={() => this.setValueBottom_1("7 Day")}>
                  7 Day
                </DropdownItem>
                <DropdownItem onClick={() => this.setValueBottom_1("30 Day")}>
                  30 Day
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div style={{ marginLeft: -10 }}>
            <div style={containner} className="phoneColumn">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: " auto",
                  marginRight: "auto"
                }}
                onClick={this.click_1}
                className="phoneWideStat"
              >
                <MinimalStatisticsBG
                  cardBgColor={
                    this.state.g1
                      ? "gradient-orange-amber"
                      : "gradient-blackberry"
                  }
                  statistics={this.state.c_1}
                  text="Total Scan"
                  iconSide="right"
                >
                  <div className="ipadhidden">
                    {" "}
                    <Icon.BarChart size={56} strokeWidth="1.3" color="#fff" />
                  </div>
                </MinimalStatisticsBG>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                onClick={this.click_2}
                className="phoneWideStat"
              >
                <MinimalStatisticsBG
                  cardBgColor={
                    this.state.g2
                      ? "gradient-orange-amber"
                      : "gradient-blackberry"
                  }
                  statistics={this.state.c_2}
                  text="Unique Users"
                  iconSide="right"
                >
                  <div className="ipadhidden">
                    {" "}
                    <Icon.UserX size={56} strokeWidth="1.3" color="#fff" />{" "}
                  </div>
                </MinimalStatisticsBG>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                onClick={this.click_3}
                className="phoneWideStat"
              >
                <MinimalStatisticsBG
                  cardBgColor={
                    this.state.g3
                      ? "gradient-orange-amber"
                      : "gradient-blackberry"
                  }
                  statistics={this.state.c_3_1}
                  text="Location"
                  iconSide="right"
                >
                  <div className="ipadhidden">
                    {" "}
                    <Icon.MapPin
                      size={56}
                      strokeWidth="1.3"
                      color="#fff"
                    />{" "}
                  </div>
                </MinimalStatisticsBG>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                onClick={this.click_4}
                className="phoneWideStat"
              >
                <MinimalStatisticsBG
                  cardBgColor={
                    this.state.g4
                      ? "gradient-orange-amber"
                      : "gradient-blackberry"
                  }
                  statistics={this.state.c_4_3 + " %"}
                  text={this.state.c_4}
                  iconSide="right"
                >
                  <div className="ipadhidden">
                    {" "}
                    <Icon.Smartphone
                      size={56}
                      strokeWidth="1.3"
                      color="#fff"
                    />{" "}
                  </div>
                </MinimalStatisticsBG>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                onClick={this.click_5}
                className="phoneWideStat"
              >
                <MinimalStatisticsBG
                  cardBgColor={
                    this.state.g5
                      ? "gradient-orange-amber"
                      : "gradient-blackberry"
                  }
                  statistics={this.state.c_5}
                  text="Identified User"
                  iconSide="right"
                >
                  <div className="ipadhidden">
                    {" "}
                    <Icon.Users size={56} strokeWidth="1.3" color="#fff" />{" "}
                  </div>
                </MinimalStatisticsBG>
              </div>
            </div>
          </div>
          <div>
            {this.state.g1 && <QRStatComp_1 data={this.state.data_1} />}
            {this.state.g1 && (
              <QRStatComp_1_table data={this.state.data_scan_table} />
            )}
            {this.state.g2 && <QRStatComp_2 data={this.state.data_2} />}
            {this.state.g3 && (
              <QRStatComp_3_table data={this.state.location_table} />
            )}

            {this.state.g4 && (
              <div>
                <Nav tabs className="nav-border-bottom">
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "1"
                      })}
                      onClick={() => {
                        this.toggle_2("1");
                      }}
                    >
                      <b>Browser</b>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2"
                      })}
                      onClick={() => {
                        this.toggle_2("2");
                      }}
                    >
                      <b>Platform</b>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "3"
                      })}
                      onClick={() => {
                        this.toggle_2("3");
                      }}
                    >
                      <b>Device</b>
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
            )}

            {this.state.g4 && <QRStatComp_4 data={this.state.data_4} />}
          </div>
          {this.state.g5 && <QRStatComp_5 data={this.state.data_5} />}
        </div>
      );
  }
}

const containner = {
  display: "flex"
};

const box = {
  backgroundColor: "skyblue",
  width: "18%",
  height: "11%",
  marginLeft: "auto",
  marginRight: "auto"
};

export default QRStatis;
