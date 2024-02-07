import React, {useState} from "react";
import "../styles/ToggleSlider.css";

function ToggleSlider(props) {
    let [active, setActive] = useState(props.active || false);

    return <div className={"toggle-slider" + (active ? " active": "") + (props.disabled ? " disabled" : "")} onClick={()=>{
        props.onChange(!active);
        setActive(!active);
    }}>
        <div className="toggle-handle"></div>
    </div>
}

export default ToggleSlider;