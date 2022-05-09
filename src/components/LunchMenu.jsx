import React, { useState } from "react";

window.onerror = alert;

function LunchItemImage(props) {
  var [loading, setLoading] = useState(true);
  var [image, setImage] = useState(null);

  const url = props.url;
  fetch(url, { headers: { accept: "application/json" } })
    .then((r) => r.json())
    .then((d) => {
      setLoading(false);
      setImage(d);
    });

  return (
    <>
      {loading && (
        <img
          width="40"
          height="40"
          className="MenuImage"
          src="https://cdn.glitch.com/41b9504c-a9af-4d48-8bcf-ed59058d6a31/loading-loading-forever.gif"
        />
      )}
      {!loading && image && (
        <img src={"data:image/png;base64," + image} className="MenuImage" width="40" height="40" />
      )}
    </>
  );
}

function LunchMenu(props) {
  var isWeekend = /[60]{1}/.test(new Date().getDay());

  if (props.loading) {
    return <>Loading...</>;
  } else if (Object.keys(props.items).length == 0 || isWeekend) {
    return (
      <>
        <p>There is nothing on the menu today</p>
      </>
    );
  } else {
    return (
      <>
        <div className="lunchMenu">
          <h1>On the Menu Today</h1>
          <h2>Meal:</h2>
          <h3>
            <LunchItemImage
              url={props.items["LUNCH ENTREE"][0].ThumbnailImageURL}
            />
            {props.items["LUNCH ENTREE"][0].MenuItemDescription}
          </h3>
          <h2>Vegetables:</h2>
          {props.items["VEGETABLE"].map((itm, i) => (
            <li key={i}>
              <LunchItemImage url={itm.ThumbnailImageURL} />
              {itm.MenuItemDescription}
            </li>
          ))}
          <h2>Fruits:</h2>
          {props.items["FRUIT"].map((itm, i) => (
            <li key={i}>
              <LunchItemImage url={itm.ThumbnailImageURL} />
              {itm.MenuItemDescription}
            </li>
          ))}
        </div>
      </>);
  }
}

export default LunchMenu;
