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
export function calculateYesPercentage(answers) {
  if (!answers?.length) return 0

  const totalAnswers = answers.length
  const yesAnswers = answers?.filter((a) => a.answer === 'Yes').length
  return ((yesAnswers / totalAnswers) * 100).toFixed(2)
}
