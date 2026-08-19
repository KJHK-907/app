const SCHEDULE_CONFIG = {
  sheetName: "Schedule",
  timezone: "America/Chicago",
  cacheSeconds: 300,
  responseVersion: 1,
};

function doGet() {
  const cache = CacheService.getScriptCache();
  const cacheKey = "schedule-api-v1";
  const cached = cache.get(cacheKey);

  if (cached) return jsonResponse_(cached);

  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) throw new Error("SPREADSHEET_ID is not configured.");

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(
    SCHEDULE_CONFIG.sheetName,
  );
  if (!sheet) throw new Error('A sheet named "Schedule" was not found.');

  const values = sheet.getDataRange().getValues();
  if (!values.length) return jsonResponse_(JSON.stringify(buildResponse_([])));

  const headers = values[0].map((header) => String(header).trim());
  const requiredHeaders = ["id", "day", "startTime", "endTime", "showName"];
  requiredHeaders.forEach((header) => {
    if (headers.indexOf(header) === -1) {
      throw new Error(`Missing required column: ${header}`);
    }
  });

  const shows = values
    .slice(1)
    .map((row) => rowToObject_(headers, row))
    .filter((row) => isActive_(row.active) && isEffectiveNow_(row))
    .map(normalizeShow_)
    .filter(Boolean);

  const json = JSON.stringify(buildResponse_(shows));
  cache.put(cacheKey, json, SCHEDULE_CONFIG.cacheSeconds);
  return jsonResponse_(json);
}

function buildResponse_(shows) {
  return {
    version: SCHEDULE_CONFIG.responseVersion,
    timezone: SCHEDULE_CONFIG.timezone,
    updatedAt: new Date().toISOString(),
    shows,
  };
}

function rowToObject_(headers, row) {
  return headers.reduce((record, header, index) => {
    if (header) record[header] = row[index];
    return record;
  }, {});
}

function normalizeShow_(row) {
  const id = cleanString_(row.id);
  const day = normalizeDay_(row.day);
  const startTime = normalizeTime_(row.startTime);
  const endTime = normalizeTime_(row.endTime);
  const showName = cleanString_(row.showName);

  if (!id || !day || !startTime || !endTime || !showName) return null;

  const duration = durationMinutes_(startTime, endTime);
  if (duration < 60 || duration % 60 !== 0) return null;

  const show = { id, day, startTime, endTime, showName };
  addOptional_(show, "djName", row.djName);
  addOptional_(show, "description", row.description);
  addOptional_(show, "genre", row.genre);

  const linkUrl = cleanString_(row.linkUrl);
  if (/^https:\/\//i.test(linkUrl)) show.linkUrl = linkUrl;

  return show;
}

function normalizeDay_(value) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const input = cleanString_(value).toLowerCase();
  return (
    days.find(
      (day) =>
        day.toLowerCase() === input || day.slice(0, 3).toLowerCase() === input,
    ) || null
  );
}

function normalizeTime_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, SCHEDULE_CONFIG.timezone, "HH:mm");
  }

  if (typeof value === "number" && value >= 0 && value < 1) {
    const totalMinutes = Math.round(value * 24 * 60) % (24 * 60);
    return `${pad2_(Math.floor(totalMinutes / 60))}:${pad2_(totalMinutes % 60)}`;
  }

  const input = cleanString_(value);
  const twentyFourHour = input.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (twentyFourHour) {
    return `${pad2_(Number(twentyFourHour[1]))}:${twentyFourHour[2]}`;
  }

  const twelveHour = input.match(/^(1[0-2]|0?[1-9]):([0-5]\d)\s*(AM|PM)$/i);
  if (!twelveHour) return null;

  let hours = Number(twelveHour[1]) % 12;
  if (twelveHour[3].toUpperCase() === "PM") hours += 12;
  return `${pad2_(hours)}:${twelveHour[2]}`;
}

function durationMinutes_(startTime, endTime) {
  const start = timeMinutes_(startTime);
  const end = timeMinutes_(endTime);
  return end > start ? end - start : 24 * 60 - start + end;
}

function timeMinutes_(time) {
  const parts = time.split(":").map(Number);
  return parts[0] * 60 + parts[1];
}

function isActive_(value) {
  if (value === "" || value === null || typeof value === "undefined")
    return true;
  if (typeof value === "boolean") return value;
  return !/^(false|no|0)$/i.test(cleanString_(value));
}

function isEffectiveNow_(row) {
  const today = Utilities.formatDate(
    new Date(),
    SCHEDULE_CONFIG.timezone,
    "yyyy-MM-dd",
  );
  const start = normalizeDate_(row.effectiveStart);
  const end = normalizeDate_(row.effectiveEnd);
  return (!start || start <= today) && (!end || end >= today);
}

function normalizeDate_(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Utilities.formatDate(value, SCHEDULE_CONFIG.timezone, "yyyy-MM-dd");
  }
  const input = cleanString_(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(input) ? input : null;
}

function addOptional_(target, key, value) {
  const cleaned = cleanString_(value);
  if (cleaned) target[key] = cleaned;
}

function cleanString_(value) {
  return value === null || typeof value === "undefined"
    ? ""
    : String(value).trim();
}

function pad2_(value) {
  return String(value).padStart(2, "0");
}

function jsonResponse_(json) {
  return ContentService.createTextOutput(json).setMimeType(
    ContentService.MimeType.JSON,
  );
}
