import React from "react";
import "../styles/Settings.css";
import LunchChooser from "./LunchChooser.jsx";
import config from "../config.json";
import themes from "../themes.json";
import ScheduleInput from "./ScheduleInput.jsx";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "about",
      countdown: props.countdown,
      mobile: window.innerWidth <= 1000,
      navopen: false,
    };

    this.pages = [
      { t: "countdown", i: "fa-clock" },
      { t: "theme", i: "fa-paint-brush" },
      { t: "schedule", i: "fa-calendar" },
      { t: "about", i: "fa-info-circle" },
    ];

    this.themes = themes;

    this.renderPage = this.renderPage.bind(this);
    this.switchPage = this.switchPage.bind(this);
    this.close = this.close.bind(this);
    this.dateSub = this.dateSub.bind(this);
    this.resetCountdown = this.resetCountdown.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({
        mobile: window.innerWidth <= 1000,
      });
    });
  }

  setPage(p) {
    this.setState(() => ({
      page: p,
    }));
  }

  renderNav() {
    return (
      <>
        {this.state.mobile ? (
          <nav className="settings-nav">
            <i
              onClick={() => this.setState((s) => ({ navopen: !s.navopen }))}
              className="mobilenavopen fa fa-bars"
            ></i>{" "}
            <span>{this.state.page}</span>
            {this.state.navopen && (
              <ul
                className="mobilenavitems"
                onClick={() => this.setState((s) => ({ navopen: false }))}
              >
                {this.pages.map((x) => (
                  <li
                    key={x.t}
                    className={this.state.page == x.t ? "current" : ""}
                    onClick={() => this.setPage(x.t)}
                  >
                    <i className={"fa " + x.i}></i>
                    <span>{x.t}</span>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        ) : (
          <nav className="settings-nav">
            <ul>
              {this.pages.map((x) => (
                <li
                  key={x.t}
                  className={this.state.page == x.t ? "current" : ""}
                  onClick={() => this.setPage(x.t)}
                >
                  <i className={"fa " + x.i}></i>
                  <span>{x.t}</span>
                </li>
              ))}
              {this.props.prompt && (
                <li onClick={() => this.props.prompt.prompt()}>Install App</li>
              )}
            </ul>
          </nav>
        )}
      </>
    );
  }

  close() {
    this.props.setTab(0);
  }

  resetCountdown() {
    this.props.setCountdown(null);
    this.setState({ countdown: null });
  }

  dateSub(e) {
    e.preventDefault();
    var a = e.target.date.value.split("-");
    a.push(a.shift());

    var x = a.join("/"),
      r = new Date(x),
      d = new Date();
    if (a[0] > 3000) {
      alert("please choose a year less than 3000");
    } else if (e < d) {
      alert("please choose a date in the future");
    } else {
      const countdown = { title: e.target.title.value, date: x };
      this.setState(() => ({
        countdown,
      }));
      this.props.setCountdown(countdown);
    }
  }

  renderPage() {
    switch (this.state.page) {
      case "about":
        return (
          <>
            <h1 className="page-title-header">About</h1>
            <p>
              Bell Countdown Version {config.version}
              <br />
              By <a href="https://github.com/hman124">hman124</a>
              <hr />
                <i className="fa fa-bug"></i>{" "}
              <a href="https://github.com/hman124/bell-countdown/issues/new">
                Report Bugs
              </a>
              <br />
                <i className="fa-brands fa-github"></i>{" "} 
              <a href="https://github.com/hman124/bell-countdown">
                Github Repository
              </a>
            </p>
          </>
        );
        break;
      case "lunch":
        return (
          <>
            <h1 className="page-title-header">Select Lunch</h1>
            <hr />
            <LunchChooser
              schedule={this.props.schedule}
              submit={(lunch) => {
                this.props.setLunch(lunch);
                this.props.setTab(0);
              }}
            />
          </>
        );
      case "theme":
        return (
          <>
            <h1 className="page-title-header">Theme</h1>
            <hr />
            {this.themes.map((x, i) => (
              <div
                key={x.name || i}
                title={x.name || "theme color"}
                onClick={() => this.props.setTheme(x, true)}
                className="theme"
              >
                <div
                  className="color"
                  style={{ backgroundColor: x.main }}
                ></div>
                <div
                  className="color"
                  style={{ backgroundColor: x.background }}
                ></div>
              </div>
            ))}
          </>
        );
        break;
      case "countdown":
        return (
          <>
            <h1 className="page-title-header">Countdown</h1>
            <hr />
            {this.state.countdown ? (
              <>
                <p>
                  {this.state.countdown.title}: {this.state.countdown.date}
                </p>
                <input
                  type="button"
                  onClick={this.resetCountdown}
                  value="Reset"
                />
              </>
            ) : (
              <form action="#" onSubmit={this.dateSub}>
                <label>
                  Select a date:
                  <input
                    type="date"
                    min={(() => {
                      var dtToday = new Date();
                      dtToday.setDate(dtToday.getDate() + 1);
                      var month = dtToday.getMonth() + 1;
                      var day = dtToday.getDate();
                      var year = dtToday.getFullYear();

                      if (month < 10) month = "0" + month.toString();
                      if (day < 10) day = "0" + day.toString();

                      return year + "-" + month + "-" + day;
                    })()}
                    required
                    name="date"
                  />
                </label>
                <label>
                  Set a title:
                  <input
                    required
                    type="text"
                    name="title"
                    maxLength="25"
                    placeholder="Countdown Title"
                  />
                </label>
                <input type="submit" value="Apply" />
              </form>
            )}
          </>
        );
        break;
      case "schedule":
        return (
          <>
            <h1 className="page-title-header">Schedule</h1>
            <hr />
            <ScheduleInput
              schedule={this.props.schedule}
              setSchedule={this.props.setSchedule}
            />
          </>
        );
    }
  }

  switchPage(p) {
    this.setState(() => ({ page: p }));
  }

  render() {
    return (
      <div className="container Settings">
        {this.renderNav()}
        <div className="settings-main">{this.renderPage()}</div>
      </div>
    );
  }
}
