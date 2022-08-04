export default {
  title: "Normal",
  version: "2.1",
  lunches: [
    {id: "A", name: "A Lunch"},
    {id: "B", name: "B Lunch"}
  ],
  getTimes: function(l) {
    const lunches = {
      A: [
        { name: "Lunch", time: ["11:25", "12:00"] },
        { name: "4th Period", time: ["10:53", "11:48"] },
      ],
      B: [
        { name: "4th Period", time: ["10:23", "11:18"] },
        { name: "Lunch", time: ["11:18", "11:48"] },
      ]
    };

    return [
      { name: "A Hour" , time: ["06:59", "08:09"] },
      { name: "1st Period", time: ["08:15", "09:14"] },
      { name: "2nd Period", time: ["09:20", "10:20"] },
      { name: "3rd Period", time: ["10:26", "11:25"] },
      ...lunches[l],
      { name: "5th Period", time: ["12:06", "13:05"] },
      { name: "6th Period", time: ["13:11", "14:10"] },
      { name: "7th Period", time: ["14:16", "15:15"] }
    ];
  }
};
7