import React from "react";
import "../styles/DateCountdown.css";
import "../styles/CustomCheckbox.css";

export default class DateCountdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {},
      weekdaysOnly: true
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
      // if this countdown has expired, remove it
      const z = this.props.countdownList;
      z.splice(index);
      this.props.setCountdown(z);
      return {};
    } else {

      // if counting all of the weekdays
      if(this.state.weekdaysOnly){

        while (d < t) {
          if (!/^[60]{1}$/.test(d.getDay())) {
            days++;
          }
          d.setDate(d.getDate() + 1);
        }
      } else {
        const tt = t.getTime();
        const dt = d.getTime();
        const diff = tt - dt;

        days = Math.trunc(diff / (24*60*60*1000));
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
        <h1 className="header">Countdown</h1>
        <label className="checkbox-container">
          Only Count Weekdays
          <input type="checkbox" 
            onChange={ evt => {
              this.setState(s=>({weekdaysOnly: !s.weekdaysOnly}), () => {
                this.tick();
              });
            }} checked={this.state.weekdaysOnly}/>
          <span className="checkmark"></span>
        </label>
        <div style={{clear: "both"}}></div>
        <hr/>
        {this.props.countdownList.length == 0 ? (
          <>
            <p>No current countdowns, add one in settings</p>
          </>
        ) : (
          <>            
          {this.props.countdownList.map((x,i,a)=><React.Fragment key={i}>
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
          </React.Fragment>)}
          </>
        )}      </div>
    );
  }
}
