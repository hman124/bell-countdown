if (window.location.protocol === "http:") {
  window.location.protocol = "https:";
}

import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";

import LunchChooser from "./components/LunchChooser.jsx";
import DateCountdown from "./components/DateCountdown.jsx";
import BellCountdown from "./components/BellCountdown.jsx";
import LunchMenu from "./components/LunchMenu.jsx";
import Settings from "./components/Settings.jsx";

import config from "./config.js";
import normal from "./schedules/normal.js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

// window.onerror = alert;

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
    };

    this.schedule = config.schedule;

    this.state = {
      lunch: this.stored.lunch || false,
      ready: !!this.stored.lunch,
      countdown: this.stored.countdown ? JSON.parse(this.stored.countdown) : {title: "Last Day of School", date: "5/26/2022"},
      tabIndex: 0,
      menu: {
        loading: true, 
        items: null
      }
    };

    this.onSelectLunch = this.onSelectLunch.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.setState({ prompt: true });
    });

  const d = new Date();
  const today = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
    
   
  const options = new URLSearchParams();
  options.set("date", today);
  
  fetch("https://bell-countdown-api.glitch.me/MenuItems?"+options.toString())
    .then(r=>r.json()).then(items => {
      this.setState({menu: {loading: false, items}});
    });
    
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

  changeDate(title, date) {
    const obj = {title, date};
    window.localStorage.setItem("countdown", JSON.stringify(obj));
    this.setState({countdown: obj});
  }
  
  render() {
    return (
      <>
        <div className="container">
          {!this.state.ready && (
            <LunchChooser
              schedule={this.schedule}
              submit={this.onSelectLunch}
            />
          )}
          {this.state.ready && (
            <div className="countdown">
              <Tabs selectedIndex={this.state.tabIndex} onSelect={(index) => this.setState({tabIndex:index})}>
                <TabList>
                  <Tab>Schedule</Tab>
                  <Tab>Countdown</Tab>
                  <Tab>Menu</Tab>
                  <Tab>Settings</Tab>
                </TabList>

                <TabPanel>
                  <BellCountdown
                    lunch="C"
                    schedule={this.schedule}
                    display="counters"
                  />
                  <p>{this.state.lunch} Lunch</p>
                </TabPanel>
                <TabPanel>
                  <DateCountdown countdown={this.state.countdown}/>
                </TabPanel>
                <TabPanel forceRender={true}>
                  <LunchMenu loading={this.state.menu.loading} items={this.state.menu.items}/>
                </TabPanel>
                <TabPanel>
                <Settings setLunch={this.onSelectLunch} schedule={this.schedule} setTab={(index) => this.setState({tabIndex:index})} changeDate={this.changeDate}/>
                </TabPanel>
              </Tabs>
            </div>
          )}
        </div>
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
