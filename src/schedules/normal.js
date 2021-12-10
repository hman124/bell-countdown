export default function lunch(l) {
  const lunches = {
    "A": [
      {"name": "Lunch", "time": [617, 647]},
      {"name": "4", "time": [653, 708]},
      {"name": "5", "time": [714, 769]}
    ],
    "B": [
      {"name": "4", "time": [623, 678]},
      {"name": "Lunch", "time": [678, 708]},
      {"name": "5", "time": [714, 769]}
    ],
    "C": [
      {"name": "4", "time": [623, 678]},
      {"name": "5", "time": [684, 739]},
      {"name": "Lunch", "time": [739, 769]}
    ]
  };
  
  return [
    {"name": "1", "time": [440, 494]},
    {"name": "2", "time": [500, 557]},
    {"name": "3", "time": [563, 617]},
    ...lunches[l],
    {"name": "6", "time": [775, 830]},
    {"name": "7", "time": [836, 890]}
  ];
}
