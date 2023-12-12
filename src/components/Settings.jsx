import React from "react";
import "../styles/Settings.css";
import LunchChooser from "./LunchChooser.jsx";
import config from "../config.json";
import themes from "../themes.json";
import ScheduleInput from "./ScheduleInput.jsx";
import Modal from "./Modal.jsx";
import WeekdayInput from "./WeekdayInput";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: props.page || "about",
      countdownList: props.countdownList,
      scheduleList: props.scheduleList,
      mobile: window.innerWidth <= 1000,
      navopen: false,
      countdownModal: {
        open: false
      },
      scheduleModal: {
        open: false,
      }
    };

    this.pages = [
      { t: "countdown", i: "fa-clock" },
      { t: "theme", i: "fa-paint-brush" }
    ];

    if (config.schedule.use) {
      this.pages.push({ t: "lunch", i: "fa-hamburger" });
    } else {
      this.pages.push({ t: "schedule", i: "fa-calendar" });
    }

    this.pages.push({ t: "about", i: "fa-info-circle" });

    this.themes = themes;

    this.renderPage = this.renderPage.bind(this);
    this.switchPage = this.switchPage.bind(this);
    this.close = this.close.bind(this);
    this.dateSub = this.dateSub.bind(this);
    this.removeCount = this.removeCount.bind(this);
    this.addSchedule = this.addSchedule.bind(this);
    this.setScheduleList = this.setScheduleList.bind(this);
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

  removeCount(i) {
    const s = this.state.countdownList;
    if (!s[i]) {
      return;
    }
    s.splice(i, 1);
    this.props.setCountdown(s);
    this.setState(() => ({ countdownList: s }));
  }

  setScheduleList(f) {
    this.setState({ scheduleList: f });
    this.props.setSchedule(f);
  }

  saveSchedule(sc, i) {
    const f = this.state.scheduleList;
    f[i] = sc;
    this.setScheduleList(f);
  }

  saveTimes(i, sc) {
    const f = this.state.scheduleList;
    f[i].periods = sc;
    this.setScheduleList(f);
  }

  addSchedule() {
    const f = this.state.scheduleList;
    f.push({ days: [], periods: [] });
    this.setScheduleList(f);
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
    } else if (this.state.countdownList.map((x) => x.date).includes(x)) {
      alert("You already have a countdown for the selected date.");
    } else {
      const countdown = { title: e.target.title.value, date: x };
      const r = [...this.props.countdownList, countdown];
      this.props.setCountdown(r);
      this.setState(() => ({ countdownList: r }));

      this.state.countdownModal.close();
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
            </p>
            <hr />
            <p>
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
              lunch={this.props.lunch}
              lunches={config.schedule.lunches}
              setLunch={this.props.setLunch}
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
            <h3 className="heading">Current</h3>
            {this.state.countdownList.length > 0 ? (
              <table>
                <tbody>
                  {this.state.countdownList.map((x, i) => (
                    <tr key={x.date}>
                      <td>{x.title}</td>
                      <td>{x.date}</td>
                      <td>
                        <button
                          className="inline"
                          onClick={() => this.removeCount(i)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nothing yet. Add a countdown below.</p>
            )}
            <hr />
            <h3 className="heading">Create</h3>
            <input type="button" onClick={() => this.setState(s => ({ countdownModal: { open: true } }))} value="Add Countdown" />
            {this.state.countdownModal.open &&
              <Modal 
                title="New Countdown" 
                close={() => this.setState(s => ({ countdownModal: { open: false } }))}
                onLoad={cb => this.setState(s => ({ countdownModal: { ...s.countdownModal, close: cb } }))}>

                <form action="#" onSubmit={this.dateSub}>
                  <label>
                    Date
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
                    Title:
                    <input
                      required
                      type="text"
                      name="title"
                      maxLength="25"
                      placeholder="Countdown Title"
                    />
                  </label>
                  <input type="submit" value="Add Countdown" />
                </form>
              </Modal>}
          </>
        );
        break;
      case "schedule":
        return (
          <>
            <h1 className="page-title-header">Schedule</h1>
            <hr />
            <h3 className="heading">Current</h3>
            {this.state.scheduleList.length > 0 ?
              (<table>
                <tbody>
                  {this.state.scheduleList.map((x, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td>{x.name || "untitled schedule"}</td>
                        <td>
                          <button
                            className="inline"
                            onClick={() =>
                              this.setState({ scheduleModal: { open: true, index: i } })
                            }
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                        </td>
                        <td>
                          <button
                            className="inline"
                            onClick={() => {
                              const c = confirm(
                                "Are you sure you want to delete this schedule?"
                              );
                              if (!c) {
                                return;
                              }
                              const s = this.state.scheduleList.concat();
                              s.splice(i, 1);
                              this.setState({ scheduleList: s });
                              this.props.setSchedule(s);
                            }}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>) : <p>No schedules yet. Add one below.</p>}

            {this.state.scheduleModal.open && (
              <Modal
                title="Schedule"
                onLoad={cb => this.setState(s => ({ scheduleModal: { ...s.scheduleModal, close: cb } }))}
                close={() => this.setState({ scheduleModal: { open: false } })}
              >
                <p>Schedule Name:</p>
                <input
                  maxLength="40"
                  type="text"
                  placeholder="Schedule name"
                  value={
                    this.state.scheduleList[this.state.scheduleModal.index].name || ""
                  }
                  onChange={(event) => {
                    const f = this.state.scheduleList;
                    f[this.state.scheduleModal.index].name = event.target.value;
                    this.setState((s) => ({
                      scheduleList: f,
                    }));
                    this.props.setSchedule(f);
                  }}
                />

                <p>Applies to:</p>
                <WeekdayInput
                  days={this.state.scheduleList[this.state.scheduleModal.index].days}
                  onChange={(s) => {
                    const f = this.state.scheduleList;
                    f[this.state.scheduleModal.index].days = s;
                    this.setState((s) => ({
                      scheduleList: f,
                    }));
                    this.props.setSchedule(f);
                  }}
                ></WeekdayInput>
                <hr />
                <ScheduleInput
                  schedule={
                    this.state.scheduleList[this.state.scheduleModal.index].periods
                  }
                  setSchedule={(sc) =>
                    this.saveTimes(this.state.scheduleModal.index, sc)
                  }
                  saveAction={this.state.scheduleModal.close}
                ></ScheduleInput>


              </Modal>
            )}

            <hr />
            <h3 className="heading">Create</h3>
            <input
              type="button"
              onClick={this.addSchedule}
              value="Add Schedule"
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
