import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/relativeTime";

dayjs.extend(AdvancedFormat);

const dtf = new Intl.DateTimeFormat("de-DE");
const rtf = new Intl.RelativeTimeFormat("de-DE");

const now = dayjs();
const random = dayjs().from("30.12.2023");
const yesterday = dayjs().subtract(1, "day");
const randomDay = dayjs().subtract(3, "day");
const lastWeek = dayjs().subtract(7, "day");
const lastYear = dayjs().subtract(1, "year");

console.log(yesterday.fromNow());
console.log(lastWeek.fromNow());
console.log(lastYear.fromNow());
console.log(randomDay.fromNow());
console.log(random);
