
export const parseDate = (input: string) => {
  if (!input || typeof input !== 'string' || input.trim() === '') {
    return new Date(); // default to current date
  }

  const dateInput = input.trim();

  // 1️⃣ Try native parser first (handles ISO, "10 Oct 2025", etc.)
  const native = new Date(dateInput);
  if (!isNaN(native.getTime())) return native;

  // 2️⃣ Handle dd/MM/yyyy or MM/dd/yyyy manually
  const parts = dateInput.split(/[\/\-\.]/); // split by / or - or .
  if (parts.length === 3) {
    let [p1, p2, p3] = parts.map(p => p.padStart(2, '0'));
    // Detect format automatically
    if (p3.length === 4) {
      // dd/MM/yyyy or MM/dd/yyyy
      const dayFirst = parseInt(p1, 10) > 12; // if first part > 12, it's definitely a day
      const day = dayFirst ? p1 : p2;
      const month = dayFirst ? p2 : p1;
      const year = p3;
      const formatted = `${year}-${month}-${day}`;
      const parsed = new Date(formatted);
      if (!isNaN(parsed.getTime())) return parsed;
    } else if (p1.length === 4) {
      // yyyy/MM/dd
      const formatted = `${p1}-${p2}-${p3}`;
      const parsed = new Date(formatted);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  }

  // 3️⃣ Fallback to current date if nothing works
  return new Date();
}


