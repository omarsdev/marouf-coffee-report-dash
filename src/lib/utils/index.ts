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
