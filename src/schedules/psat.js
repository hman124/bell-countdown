export default {
  title: "PSAT",
  version: "1.0",
  getTimes: function(l) {
    const lunches = {
      A: [
        { name: "Lunch", time: [613, 643] },
        { name: "4", time: [649, 701] },
        { name: "5", time: [707, 773] }
      ],
      B: [
        { name: "4", time: [619, 671] },
        { name: "Lunch", time: [671, 701] },
        { name: "5", time: [707, 773] }
      ],
      C: [
        { name: "4", time: [619, 671] },
        { name: "5", time: [677, 707] },
        { name: "Lunch", time: [707, 737] },
        { name: "5", time: [743, 773] }
      ],
      PSAT: [
        { name: "4", time: [619, 671] },
        { name: "5", time: [677, 743] },
        { name: "Lunch", time: [743, 773] }
      ],
    };
    return [
      { name: "1", time: [440, 493] },
      { name: "2", time: [554, 499] },
      { name: "3", time: [560, 613] },
      ...lunches[l],
      { name: "6", time: [779, 831] },
      { name: "7", time: [837, 890] }
    ];
  }
};
