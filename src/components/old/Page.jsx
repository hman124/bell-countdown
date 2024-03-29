import React from "react";

function Folder(props){
    return props.children.map((x,i)=>React.cloneElement(x, {current: props.current, key: i}));
}

function Page(props){
    const {current, page} = props;
    return current === page && <div className="page">
      {props.children}
    </div>;  
}

function Nav(props){
    return <div className="navigation">
        {props.children.map((x,i)=>React.cloneElement(x, {current: props.current, key: i, set: props.set}))}
    </div>
}

function Button(props){
    const {current, page} = props;
    return <div onClick={()=>props.set(props.page)} className={"button " + (current==page?"selected":"")}>
      {props.children}
    </div>;  
}

export {Page, Folder, Nav, Button};