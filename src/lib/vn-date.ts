export function todayInVietnam(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

export function currentHourInVietnam(): number {
  const hourStr = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    hour12: false,
  });
  // "en-US" with hour12:false can return "24" for midnight; normalize to 0
  const hour = parseInt(hourStr, 10);
  return hour === 24 ? 0 : hour;
}

export function isValidDateKey(value: string | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
}
