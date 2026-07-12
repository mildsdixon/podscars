export const NOMINATIONS_START_DATE_LABEL = "Monday, July 13, 2026"
export const NOMINATIONS_START_AT = new Date("2026-07-13T04:00:00.000Z")

export const NOMINATIONS_START_MESSAGE =
  "Nominations start Monday, July 13, 2026. Please come back then to submit your picks."

export function nominationsHaveStarted(now = new Date()) {
  return now.getTime() >= NOMINATIONS_START_AT.getTime()
}
