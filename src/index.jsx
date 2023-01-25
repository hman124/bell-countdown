import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";
import "./styles/fontawesome/css/all.min.css";

import config from "./config.json";
import themes from "./themes.json";

//stuff from ver. 1.0
import LunchChooser from "./components/LunchChooser.jsx";
import ScheduleChooser from "./components/ScheduleChooser.jsx";
import DateCountdown from "./components/DateCountdown.jsx";
import BellCountdown from "./components/BellCountdown.jsx";
// import LunchMenu from "./components/LunchMenu.jsx";
import Settings from "./components/Settings.jsx";
// import Updates from "./components/Updates.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    //saved items from localstorage
    this.schedule = window.localStorage.getItem("schedule");
    // this.lunch = window.localStorage.getItem("lunch");
    this.theme = window.localStorage.getItem("theme");
    this.countdown = window.localStorage.getItem("countdown");

    //config variables
    this.apiEndpoint = config.apiEndpoint;
    this.version = config.version;

    this.state = {
      page: "schedule",
      countdown: this.countdown ? JSON.parse(this.countdown) : null,
      schedule: this.schedule ? JSON.parse(this.schedule) : null,
      theme: this.theme ? themes.find((x) => x.name == this.theme) : themes[0],
      // lunch: this.lunch
    };

    //pages for nav
    this.pages = [
      "schedule",
      "countdown",
      // "updates",
      "settings",
      // "menu"
    ];

    this.setPage = this.setPage.bind(this);
    this.setCountdown = this.setCountdown.bind(this);
    this.setSchedule = this.setSchedule.bind(this);
    this.setTheme = this.setTheme.bind(this);
  }

  componentDidMount() {
    this.setTheme(this.state.theme, false);
  }

  setCountdown(obj) {
    this.setState(() => ({
      countdown: obj,
    }));

    window.localStorage.setItem("countdown", JSON.stringify(obj));
  }

  setPage(id) {
    if (this.state.page == id) {
      return;
    }
    this.setState(() => ({
      page: id,
    }));
  }

  setLunch(l) {
    if (!this.schedule.lunches.includes(l)) {
      console.error(
        "can't set this lunch because it's not defined in the schedule"
      );
      return;
    }
    this.setState(() => ({
      lunch: l,
    }));
    window.localStorage.setItem("lunch", l);
  }

  setSchedule(s) {
    if (s.length == 0) {
      s = null;
    }
    this.setState(() => ({
      schedule: s,
    }));
    window.localStorage.setItem("schedule", JSON.stringify(s));
  }

  setTheme(t, a) {
    document.documentElement.style.setProperty("--theme-main", t.main);
    document.documentElement.style.setProperty("--theme-text", t.text);
    document.documentElement.style.setProperty(
      "--theme-background",
      t.background
    );
    document.documentElement.style.setProperty("--theme-contrast", t.contrast);

    if (a) {
      this.setState((s) => ({ theme: t }));
      window.localStorage.setItem("theme", t.name);
    }
  }

  render() {
    return (
      <>
        <nav className="home-nav">
          <ul>
            {this.pages.map((x) => (
              <li
                key={x}
                onClick={() => this.setPage(x)}
                className={this.state.page == x ? "current" : ""}
              >
                {x}
              </li>
            ))}
          </ul>
        </nav>
        <main>
          {this.state.page == "schedule" &&
            (this.state.schedule ? (
              this.state.lunch ? (
                <LunchChooser setLunch={this.props.setLunch} />
              ) : (
                <BellCountdown
                  lunch={this.state.lunch}
                  schedule={this.state.schedule}
                  scheduleType={this.state.scheduleType}
                  setLunch={this.setLunch}
                  display="counters"
                  theme={this.state.theme}
                />
              )
            ) : (
              <ScheduleChooser setSchedule={this.setSchedule} />
            ))}
          {this.state.page == "countdown" && (
            <DateCountdown
              setCountdown={this.setCountdown}
              countdown={this.state.countdown}
            />
          )}
          {this.state.page == "settings" && (
            <Settings
              setLunch={this.onSelectLunch}
              schedule={this.state.schedule}
              setSchedule={this.setSchedule}
              setTheme={this.setTheme}
              setPage={this.setPage}
              countdown={this.state.countdown}
              setCountdown={this.setCountdown}
            />
          )}
          {this.state.page == "updates" && <Updates />}

          {this.state.page == "lunchmenu" && <LunchMenu />}
        </main>
        <footer>
          &copy; {new Date().getFullYear()} by hman124. (Version {this.version})
        </footer>
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
