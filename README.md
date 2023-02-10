# Bell Countdown 3.1.0

Bell countdown is a react web app that "counts down" to the next bell in school. 

[https://bell-countdown.netlify.app](https://bell-countdown.netlify.app)

## About 

Bell Countdown started as a way to count down every agonizing second left of school. Times were rough. Nowadays, the app has a ton of cool features and is quite useful when in class. Thanks for using Bell Countdown! 

## Features

- custom schedules
- date countdown to a custom day (such as the last day of school)
- a bunch of light/dark themes to choose from
- precise data (exact seconds until bell)
- pre-set schedules if you're forking this for your school

## Plans
- seconds adjustment to synchronize your device and the bell at your school
- schedules registry with schedules for specific schools (community maintained)
- updates / announcements tab where users can sign up for updates at their school

## Issues and Bugs

If you find a bug in the code, **please create an issue**. 
Most of the current code does not have sufficient error handling yet and there will likely be some serious errors.

Make sure to include the following:
- time of day error occurred
- reproducability steps
- browser/user agent error occurred on 
- relevant errors you find in the devtools console

## Custom School Config

If you would like to fork and re-host this for your school (see also: "Forks / Self-Hosting"), you can program in your school's schedule to share it with others at your school. Just edit `src/config.js` as shown below:

```
...

"schedule": {
    "use": true,
    "path": ["ID", "ID2", "..."],
    "lunches": [ 
        {"id": "A", "name": "A Lunch"},
        {"id": "B", "name": "B Lunch"},
        ...
    ]
}

...
```

Add your schedule(s) to the folder `src/schedules` (make sure to follow the naming scheme of `schedule-ID.json`) and use the sample files as templates when filling in your school's information.

Please note that this feature may be buggy as it is pretty new. Please create an issue if you find anything that doesn't seem right.

## Forks / Self Hosting

Feel free to fork this repository and host your own version, but please don't remove any of the links or info from the "about" page on settings. Please note that this repository is under an MIT license. 
