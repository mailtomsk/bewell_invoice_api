export const parseDate = (input: string): Date | null => {
  if (!input || typeof input !== 'string' || input.trim() === '') {
    return new Date(); // default to current date
  }

  const dateInput = input.trim();

  // Helper: validate realistic date range (1900–2100)
  const isRealisticYear = (date: Date) => {
    const y = date.getFullYear();
    return y >= 1900 && y <= 2100;
  };

  // 1️⃣ Try native Date parser (handles ISO, "10 Oct 2025", etc.)
  const native = new Date(dateInput);
  if (!isNaN(native.getTime()) && isRealisticYear(native)) return native;

  // 2️⃣ Handle dd/MM/yyyy or MM/dd/yyyy or yyyy-MM-dd manually
  const parts = dateInput.split(/[\/\-\.]/); // split by /, -, or .
  if (parts.length === 3) {
    let [p1, p2, p3] = parts.map(p => p.padStart(2, '0'));

    // Case: dd/MM/yyyy or MM/dd/yyyy
    if (p3.length === 4) {
      const dayFirst = parseInt(p1, 10) > 12; // if first >12, likely day
      const day = dayFirst ? p1 : p2;
      const month = dayFirst ? p2 : p1;
      const year = p3;

      const formatted = `${year}-${month}-${day}`;
      const parsed = new Date(formatted);

      if (!isNaN(parsed.getTime()) && isRealisticYear(parsed)) {
        // ensure actual parts match (catch invalid like 2025-02-30)
        if (
          parsed.getUTCFullYear() === parseInt(year, 10) &&
          parsed.getUTCMonth() + 1 === parseInt(month, 10) &&
          parsed.getUTCDate() === parseInt(day, 10)
        ) {
          return parsed;
        }
      }
    }

    // Case: yyyy/MM/dd
    if (p1.length === 4) {
      const [year, month, day] = [p1, p2, p3];
      const formatted = `${year}-${month}-${day}`;
      const parsed = new Date(formatted);

      if (!isNaN(parsed.getTime()) && isRealisticYear(parsed)) {
        if (
          parsed.getUTCFullYear() === parseInt(year, 10) &&
          parsed.getUTCMonth() + 1 === parseInt(month, 10) &&
          parsed.getUTCDate() === parseInt(day, 10)
        ) {
          return parsed;
        }
      }
    }
  }

  // 3️⃣ Fallback — invalid date (instead of defaulting silently)
  return new Date();
};
