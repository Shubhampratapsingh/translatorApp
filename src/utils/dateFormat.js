import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export function formatDate(dateString) {
  return dayjs(dateString).format("D MMM YYYY, h:mm A");
}
