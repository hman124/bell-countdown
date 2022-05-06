import calendar from "./icalfeed.json";
import schedule from "./schedule.js";

  function zeroPad(num) {
    if (num < 10) {
      return "0" + num.toString();
    } else {
      return num;
    }
  }

  function ordinal_suffix_of(i) {
    var j = typeof i !== "string" ? i.toString() : i;
    if (!/^[0-9]+$/.test(i)) {
      return j;
    } else if (j.endsWith("1")) {
      return i + "st Period";
    } else if (j.endsWith("2")) {
      return i + "nd Period";
    } else if (j.endsWith("3")) {
      return i + "rd Period";
    } else {
      return i + "th Period";
    }
  }

  function getSchedule() {
    const d = new Date(),
      w = d.getDay();
    return schedule.order[w];
  }

  function to12hrTime(time) {
    return (
      (((+time.split(":")[0] + 11) % 12) + 1).toString() +
      ":" +
      time.split(":")[1] +
      (+time.split(":")[0] >= 12 ? " PM" : "")
    );
  }

  function test() {}

  function toMins(time) {
    const [hours, minutes] = time.split(":").map((x) => +x);
    return hours * 60 + minutes;
  }

  function checkDaysOff() {
    const d = new Date(),
      holidays = calendar.map((x) => ({
        date: x.start.slice(6, 8),
        month: x.start.slice(4, 6),
        duration: x.duration ? +x.duration.match(/[1-9]+/)[0] : 1,
      }));

    d.setSeconds(0);
    d.setHours(0);
    d.setMinutes(0);
    d.setDate(d.getDate());

    if (/^[60]$/.test(d.getDay())) {
      return { isOff: true, reason: "Weekend" };
    } else {
      var t = new Date(d.toString()),
        first = new Date("8/1/2021");
      while (true) {
        const today = holidays.find(
          (x) => x.date == t.getDate() && x.month == t.getMonth() + 1
        );
        if (today) {
          var e = new Date(t.toString());
          e.setDate(e.getDate() + today.duration);
          return { isOff: d <= e && d >= t, reason: "Student Holiday " };
        } else if (t <= first) {
          return { isOff: false };
        } else {
          t.setDate(t.getDate() - 1);
        }
      }
    }
  }

  function getTime(lunch) {
    var daysOff = checkDaysOff();
    if (!lunch) return {};
    else if (daysOff.isOff) return { no_school: true, reason: daysOff.reason };
    const d = new Date(),
      mins = d.getHours() * 60 + d.getMinutes(),
      sched = getSchedule(),
      times = sched.getTimes(lunch);

    var period = null,
      next = null;
    for (let i = 0; i < times.length; i++) {
      const x = times[i];
      if (mins < toMins(x.time[1]) && mins >= toMins(x.time[0])) {
        if (!times[i + 1]) {
          next = ordinal_suffix_of(times[i + 1].name);
        }
        period = x;
        break;
      } else if (
        i > 0 &&
        mins < toMins(x.time[0]) &&
        mins >= toMins(times[i - 1].time[1])
      ) {
        next = x.name;
        period = {
          name: `Passing Period (after ${ordinal_suffix_of(
            times[i - 1].name
          )})`,
          time: [times[i - 1].time[1], x.time[0]],
        };
        break;
      }
    }

    if (!period)
      return {
        period: "no_school",
        reason: `School ${
          mins < times[0].time[0]
            ? "hasn't started yet"
            : "has ended for the day"
        }`,
      };
    const l = 60 - d.getSeconds(),
      mins_left = toMins(period.time[1]) - mins - (l === 60 ? 0 : 1),
      data2 = {
        schedule: sched.title,
        next_period: next,
        period: ordinal_suffix_of(period.name),
        mins_left,
        secs_left: l == 60 ? "00" : zeroPad(l),
        end_time: to12hrTime(period.time[1]),
        percent_complete: Math.trunc(
          (1 - mins_left / (toMins(period.time[1]) - toMins(period.time[0]))) *
            100
        ),
      };
    return data2;
  }

  function getClock() {
    const d = new Date();
    return (
      ((d.getHours() + 11) % 12) +
      1 +
      ":" +
      (d.getMinutes() < 10
        ? "0" + d.getMinutes().toString()
        : d.getMinutes().toString()) +
      " " +
      (d.getHours() >= 12 ? "PM" : "AM")
    );
  }

export default {
 
}

//   function getScheduleList() {
//     const times = getSchedule().getTimes(state.lunch);
//     return times.reduce((p, c, i, a) => {
//       p.push(
//         <li key={i} style={{ marginBottom: "1rem" }}>
//           <b>{ordinal_suffix_of(c.name)}</b>
//           <br />
//           <small>
//             {to12hrTime(c.time[0])} - {to12hrTime(c.time[1])} (
//             {toMins(c.time[1]) - toMins(c.time[0])} minutes)
//           </small>
//         </li>
//       );
//       return p;
//     }, []);
//   }
// }
