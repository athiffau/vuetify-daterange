function dateFromStr (strDate: string | null, deltaDay = 0, deltaMonth = 0, deltaYear = 0) {
  if (typeof strDate === 'string') {
    const yr = parseInt(strDate.substring(0, 4))
    const mon = parseInt(strDate.substring(5, 8))
    const dt = parseInt(strDate.substring(8, 10))

    const d = new Date(yr, mon - 1, dt)

    if (typeof d.setMonth === 'function') {
      d.setMonth(d.getMonth() + deltaMonth, d.getDate() + deltaDay)
      d.setFullYear(d.getFullYear() + deltaYear)

      return d
    }
  }

  return null
}

export default function isDateInRange (date: string, range: any): boolean {
  const dateToCheck = dateFromStr(date)

  if (Array.isArray(range)) {
    if (typeof range[0] === 'string' && typeof range[1] === 'string') {
      const startDate = dateFromStr(range[0])
      const endDate = dateFromStr(range[1])

      return (startDate && endDate && dateToCheck)
        ? startDate.getTime() <= dateToCheck.getTime() && endDate.getTime() >= dateToCheck.getTime()
        : false
    }
  }
  return false
}

export function isHoverAfterStartDate (btnDate: string, startDate: any, hoveringDate: string): boolean {
  const _me = dateFromStr(btnDate)
  const _std = dateFromStr(startDate)
  const _htd = dateFromStr(hoveringDate)

  return (_std && _htd && _me)
    ? _me.getTime() >= _std.getTime() && _me.getTime() <= _htd.getTime() && _std.getTime() < _htd.getTime()
    : false
}
