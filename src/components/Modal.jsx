import React, { useState, useRef } from "react";
import "../styles/Modal.css";

export default function Modal(props) {
  // animation duration
  const dur = 300;
  let [closing, setClosing] = useState(false);
  let [animating, setAnimating] = useState(true);
  let bodyEl = useRef(0);
  let containerEl = useRef(0);

  function close() {
    setClosing(true);
    setAnimating(true);
    
    // called on the start of the close animation
    if(typeof props.onCloseStart == "function"){
      props.onCloseStart();
    }

    // future: this should be renamed to onCloseEnd
    // called at the end of the close animation
    if(typeof props.close == "function"){ 
      setTimeout(props.close, dur);
    }
  }

  React.useEffect(() => {
    if (typeof props.onLoad == "function") {
      props.onLoad(close);
    }
  }, []);

  return (
    <>
      <div 
        className={
          "popup" + 
          (animating ? " " + (closing ? "fadeout" : "fadein") : "") + 
          (props.className ? (" " + props.className) : "")} 
        style={{ "--_anim-duration": dur + "ms" }} 
        onClick={close}
        onAnimationEnd={()=>!closing&&setAnimating(false)}>

        <div className="content" onClick={event => event.stopPropagation()}>
          <div className="header" style={{width: bodyEl.current.clientWidth}}>
            <h1>{props.title}</h1>
            <span className={"close fa "+(props.closeIcon?props.closeIcon:"fa-x")} onClick={close}>
            </span>
          </div>
          <div className="body" ref={bodyEl}>
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}
