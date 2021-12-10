//this is just a copy of the normal schedule for now
// a "//" after a name means it has been updated
//--- All D0ne!

export default function lunch(l) {
  const lunches = {
    "A": [
      {"name": "Lunch", "time": [614, 644]}, //
      {"name": "4", "time": [650, 700]},//
      {"name": "5", "time": [706, 756]} //
    ],
    "B": [
      {"name": "4", "time": [620, 670]},//
      {"name": "Lunch", "time": [670, 700]},//
      {"name": "5", "time": [706, 756]}
    ],
    "C": [
      {"name": "4", "time": [620, 670]},//
      {"name": "5", "time": [676, 726]},//
      {"name": "Lunch", "time": [726, 756]}//
    ]
  };
  
  return [
    {"name": "EXAM 1", "time": [440, 560]},//
    {"name": "3", "time": [566, 614]},//
    ...lunches[l],
    {"name": "EXAM 2", "time": [762, 890]},//
  ];
}
