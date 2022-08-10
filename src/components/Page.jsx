import React from "react";

function Folder(props){
    return props.children.map(x=>React.cloneElement(x, {current: props.current}));
}

function Page(props){
    console.log(props.children);
    const {current, page} = props;
    return current === page && <div className="page">
      {props.children}
    </div>;  
}

function Nav(props){
    return <div className="navigation">
        {props.children.map(x=>React.cloneElement(x, {current: props.current, set: props.set}))}
    </div>
}

function Button(props){
    const {current, page} = props;
    return <div onClick={()=>props.set(props.page)} className={"button " + (current==page?"selected":"")}>
      {props.children}
    </div>;  
}

export {Page, Folder, Nav, Button};