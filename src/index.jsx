import React, { useState } from "react";
import ReactDOM from "react-dom";

import Settings from "./settings.jsx";
import "./style.css";

import message from "./message.json";

import BellTime from "./belltime.jsx";
import YearTime from "./yeartime.jsx";

window.addEventListener("load", () => {
  navigator.wakeLock ? navigator.wakeLock.request("screen") : false;

  if (window.location.protocol === "http:") {
    window.location.protocol = "https:";
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(reg => {
      console.log("Service Worker Started");
    });
  }
});

window.onerror = alert;

let prompt = false;
window.addEventListener("beforeinstallprompt", function(e) {
  e.preventDefault();
  prompt = e;
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.lunch = window.localStorage.getItem("lunch");
    this.countdown = window.localStorage.getItem("countdown");
    this.state = {
      ready: !!this.lunch,
      mode: "clock",
      background: window.localStorage.getItem("background"),
      settings: false,
      installed: false,
      notifications: !!window.localStorage.getItem("notifications"),
      message,
      countdown: this.countdown ? JSON.parse(this.countdown) : false
    };

    window.addEventListener(
      "appinstalled",
      function(e) {
        this.setState(() => ({ installed: true }));
      }.bind(this)
    );

    this.changeDate = this.changeDate.bind(this);
    this.selectChange = this.selectChange.bind(this);
    this.toggleNotifs = this.toggleNotifs.bind(this);
  }

  changeDate(title, date) {
    const a = { title, date };
    window.localStorage.setItem("countdown", JSON.stringify(a));
    this.setState(o => ({
      countdown: a,
      mode: "last"
    }));
  }

  selectChange(event) {
    var val = event.target.value;
    if (val === "choose") {
      alert("Please choose an option");
    } else {
      window.localStorage.removeItem("new");
      window.localStorage.setItem("lunch", val);
      this.lunch = event.target.value;
      this.setState(() => ({ ready: true }));
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

  toggleNotifs() {
    if (this.state.notifications) {
      window.localStorage.removeItem("notifications");
      this.setState(s => ({ notifications: !1 }));
    } else {
      Notification.requestPermission().then(r => {
        if (r == "granted") {
          window.localStorage.setItem("notifications", "true");
          this.setState(s => ({ notifications: !0 }));
        } else {
          alert(
            "You need to grant permission in order for notifications to function."
          );
        }
      });
    }
  }

  render() {
    return (
      <>
        {this.state.message.show && (
          <div className="modal">
            {this.state.message.content}
            <input
              type="button"
              onClick={() =>
                this.setState(() => ({ message: { show: false } }))
              }
              value="Okay"
            />
          </div>
        )}
        <div
          className="countdown"
          style={
            this.state.background
              ? { backgroundColor: "rgba(0,0,0,0.7)", color: "white" }
              : {}
          }
        >
          <div className="container">
            {this.lunch ? (
              <>
                {this.state.mode === "clock" ? (<BellTime lunch={this.lunch} />) : (<YearTime countdown={this.state.countdown}/>)}
                <button
                  onClick={() =>
                    this.setState(s => ({
                      mode: s.mode == "last" ? "clock" : "last"
                    }))
                  }
                >
                  {this.state.mode === "clock"
                    ? "Show countdown"
                    : "Show Bell Schedule"}
                </button>
                <button
                  onClick={() => this.setState(() => ({ settings: true }))}
                >
                  Settings
                </button>
                <Settings
                  close={() => this.setState(() => ({ settings: false }))}
                  setLunch={this.selectChange}
                  setBackground={this.changeBg}
                  isOpen={this.state.settings}
                  notifs={this.state.notifications}
                  changeDate={this.changeDate}
                  toggleNotifs={this.toggleNotifs}
                  changeBackground={w =>
                    this.setState(() => ({ background: w }))
                  }
                />
              </>
            ) : (
              <>
                <h1>Choose a Lunch</h1>
                <select onChange={this.selectChange}>
                  <option value="choose">Choose One</option>
                  <option value="A">A Lunch</option>
                  <option value="B">B Lunch</option>
                  <option value="C">C Lunch</option>
                </select>
              </>
            )}
          </div>
        </div>
        <div
          className="background"
          style={
            this.state.background
              ? { backgroundImage: `url(${this.state.background})` }
              : {}
          }
        ></div>
      </>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
