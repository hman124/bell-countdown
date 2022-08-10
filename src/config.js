import sky from "./schedules/sky.js";
import half from "./schedules/half.js";

const config = {
    schedule: {
        //default schedule - schedule used most often. User will be
        //notified if today's schedule is not the default.
        default: sky,
        order: [null, sky, sky, half, sky, sky],
        //alt schedule - if this is set, it will override the daily order.
        alt: null
    }
}

export default config;