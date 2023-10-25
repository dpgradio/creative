export const setupAirbrake = async (
  AirbrakeNotifier,
  { projectId, projectKey, version, environment = 'production' },
  app = null
) => {
  if (!projectId || !Number.isInteger(projectId)) {
    return
  }

  const airbrake = new AirbrakeNotifier({ projectId, projectKey, environment })

  airbrake.addFilter(gtmFilter)

  if (version) {
    airbrake.addFilter((notice) => {
      notice.context = {
        ...notice.context,
        version,
      }
      return notice
    })
  }

  if (app) {
    app.config.errorHandler = (error, _vm, info) => airbrake.notify({ error, params: { info } })
  }

  return airbrake
}

export const rejectErrorMessagesContaining = (notice, phrases) =>
  phrases.some((phrase) => notice.errors[0]?.message?.includes(phrase)) ? null : notice

export const rejectErrorsFromFilesContaining = (notice, phrases) =>
  phrases.some((phrase) => notice.errors[0]?.backtrace.some((backtraceItem) => backtraceItem.file.includes(phrase)))
    ? null
    : notice

export const gtmFilter = (notice) =>
  rejectErrorMessagesContaining(notice, ['dpg_snowplow', '__tcfapi']) &&
  rejectErrorsFromFilesContaining(notice, ['mychannels', 'gtm.js'])
