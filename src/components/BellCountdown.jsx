import React from "react";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/BellCountdown.css";
import Modal from "./Modal.jsx";

class BellCountdown extends React.Component {
  constructor(props) {
    super(props);
    this.schedule = props.schedule;

    const days = ["su", "mo", "tu", "we", "th", "fr", "sa"];
    const d = new Date();

    this.weekday = days[d.getDay()];

    this.state = {
      countdown: {},
      clock: this.getClock(),
      schedule:
        props.scheduleList.find((x) => (!("enabled" in x) || x.enabled) && x.days.includes(this.weekday)) || null,
      schedulemodal: false,
    };

    this.styles = buildStyles({
      pathColor: props.theme.main,
      textColor: props.theme.main,
      trailColor: props.theme.type == "light" ? "#aaa" : "#fff",
      backgroundColor: "#aaaaaa",
    });

    this.tick = this.tick.bind(this);
    this.getCountdown = this.getCountdown.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
    this.setState({ countdown: this.getCountdown() });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  toMins(time) {
    const pattern = /[0-9]{1,2}:[0-9]{1,2}/;
    if (pattern.test(time)) {
      const [hours, minutes] = time.split(":");
      return +minutes + +hours * 60;
    } else {
      return 0;
    }
  }

  zeroPad(num) {
    if (num < 10) {
      return "0" + num.toString();
    } else {
      return num.toString();
    }
  }

  getTimeLeft(diff) {
    const d = new Date(),
      l = 60 - d.getSeconds(),
      seconds = l == 60 ? "00" : this.zeroPad(l);
    return {
      hours: Math.trunc(diff / 60),
      minutes: (diff % 60) + (l == 60 ? 1 : 0) - 1,
      seconds,
    };
  }

  getCountdown() {
    if (!this.state.schedule || !this.state.schedule.periods) {
      return { school: false, reason: "There is no schedule for today" };
    }
    const d = new Date(),
      times = this.state.schedule.periods,
      mins = d.getHours() * 60 + d.getMinutes(),
      list = times
        .map((x) => x.time)
        .flat()
        .map((x) => this.toMins(x))
        .sort((a, b) => a - b),
      itm = list.find((c, i, a) => i > 0 && mins < c && mins >= a[i - 1]),
      i = list.indexOf(itm) + (itm == mins ? 1 : 0);

    if (i < 0) {
      //no school
      return {
        school: false,
        reason:
          mins > list[0]
            ? "School is over for the day"
            : "School hasn't started yet",
      };
    } else if (i % 2 == 0) {
      //passing period
      const prevPeriod = times[Math.trunc(i / 2) - 1],
        nextPeriod = times[Math.trunc(i / 2)],
        end = this.toMins(nextPeriod.time[0]),
        beg = this.toMins(prevPeriod.time[1]);
      return {
        school: true,
        current: `Passing Period`,
        next: nextPeriod.name,
        end: nextPeriod.time[0],
        start: prevPeriod.time[1],
        percent: Math.trunc(((mins - beg) / (end - beg)) * 100),
        time: this.getTimeLeft(end - mins),
        length: end - beg,
      };
    } else {
      //class period
      const period = times[Math.trunc(i / 2)],
        [beg, end] = period.time.map((x) => this.toMins(x)),
        next = times[Math.trunc(i / 2) + 1];
      return {
        school: true,
        current: period.name,
        next: next ? next.name : false,
        end: period.time[1],
        start: period.time[0],
        percent: Math.trunc(((mins - beg) / (end - beg)) * 100),
        time: this.getTimeLeft(end - mins),
        length: end - beg,
      };
    }
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
    const count = this.getCountdown();
    this.setState({
      clock: this.getClock(),
      countdown: count,
    });

    if (count.school) {
      document.title = `${count.time.minutes}:${count.time.seconds} - Bell Countdown`;
    } else {
      document.title = `Bell Countdown`;
    }
  }

  to12hrTime(time) {
    return (
      (((+time.split(":")[0] + 11) % 12) + 1).toString() +
      ":" +
      time.split(":")[1] +
      (+time.split(":")[0] >= 12 ? " PM" : " AM")
    );
  }

  render() {
    if (!this.props.visible) {
      return (<></>);
    }

    return (
      <div className="BellCountdown container center">
        <h1>{this.state.clock}</h1>
        {this.state.countdown.school ? (
          <>
            <h1>{this.state.countdown.current}</h1>
            <div className="counters-container">
              <div className="progressbar-container">
                <CircularProgressbar
                  styles={this.styles}
                  value={this.state.countdown.time.minutes}
                  maxValue={this.state.countdown.length}
                  text={this.state.countdown.time.minutes.toString()}
                />
                <p className="progressbar-label">Minutes</p>
              </div>
              <div className="progressbar-container">
                <CircularProgressbar
                  styles={this.styles}
                  value={this.state.countdown.time.seconds}
                  maxValue={60}
                  text={this.state.countdown.time.seconds.toString()}
                />
                <p className="progressbar-label">Seconds</p>
              </div>
            </div>
            <p><i className="fa fa-clock"></i> {this.to12hrTime(this.state.countdown.start)} - {this.to12hrTime(this.state.countdown.end)}</p>
            {this.state.countdown.next ? (
              <p><i className="fa fa-angles-right"></i> {this.state.countdown.next}</p>
            ) : null}
          </>
        ) : (
          <>
            <h1>No School Right Now</h1>
            <p>{this.state.countdown.reason}</p>
          </>
        )}
        {this.state.schedule && (
          <>
            <p>
              <a
                href="#"
                className="normal no-underline"
                onClick={() => this.setState(() => ({ schedulemodal: true }))}
              >
                <i className="fa fa-calendar"></i>{" "}
                <span className="underline">{this.state.schedule.name}</span>
              </a>
            </p>

            {this.state.schedulemodal && (
              <Modal
                open={this.state.schedulemodal}
                title="Schedule"
                close={() => this.setState(() => ({ schedulemodal: false }))}
              >
                <table>
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <th>Start</th>
                      <th>End</th>
                    </tr>
                    {this.state.schedule.periods
                      .sort(
                        (a, b) =>
                          this.toMins(a.time[0]) - this.toMins(b.time[0])
                      )
                      .map((x, i) => (
                        <tr key={i}>
                          <td>{x.name}</td>
                          <td>{this.to12hrTime(x.time[0])}</td>
                          <td>{this.to12hrTime(x.time[1])}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Modal>
            )}
          </>
        )}

        {/* {this.props.lunch && <p><i className="fa fa-hamburger"></i> {config.schedule.lunches[this.props.lunch].name} Lunch</p>} */}
      </div>
    );
  }
}

export default BellCountdown;
