import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/relativeTime";
import UTC from "dayjs/plugin/utc";

dayjs.extend(AdvancedFormat);
dayjs.extend(UTC);

export const getRelativeLocalTimeStrFromUtcDate = (date: Date) =>
  configuredDayjs().to(configuredDayjs.utc(date).local());
export const configuredDayjs = dayjs;
