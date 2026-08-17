export const NOMINATIONS_START_DATE_LABEL = "Monday, July 13, 2026"
export const NOMINATIONS_CLOSE_DATE_LABEL = "Tuesday, August 25, 2026"
export const NOMINATIONS_DEADLINE_LABEL = "Tuesday, August 25, 2026 at 9:00 PM ET"
export const VOTING_START_DATE_LABEL = "Wednesday, August 26, 2026"
export const NOMINATIONS_START_AT = new Date("2026-07-13T00:00:00-04:00")
export const NOMINATIONS_CLOSE_AT = new Date("2026-08-25T21:00:00-04:00")

export const NOMINATIONS_START_MESSAGE =
  "Nominations start Monday, July 13, 2026. Please come back then to submit your picks."

export const NOMINATIONS_CLOSED_MESSAGE =
  "Nominations closed Tuesday, August 25, 2026 at 9:00 PM ET. Voting starts Wednesday, August 26, 2026."

export function nominationsHaveStarted(now = new Date()) {
  return now.getTime() >= NOMINATIONS_START_AT.getTime()
}

export function nominationsHaveClosed(now = new Date()) {
  return now.getTime() >= NOMINATIONS_CLOSE_AT.getTime()
}

export function nominationsAreInWindow(now = new Date()) {
  return nominationsHaveStarted(now) && !nominationsHaveClosed(now)
}
