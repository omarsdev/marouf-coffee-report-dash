export const toSearchQuery = (params) => {
  const searchQuery = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== '') // Remove null & empty values
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&')

  return searchQuery ? `?${searchQuery}` : ''
}
export const calculateYesPercentage = (answers) => {
  if (!answers?.length) return 0

  console.log({answers})

  const totalAnswers = answers.length
  const yesAnswers = answers?.filter(
    (a) => a.answer === 'YES' || a.answer === 'NA',
  ).length
  console.log({yesAnswers, totalAnswers})
  return ((yesAnswers / totalAnswers) * 100).toFixed(2)
}
