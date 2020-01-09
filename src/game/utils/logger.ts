import { throttle } from "./throttle";

export const logger = throttle(
    (...message: any) => {
        console.log(...message);
    },
    1000
);

