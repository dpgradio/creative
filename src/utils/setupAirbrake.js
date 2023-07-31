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

export const gtmFilter = (notice) => {
  const rejectErrorsContaining = ['dpg_snowplow', '__tcfapi']
  const rejectErrorsFromFilesContaining = ['mychannels', 'gtm.js']

  const rejectMessage = rejectErrorsContaining.some((phrase) => notice.errors[0]?.message?.includes(phrase))
  const rejectFileInBacktrace = rejectErrorsFromFilesContaining.some((phrase) =>
    notice.errors[0]?.backtrace.some((backtraceItem) => backtraceItem.file.includes(phrase))
  )

  if (rejectMessage || rejectFileInBacktrace) {
    return null
  }

  return notice
}
