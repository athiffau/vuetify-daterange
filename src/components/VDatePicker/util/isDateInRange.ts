function dateFromStr (strDate: string, deltaDay = 0, deltaMonth = 0, deltaYear = 0) {
  const yr = parseInt(strDate.substring(0, 4))
  const mon = parseInt(strDate.substring(5, 8))
  const dt = parseInt(strDate.substring(8, 10))

  const d = new Date(yr, mon - 1, dt)

  d.setMonth(d.getMonth() + deltaMonth, d.getDate() + deltaDay)
  d.setFullYear(d.getFullYear() + deltaYear)

  return d
}

export default function isDateInRange (date: string, range: any): boolean {
  const dateToCheck = dateFromStr(date)
  if (Array.isArray(range)) {
    range.sort()
    if (typeof range[0] === 'string' && typeof range[1] === 'string') {
      const startDate = dateFromStr(range[0])
      const endDate = dateFromStr(range[1])

      return startDate.getTime() <= dateToCheck.getTime() && endDate.getTime() >= dateToCheck.getTime()
    }
  }
  return false
}
