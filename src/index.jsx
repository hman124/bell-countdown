if (window.location.protocol === "http:" && window.location.hostname !== "localhost") {
  window.location.protocol = "https:";
}
window.onerror=alert;

import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";

import LunchChooser from "./components/LunchChooser.jsx";
import DateCountdown from "./components/DateCountdown.jsx";
import BellCountdown from "./components/BellCountdown.jsx";
import LunchMenu from "./components/LunchMenu.jsx";
import Settings from "./components/Settings.jsx";

import config from "./config.js";

import {Page, Folder, Nav, Button} from "./components/Page.jsx";
import Confetti from "./components/Confetti.jsx";

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/" });
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.stored = {
      lunch: window.localStorage.getItem("lunch"),
      countdown: window.localStorage.getItem("countdown"),
      schedule: window.localStorage.getItem("schedule")
    };

    this.date = new Date();

    var today = config.schedule.order[this.date.getDay()];
    var alt = config.schedule.alt;
    this.schedule = alt ? alt : today ? today : config.schedule.default;
    console.log(this.schedule);
    this.lunch = !!this.schedule.lunches.find(x=>x.id == this.stored.lunch) ? this.stored.lunch : false;
    this.state = {
      lunch: this.lunch,
      ready: !!this.lunch,
      countdown: this.stored.countdown
        ? JSON.parse(this.stored.countdown)
        : false,
      tabIndex: 0,
      schedule: this.schedule,
      menu: {
        loading: true,
        items: null,
      }, page: "schedule"
    };

    this.onSelectLunch = this.onSelectLunch.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.setPage = this.setPage.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.setState({ prompt: true });
    });

    // const d = new Date();
    // const today = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

    // const options = new URLSearchParams();
    // options.set("date", today);

    // fetch(
    //   "https://bell-countdown-api.glitch.me/MenuItems?" + options.toString()
    // )
    //   .then((r) => r.json())
    //   .then((items) => {
    //     this.setState({ menu: { loading: false, items } });
    //   });

    window.addEventListener("appinstalled", () => {
      this.setState({ prompt: true });
    });
  }

  onSelectLunch(lunch) {
    if (lunch !== "choose") {
      window.localStorage.setItem("lunch", lunch);
      this.setState({
        lunch,
        ready: true,
      });
    }
  }

  setPage(page) {
    this.setState({page});
  }

  changeDate(title, date) {
    const obj = { title, date };
    window.localStorage.setItem("countdown", JSON.stringify(obj));
    this.setState({ countdown: obj });
  }

//   setSchedule(type, schedule){
//     this.setState({
//       scheduleType: type,
//       schedule: type=="default"?[config.order[this.date.getDay()]]:schedule
//     });
    
//     if(type == "custom"){
//       window.localStorage.setItem("customSchedule", schedule);
//     }
    
//     window.localStorage.setItem("schedule", type);
//   }
  
  render() {
    return (
      <>
        
        {this.state.confetti && <Confetti/>}
          {!this.state.ready && (
            <LunchChooser
              schedule={this.schedule}
              submit={this.onSelectLunch}
            />
          )}
          {this.state.ready && (<>
<Folder current={this.state.page}>
             <Nav set={this.setPage}>
                <Button page="schedule">Schedule</Button>
                <Button page="countdown">Countdown</Button>
                <Button page="menu">Menu</Button>
                <Button page="settings">Settings</Button>
                </Nav>
<Page page="schedule">
                <BellCountdown
                  lunch={this.state.lunch}
                  schedule={this.state.schedule}
                  scheduleType={this.state.scheduleType}
                  display="counters"
                />
                </Page>

                <Page page="countdown">
                <DateCountdown countdown={this.state.countdown} />
                </Page>
                <Page page="menu">
                <LunchMenu
                  loading={this.state.menu.loading}
                  items={this.state.menu.items}
                /></Page>
                <Page page="settings">
                <Settings
                  setLunch={this.onSelectLunch}
                  setSchedule={this.setSchedule}
                  schedule={this.schedule}
                  setTab={(index) => this.setState({ tabIndex: index })}
                  changeDate={this.changeDate}
                />
                </Page>
                </Folder>
                </>
           )}
      </>
    );
  }
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
