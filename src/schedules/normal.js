export default {
  title: "Normal",
  version: "2.0",
  getTimes: function(l) {
    const lunches = {
      A: [
        { name: "Lunch", time: ["10:17", "10:47"] },
        { name: "4", time: ["10:53", "11:48"] },
        { name: "5", time: ["11:54", "12:49"] }
      ],
      B: [
        { name: "4", time: ["10:23", "11:18"] },
        { name: "Lunch", time: ["11:18", "11:48"] },
        { name: "5", time: ["11:54", "12:49"] }
      ],
      C: [
        { name: "4", time: ["10:23", "11:18"] },
        { name: "5", time: ["11:24", "12:19"] },
        { name: "Lunch", time: ["12:19", "12:49"] }
      ]
    };

    return [
      { name: "1", time: ["7:20", "8:14"] },
      { name: "2", time: ["8:20", "9:17"] },
      { name: "3", time: ["9:23", "10:17"] },
      ...lunches[l],
      { name: "6", time: ["12:55", "13:50"] },
      { name: "7", time: ["13:56", "14:50"] }
    ];
  }
};
