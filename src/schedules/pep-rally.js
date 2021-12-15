export default {
  title: "Pep Rally",
  getTimes: function(l) {
    const lunches = {
      A: [
        { name: "Lunch", time: [605, 635] },
        { name: "4", time: [641, 687] },
        { name: "5", time: [693, 737] }
      ],
      B: [
        { name: "4", time: [611, 657] },
        { name: "Lunch", time: [657, 687] },
        { name: "5", time: [693, 737] }
      ],
      C: [
        { name: "4", time: [611, 657] },
        { name: "5", time: [663, 707] },
        { name: "Lunch", time: [707, 737] }
      ]
    };

    return [
      { name: "1", time: [440, 490] },
      { name: "2", time: [496, 549] },
      { name: "3", time: [555, 605] },
      ...lunches[l],
      { name: "6", time: [743, 791] },
      { name: "7th Period and Pep Rally", time: [797, 890] }
    ];
  }
};
