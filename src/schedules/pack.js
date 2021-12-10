export default function lunch(l) {
  const lunches = {
    "A": [
      {"name": "Lunch", "time": [632, 662]},
      {"name": "4", "time": [668, 719]},
      {"name": "5", "time": [725, 776]}
    ],
    "B": [
      {"name": "4", "time": [638, 689]},
      {"name": "Lunch", "time": [689, 719]},
      {"name": "5", "time": [725, 776]}
    ],
    "C": [
      {"name": "4", "time": [638, 689]},
      {"name": "5", "time": [695, 746]},
      {"name": "Lunch", "time": [746, 776]}
    ]
  };
  
  return [
    {"name": "1", "time": [440, 490]},
    {"name": "2", "time": [496, 546]},
    {"name": "Pack", "time": [546,576]},
    {"name": "3", "time": [582, 632]},
    ...lunches[l],
    {"name": "6", "time": [782, 833]},
    {"name": "7", "time": [839, 890]}
  ]
}