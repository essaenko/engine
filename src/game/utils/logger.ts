import { throttle } from "./throttle";

export const log = throttle(
    (...message: any) => {
        console.log(...message);
    },
    1000
);

