import React from "react";

//import psat from "./schedules/psat.js";
//import pep from "./schedules/pep-rally.js";

import pack from "./schedules/pack.js";
import normal from "./schedules/normal.js";
import finals_tues from "./schedules/finals-tues.js";
import finals_wed from "./schedules/finals-wed.js";
import finals_thurs from "./schedules/finals-thurs.js";
import finals_fri from "./schedules/finals-fri.js";

export default class BellTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lunch: props.lunch,
      bell_time: this.getBellTime(props.lunch),
      clock: this.getClock(),
      scheduleModal: false
    };

    this.tick = this.tick.bind(this);
  }

  zeroPad(num) {
    if (num < 10) {
      return "0" + num.toString();
    } else {
      return num;
    }
  }

  numToTime(num) {
    if (typeof num == "string") {
      return (
        (((+num.split(":")[0] + 11) % 12) + 1).toString() +
        ":" +
        num.split(":")[1]
      );
    } else {
      var h = Math.trunc(num / 60),
        m = num % 60;
      return `${(h > 12 ? h % 12 : h).toString()}:${
        m < 10 ? "0" + m.toString() : m.toString()
      }`;
    }
  }

  ordinal_suffix_of(i) {
    var j = typeof i !== "string" ? i.toString() : i;
    if (!/^[0-9]+$/.test(i)) {
      return j;
    } else if (j.endsWith("1")) {
      return i + "st Period";
    } else if (j.endsWith("2")) {
      return i + "nd Period";
    } else if (j.endsWith("3")) {
      return i + "rd Period";
    } else {
      return i + "th Period";
    }
  }

  getSchedule() {
    const scheds = [
      null,
      normal,
      finals_tues,
      finals_wed,
      finals_thurs,
      finals_fri
    ];
    return scheds[new Date().getDay()];
  }

  to12hrTime(time) {
    return (
      (((+time.split(":")[0] + 11) % 12) + 1).toString() +
      ":" +
      time.split(":")[1]
    );
  }

  toMins(time) {
    const [hours, minutes] = time.split(":").map(x => +x);
    return hours * 60 + minutes;
  }

  getBellTime(lunch) {
    if (!lunch) return {};
    const d = new Date();
    d.setHours(9)
    const  mins = d.getHours() * 60 + d.getMinutes(),
      sched = this.getSchedule() /*finals, d.getDay() === 3 ? pack : normal,*/,
      times = sched.getTimes(lunch);

    var period = null,
      next = null;
    for (let i = 0; i < times.length; i++){
      const x = times[i];
      if (mins < this.toMins(x.time[1]) && mins >= this.toMins(x.time[0])) {
        if (typeof times[i + 1] !== "undefined") {next = this.ordinal_suffix_of(times[i + 1].name);}
        period = x;
        break;
      } else if (i > 0 && mins < this.toMins(x.time[0]) && mins >= this.toMins(times[i - 1].time[1])){
        next = x.name;
        period = { 
          name: `Passing Period (after ${times[i - 1].name})`,
          time: [this.toMins(times[i - 1].time[1]), this.toMins(x.time[0])]
        };
        break;
      }
    }

    if (!period) return { period: "no_school" };
    const l = 60 - d.getSeconds(),
      mins_left = this.toMins(period.time[1]) - mins - (l === 60 ? 0 : 1),
      data2 = {
        schedule: sched.title,
        next_period: next,
        period: this.ordinal_suffix_of(period.name),
        mins_left,
        secs_left: l == 60 ? "00" : this.zeroPad(l),
        end_time: this.to12hrTime(period.time[1]),
        percent_complete: Math.trunc((1 - (mins_left / (this.toMins(period.time[1]) - this.toMins(period.time[0])))) * 100)
      };
    return data2;
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getClock() {
    const d = new Date();
    return (
      ((d.getHours() + 11) % 12) +
      1 +
      ":" +
      (d.getMinutes() < 10
        ? "0" + d.getMinutes().toString()
        : d.getMinutes().toString()) +
      " " +
      (d.getHours() >= 12 ? "PM" : "AM")
    );
  }

  tick() {
    var d = new Date(),
      seconds = d.getSeconds();
    if (
      seconds !== 1 &&
      seconds % 15 !== 0 &&
      this.getClock() === this.state.clock
    ) {
      var l = 60 - new Date().getSeconds();
      this.setState(state => {
        const secs_left =
          l == 60 ? "00" : l < 10 ? `0${l.toString()}` : l.toString();
        document.title = `School Bell Schedule ${
          typeof state.bell_time.mins_left == "number"
            ? `- ${state.bell_time.mins_left}:${secs_left}`
            : ""
        }`;
        return {
          bell_time: Object.assign(state.bell_time, { secs_left })
        };
      });
    } else {
      this.setState(() => {
        const bell_time = this.getBellTime(this.state.lunch);
        document.title = `School Bell Schedule ${
          typeof bell_time.mins_left == "number"
            ? `- ${bell_time.mins_left}:${bell_time.secs_left}`
            : ""
        }`;
        return {
          bell_time,
          clock: this.getClock()
        };
      });
    }
  }

  getScheduleList() {
    const times = this.getSchedule().getTimes(this.state.lunch);
    return times.reduce((p, c, i, a) => {
      p.push(
        <li key={i} style={{ marginBottom: "1rem" }}>
          <b>{this.ordinal_suffix_of(c.name)}</b>
          <br />
          <small>
            {this.to12hrTime(c.time[0])} - {this.to12hrTime(c.time[1])} (
            {this.toMins(c.time[1]) - this.toMins(c.time[0])} minutes)
          </small>
        </li>
      );
      return p;
    }, []);
  }

  render() {
    return (
      <>
        <>
          <h1>{this.state.clock}</h1>
          {this.state.bell_time.period === "no_school" ? (
            <h1>School is not in session right now</h1>
          ) : (
            <>
              <h1>
                The Bell rings in{" "}
                {this.state.bell_time.mins_left > 59
                  ? `${Math.trunc(
                      this.state.bell_time.mins_left / 60
                    )}:${this.zeroPad(this.state.bell_time.mins_left % 60)}`
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
              <fieldset style={{ borderRadius: "10px", marginBottom: "2rem" }}>
                <legend>
                  <h3 style={{ margin: "0" }}>Schedule</h3>
                </legend>
                <h4>{this.state.bell_time.schedule}&nbsp;</h4>
                <h4>{this.state.lunch} Lunch</h4>
                <h4>
                  <a
                    href="#"
                    style={{ color: "inherit" }}
                    onClick={e => {e.preventDefault();
                      this.setState(() => ({ scheduleModal: true }))}
                    }
                  >
                    View Schedule
                  </a>
                </h4>
                {this.state.bell_time.next_period && (
                  <h4>Next Period: {this.state.bell_time.next_period}</h4>
                )}
              </fieldset>
              {new Date().getDay() === 3 && false && (
                <p>Pack Period Schedule</p>
              )}
            </>
          )}
          {this.state.scheduleModal && (
            <div style={{ display: "block" }} className="modal">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => this.setState(() => ({ scheduleModal: false }))}
              >
                X
              </span>
              <h1 style={{ textAlign: "center" }}>Schedule</h1>
              <hr />
              <p>{this.getSchedule().title}</p>
              <p>{this.state.lunch} Lunch</p>
              <ul>{this.getScheduleList()}</ul>
            </div>
          )}
        </>
      </>
    );
  }
}
