export default {
  title: "SAT TESTING",
  version: "1.0",
  getTimes: function(l) {
    const lunches = {
      A: [
        { name: "Lunch", time: ["10:13", "10:43"] },
        { name: "4", time: ["10:49", "11:41"] },
        { name: "5", time: ["11:47", "12:53"] },
      ],
      B: [
        { name: "4", time: ["10:19", "11:11"] },
        { name: "Lunch", time: ["11:11", "11:41"] },
        { name: "5", time: ["11:47", "12:53"] }
      ],
      C: [
        { name: "4", time: ["10:19", "11:11"] },
        { name: "5th Period (Part 1)", time: ["11:17", "11:47"] },
        { name: "Lunch", time: ["11:47", "12:17"] },
        { name: "5th Period (Part 2)", time: ["12:23", "12:53"] }
      ],
      SAT: [
        { name: "4", time: ["10:19", "11:11"] },
        { name: "5", time: ["11:17", "12:23"] },
        { name: "Lunch", time: ["12:23", "12:53"] },
      ],
      
    };

    return [
      { name: "1", time: ["07:20", "08:13"] },
      { name: "2", time: ["08:19", "09:14"] },
      { name: "3", time: ["09:20", "10:13"] },
      ...lunches[l],
      { name: "6", time: ["12:59", "13:51"] },
      { name: "7", time: ["13:57", "14:50"] },
    ];
  }
};