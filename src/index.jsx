import React, { useState } from "react";
import ReactDOM from "react-dom";

import Settings from "./settings.jsx";

import { VCALENDAR } from "./icalfeed.json";

import "./style.css";

import normal from "./schedules/normal.js";
import pack from "./schedules/pack.js";

import message from "./message.json";

//import psat from "./schedules/psat.js";
//import pep from "./schedules/pep-rally.js";
//import finals from "./schedules/finals.js";

window.addEventListener("load", () => {
  navigator.wakeLock ? navigator.wakeLock.request("screen") : false;

  if (window.location.protocol === "http:") {
    //window.location.protocol = "https:";
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
      clock: this.getClock(),
      bell_time: this.getBellTime(),
      year_time: this.getYearTime(),
      mode: "clock",
      background: window.localStorage.getItem("background"),
      settings: false,
      installed: false,
      refresh: false,
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
    this.updateClock = this.updateClock.bind(this);
    this.tick = this.tick.bind(this);
    this.getBellTime = this.getBellTime.bind(this);
    this.toggleNotifs = this.toggleNotifs.bind(this);
  }

  tick() {
    if (!this.lunch) return;
    else {
      var d = new Date(),
        seconds = d.getSeconds();
      if (
        seconds !== 1 &&
        seconds % 15 !== 0 &&
        this.getClock() === this.state.clock &&
        this.state.refresh === false
      ) {
        var l = 60 - new Date().getSeconds();
        this.setState(state => ({
          bell_time: Object.assign(state.bell_time, {
            secs_left:
              l == 60 ? "00" : l < 10 ? `0${l.toString()}` : l.toString()
          }),
          year_time: this.getYearTime()
        }));
      } else {
        this.setState(() => ({
          bell_time: this.getBellTime(),
          year_time: this.getYearTime(),
          refresh: false
        }));
        this.updateClock();
      }
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.tick();
      setInterval(this.tick, 1000);
    }, 1);
  }

  componentWillUnmount() {
    clearInterval(this.timeint);
    clearInterval(this.clockint);
  }

  getClock() {
    const d = new Date();
    return (
      (d.getHours() > 12 ? d.getHours() % 12 : d.getHours()) +
      ":" +
      (d.getMinutes() < 10
        ? "0" + d.getMinutes().toString()
        : d.getMinutes().toString()) +
      " " +
      (d.getHours() >= 12 ? "PM" : "AM")
    );
  }

  updateClock() {
    const d = new Date();
    this.setState(state => ({
      clock: this.getClock()
    }));
  }

  changeDate(title, date) {
    const a = { title, date};
    window.localStorage.setItem("countdown", JSON.stringify(a));
    this.setState(o => ({
      countdown: a,
      mode: "last"
    }));
  }

  numToTime(num) {
    var h = Math.trunc(num / 60),
      m = num % 60;
    return `${(h > 12 ? h % 12 : h).toString()}:${
      m < 10 ? "0" + m.toString() : m.toString()
    }`;
  }

  getBellTime() {
    if (!this.lunch) {
      return {};
    } else {
      const d = new Date(),
        mins = d.getHours() * 60 + d.getMinutes(),
        sched = d.getDay() === 3 ? pack(this.lunch) : normal(this.lunch),
        period = sched.find(x => mins < x.time[1] && mins >= x.time[0]),
        passing = sched.reduce((p, c, i, a) => {
          if (!p && i > 0 && mins < c.time[0] && mins >= a[i - 1].time[1]) {
            return {
              name: a[i - 1].name,
              time: [a[i - 1].time[1], c.time[0]]
            };
          } else {
            return p;
          }
        }, false),
        final = period || passing,
        l = 60 - d.getSeconds();
      if (!period && !passing) {
        return { period: "no_school" };
      } else {
        const mins_left = final.time[1] - mins - (l === 60 ? 0 : 1),
          data2 = {
            period: period
              ? `${this.ordinal_suffix_of(final.name)}  Period`
              : `Passing Period (after ${this.ordinal_suffix_of(final.name)})`,
            mins_left: mins_left.toString(),
            secs_left:
              l == 60 ? "00" : l < 10 ? `0${l.toString()}` : l.toString(),
            end_time: this.numToTime(final.time[1]),
            percent_complete:
              100 -
              Math.trunc(
                ((mins_left + l / 60) / (final.time[1] - final.time[0])) * 100
              )
          };

        if (
          this.state &&
          this.state.notifications &&
          /^(5|2|1|0)$/.test(mins_left.toString())
        ) {
          if (l == 60) {
            new Notification(`${mins_left.toString()} minutes left`);
          } else if (mins_left == 0 && l == 30) {
            new Notification(`30 seconds left`);
          }
        }

        return data2;
      }
    }
  }

  getYearTime() {
    var countdown = this.state?.countdown
        ? this.state.countdown
        : this.countdown
        ? JSON.parse(this.countdown)
        : { title: "The Last Day of School", date: "5/27/2022" },
      days = 0;

    const t = new Date(countdown.date),
      d = new Date;
    const holidays = VCALENDAR[0].VEVENT.filter(x =>
      x.SUMMARY.toLowerCase().includes("holiday")
    ).map(x => ({
      date: x.DTSTART.slice(6, 8),
      month: x.DTSTART.slice(4, 6),
      duration: x.DURATION ? +x.DURATION.match(/[1-9]+/)[0] : 1
    }));
    
    d.setDate(d.getDate()+1);
    while (d < t) {
      if (countdown.holidays) {
        days++;
      } else {
        const today = holidays.filter(
          x => x.date == d.getDate() && x.month == d.getMonth() + 1
        );
        if (today.length > 0) {
          d.setDate(d.getDate() + (+today[0].duration - 1));
        } else if (!/^[60]{1}$/.test(d.getDay())) {
          days++;
     //     alert(d.toString());
        }
      }
      d.setDate(d.getDate()+1);
    } 

    const twelve = new Date();
    twelve.setDate(twelve.getDate() + 1);
    twelve.setHours(0);
    twelve.setMinutes(0);
    twelve.setSeconds(0);

    var distance = twelve.getTime() - Date.now(),
      hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
      days_until: days,
      secs_until: seconds,
      hours_until: hours,
      minutes_until: minutes
    };
  }

  ordinal_suffix_of(i) {
    var j = typeof i !== "string" ? i.toString() : i;
    if (!/^[0-9]+$/.test(i)) {
      return j;
    } else if (j.endsWith("1")) {
      return i + "st";
    } else if (j.endsWith("2")) {
      return i + "nd";
    } else if (j.endsWith("3")) {
      return i + "rd";
    } else {
      return i + "th";
    }
  }

  selectChange(event) {
    var val = event.target.value;
    if (val === "choose") {
      alert("Please choose an option");
    } else {
      window.localStorage.removeItem("new");
      window.localStorage.setItem("lunch", val);
      this.lunch = event.target.value;
      this.setState(() => ({ ready: true, bell_time: this.getBellTime() }));
    }
  }

  setBackground(url) {
    this.setState(() => ({ background: url }));
    window.localStorage.setItem("background", url);
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
                {this.state.mode === "clock" ? (
                  <>
                    <h1>{this.state.clock}</h1>
                    {this.state.bell_time.period === "no_school" ? (
                      <h1>School is not in session right now</h1>
                    ) : (
                      <>
                        <h1>
                          The Bell rings in{" "}
                          {this.state.bell_time.mins_left > 59
                            ? `01:${this.state.bell_time.mins_left % 60}`
                            : this.state.bell_time.mins_left}
                          :{this.state.bell_time.secs_left}
                        </h1>
                        <h2>{this.state.bell_time.period}</h2>
                        <h3>Ends at {this.state.bell_time.end_time}</h3>
                        <p>
                          Progress: {this.state.bell_time.percent_complete}%
                          <br />
                          <progress
                            max="100"
                            value={this.state.bell_time.percent_complete}
                          ></progress>
                        </p>
                        {new Date().getDay() === 3 && (
                          <p>Pack Period Schedule</p>
                        )}
                      </>
                    )}
                    <p>{this.lunch} Lunch</p>
                  </>
                ) : (
                  <>
                    <h1>{this.state.countdown.title}</h1>
                    <span>{this.state.countdown.date}</span>
                    <h2>{this.state.year_time.days_until} days,</h2>
                    <h2>{this.state.year_time.hours_until} hours,</h2>
                    <h2>{this.state.year_time.minutes_until} minutes,</h2>
                    <h2>{this.state.year_time.secs_until} seconds left</h2>
                    <h3>
                      (
                      <input
                        type="checkbox"
                        onClick={event => {
                          this.setState(s => {
                            const countdown = Object.assign(s.countdown, {
                              holidays: !s.countdown.holidays
                            });
                            window.localStorage.setItem(
                              "countdown",
                              JSON.stringify(countdown)
                            );
                            return {
                              year_time: this.getYearTime(),
                              countdown
                            };
                          });
                        }}
                        style={{ display: "inline" }}
                        checked={this.state.countdown.holidays}
                      />
                      {this.state.countdown.holidays ? "" : "not "}
                      including weekends and holidays)
                    </h3>
                  </>
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
                  onClick={() => this.setState(() => ({ settings: true}))}
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
