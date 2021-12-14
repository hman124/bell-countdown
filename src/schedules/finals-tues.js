export default function lunch(l) {
  const lunches = {
    "A": [
      {"name": "Lunch", "time": [614, 644]}, 
      {"name": "4", "time": [650, 700]},
      {"name": "5", "time": [706, 756]} 
    ],
    "B": [
      {"name": "4", "time": [620, 670]},
      {"name": "Lunch", "time": [670, 700]},
      {"name": "5", "time": [706, 756]}
    ],
    "C": [
      {"name": "4", "time": [620, 670]},
      {"name": "5", "time": [676, 726]},
      {"name": "Lunch", "time": [726, 756]}
    ]
  };
  
  return [
    {"name": "1st Period Exam", "time": [440, 560]},
    {"name": "3", "time": [566, 614]},
    ...lunches[l],
    {"name": "6th Period Exam", "time": [762, 890]},
  ];
}
