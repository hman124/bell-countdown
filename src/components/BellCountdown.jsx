import React from "react";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/BellCountdown.css";
import Modal from "./Modal.jsx";


// helper functions for use in the BellCountdown class
function toMins(time) {
  const pattern = /[0-9]{1,2}:[0-9]{1,2}/;
  if (pattern.test(time)) {
    const [hours, minutes] = time.split(":");
    return +minutes + +hours * 60;
  } else {
    return 0;
  }
}

function getClock() {
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

function getCountdown(schedule) {
  if (!schedule || !schedule.periods || schedule.periods.length == []) {
    return {
      school: false,
      reason: "There is no schedule for today"
    };
  }
  const d = new Date();
  const periods = schedule.periods;

  // sort the class periods by their start time
  periods.sort((a, b) => toMins(a.time[0]) - toMins(b.time[0]));

  const mins = d.getHours() * 60 + d.getMinutes();

  const first_st = toMins(periods[0].time[0]);
  const last_nd = toMins(periods[periods.length - 1].time[1]);

  if (mins < first_st || mins > last_nd) {
    return {
      school: false,
      reason: mins < first_st ? "School has not started yet" : "School is over for the day"
    }
  }

  for (let i = 0; i < periods.length; i++) {
    const curr = periods[i];
    const prev = periods[Math.max(i - 1, 0)];

    // current start and end
    const st = toMins(curr.time[0]);
    const nd = toMins(curr.time[1]);

    if (mins >= st && mins < nd) {
      // middle of class period
      return {
        school: true,
        current: curr.name,
        end: curr.time[1],
        start: curr.time[0],
        time: getTimeLeft(nd - mins),
        length: nd - st
      }
    }

    // if no previous period, keep checking
    if (!prev) { continue }

    // previous start
    const pd = toMins(prev.time[1]);

    if (mins >= pd && mins < st) {
      // passing period
      return {
        school: true,
        current: "Passing Period",
        end: curr.time[0],
        start: prev.time[1],
        time: getTimeLeft(st - mins),
        length: st - pd
      }
    }
  }

  return {};

}

function to12hrTime(time) {
  return (
    (((+time.split(":")[0] + 11) % 12) + 1).toString() +
    ":" +
    time.split(":")[1] +
    (+time.split(":")[0] >= 12 ? " PM" : " AM")
  );
}


function zeroPad(num) {
  if (num < 10) {
    return "0" + num.toString();
  } else {
    return num.toString();
  }
}

function getTimeLeft(diff) {
  const d = new Date(),
    l = 60 - d.getSeconds(),
    seconds = l == 60 ? "00" : zeroPad(l);
  return {
    hours: Math.trunc(diff / 60),
    minutes: (diff % 60) + (l == 60 ? 1 : 0) - 1,
    seconds,
  };
}

class BellCountdown extends React.Component {
  constructor(props) {
    super(props);
    this.schedule = props.schedule;

    const days = ["su", "mo", "tu", "we", "th", "fr", "sa"];
    const d = new Date();

    this.weekday = days[d.getDay()];

    const schedule = (props.scheduleList.find(x => (!("active" in x) || x.active) && x.days.includes(this.weekday)) || null);

    const styles = buildStyles({
      pathColor: props.theme.main,
      textColor: props.theme.main,
      trailColor: props.theme.type == "light" ? "#aaa" : "#fff",
      backgroundColor: "#aaaaaa",
    });

    this.state = {
      countdown: {},
      clock: getClock(),
      schedulemodal: false,
      schedule, styles
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
    this.tick();
  }

  static getDerivedStateFromProps(props, state) {
    const days = ["su", "mo", "tu", "we", "th", "fr", "sa"];
    const d = new Date();

    const weekday = days[d.getDay()];

    const schedule = (props.scheduleList.find(x => (!("active" in x) || x.active) && x.days.includes(weekday)) || null);
    const count = getCountdown(schedule);

    if (count.school) {
      document.title = `${count.time.minutes}:${count.time.seconds} - Bell Countdown`;
    } else {
      document.title = `Bell Countdown`;
    }

    return {
      clock: getClock(),
      countdown: count
    };
  }

  // UNSAFE_componentWillReceiveProps() {

  //   this.styles = buildStyles({
  //     pathColor: this.props.theme.main,
  //     textColor: this.props.theme.main,
  //     trailColor: this.props.theme.type == "light" ? "#aaa" : "#fff",
  //     backgroundColor: "#aaaaaa",
  //   });

  //   this.schedule = this.props.scheduleList.find(x => (!("active" in x) || x.active) && x.days.includes(this.weekday)) || null;
  //   this.tick();
  // }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  tick() {
    const count = getCountdown(this.schedule);
    this.setState({
      clock: getClock(),
      countdown: count,
    });

    if (count.school) {
      document.title = `${count.time.minutes}:${count.time.seconds} - Bell Countdown`;
    } else {
      document.title = `Bell Countdown`;
    }
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
            <span>{this.state.schedule.name}</span>
            <div className="counters-container">
              <div className="progressbar-container">
                <CircularProgressbar
                  styles={this.state.styles}
                  value={this.state.countdown.time.minutes}
                  maxValue={this.state.countdown.length}
                  text={this.state.countdown.time.minutes.toString()}
                />
                <p className="progressbar-label">Minutes</p>
              </div>
              <div className="progressbar-container">
                <CircularProgressbar
                  styles={this.state.styles}
                  value={this.state.countdown.time.seconds}
                  maxValue={60}
                  text={this.state.countdown.time.seconds.toString()}
                />
                <p className="progressbar-label">Seconds</p>
              </div>
            </div>
            <p><i className="fa fa-clock"></i> {to12hrTime(this.state.countdown.start)} - {to12hrTime(this.state.countdown.end)}</p>
            <p><i className="fa fa-chalkboard"></i> {this.state.countdown.current}</p>
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
                onClick={() => {
                  console.log("schedule modal")
                  this.setState(() => ({ schedulemodal: true }))
                }}
              >
                <i className="fa fa-calendar"></i>{" "}
                <span className="underline">view schedule</span>
              </a>
            </p>

            {this.state.schedulemodal &&
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
                      .toSorted(
                        (a, b) =>
                          toMins(a.time[0]) - toMins(b.time[0])
                      )
                      .map((x, i) => (
                        <tr key={i}>
                          <td>{x.name}</td>
                          <td>{to12hrTime(x.time[0])}</td>
                          <td>{to12hrTime(x.time[1])}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Modal>}
          </>
        )}

        {/* {this.props.lunch && <p><i className="fa fa-hamburger"></i> {config.schedule.lunches[this.props.lunch].name} Lunch</p>} */}
      </div>
    );
  }
}

export default BellCountdown;
