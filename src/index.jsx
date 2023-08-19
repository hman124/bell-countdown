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
import Settings from "./components/Settings.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    //saved items from localstorage
    this.scheduleType = window.localStorage.getItem("scheduleType");

    this.schedule = window.localStorage.getItem("schedule");
    this.scheduleList = window.localStorage.getItem("scheduleList");

    this.countdown = window.localStorage.getItem("countdown");
    this.countdownList = window.localStorage.getItem("countdownList");

    this.theme = window.localStorage.getItem("theme");
    this.lunch = window.localStorage.getItem("lunch");

    //config variables
    this.apiEndpoint = config.apiEndpoint;
    this.version = config.version;

    this.state = {
      page: "schedule",
      countdownList: this.countdownList ? JSON.parse(this.countdownList) : [],
      scheduleList: this.scheduleList ? JSON.parse(this.scheduleList) : [],
      scheduleType: config.schedule.use ? "preset" : "custom",
      theme: this.theme ? themes.find((x) => x.name == this.theme) : themes[0],
      lunch: this.lunch || null,
      scheduleFile: null,
      settingsPage: null
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
    this.setLunch = this.setLunch.bind(this);
  }

  componentDidMount() {
    this.setTheme(this.state.theme, false);

    //import the preset schedule
    if (config.schedule.use) {
      const schedules = Promise.all(
        config.schedule.path.map((x) =>
          import(`./schedules/schedule-${x}.json`)
        )
      );
      schedules
        .then((schedules) => {
          this.setState({
            scheduleType: "preset",
            scheduleFile: schedules,
          });
          window.localStorage.setItem("scheduleType", "preset");
        })
        .catch((err) => {
          console.error(
            `${err} Error importing custom schedule at path
             src/schedules/schedule-${config.schedule.path}.json`
          );
        });
    } else if (this.scheduleType == "preset") {
      window.localStorage.removeItem("scheduleType");
      window.localStorage.removeItem("lunch");
      window.localStorage.removeItem("scheduleList");
      this.setState(() => ({
        scheduleList: [],
        lunch: null,
        schedeuleType: "custom",
      }));
    }

    //update single schedule to list
    if (this.schedule) {
      const f = [
        ...this.state.scheduleList,
        {
          periods: JSON.parse(this.schedule),
          name: "",
          days: ["mo", "tu", "we", "th", "fr", "sa", "su"],
        },
      ];
      this.setState((s) => ({
        scheduleList: f,
      }));
      window.localStorage.removeItem("schedule");
      window.localStorage.setItem("scheduleList", JSON.stringify(f));
    }
    //update single countdown to list
    if (this.countdown) {
      this.setState((s) => ({
        countdownList: [...s.countdownList, JSON.parse(this.countdown)],
      }));
      window.localStorage.removeItem("countdown");
    }

    navigator.serviceWorker.register("/sw.js", {scope: "/"});
  }

  setCountdown(obj) {
    this.setState(() => ({
      countdownList: obj,
    }));

    window.localStorage.setItem("countdownList", JSON.stringify(obj));
  }

  setPage(id) {
    if (this.state.page == id) {
      return;
    }

    document.title = "Bell Countdown";
    this.setState(() => ({
      page: id,
      settingsPage: null
    }));
  }

  setLunch(l) {
    this.setSchedule(
      this.state.scheduleFile.map((x) => ({
        name: x.name,
        days: x.days,
        periods: [...x.classes.regular, ...x.classes.lunch[l]],
      })),
      "preset"
    );

    this.setState(() => ({
      lunch: l,
    }));

    window.localStorage.setItem("lunch", l);
  }

  setSchedule(schedule) {
    const s = schedule.map((x) => (x.length == 0 ? null : x));
    this.setState(() => ({
      scheduleList: s,
    }));

    window.localStorage.setItem("scheduleList", JSON.stringify(s));
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
            (this.state.scheduleList.length > 0 ? (
              <BellCountdown
                lunch={this.state.lunch}
                scheduleList={this.state.scheduleList}
                scheduleType={this.state.scheduleType}
                setLunch={this.setLunch}
                display="counters"
                theme={this.state.theme}
              />
            ) : this.state.scheduleType == "preset" ? (
              <LunchChooser
                lunch={this.state.lunch}
                lunches={config.schedule.lunches}
                setLunch={this.setLunch}
              />
            ) : (
              <ScheduleChooser settings={()=>{
                this.setPage("settings")
                this.setState({settingsPage: "schedule"});
              }} />
            ))}
          {this.state.page == "countdown" && (
            <DateCountdown
              setCountdown={this.setCountdown}
              countdownList={this.state.countdownList}
            />
          )}
          {this.state.page == "settings" && (
            <Settings
              setLunch={this.setLunch}
              lunch={this.state.lunch}
              scheduleList={this.state.scheduleList}
              scheduleType={this.state.scheduleType}
              scheduleFile={this.state.scheduleFile}
              setSchedule={this.setSchedule}
              setTheme={this.setTheme}
              setPage={this.setPage}
              page={this.state.settingsPage}
              countdownList={this.state.countdownList}
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
