import dayjs from "dayjs";

type FormatDateParams = {
  date: Date | string;
  format?: string;
};

export class TimeUtilities {
  static formatDate(params: FormatDateParams) {
    return dayjs(params.date).format(params.format ?? "MM-DD-YYYY");
  }

  static parseMonthYearDate(date: string) {
    const parsedDate = dayjs(date, "YYYY-MM");

    if (!parsedDate.isValid()) {
      throw new Error("Invalid month-year format, expected YYYY-MM");
    }

    return parsedDate.format("MMMM YYYY"); // e.g. January 2025
  }
}
