import { OCCUPATIONS } from '../constants/occupations.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const EMPTY_REGISTRATION_FORM = Object.freeze({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  occupationSelect: '',
  occupationCustom: '',
})

export function onlyDigits(value = '') {
  return value.replace(/\D/g, '')
}

export function formatPhone(value = '') {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 2) {
    return digits
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function getTodayDateValue() {
  const now = new Date()
  const timezoneOffsetInMs = now.getTimezoneOffset() * 60 * 1000

  return new Date(now.getTime() - timezoneOffsetInMs).toISOString().slice(0, 10)
}

export function toDateInputValue(value) {
  return value ? value.slice(0, 10) : ''
}

export function getOccupationValue(form) {
  if (form.occupationSelect === 'Outra') {
    return form.occupationCustom.trim()
  }

  return form.occupationSelect.trim()
}

export function toFormState(user = {}) {
  const occupation = user.occupation ?? ''
  const isListedOccupation = OCCUPATIONS.includes(occupation) && occupation !== 'Outra'

  return {
    name: user.name ?? '',
    email: user.email ?? '',
    phone: formatPhone(user.phone ?? ''),
    birthDate: toDateInputValue(user.birthDate),
    occupationSelect: isListedOccupation ? occupation : occupation ? 'Outra' : '',
    occupationCustom: isListedOccupation ? '' : occupation,
  }
}

export function validateRegistrationForm(form) {
  const errors = {}
  const phoneDigits = onlyDigits(form.phone)
  const email = form.email.trim()

  if (!form.name.trim()) {
    errors.name = 'Informe o nome.'
  } else if (form.name.trim().length < 3) {
    errors.name = 'O nome precisa ter pelo menos 3 caracteres.'
  }

  if (!email) {
    errors.email = 'Informe o e-mail.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Digite um e-mail valido.'
  }

  if (!phoneDigits) {
    errors.phone = 'Informe o telefone.'
  } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.phone = 'Telefone precisa ter 10 ou 11 digitos.'
  }

  if (!form.birthDate) {
    errors.birthDate = 'Informe a data de nascimento.'
  } else if (form.birthDate > getTodayDateValue()) {
    errors.birthDate = 'Data de nascimento nao pode ser futura.'
  }

  if (!form.occupationSelect) {
    errors.occupationSelect = 'Selecione a profissao.'
  }

  if (form.occupationSelect === 'Outra' && !form.occupationCustom.trim()) {
    errors.occupationCustom = 'Digite a profissao.'
  }

  return errors
}

export function toUserPayload(form) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: onlyDigits(form.phone),
    birthDate: new Date(`${form.birthDate}T00:00:00`).toISOString(),
    occupation: getOccupationValue(form),
  }
}

export function toSubmittedUser(form, userId = null) {
  return {
    id: userId,
    ...toUserPayload(form),
  }
}
