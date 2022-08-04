import pack from "./schedules/pack.js";
import normal from "./schedules/normal.js";
import eoy from "./schedules/eoy_exam.js"
import sky from "./schedules/sky.js";
// import eoc from "./schedules/eoc.js";
// import finals_tues from "./schedules/finals-tues.js";
// import finals_wed from "./schedules/finals-wed.js";
// import finals_thurs from "./schedules/finals-thurs.js";
// import finals_fri from "./schedules/finals-fri.js";
// import sat from "./schedules/sat.js"
// import psat from "./schedules/psat.js";
// import pep from "./schedules/pep-rally.js";

const calendarFeed = ""; // this will eventually hold the url for the SchoolCafe holiday url
//const startPage = "bell"; // options could include bell for the bell schedule, countdown for the countdown url, settings for the settings url, or menu for the menu url.
//const isSummer = false; //if true, show a different page stating it's SUMMER!
const version = "2.1.6"
const versionType = "stable"
const doUseAlt = true;
var scheduleOrder = null;
var showBellTimeList = false; // show the bell time list descriptor 

if (doUseAlt == false)
  {
    scheduleOrder = [null, sky, sky, sky,sky, sky]
  }
else
  {
    scheduleOrder = [null, eoy, eoy, eoy, eoy, eoy]
  }

export default {
 "schedule": [],
 "order": scheduleOrder,
"version": version
};