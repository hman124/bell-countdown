///*
export default {
  title: "EOC TESTING",
  version: "1.0",
  getTimes: function(l) {
    const lunches = {
      Downstairs: [
        { name: "4 Part 1", time: ["10:22", "10:27"] },
        { name: "A Lunch", time: ["10:27", "10:57"] },
        { name: "4 Part 2", time: ["11:03", "11:45"] },
        
      ],
      Upstairs: [
        { name: "4", time: ["10:22", "11:15"] },
        { name: "Lunch", time: ["11:15", "11:45"] },
      ],
      Testers: [
        
        { name: "Lunch", time: ["13:25", "13:55"] },

      ],
      
    };

    return [
      { name: "1", time: ["07:20", "08:14"] },
      { name: "2", time: ["08:12", "09:15"] },
      { name: "3", time: ["09:21", "10:16"] },
      { name: "5", time: ["11:47", "12:53"] },
      ...lunches[l],
      { name: "6", time: ["12:59", "13:51"] },
      { name: "7", time: ["13:57", "14:50"] },
    ];
  }
};
//*/