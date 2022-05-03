export default {
  title: "Pack Period",
  version: "2.0",
  getTimes: function(l) {
    const lunches = {
      A: [
        { name: "Lunch", time: ["10:32", "11:02"] },
        { name: "4", time: ["11:08", "11:59"] },
        { name: "5", time: ["12:05", "12:56"] }
      ],
      B: [
        { name: "4", time: ["10:38", "11:29"] },
        { name: "Lunch", time: ["11:29", "11:59"] },
        { name: "5", time: ["12:05", "12:56"] }
      ],
      C: [
        { name: "4", time: ["10:38", "11:29"] },
        { name: "5", time: ["11:35", "12:26"] },
        { name: "Lunch", time: ["12:26", "12:56"] }
      ]
    };

    return [
      { name: "1", time: ["07:20", "08:10"] },
      { name: "2", time: ["08:16", "09:06"] },
      { name: "Pack Period", time: ["09:06", "9:36"] },
      { name: "3", time: ["09:42", "10:32"] },
      ...lunches[l],
      { name: "6", time: ["13:02", "13:53"] },
      { name: "7", time: ["13:59", "14:50"] }
    ];
  }
};
