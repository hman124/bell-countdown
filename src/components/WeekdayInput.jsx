import React, {useState} from "react";

import "../styles/WeekdayInput.css";

export default function WeekdayInput(props) {
    let [days, setDays] = useState(props.days || []);

    const list = ["mo", "tu", "we", "th", "fr", "sa", "su"]
    return <div className="weekday-container">
    {list.map(x=>
      <div key={x} onClick={()=>{
        const d= days.concat();
        if(d.includes(x)){
            d.splice(d.indexOf(x), 1);
        } else {
            d.push(x);
        }
        setDays(d);
        props.onChange(d);
      }} className={"weekday"+ (days.includes(x)? " selected" : "")}><p>{x}</p></div>
    )}
    <div style={{clear:"both"}}></div>
    </div>
}