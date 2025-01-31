import moment from "moment";

export const MOMENT_JORDAN = (_seed) => {
    return moment(_seed).subtract(3, 'hour')
}