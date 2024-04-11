import React from "react";
import "../styles/Settings.css";
import LunchChooser from "./LunchChooser.jsx";
import config from "../config.json";
import themes from "../themes.json";
import ScheduleInput from "./ScheduleInput.jsx";
import Modal from "./Modal.jsx";
import WeekdayInput from "./WeekdayInput";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToggleSlider from "./ToggleSlider.jsx";

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
      }, devOptions: window.localStorage.getItem("devOptions") == "true",
      scheduleUploadModal: {
        open: false
      }, installButton: !!props.installPrompt,
      notificationPermission: Notification.permission,
      notificationOptions: props.notificationOptions,
      notificationAlertDraft: { amount: "", units: "", mode: "" }
    };

    this.pages = [
      { t: "countdown", i: "fa-clock" },
      { t: "theme", i: "fa-paint-brush" },
      { t: "schedule", i: "fa-calendar" },
      { t: "notifications", i: "fa-bell" },
      { t: "Sync", i: "fa-sync" },
      { t: "about", i: "fa-info-circle" }
    ];

    if (config.schedule.use) {
      this.pages.splice(2, 0, { t: "lunch", i: "fa-hamburger" });
    }

    this.themes = themes;

    this.renderPage = this.renderPage.bind(this);
    this.switchPage = this.switchPage.bind(this);
    this.close = this.close.bind(this);
    this.dateSub = this.dateSub.bind(this);
    this.removeCountdown = this.removeCountdown.bind(this);
    this.addSchedule = this.addSchedule.bind(this);
    this.setScheduleList = this.setScheduleList.bind(this);
    this.toggleSchedule = this.toggleSchedule.bind(this);
    this.requestNotificationPermission = this.requestNotificationPermission.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({
        mobile: window.innerWidth <= 1000,
      });
    });
  }

  setPage(p) {
    this.setState({ page: p });
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
              {this.state.installButton && (
                <li onClick={() => {
                  this.setState({ installButton: false });
                  this.props.installPrompt.prompt();
                }}><i className="fa fa-circle-down"></i> Install App</li>
              )}
            </ul>
          </nav>
        )}
      </>
    );
  }

  requestNotificationPermission() {
    if (!(Notification in window)) {
      alert("This browser doesn't support notifications!");
      return;
    }

    // if the permission is granted or denied, just update the state
    if (
      Notification.permission == "granted" ||
      Notification.permission == "denied"
    ) {
      this.setState({ notificationPermission: Notification.permission });
      return;
    }

    // request permission and update the state accordingly
    Notification.requestPermission().then(permission => {
      this.setState({ notificationPermission: permission });
    });
  }

  close() {
    this.props.setTab(0);
  }

  removeCountdown(i) {
    const s = this.state.countdownList;
    if (!s[i]) {
      return;
    }
    s.splice(i, 1);
    this.props.setCountdownList(s);
    this.setState(() => ({ countdownList: s }));
  }

  setScheduleList(f) {
    this.setState({ scheduleList: f });
    this.props.setScheduleList(f);
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
      this.props.setCountdownList(r);
      this.setState(() => ({ countdownList: r }));

      this.state.countdownModal.close();
    }
  }

  downloadSchedule(idx) {
    const file = JSON.stringify(this.state.scheduleList[idx]);

    const blob = new Blob([file]);
    const blobURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobURL;
    a.innerText = "download";
    a.download = "schedule (" + this.state.scheduleList[idx].name + ").json"

    document.body.appendChild(a);
    a.click();

    a.remove();
  }

  toggleSchedule(i, val) {
    const schedules = this.state.scheduleList.concat();
    schedules[i].active = val;

    this.setScheduleList(schedules);
  }

  uploadSchedule(event) {
    const file = event.target.files[0];
    if (!file) { return; }

    const reader = new FileReader();
    reader.onload = (response) => {
      try {

        const parsed = JSON.parse(response.target.result);
        parsed.name += " (uploaded)";

        this.setState(s => {
          const scheduleList = [...s.scheduleList, parsed];
          window.localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
          return { scheduleList }
        });

        toast.info("Uploaded File");

      } catch (err) {

      }
    };
    reader.readAsText(file);

  }

  toggleNotifications() {
    this.setState(s => ({
      notificationOptions: {
        ...s.notificationOptions,
        enabled: !s.notificationOptions.enabled
      }
    }), this.saveNotificationOptions);
  }

  saveNotificationOptions() {
    this.props.setNotificationOptions(this.state.notificationOptions);
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

              <br />
              <i className="fa fa-code"></i>{" "}
              <a href="#" onClick={() => {
                this.setState(s => {
                  window.localStorage.setItem("devOptions", (!s.devOptions).toString());
                  return { devOptions: !s.devOptions };
                });
              }}>
                {this.state.devOptions ? "Disable" : "Enable"} Developer Options
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
            <h3 className="heading">Current Countdowns</h3>
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
                          onClick={() => this.removeCountdown(i)}
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
            <button onClick={() => this.setState(s => ({ countdownModal: { open: true } }))}>
              <i className="fa fa-plus-circle"></i> Add Countdown
            </button>
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
            {config.schedule.use && <div className="info">
              This version of bell countdown comes preloaded with schedules from your school.
            </div>}
            {this.state.scheduleList.length > 0 ?
              (<table>
                <tbody>
                  {this.state.scheduleList.map((x, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td>{x.name || "untitled schedule"}</td>

                        <td>
                          <button
                            disabled={x.preset}
                            title="Edit this schedule"
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
                            disabled={x.preset}
                            title="Delete this schedule"
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
                              this.props.setScheduleList(s);
                            }}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                        {this.state.devOptions && <td>
                          <button
                            className="inline"
                            title="Download Schedule"
                            onClick={() => this.downloadSchedule(i)}
                          >
                            <i className="fa fa-file-arrow-down"></i>
                          </button>
                        </td>}

                        <td title="Toggle this Schedule">
                          <ToggleSlider active={!("active" in x) || x.active} onChange={(val) => this.toggleSchedule(i, val)}></ToggleSlider>
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
                    this.props.setScheduleList(f);
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
                    this.props.setScheduleList(f);
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

            <button
              title="Create a new Schedule"
              onClick={this.addSchedule}>
              <i className="fa fa-plus-circle"></i>{" "}
              Add Schedule
            </button>

            {this.state.devOptions &&
              <button
                title="Upload Schedule File"
                onClick={() => this.setState(({ scheduleUploadModal: { open: true } }))}
              >
                <i className="fa fa-file-arrow-up"></i> {" "}
                Upload Schedule
              </button>}

            {this.state.scheduleUploadModal.open &&
              <Modal
                onLoad={(cb) => this.setState(s => ({ scheduleUploadModal: { ...s.scheduleUploadModal, close: cb } }))}
                close={() => this.setState({ scheduleUploadModal: { open: false } })}
                title="Upload Schedule">
                <h3>Choose a schedule ".json" file</h3>
                <input type="file" onChange={evt => {
                  this.uploadSchedule(evt);
                  this.state.scheduleUploadModal.close()
                }} />
              </Modal>}

          </>
        );
      case "notifications":
        return (<>
          <h1>Notifications</h1>
          <hr />
          {this.state.notificationPermission == "default" &&
            <button onClick={this.requestNotificationPermission}>Allow Notifications</button>
          }

          {this.state.notificationPermission == "denied" &&
            <span style={{ color: "red" }}>Notification permission has been denied. <br /> Click the lock or options icon to allow notification access.</span>
          }

          {this.state.notificationPermission == "granted" && <>
            <ToggleSlider active={this.state.notificationOptions.enabled} onChange={() => this.toggleNotifications()}></ToggleSlider> <span>Enable Notifications</span>

            <h3>Active Alerts</h3>

            {this.state.notificationOptions.alerts.length == 0 ?
              <span>No alerts yet. Add one below</span> :
              <table>
                <tbody>
                  {this.state.notificationOptions.alerts.map((x, i) => 
                  <tr key={x.formatted}>
                    <td>{x.formatted}</td>
                    <td>
                      <button className="inline" onClick={() => {
                        this.setState(s => { 
                          const alerts = s.notificationOptions.alerts.concat()
                          alerts.splice(i, 1); 
                          console.log(i, alerts);
                          return { notificationOptions: { ...s.notificationOptions, alerts  } };
                        }, this.saveNotificationOptions);
                       }}>
                        <i className="fa fa-trash"></i>
                        </button>
                    </td>
                  </tr>)}
                </tbody>
              </table>
            }

            <h3>Create Alert</h3>

            <select
              className="inline"
              onInput={(evt) => this.setState(s => ({ notificationAlertDraft: { ...s.notificationAlertDraft, amount: evt.target.value } }))}
              value={this.state.notificationAlertDraft.amount}>
              <option value="">Choose one</option>
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>

            <select
              className="inline"
              onInput={(evt) => this.setState(s => ({ notificationAlertDraft: { ...s.notificationAlertDraft, units: evt.target.value } }))}
              value={this.state.notificationAlertDraft.units}>
              <option value="">Choose one</option>
              <option value="minutes">minute(s)</option>
              <option value="seconds">second(s)</option>
            </select>

            <select
              className="inline"
              onInput={(evt) => this.setState(s => ({ notificationAlertDraft: { ...s.notificationAlertDraft, mode: evt.target.value } }))}
              value={this.state.notificationAlertDraft.mode}>
              <option value="">Choose one</option>
              <option value="before_end">before class end</option>
              <option value="after_start">after class start</option>
            </select>

            <button onClick={() => {
              this.setState(s => {
                const draft = s.notificationAlertDraft;

                if (Object.values(draft).includes("")) { return s; }

                const alerts = s.notificationOptions.alerts.concat();
                alerts.push({
                  ...draft,
                  formatted: draft.amount + draft.units.slice(0, 1) + " " +
                    (draft.mode == "before_end" ? " before class end" : "after class start")
                });

                

                return {
                  notificationOptions: { ...s.notificationOptions, alerts },
                  notificationAlertDraft: { mode: "", amount: "", units: "" }
                }
              }, this.saveNotificationOptions);
            }}>Create</button>
          </>}

        </>);
    }
  }

  switchPage(p) {
    this.setState(() => ({ page: p }));
  }

  render() {
    return (
      <div className="container Settings">
        {this.renderNav()}
<<<<<<< Updated upstream
        <div className="settings-main">{this.renderPage()}</div>
=======
        <div className="settings-main" style={this.state.navopen ? { display: "none" } : {}}>{this.renderPage()}</div>
>>>>>>> Stashed changes
        <ToastContainer></ToastContainer>
      </div>
    );
  }
}
