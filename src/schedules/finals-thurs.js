export default {
  title: "Finals Week - Thursday",
  version: "2.0",
  getTimes: function(l) {
    const lunches = {
      A: [
        { name: "Lunch", time: ["10:14", "10:44"] },
        { name: "4", time: ["10:50", "11:40"] },
        { name: "5", time: ["11:46", "12:36"] },
      ],
      B: [
        { name: "4", time: ["10:20", "11:10"] },
        { name: "Lunch", time: ["11:10", "11:40"] },
        { name: "5", time: ["11:46", "12:36"] }
      ],
      C: [
        { name: "4", time: ["10:20", "11:10"] },
        { name: "5", time: ["11:16", "12:06"] },
        { name: "Lunch", time: ["12:06", "12:36"] },
      ],
    };

    return [
      { name: "3rd Period Exam", time: ["7:20", "9:20"] },
      { name: "3", time: ["9:26", "10:14"] },
      ...lunches[l],
      { name: "5th Period Exam", time: ["12:42", "14:50"] }
    ];
  }
};