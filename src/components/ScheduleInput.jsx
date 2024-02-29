import React from "react";
import ToggleSlider from "./ToggleSlider";

//this file is very erroneous, long, and repetitive
//but it works

export default class ScheduleInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schedule: props.schedule || [],
      errors: [],
      dragging: false,
      mobile: window.innerWidth <= 1000,
      index: 0,
    };

    this.saveSchedule = this.saveSchedule.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState((s) => ({ mobile: window.innerWidth <= 1000 }));
    });
  }

  dTime(t) {
    let [h, m] = t.split(":");

    let d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    d.setSeconds(0);
    return d;
  }

  saveSchedule(schedule, checkErrors) {
    console.log(schedule)

    this.setState(({ schedule }));

    if(!checkErrors){return;}

    //check for blank class periods - we can't sort if so
    let blank = schedule.map((x) => {
      if (!x.name || !x.time.length || !x.time[0] || !x.time[1]) {
        console.log("blank");
        return "Please fill in all fields";
      }

      return null;
    });

    if (blank.filter((x) => !!x).length > 0) {
      this.setState({ errors: blank });
      console.log("returning");
      return;
    }
    
    //sort the schedule
    let sr = schedule.sort((a, b) => this.dTime(a.time[0]) - this.dTime(b.time[0]));
    console.log(sr);
    //if problems persist, list them here
    let time = sr.map((x, i, a) => {
      if (this.dTime(x.time[0]) > this.dTime(x.time[1])) {
        return "Invalid times. Start time must be before end time";
      } else if (
        i > 0 &&
        a[i - 1].time[1] &&
        this.dTime(x.time[0]) < this.dTime(a[i - 1].time[1])
        ) {
          return "Invalid times. Start time must be after previous end time";
        }
        
        return "";
      });
      
      this.setState({ errors: time });


    this.props.setSchedule(sr);
  }

  renderPeriodTable() {
    return this.state.schedule.map((x, i) =>
      this.state.mobile ? (
        <React.Fragment>
          <p>Period Name</p>{" "}
          <input
            onChange={(e) => {
              let t = this.state.schedule.concat();
              t[i].name = e.target.value;
              this.saveSchedule(t,true);

            }}
            type="text"
            placeholder="1st Period"
            value={x.name || ""}
          />
          <p>Start Time</p>
          <input
            type="time"
            onChange={(e) => {
              let t = this.state.schedule.concat();
              t[i].time[0] = e.target.value;
              this.saveSchedule(t,true);
            }}
            value={x.time[0] || ""}
          />
          <p>End Time</p>
          <input
            type="time"
            onChange={(e) => {
              var t = this.state.schedule.concat();
              t[i].time[1] = e.target.value;
              this.saveSchedule(t,true);
            }}
            value={x.time[1] || ""}
          />
          <span className="error">{this.state.errors[i]}</span>
        </React.Fragment>
      ) : (
        <React.Fragment key={i}>
          <tr>
            <td>
              <input
                onChange={(e) => {
                  let t = this.state.schedule.concat();
                  t[i].name = e.target.value;
                  this.saveSchedule(t,true);
                }}
                type="text"
                placeholder="1st Period"
                value={x.name || ""}
              />
            </td>
            <td>
              <input
                type="time"
                onChange={(e) => {
                  let t = this.state.schedule.concat();
                  t[i].time[0] = e.target.value;
                  this.saveSchedule(t,true);
                }}
                value={x.time[0] || ""}
              />
            </td>
            <td>
              <input
                type="time"
                onChange={(e) => {
                  let t = this.state.schedule.concat();
                  t[i].time[1] = e.target.value;
                  this.saveSchedule(t,true);
                }}
                value={x.time[1] || ""}
              />
            </td>
            <td>
              <button
                className="inline"
                onClick={() => {
                  var t = this.state.schedule.concat();
                  t.splice(i, 1);
                  this.saveSchedule(t,true);
                }}
                title="Remove Class Period"
              >
                <i className="fa fa-x"></i>
              </button>
            </td>
          </tr>
          <tr>
            <td colSpan="3">
              {this.state.errors[i] && (
                <p className="error">{this.state.errors[i]}</p>
              )}
            </td>
          </tr>
        </React.Fragment>
      )
    );
  }

  render() {
    return (
      <>
        {this.state.schedule.length > 0 ? (
          this.state.mobile ? (
            <div className="table-mobile">
              {this.renderPeriodTable()[this.state.index]}
              <button
                className="icon-with-text"
                title="delete this period"
                disabled={this.state.schedule.length == 0}
                onClick={() => {
                  if (!confirm("Delete this class period?")) {
                    return;
                  }

                  let t = this.state.schedule.concat();
                  t.splice(s.index, 1);
                }}
              >
                <i className="fa fa-x"></i>
                Delete Period
              </button>
              <p className="text-center">
                <button
                  style={{ marginRight: "1rem" }}
                  className="inline"
                  disabled={this.state.index == 0}
                  onClick={() =>
                    this.setState((s) => ({ index: Math.max(s.index - 1, 0) }))
                  }>
                  <i className="fa fa-arrow-left"></i>
                </button>
                period {this.state.index + 1} out of{" "}
                {this.state.schedule.length}
                <button
                  style={{ marginLeft: "1rem" }}
                  className="inline"
                  disabled={this.state.index == this.state.schedule.length - 1}
                  onClick={() =>
                    this.setState((s) => ({
                      index: Math.min(s.index + 1, s.schedule.length - 1),
                    }))
                  }
                >
                  <i className="fa fa-arrow-right"></i>
                </button>
              </p>
            </div>
          ) : (
            <table className="no-border">
              <thead></thead>
              <tbody>
                <tr>
                  <th>Period Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th></th>
                </tr>
                {this.renderPeriodTable()}
              </tbody>
            </table>
          )
        ) : (
          <p>
            No class periods yet. Click the{" "}
            <i className="fa fa-plus-circle"></i> icon to add a class period.
          </p>
        )}
        <hr />
        <button
          className="icon-with-text width-third"
          title="New Class Period"
          onClick={() => {
            let e = this.state.schedule.concat();
            e.push({ name: "", time: [] });
            this.saveSchedule(e,false);
            this.setState((s) => ({ index: e.length - 1 }));
          }}
        >
          <i className="fa fa-plus-circle"></i>
          Add Class
        </button>
        <button
          className="icon-with-text width-third"
          title="Reset Schedule"
          onClick={() => {
            if (!confirm("Delete your entire schedule?")) {
              return;
            }
            this.saveSchedule([],false);
          }}
          disabled={this.state.schedule.length == 0}
        >
          <i className="fa fa-trash"></i>
          Clear Schedule
        </button>
        <button onClick={() => this.props.saveAction()} className="icon-with-text width-third"><i className="fa fa-save"></i> Save</button>
      </>
    );
  }
}
