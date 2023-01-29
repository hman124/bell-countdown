import React, { useState } from "react";

export default function LunchChooser(props) {
  var [lunch, setLunch] = useState("choose");
  var [error, setError] = useState(false);

  function submitForm() {
    if (lunch !== "choose") {
      props.setLunch(lunch);
    } else {
      setError(true);
    }
  }

  if(!props.lunches)return <></>

  const options = props.lunches.map((x) => (
    <option key={x.id} value={x.id}>
      {x.name}
    </option>
  ));

  return (
    <>
      <h1 className="heading">Lunch</h1>
      <select onChange={(event) => setLunch(event.target.value)} value={lunch}>
        <option value="choose">Choose One</option>
        {options}
      </select>
      <input type="button" onClick={submitForm} value="Select" />
      {error && <span style={{ color: "red" }}>Please Choose an Option</span>}
      {props.lunch && <p>Currently Selected: {props.lunch} Lunch</p>}
    </>
  );
}
