import React from "react";

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "../styles/BellCountdown.css";

class BellCountdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countdown: this.getCountdown(),
      clock: this.getClock(),
      counter: Math.min(window.innerWidth / 4, window.innerHeight / 4),
    };

    this.styles = buildStyles({
      pathColor: props.theme.main,
      textColor: props.theme.main,
      trailColor: props.theme.type == "light"? "#aaa" : "#fff",
      backgroundColor: "#aaaaaa"
    })

    this.tick = this.tick.bind(this);
    this.resizeDimensions = this.resizeDimensions.bind(this);
  }

  resizeDimensions() {
    this.setState({
      counter: Math.min(window.innerWidth / 4, window.innerHeight / 4),
    });
    // this.forceUpdate()
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeDimensions);
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeDimensions);
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
    // if(this.props.scheduleType !== "default"){return {}};
    const d = new Date();
    if (/[60]/.test(d.getDay())) return { school: false, reason: "Weekend" };
    const mins = d.getHours() * 60 + d.getMinutes(),
      times = this.props.schedule,
      list = times
        .map((x) => x.time)
        .flat()
        .map((x) => this.toMins(x)),
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
        current: `Passing Period (after ${prevPeriod.name})`,
        next: nextPeriod.name,
        end: nextPeriod.time[0],
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
    const d = new Date(),
      seconds = 60 - d.getSeconds();
    if (
      seconds % 15 == 0 ||
      seconds == 0 ||
      seconds == 59 ||
      this.getClock() !== this.state.clock
    ) {
      this.setState({
        clock: this.getClock(),
        countdown: this.getCountdown(),
      });
    } else if (this.state.countdown.school) {
      this.setState((s) => ({
        countdown: {
          ...s.countdown,
          time: {
            ...s.countdown.time,
            seconds: this.zeroPad(seconds),
          },
        },
      }));
    }
  }

  to12hrTime(time) {
    return (
      (((+time.split(":")[0] + 11) % 12) + 1).toString() +
      ":" +
      time.split(":")[1] +
      (+time.split(":")[0] >= 12 ? " PM" : "")
    );
  }

  render() {
    return (
      <div className="BellCountdown container center">
        <h1>{this.state.clock}</h1>
        {this.state.countdown.school ? (
          <>
                <h1>{this.state.countdown.current}</h1>
                <div className="counters-container">
                  <div style={{width: this.state.counter, height: this.state.counter}} className="progressbar-container">
                    <CircularProgressbar styles={this.styles} value={this.state.countdown.time.minutes} maxValue={this.state.countdown.length} text={this.state.countdown.time.minutes.toString()}/>
                  </div>
                  <div style={{width: this.state.counter, height: this.state.counter}} className="progressbar-container">
                    <CircularProgressbar styles={this.styles} value={this.state.countdown.time.seconds} maxValue={60} text={this.state.countdown.time.seconds.toString()}/>
                  </div>                  
                  <p className="progressbar-label">Minutes</p>
                  <p className="progressbar-label">Seconds</p>
                </div>
            <p>Ends At {this.to12hrTime(this.state.countdown.end)}</p>
            {this.state.countdown.next ? <p>Next Period: {this.state.countdown.next}</p> : null }
          </>
        ) : (
          <>
            <h1>No School Right Now</h1>
            <p>{this.state.countdown.reason}</p>
          </>
        )}
      </div>
    );
  }
}

export default BellCountdown;
