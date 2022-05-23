export default {
  title: "EOC Testing",
  version: "2.0",
  lunches: [
    { id: "TEST", name: "EOC Testers" },
    { id: "DOWNSTAIRS", name: "Downstairs 4th Period" },
    {
      id: "UPSTAIRS",
      name: "Upstairs, Gym, Band, Orchestra, or Portables 4th Period",
    },
  ],
  getTimes: function (l) {
    const lunches = {
      TEST: [{ name: "Lunch", time: ["12:15", "12:45"] }],
      DOWNSTAIRS: [
        { name: "4th Period", time: ["10:22", "10:27"] },
        { name: "Lunch", time: ["10:27", "10:57"] },
        { name: "4th Period", time: ["11:03", "11:45"] },
      ],
      UPSTAIRS: [
        { name: "4th Period", time: ["10:22", "11:15"] },
        { name: "Lunch", time: ["11:15", "11:45"] },
      ],
    };

    if (l == "DOWNSTAIRS" || l == "UPSTAIRS") {
      return [
        { name: "1", time: ["07:20", "08:14"] },
        { name: "2", time: ["08:20", "09:16"] },
        { name: "3", time: ["09:22", "10:16"] },
        ...lunches[l],
        { name: "5th Period", time: ["11:51", "12:45"] },
        { name: "6th Period", time: ["12:51", "13:50"] },
        { name: "7th Period", time: ["13:56", "14:50"] },
      ];
    } else {
      return [{ name: "EOC Test", time: ["07:20", ""] }];
    }
  },
};
