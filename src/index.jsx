window.onerror = alert;
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import Settings from "./settings.jsx";
import "./style.css";

import message from "./message.json";

import BellTime from "./belltime.jsx";
import YearTime from "./yeartime.jsx";

import confetti from "./confetti.js";

window.addEventListener("load", () => {
  navigator.wakeLock ? navigator.wakeLock.request("screen") : false;

  if (window.location.protocol === "http:") {
    window.location.protocol = "https:";
  }

  if ("serviceWorker" in navigator) {
    // navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(reg => {
    // reg.unregister()
    //   console.log("Service Worker Started");
    // });
  }
});

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
    this.confettiColors = window.localStorage.getItem("confetti");
    this.state = {
      lunch: this.lunch,
      ready: !!this.lunch,
      mode: "clock",
      background: window.localStorage.getItem("background"),
      settings: false,
      installed: false,
      notifications: !!window.localStorage.getItem("notifications"),
      countdown: this.countdown ? JSON.parse(this.countdown) : false,
      message,
      confettiColors: this.confettiColors?JSON.parse(this.confettiColors):["red", "green"],
      confettiModal: false
    };
    message.show
      ? setTimeout(
          () => this.setState(() => ({ message: { show: false } })),
          5000
        )
      : false;
    window.addEventListener(
      "appinstalled",
      function(e) {
        this.setState(() => ({ installed: true }));
      }.bind(this)
    );

    this.changeDate = this.changeDate.bind(this);
    this.selectChange = this.selectChange.bind(this);
    this.toggleNotifs = this.toggleNotifs.bind(this);
    this.updateColors = this.updateColors.bind(this);
    confetti.colorList = this.state.confettiColors;
    confetti.start();
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

  updateColors(e) {

    this.setState(x => {
      const z = x.confettiColors.concat();
      z.includes(e.target.value)
        ? z.splice(z.indexOf(e.target.value), 1)
        : z.push(e.target.value);
      confetti.remove();
      if(z.length == 0){
        confetti.colorList = ["white"];
      } else {
        confetti.colorList = z;
      }
      confetti.start();
      window.localStorage.setItem("confetti", JSON.stringify(z));
      return {confettiColors:z};
    });
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
            <p>{this.state.message.content}</p>
          </div>
        )}
        <div
          className={
            "countdown" + (this.state.background ? " background-enabled" : "")
          }
        >
          <div className="container">
            {this.state.lunch ? (
              <>
                {this.state.mode === "clock" ? (
                  <BellTime lunch={this.state.lunch} key={this.state.lunch} />
                ) : (
                  <YearTime countdown={this.state.countdown} />
                )}
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
                <button
                  onClick={() => this.setState(() => ({ confettiModal: true }))}
                >
                  Confetti Colors
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
        {this.state.confettiModal && (
          <div className="modal">
            <span style={{cursor: "pointer"}} onClick={()=>this.setState(()=>({confettiModal:!1}))}>X</span>
            <h1>Confetti Colors</h1>
            <hr />
            <label>
              Red
              <input
                type="checkbox"
                value="red"
                checked={this.state.confettiColors.includes("red")}
                onChange={this.updateColors}
              />
            </label><label>
              Orange
              <input
                type="checkbox"
                value="orange"
                checked={this.state.confettiColors.includes("orange")}
                onChange={this.updateColors}
              />
            </label><label>
              Yellow
              <input
                type="checkbox"
                value="yellow"
                checked={this.state.confettiColors.includes("yellow")}
                onChange={this.updateColors}
              />
            </label><label>
            Green  
            <input
                type="checkbox"
                value="green"
                checked={this.state.confettiColors.includes("green")}
                onChange={this.updateColors}
              />
            </label><label>
              Lime
              <input
                type="checkbox"
                value="lime"
                checked={this.state.confettiColors.includes("lime")}
                onChange={this.updateColors}
              />
            </label><label>
              Dark Green
              <input
                type="checkbox"
                value="darkGreen"
                checked={this.state.confettiColors.includes("darkGreen")}
                onChange={this.updateColors}
              />
            </label><label>
              Blue
              <input
                type="checkbox"
                value="blue"
                checked={this.state.confettiColors.includes("blue")}
                onChange={this.updateColors}
              />
            </label><label>
              Cyan
              <input
                type="checkbox"
                value="cyan"
                checked={this.state.confettiColors.includes("cyan")}
                onChange={this.updateColors}
              />
            </label><label>
              Dark Cyan
              <input
                type="checkbox"
                value="darkCyan"
                checked={this.state.confettiColors.includes("darkCyan")}
                onChange={this.updateColors}
              />
            </label><label>
              Purple
              <input
                type="checkbox"
                value="purple"
                checked={this.state.confettiColors.includes("purple")}
                onChange={this.updateColors}
              />
            </label><label>
              Magenta
              <input
                type="checkbox"
                value="magenta"
                checked={this.state.confettiColors.includes("magenta")}
                onChange={this.updateColors}
              />
            </label><label>
              Pink
              <input
                type="checkbox"
                value="pink"
                checked={this.state.confettiColors.includes("pink")}
                onChange={this.updateColors}
              />
            </label> <label>
              Black
              <input
                type="checkbox"
                value="black"
                checked={this.state.confettiColors.includes("black")}
                onChange={this.updateColors}
              />
            </label>      </div>
        )}
      </>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>,
  document.getElementById("root")
);
