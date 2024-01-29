import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/relativeTime";
import UTC from "dayjs/plugin/utc";

dayjs.extend(AdvancedFormat);
dayjs.extend(UTC);

/**This only works as long as the server has (is in) the same time zone as the client.
 *
 * To pre-render these time stamps for any client in any time zone correctly we would need to consider browser time zone information.
 *
 * Kind of overkill at this stage so we don't.
 */
export const getRelativeLocalTimeStrFromUtcDate = (date: Date) =>
  configuredDayjs().to(configuredDayjs.utc(date).local());
export const configuredDayjs = dayjs;
