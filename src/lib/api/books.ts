import request from '.'

export const booksApi = {
  get: ({
    startDate = null,
    endDate = null,
    venue = null,
    l = 1,
    entity = null,
  }) =>
    request.get('/books', {
      params: {
        // startDate,
        // endDate,
        // venue,
        entity,
      },
    }),
  getByEntity: ({startDate = null, endDate = null, entity = null, l = 1}) =>
    request.get('/books', {
      params: {
        startDate,
        endDate,
        entity,
      },
    }),
  findByNumber: ({number}) =>
    request.get('/books/booking_number?number=' + number),
  edit: (bookData, bookId) => request.put('/books/' + bookId, {...bookData}),
  autocomplete: (query) => request.get('/books/auto-complete?input=' + query),
}
