import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

import Settings from "./settings.jsx";
import "./styles/style.css";

import message from "./config.js";
import BellTime from "./belltime.jsx";
import YearTime from "./yeartime.jsx";

import config from "./config.js";

window.addEventListener("load", () => {
  navigator.wakeLock ? navigator.wakeLock.request("screen") : false;
  if (window.location.protocol === "http:") {
    window.location.protocol = "https:";
  } else if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/" });
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.useAlt = config.schedule.alternate.use;
    this.lunch =
      this.useAlt && config.schedule.alternate.reset_lunch
        ? null
        : window.localStorage.getItem("lunch");
    this.countdown = window.localStorage.getItem("countdown");
    this.state = {
      lunch: this.lunch,
      ready: !!this.lunch,
      mode: "clock",
      background: window.localStorage.getItem("background"),
      settings: false,
      prompt: false,
      // notifications: !!window.localStorage.getItem("notifications"),
      countdown: this.countdown
        ? JSON.parse(this.countdown)
        : { title: "The Last Day of School", date: "5/27/2022" },
      message,
      display: window.localStorage.getItem("display") || "aesthetic",
    };

    this.changeDate = this.changeDate.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
    this.selectChange = this.selectChange.bind(this);
    // this.toggleNotifs = this.toggleNotifs.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.setState({ prompt: true });
    });

    window.addEventListener("appinstalled", () => {
      this.setState({ prompt: true });
    });
  }

  changeDate(title, date) {
    const a = { title, date };
    window.localStorage.setItem("countdown", JSON.stringify(a));
    this.setState((o) => ({
      countdown: a,
      mode: "last",
    }));
  }

  selectChange(event) {
    var val = event.target.value;
    if (val === "choose") {
      alert("Please choose an option");
    } else {
      // window.localStorage.removeItem("new");
      window.localStorage.setItem("lunch", val);
      this.lunch = event.target.value;
      this.setState(() => ({ ready: true, lunch: event.target.value }));
    }
  }

  setBackground(url) {
    this.setState(() => ({ background: url }));
    window.localStorage.setItem("background", url);
  }

  zeroPad(num) {
    if (num < 10) {
      return "0" + num.toString();
    } else {
      return num;
    }
  }

  // toggleNotifs() {
  //   if (this.state.notifications) {
  //     window.localStorage.removeItem("notifications");
  //     this.setState(s => ({ notifications: !1 }));
  //   } else {
  //     Notification.requestPermission().then(r => {
  //       if (r == "granted") {
  //         window.localStorage.setItem("notifications", "true");
  //         this.setState(s => ({ notifications: !0 }));
  //       } else {
  //         alert(
  //           "You need to grant permission in order for notifications to function."
  //         );
  //       }
  //     });
  //   }
  // }  Should We Delete this?

  setDisplay(d) {
    this.setState({ display: d });
  }

  renderLunchOptions() {
    if (this.useAlt) {
      return config.schedule.alternate.schedule.lunches.map((x, i) => (
        <option key={i} value={x.id}>
          {x.name}
        </option>
      ));
    } else {
      return (
        <>
          <option value="A">A Lunch</option>
          <option value="B">B Lunch</option>
          <option value="C">C Lunch</option>
        </>
      );
    }
  }

  render() {
    return (
      <>
        {this.state.message.show && (
          <div
            className={
              "message" + (this.state.background ? " background-enabled" : "")
            }
          >
            <p>{this.state.message.message.content}</p>
          </div>
        )}
        <div
          className={
            "countdown" +
            (this.state.background ? " background-enabled" : "") +
            (this.state.display ? " " + this.state.display : "")
          }
        >
          <div className="container">
            {this.state.lunch ? (
              <>
                {this.state.mode === "clock" ? (
                  <BellTime
                    display={this.state.display}
                    schedule={config.schedule}
                    lunch={this.state.lunch}
                    key={this.state.lunch}
                  />
                ) : (
                  <YearTime
                    onExpire={() =>
                      this.setState({ countdown: { expired: true } })
                    }
                    countdown={this.state.countdown}
                    key={this.state.countdown.date}
                  />
                )}
                <button
                  onClick={() =>
                    this.setState((s) => ({
                      mode: s.mode == "last" ? "clock" : "last",
                    }))
                  }
                >
                  {this.state.mode === "clock" ? "Countdown" : "Bell Schedule"}
                </button>
                <button
                  onClick={() => this.setState(() => ({ settings: true }))}
                >
                  Settings
                </button>
                <Settings
                  close={() => this.setState(() => ({ settings: false }))}
                  setLunch={this.selectChange}
                  setDisplay={this.setDisplay}
                  prompt={this.state.prompt}
                  setBackground={this.changeBg}
                  lunch={this.state.lunch}
                  isOpen={this.state.settings}
                  notifs={this.state.notifications}
                  changeDate={this.changeDate}
                  toggleNotifs={this.toggleNotifs}
                  changeBackground={(w) =>
                    this.setState(() => ({ background: w }))
                  }
                />
              </>
            ) : (
              <>
                <h1>Choose a Lunch</h1>
                <select onChange={this.selectChange}>
                  <option value="choose">Choose One</option>
                  {this.renderLunchOptions()}
                </select>
              </>
            )}
          </div>
        </div>
        {(!this.state.display || this.state.display == "aesthetic") && (
          <div
            className="background"
            style={
              this.state.background
                ? { backgroundImage: `url(${this.state.background})` }
                : {}
            }
          ></div>
        )}
      </>
    );
  }
}
// {(new Date()).getHours() == 0 && <Confetti/>}

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
