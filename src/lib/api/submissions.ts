import request from '.'

export const submissionsApi = {
  get: async (option?: string) => request.get('/submissions' + option),
  getById: async (id: string) => request.get('/submissions/' + id),
  getByAssignmentId: async (id: string) =>
    request.get('/submissions/assignment/' + id),
  getAssignmentSubmission: async (options: string) =>
    request.get('/submissions/assignment_submission/' + options),
}
