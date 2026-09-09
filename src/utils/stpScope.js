/** Match a row to the STP selected in the page dropdown. */
export function matchesSelectedStp(row, stpId, stpName) {
  if (!stpId && !stpName) return true
  if (!row) return false

  if (row.stpId) return row.stpId === stpId
  if (Array.isArray(row.stpIds)) return row.stpIds.includes(stpId)

  const hay = [row.stp, row.stpName, row.name, row.uniqueId]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (stpId === 'sarai-14') {
    return hay.includes('14 mld') || hay.includes('14mld') || hay.includes('sarai-14')
  }
  if (stpId === 'jagjeetpur-68') {
    return hay.includes('68 mld') || hay.includes('68mld') || hay.includes('jagjeetpur')
  }

  if (!hay) return true
  if (stpName) {
    const name = String(stpName).toLowerCase()
    return hay.includes(name) || name.includes(hay)
  }
  return true
}

export function filterRowsByStp(rows, stpId, stpName) {
  const list = Array.isArray(rows) ? rows : []
  if (!stpId) return list
  return list.filter((row) => matchesSelectedStp(row, stpId, stpName))
}

export function scaleTrendSeries(series, factor) {
  return series.map((point) => ({
    ...point,
    present: Math.round(point.present * factor),
    leave: Math.round(point.leave * factor),
    absent: Math.round(point.absent * factor),
  }))
}
