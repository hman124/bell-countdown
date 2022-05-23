var today = new Date();
var testOne;
var testTwo;
var scheduleToExport; // 0 = two tests, 1 = one test, 2 = default
var day = today.getDay(); // sunday = 0, monday = 1, tuesday =2, wednesday = 3, thursday  4; friday = 5, saturday = 6;
if (day == 1) {
  scheduleToExport = 0;
  testOne = "Second";
  testTwo = "Sixth";
} else if (day == 2) {
  scheduleToExport = 0;
  testOne = "First";
  testTwo = "Seventh";
} else if (day == 3) {
  scheduleToExport = 0;
  testOne = "Third";
  testTwo = "Fifth";
} else if (day == 4) {
  scheduleToExport = 1;
  testOne = "First";
  testTwo = "NONE";
} else {
  scheduleToExport = 2;
}

var toExport;
if (scheduleToExport == 0) {
  toExport = {
  title: "End of Year Tests",
  version: "2.2",
  lunches: [
    { id: "A", name: "A Lunch" },
    { id: "B", name: "B Lunch" },
    { id: "C", name: "C Lunch" },
  ],
  getTimes: function (l) {
    const lunches = {
      A: [
        { name: "Lunch", time: ["10:17", "10:47"] },
        { name: "4th Period", time: ["10:53", "11:48"] },
        { name: "5th Period", time: ["11:54", "12:49"] },
      ],
      B: [
        { name: "4th Period", time: ["10:23", "11:18"] },
        { name: "Lunch", time: ["11:18", "11:48"] },
        { name: "5th Period", time: ["11:54", "12:49"] },
      ],
      C: [
        { name: "4th Period", time: ["10:23", "11:18"] },
        { name: "5th Period", time: ["11:24", "12:19"] },
        { name: "Lunch", time: ["12:19", "12:49"] },
      ],
    };

    return lunches[l] ? [
      { name: `${testOne} Period Exam`, time: ["07:20", "09:17"] },
      { name: "3rd Period", time: ["09:23", "10:17"] },
      ...lunches[l],
      { name: `${testTwo} Period Exam`, time: ["12:55", "14:50"] },
    ] : [];
  },
};
}
else {
toExport = {
  title: "End of Year Tests",
  version: "2.0",
  lunches: [
    { id: "A", name: "A Lunch" },
    { id: "B", name: "B Lunch" },
    { id: "C", name: "C Lunch" },
  ],
  getTimes: function (l) {
    const lunches = {
      A: [
        { name: "Lunch", time: ["10:17", "10:47"] },
        { name: "4th Period", time: ["10:53", "11:48"] },
        { name: "5th Period", time: ["11:54", "12:49"] },
      ],
      B: [
        { name: "4th Period", time: ["10:23", "11:18"] },
        { name: "Lunch", time: ["11:18", "11:48"] },
        { name: "5th Period", time: ["11:54", "12:49"] },
      ],
      C: [
        { name: "4th Period", time: ["10:23", "11:18"] },
        { name: "5th Period", time: ["11:24", "12:19"] },
        { name: "Lunch", time: ["12:19", "12:49"] },
      ],
    };

    return lunches[l] ? [
      { name: `${testOne} Period Exam`, time: ["07:20", "09:17"] },
      ...lunches[l],
      { name: "6", time: ["12:55", "13:50"] },
      { name: "7", time: ["13:56", "14:50"] },
    ] : [];
  },
};
}

export default toExport;