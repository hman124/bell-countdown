import React from "react";
import "../styles/settings.css";
import LunchChooser from "./LunchChooser.jsx";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.schedule = window.localStorage.getItem("schedule");
    this.state = {
      page: 0,
      schedule: this.schedule?JSON.parse(this.schedule):[]
    };

    // this.fileInput = React.createRef();
    this.renderPage = this.renderPage.bind(this);
    this.switchPage = this.switchPage.bind(this);
    // this.changeBackground = this.changeBackground.bind(this);
    // this.uploadBackground = this.uploadBackground.bind(this);
    this.close = this.close.bind(this);
    this.dateSub = this.dateSub.bind(this);
  }

  // changeBackground(val) {
  //   if (val) {
  //     this.props.changeBackground(val);
  //     window.localStorage.setItem("background", val);
  //   } else {
  //     this.props.changeBackground(false);
  //     window.localStorage.removeItem("background");
  //   }
  //   this.close();
  // }

//   async uploadBackground(e) {
//     if (this.fileInput.current.files[0].size > 4000000) {
//       alert("Image is too large in size. Must be less than 4MB");
//       this.fileInput.current.value = "";
//       return;
//     } else {
//       const toBase64 = file =>
//         new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.readAsDataURL(file);
//           reader.onload = () => resolve(reader.result);
//           reader.onerror = error => reject(error);
//         });

//       this.changeBackground(await toBase64(this.fileInput.current.files[0]));
//     }
//   }

      // <li onClick={()=>this.switchPage(4)}>Schedule</li>
  renderNav() {
    return <ul className="settings-nav">
      <li onClick={()=>this.switchPage(1)}>Lunch</li>    
      <li onClick={()=>this.switchPage(3)}>Countdown</li>
      {this.props.prompt && <li onClick={()=>this.props.prompt.prompt()}>Install App</li>}
    </ul>
  }
      // <li onClick={()=>this.switchPage(2)}>Background</li>    
      // <li onClick={()=>this.switchPage(5)}>Display</li>
  
  close() {
    this.props.setTab(0);
  }

  dateSub(e) {
    e.preventDefault();
    var a = e.target.date.value.split("-");
    a.push(a.shift());
  
    var x = a.join("/"),
        r = new Date(x),
        d = new Date();
    if (a[0] > 3000) {
      alert("please choose a year less than 3000");
    } else if(e < d) {
      alert("please choose a date in the future");
    } else {
      this.props.changeDate(e.target.title.value, x);
      this.props.setTab(1);
    }
  }

  renderPage() {
    switch (this.state.page) {
      case 0:
        return (<>
        <h1>Settings</h1>
        <p>Select a menu item to edit the settings</p></>);
        break;
      case 1:
        return (
          <>
            <h1>Select Lunch</h1>
            <hr />
            <LunchChooser schedule={this.props.schedule} submit={lunch=>{this.props.setLunch(lunch);this.props.setTab(0);}}/>
          </>
        );
      // case 2:
      //   return (
      //     <>
      //       <h1>Select Background</h1>
      //       <hr />
      //       <div className="bg-cont">
      //         {Array(6)
      //           .fill(null)
      //           .reduce((a, e, i) => {
      //             var url = `/img/${i}.png`;
      //             a.push(
      //               <img
      //                 key={i}
      //                 className="bg-preview"
      //                 src={url}
      //                 onClick={e => this.changeBackground(url)}
      //               />
      //             );
      //             return a;
      //           }, [])}
      //       </div>
      //       <hr />
      //       <h3>Or upload a file:</h3>
      //       <input
      //         type="file"
      //         value=""
      //         accept="image/*"
      //         ref={this.fileInput}
      //         onChange={this.uploadBackground}
      //       />
      //       <input
      //         type="button"
      //         onClick={this.changeBackground.bind(this, false)}
      //         value="Clear Background"
      //       />
      //     </>
      //   );
      //   break;
      case 3:
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
                />
              </label>
              <br />
              <input
                required
                type="text"
                name="title"
                placeholder="Countdown Title"
              />
              <input type="submit" value="Apply"/>
            </form>
            <hr></hr>
            <input
              type="button"
              value="Use The Last Day of School"
              onClick={() => {
                this.props.changeDate("The Last Day of School", "5/26/2022");
                this.close();
              }}
            ></input>
          </>
        );
        break;
      case 4:
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
      // case 5:
      //   return (<>
      //       <h1>Display Settings</h1>
      //       <hr/>
      //         <input type="button" value="Aesthetic" onClick={()=>this.setDisplay('aesthetic')}/>
      //         <input type="button" value="Focused" onClick={()=>this.setDisplay('focused')}/>
      //     </>);
    }
  }

//   saveSchedule(e) {
//     window.localStorage.setItem("schedule", JSON.stringify(e));
//   }

//   renderPeriodTable() {
//     return this.state.schedule.map((x, i) => (
//       <tr key={i}>
//         <td>
//           <input
//             onChange={e =>
//               this.setState(s => {
//                 var t = s.schedule.concat();
//                 t[i].name = e.target.value;
//                 this.saveSchedule(t);
//                 return { schedule: t };
//               })
//             }
//             type="text"
//             value={x.name}
//           />
//         </td>
//         <td>
//           <input
//             type="time"
//             onChange={e =>
//               this.setState(s => {
//                 var t = s.schedule.concat();
//                 t[i].time[0] = e.target.value;
//                 this.saveSchedule(t);
//                 return { schedule: t };
//               })
//             }
//             value={x.time[0]}
//           />
//         </td>
//         <td>
//           <input
//             type="time"
//             onChange={e =>
//               this.setState(s => {
//                 var t = s.schedule.concat();
//                 t[i].time[1] = e.target.value;
//                 this.saveSchedule(t);
//                 return { schedule: t };
//               })
//             }
//             value={x.time[1]}
//           />
//         </td>
//       </tr>
//     ));
//   }

  switchPage(p) {
    this.setState(() => ({ page: p }));
  }

  render() {
    return (
      <>
            <div className="settings">
              {this.renderNav()}
              <div style={{clear: "both"}}></div>
              <div className="settings-page">
                {this.renderPage()}
              </div>
              <span style={{position:"fixed", bottom: "0", left: "0"}}>Ver. 2.1.0 (stable) | <a href="mailto:bugs@steedster.net">Report Bugs</a></span>
            </div>
          </>
        
    );
  }
}

              // <span className="settings-close" onClick={this.close}>
              //   X
              // </span>