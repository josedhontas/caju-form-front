const DEFAULT_API_BASE_URL = 'https://caju-form-a90be5eacb3a.herokuapp.com'

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '' : DEFAULT_API_BASE_URL)
).replace(/\/$/, '')
