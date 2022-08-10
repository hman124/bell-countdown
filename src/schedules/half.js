export default {
  title: "Half Day",
  version: "2.1",
  lunches: [
    {id: "A", name: "A Lunch"},
    {id: "B", name: "B Lunch"}
  ],
  getTimes: function(l) {
    const lunches = {
      A: [
        { name: "Lunch", time: ["12:45", "13:15"] },
      ],
      B: [
        { name: "Lunch", time: ["12:45", "13:15"] },
      ]
    };

    return [
      { name: "1st Period", time: ["08:15", "08:55"] },
      { name: "2nd Period", time: ["09:01", "9:41"] },
      { name: "3rd Period", time: ["09:47", "10:27"] },
      { name: "5th Period", time: ["10:33", "11:13"] },
      { name: "6th Period", time: ["11:19", "11:59"] },
      { name: "7th Period", time: ["12:05", "12:45"] },
      ...lunches[l]
    ];
  }
};
7