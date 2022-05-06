export default {
  title: "Normal",
  version: "2.0",
  lunches: [
    {id: "A", name: "A Lunch"},
    {id: "B", name: "B Lunch"},
    {id: "C", name: "C Lunch"}
  ],
  getTimes: function(l) {
    const lunches = {
      A: [
        { name: "Lunch", time: ["10:17", "10:47"] },
        { name: "4th Period", time: ["10:53", "11:48"] },
        { name: "5th Period", time: ["11:54", "12:49"] }
      ],
      B: [
        { name: "4th Period", time: ["10:23", "11:18"] },
        { name: "Lunch", time: ["11:18", "11:48"] },
        { name: "5th Period", time: ["11:54", "12:49"] }
      ],
      C: [
        { name: "4th Period", time: ["10:23", "11:18"] },
        { name: "5th Period", time: ["11:24", "12:19"] },
        { name: "Lunch", time: ["12:19", "12:49"] }
      ]
    };

    return [
      { name: "1st Period", time: ["07:20", "08:14"] },
      { name: "2nd Period", time: ["08:20", "09:17"] },
      { name: "3rd Period", time: ["09:23", "10:17"] },
      ...lunches[l],
      { name: "6th Period", time: ["12:55", "13:50"] },
      { name: "7th Period", time: ["13:56", "14:50"] }
    ];
  }
};
