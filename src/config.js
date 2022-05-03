import pack from "./schedules/pack.js";
import normal from "./schedules/normal.js";
import eoc from "./schedules/eoc.js";
// import finals_tues from "./schedules/finals-tues.js";
// import finals_wed from "./schedules/finals-wed.js";
// import finals_thurs from "./schedules/finals-thurs.js";
// import finals_fri from "./schedules/finals-fri.js";
import sat from "./schedules/sat.js"
// import psat from "./schedules/psat.js";
// import pep from "./schedules/pep-rally.js";
const calendarFeed = ""; // this will eventually hold the url for the SchoolCafe holiday url


export default {
 "schedule":{
    "alternate": {
      "use": true,
      "reset_lunch": true,
      "schedule": eoc,
      // use schedule for one schedule, use order for multiple, depending on weekday 
      //"order": [normal, finals_tues, finals_wed, finals_thurs, finals_fri]
    }, "order": [null, normal, normal, pack, normal, normal]
 }, "message":{
    "show": true,
    "content": "EOC TESTING TODAY, 5/3/2022! The schedule for Today has been adjusted for this."
  }
};