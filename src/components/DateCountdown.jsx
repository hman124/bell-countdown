import React from "react";
import "../styles/DateCountdown.css";

export default class DateCountdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {},
    };

    this.tick = this.tick.bind(this);
    this.getYearTime = this.getYearTime.bind(this);
  }

  componentDidMount() {
    if(this.props.countdownList.length > 0){
      this.interval = setInterval(this.tick, 1000);
      this.tick();
    }
  }

  componentWillUnmount() {
    if(this.interval){
      clearInterval(this.interval);
    }
  }

  tick() {
    this.setState(() => ({
      time: this.props.countdownList.map(x=>this.getYearTime(x)),
    }));
  }

  getYearTime(countdown, index) {
    var days = 0,
      t = new Date(countdown.date),
      d = new Date();
    if (t < d) {
      const z = this.props.countdownList;
      z.splice(index);
      this.props.setCountdown(z);
      return {};
    } else {
      while (d < t) {
        if (!/^[60]{1}$/.test(d.getDay())) {
            days++;
        }
        d.setDate(d.getDate() + 1);
    }

      const twelve = new Date();
      twelve.setDate(twelve.getDate()+1);
      twelve.setHours(12);
      twelve.setMinutes(0);
      twelve.setSeconds(0);

      var distance = twelve.getTime() - Date.now(),
        hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return {
        days_until: days,
        secs_until: seconds,
        hours_until: hours,
        minutes_until: minutes,
      };
    }}


  render() {
    return (
      <div className="DateCountdown container center">
        <h1>Countdown</h1>
        <hr/>
        {this.props.countdownList.length == 0 ? (
          <>
            <p>No current countdowns, add one in settings</p>
          </>
        ) : (
          <>            
          {this.props.countdownList.map((x,i,a)=><>
            <h3>{x.title}</h3>
            <span>{x.date}</span>
            {/* <hr/> */}
            <ul className="DateCountdown">
              <li><p>{this.state.time[i]?.days_until}</p> days</li>
              <li><p>{this.state.time[i]?.hours_until}</p> hours</li>
              <li><p>{this.state.time[i]?.minutes_until}</p> minutes</li>
              <li><p>{this.state.time[i]?.secs_until}</p> seconds</li>
            </ul>
            {i !== a.length-1 && <hr/> }
          </>)}
          </>
        )}
      </div>
    );
  }
}
