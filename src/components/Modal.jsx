import React, { useState } from "react";
import "../styles/Modal.css";

export default function Modal(props) {
  // animation duration
  const dur = 300;
  let [closing, setClosing] = useState(false);
  function close() {
    setClosing(true);
    setTimeout(props.close, dur);
  }

  React.useEffect(() => {
    if (typeof props.onLoad == "function") {
      props.onLoad(close);
    }
  }, []);

  return (
    <>
      <div className={"popup " + (closing ? " fadeout" : " fadein")} style={{ "--_anim-duration": dur + "ms" }} onClick={close}>
        <div className="content" onClick={event => event.stopPropagation()}>
          <div className="header">
            <h1>{props.title}</h1>
            <span className="close fa fa-x" onClick={close}>
            </span>
          </div>
          {props.children}
        </div>
      </div>
    </>
  );
}
