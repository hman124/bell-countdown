import React, { useEffect, useState, useRef } from "react";
import ToggleSlider from "./ToggleSlider";
import Modal from "./Modal.jsx";

//this file is very erroneous, long, and repetitive
//but it works

function to12hrTime(time) {
  if(typeof time !== "string"){return "";}
  return (
    (((+time.split(":")[0] + 11) % 12) + 1).toString() +
    ":" +
    time.split(":")[1] +
    (+time.split(":")[0] >= 12 ? " PM" : " AM")
  );
}

function dTime(t) {
  let [h, m] = t.split(":");

  let d = new Date();
  d.setHours(h);
  d.setMinutes(m);
  d.setSeconds(0);
  return d;
}

function ScheduleInput(props) {
  let [schedule, setSchedule] = useState(props.schedule);
  let [classModalOpen, setClassModalOpen] = useState(false);
  let [tooltipOpen, setTooltipOpen] = useState(false);
  let [tooltipCoords, setTooltipCoords] = useState(null);


  let tooltipEl = useRef(0);

  let tooltipIdx = null;
  let classModalCb = null;

  function checkTooltipFocus(event) {
    console.log(tooltipOpen, event.target, tooltipEl.current);
    const menu = tooltipEl.current;
    if (menu && !menu.contains(event.target)) {
      setTooltipOpen(false);
    }
  }

  useEffect(() => {

    console.log("useeffect")
    window.addEventListener("mousedown", checkTooltipFocus);

    return () => {
      console.log("removing");
      // window.removeEventListener("click", checkTooltipFocus);
    }
  }, []);

  function saveSchedule(schedule) {
    setSchedule(schedule);
    props.setSchedule(schedule);
  }

  function removeClass(i) {
    var t = schedule.concat();
    t.splice(i, 1);
    saveSchedule(t, true);
  }

  function contextMenu(idx, evt) {
    const rect = evt.currentTarget.getBoundingClientRect();
    tooltipIdx = idx;
    const left = evt.clientX;
    const top = evt.clientY;

    setTooltipOpen(true);
    setTooltipCoords({left, top});
  }


  // render the component
  return <>
    {schedule.length > 0 ? (
      <table className="no-border thin">
        <thead></thead>
        <tbody>
          {schedule.map((x, i) =>
          (
            <tr key={i}>
              <td><i className="fa fa-grip-lines"></i></td>
              <td>
                {x.name || "Untitled"}
              </td>
              <td>
                {to12hrTime(x.time[0])}{" - "}
                {to12hrTime(x.time[1])}
              </td>
              <td>
                <button
                  className="inline transparent"
                  onClick={(evt) => contextMenu(i, evt)}
                  title="Options"
                >
                  <i className="fa fa-ellipsis-vertical"></i>
                </button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    ) : (
      <>
        <p>No classes yet.</p>
        <small>Click the <i className="fa fa-plus-circle"></i> icon to add a class period.</small>
      </>
    )}

    <button
      className="icon-with-text width-full"
      title="New Class Period"
      onClick={() => {
        // let e = schedule.concat();
        // e.push({ name: "", time: [] });
        // saveSchedule(e, false);
        props.createClass();
      }}
    >
      <i className="fa fa-plus-circle"></i>
      Add Class
    </button>
    {/* <button
        className="icon-with-text width-third"
        title="Reset Schedule"
        onClick={() => {
          if (!confirm("Delete your entire schedule?")) {
            return;
          }
          saveSchedule([], false);
        }}
        disabled={schedule.length == 0}
      >
        <i className="fa fa-trash"></i>
        Clear Schedule
      </button>
      <button onClick={() => props.saveAction()} className="icon-with-text width-third"><i className="fa fa-save"></i> Save</button> */}

    {tooltipOpen &&
      <div className="context-menu"
        ref={tooltipEl}
        style={{ "--_left": tooltipCoords.left + "px", "--_top": tooltipCoords.top + "px" }}>
        <ul>
          <li><i className="fa fa-edit"></i> Edit</li>
          <li><i className="fa fa-trash"></i> Delete</li>
        </ul>
      </div>}
  </>

}

export default ScheduleInput;

// export default class ScheduleInput extends React.Component {


//   saveSchedule(schedule, checkErrors) {
//     console.log(schedule)

//     this.setState(({ schedule }));

//     if (!checkErrors) { return; }

//     //check for blank class periods - we can't sort if so
//     let blank = schedule.map((x) => {
//       if (!x.name || !x.time.length || !x.time[0] || !x.time[1]) {
//         console.log("blank");
//         return "Please fill in all fields";
//       }

//       return null;
//     });

//     if (blank.filter((x) => !!x).length > 0) {
//       this.setState({ errors: blank });
//       console.log("returning");
//       return;
//     }

//     //sort the schedule
//     let sr = schedule.sort((a, b) => this.dTime(a.time[0]) - this.dTime(b.time[0]));
//     console.log(sr);
//     //if problems persist, list them here
//     let time = sr.map((x, i, a) => {
//       if (this.dTime(x.time[0]) > this.dTime(x.time[1])) {
//         return "Invalid times. Start time must be before end time";
//       } else if (
//         i > 0 &&
//         a[i - 1].time[1] &&
//         this.dTime(x.time[0]) < this.dTime(a[i - 1].time[1])
//       ) {
//         return "Invalid times. Start time must be after previous end time";
//       }

//       return "";
//     });

//     this.setState({ errors: time });


//     this.props.setSchedule(sr);
//   }

//   renderPeriodTable() {
//     return
//   }
// }