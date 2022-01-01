import React from "react";
import "./settings.css";

import normal from "./schedules/normal.js";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.schedule = window.localStorage.getItem("schedule");
    this.state = {
      page: 1,
      schedule: this.schedule?JSON.parse(this.schedule):[]
    };

    this.fileInput = React.createRef();

    this.renderPage = this.renderPage.bind(this);
    this.switchPage = this.switchPage.bind(this);
    this.changeBackground = this.changeBackground.bind(this);
    this.uploadBackground = this.uploadBackground.bind(this);
    this.close = this.close.bind(this);
    this.dateSub = this.dateSub.bind(this);
  }

  changeBackground(val) {
    if (val) {
      this.props.changeBackground(val);
      window.localStorage.setItem("background", val);
    } else {
      this.props.changeBackground(false);
      window.localStorage.removeItem("background");
    }
    this.close();
  }

  async uploadBackground(e) {
    if (this.fileInput.current.files[0].size > 4000000) {
      alert("Image is too large in size. Must be less than 4MB");
      this.fileInput.current.value = "";
      return;
    } else {
      const toBase64 = file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });

      this.changeBackground(await toBase64(this.fileInput.current.files[0]));
    }
  }

  close() {
    this.setState(() => ({ page: 1 }));
    this.props.close();
  }

  dateSub(e) {
    e.preventDefault();
    var a = e.target.date.value.split("-");
    if (a[0] > 3000) {
      alert("please choose a year less than 3000");
    } else {
      a.push(a.shift());
      this.props.changeDate(e.target.countdowntitle.value, a.join("/"));
      this.close();
    }
  }

  renderPage() {
    switch (this.state.page) {
      case 1:
        return (
          <>
            <h1>Settings</h1>
            <hr />
            <input
              className="menu"
              type="button"
              value="Change Lunch"
              onClick={() => this.switchPage(2)}
            />
            <input
              className="menu"
              type="button"
              value="Set Background"
              onClick={() => this.switchPage(3)}
            />
            <input
              className="menu"
              type="button"
              value="Set Countdown"
              onClick={() => this.switchPage(4)}
            />{" "}
            <input
              className="menu"
              type="button"
              value="Set Schedule"
              onClick={() => this.switchPage(5)}
            />{" "}
          </>
        );
      case 2:
        return (
          <>
            <h1>Select Lunch</h1>
            <hr />
            <select
              onChange={e => {
                this.props.setLunch(e);
                this.close();
              }}
            >
              <option>Choose One</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            <input
              type="button"
              value="Cancel"
              onClick={() => this.switchPage(1)}
            />
          </>
        );
      case 3:
        return (
          <>
            <h1>Select Background</h1>
            <hr />
            <div className="bg-cont">
              {Array(6)
                .fill(null)
                .reduce((a, e, i) => {
                  var url = `/img/${i}.png`;
                  a.push(
                    <img
                      key={i}
                      className="bg-preview"
                      src={url}
                      onClick={e => this.changeBackground(url)}
                    />
                  );
                  return a;
                }, [])}
            </div>
            <hr />
            <input
              type="file"
              value=""
              accept="image/*"
              ref={this.fileInput}
              onChange={this.uploadBackground}
            />
            <input
              type="button"
              onClick={this.changeBackground.bind(this, false)}
              value="Clear Background"
            />
          </>
        );
      case 4:
        return (
          <>
            <h1>Countdown</h1>
            <hr />
            <form action="#" onSubmit={this.dateSub}>
              <label>
                Enter the date you would like to count down to
                <br />
                <input
                  type="date"
                  min={(() => {
                    var dtToday = new Date();
                    dtToday.setDate(dtToday.getDate() + 1);
                    var month = dtToday.getMonth() + 1;
                    var day = dtToday.getDate();
                    var year = dtToday.getFullYear();

                    if (month < 10) month = "0" + month.toString();
                    if (day < 10) day = "0" + day.toString();

                    return year + "-" + month + "-" + day;
                  })()}
                  required
                  name="date"
                ></input>
              </label>
              <br />
              <input
                required
                type="text"
                name="countdowntitle"
                placeholder="Countdown Title"
              ></input>
              <input type="reset" value="Reset"></input>
              <input type="submit" value="Apply"></input>
            </form>
            <hr></hr>
            <input
              type="button"
              value="Use The Last Day of School"
              onClick={() => {
                this.props.changeDate("The Last Day of School", "5/27/2022");
                this.close();
              }}
            ></input>
          </>
        );
      case 5:
        return (
          <>
            <h1>Set Schedule</h1>
            <hr />
            {this.state.schedule?.length > 0 && <><table>
              <thead></thead>
              <tbody>
                <tr>
                  <th>Period Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
                {this.renderPeriodTable()}
              </tbody>
            </table>
            <button onClick={()=>{
                this.setState({schedule: []});
                 window.localStorage.removeItem("schedule");
                }}>Clear Schedule</button></>
            }
            <button
              onClick={() =>
                this.setState(s => {
                  var e = s.schedule.concat();
                  e.push({ name: "", time: [] });
                  return { schedule: e };
                })
              }
            >
              Add Period
            </button>
          </>
        );
    }
  }

  saveSchedule(e) {
    window.localStorage.setItem("schedule", JSON.stringify(e));
  }

  renderPeriodTable() {
    return this.state.schedule.map((x, i) => (
      <tr key={i}>
        <td>
          <input
            onChange={e =>
              this.setState(s => {
                var t = s.schedule.concat();
                t[i].name = e.target.value;
                this.saveSchedule(t);
                return { schedule: t };
              })
            }
            type="text"
            value={x.name}
          />
        </td>
        <td>
          <input
            type="time"
            onChange={e =>
              this.setState(s => {
                var t = s.schedule.concat();
                t[i].time[0] = e.target.value;
                this.saveSchedule(t);
                return { schedule: t };
              })
            }
            value={x.time[0]}
          />
        </td>
        <td>
          <input
            type="time"
            onChange={e =>
              this.setState(s => {
                var t = s.schedule.concat();
                t[i].time[1] = e.target.value;
                this.saveSchedule(t);
                return { schedule: t };
              })
            }
            value={x.time[1]}
          />
        </td>
      </tr>
    ));
  }

  switchPage(p) {
    this.setState(() => ({ page: p }));
  }

  render() {
    return (
      <>
        {this.props.isOpen && (
          <>
            <div className="settings-fallback" onClick={this.close}></div>
            <div className="settings">
              <span className="settings-close" onClick={this.close}>
                X
              </span>
              {this.renderPage()}
            </div>
          </>
        )}
      </>
    );
  }
}
