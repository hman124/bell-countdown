import React, { useState } from "react";
import ScheduleInput from "./ScheduleInput.jsx";

export default function ScheduleChooser(props) {
  const [enter, setEnter] = useState(false);
  const [find, setFind] = useState(false);

  return enter ? (
    <>
      <div className="oneline heading">
        <button
          style={{ marginRight: "1rem" }}
          className="inline"
          onClick={() => setEnter(false)}
        >
          <i className="fa fa-arrow-left"></i>
        </button>
        <h3>Enter Schedule</h3>
      </div>
      <ScheduleInput setSchedule={props.setSchedule} />
      <br />
    </>
  ) : find ? (
    <>
      <div className="oneline heading">
        <button
          style={{ marginRight: "1rem" }}
          className="inline"
          onClick={() => setFind(false)}
        >
          <i className="fa fa-arrow-left"></i>
        </button>
        <h3>Find Schedule</h3>
      </div>
      <input type="text" defaultValue="" key="schoolsearch" />
    </>
  ) : (
    <>
      <h1>Welcome</h1>
      <h3 className="heading">Find Your School's Schedule</h3>
      <input
        type="button"
        onClick={() => setEnter(true)}
        key="entermanually"
        value="Enter Manually"
      />
      <input
        type="button"
        onClick={() => setFind(true)}
        key="search"
        disabled={true} 
        value="Search Available Schools (currently unavailable)"
      />
    </>
  );
}
