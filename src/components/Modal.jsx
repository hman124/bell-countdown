import React, {useState} from "react";
import "../styles/Modal.css";

export default function Modal(props) {
    let [closing, setClosing] = useState(false);
    function close(){
      setClosing(true);
      setTimeout(props.close, 200);
    }

  return (
    <>
      <div className="popup" onClick={close}>
        <div className={"content "+(closing? " closing": " roll-out")} onClick={event=>event.stopPropagation()}>
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
