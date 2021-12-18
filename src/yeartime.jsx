import React from "react";
import { VCALENDAR } from "./icalfeed.json";

export default class YearTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year_time: this.getYearTime(props.countdown),
      countdown: this.props.countdown
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState(s => ({ year_time: this.getYearTime(this.state.countdown) }));
  }

  getYearTime(countdown) {
    var days = 0,
        t = new Date(countdown.date),
        d = new Date();

    d.setDate(d.getDate() + 1);
    while (d < t) {
      days++;
      d.setDate(d.getDate() + 1);
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

  render() {
    return (
      <>
        <h1>{this.state.countdown.title}</h1>
        <span>{this.state.countdown.date}</span>
        <h2>{this.state.year_time.days_until} days,</h2>
        <h2>{this.state.year_time.hours_until} hours,</h2>
        <h2>{this.state.year_time.minutes_until} minutes,</h2>
        <h2>{this.state.year_time.secs_until} seconds left</h2>
      </>
    );
  }
}
