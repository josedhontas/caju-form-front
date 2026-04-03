import { useEffect, useReducer } from 'react'
import { saveUser } from '../services/user-service.js'
import {
  EMPTY_REGISTRATION_FORM,
  formatPhone,
  toFormState,
  toSubmittedUser,
  toUserPayload,
  validateRegistrationForm,
} from '../utils/form-helpers.js'

const EMPTY_STATUS = Object.freeze({ type: 'none', message: '' })

function getInitialState() {
  return {
    form: { ...EMPTY_REGISTRATION_FORM },
    errors: {},
    status: EMPTY_STATUS,
    screen: 'form',
    submittedUser: null,
    editingUserId: null,
    isSubmitting: false,
  }
}

function registrationReducer(state, action) {
  switch (action.type) {
    case 'FIELD_CHANGED': {
      const { name, value } = action
      const nextForm = { ...state.form }

      if (name === 'phone') {
        nextForm.phone = formatPhone(value)
      } else if (name === 'occupationSelect') {
        nextForm.occupationSelect = value
        nextForm.occupationCustom = value === 'Outra' ? state.form.occupationCustom : ''
      } else {
        nextForm[name] = value
      }

      const nextErrors = { ...state.errors, [name]: '' }

      if (name === 'occupationSelect' && value !== 'Outra') {
        nextErrors.occupationCustom = ''
      }

      return {
        ...state,
        form: nextForm,
        errors: nextErrors,
      }
    }

    case 'SUBMIT_INVALID':
      return {
        ...state,
        errors: action.errors,
        status: {
          type: 'error',
          message: 'Corrija os campos destacados antes de continuar.',
        },
      }

    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        errors: {},
        status: EMPTY_STATUS,
      }

    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        submittedUser: action.user,
        editingUserId: action.user.id ?? state.editingUserId,
        screen: 'success',
        status: EMPTY_STATUS,
      }

    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        status: {
          type: 'error',
          message: action.message,
        },
      }

    case 'EDIT_SUBMITTED_USER':
      if (!state.submittedUser) {
        return state
      }

      return {
        ...state,
        form: toFormState(state.submittedUser),
        errors: {},
        status: EMPTY_STATUS,
        editingUserId: state.submittedUser.id,
        screen: 'form',
      }

    case 'START_NEW_REGISTRATION':
      return getInitialState()

    case 'SHOW_SUMMARY':
      return {
        ...state,
        screen: 'summary',
      }

    case 'RETURN_TO_SUCCESS':
      return {
        ...state,
        screen: 'success',
      }

    case 'DISMISS_STATUS':
      return {
        ...state,
        status: EMPTY_STATUS,
      }

    default:
      return state
  }
}

function getErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Nao foi possivel concluir o envio do formulario. Tente novamente.'
}

export function useRegistrationFlow() {
  const [state, dispatch] = useReducer(registrationReducer, undefined, getInitialState)

  useEffect(() => {
    if (state.status.type === 'none') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'DISMISS_STATUS' })
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [state.status])

  function handleChange(event) {
    dispatch({
      type: 'FIELD_CHANGED',
      name: event.target.name,
      value: event.target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validateRegistrationForm(state.form)

    if (Object.keys(nextErrors).length > 0) {
      dispatch({ type: 'SUBMIT_INVALID', errors: nextErrors })
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    try {
      const savedUser = await saveUser(toUserPayload(state.form), state.editingUserId)
      dispatch({
        type: 'SUBMIT_SUCCESS',
        user: savedUser ?? toSubmittedUser(state.form, state.editingUserId),
      })
    } catch (error) {
      dispatch({ type: 'SUBMIT_ERROR', message: getErrorMessage(error) })
    }
  }

  function handleDismissStatus() {
    dispatch({ type: 'DISMISS_STATUS' })
  }

  function handleEditSubmittedUser() {
    dispatch({ type: 'EDIT_SUBMITTED_USER' })
  }

  function handleNewRegistration() {
    dispatch({ type: 'START_NEW_REGISTRATION' })
  }

  function handleOpenSummary() {
    dispatch({ type: 'SHOW_SUMMARY' })
  }

  function handleReturnToSuccess() {
    dispatch({ type: 'RETURN_TO_SUCCESS' })
  }

  return {
    ...state,
    isEditing: Boolean(state.editingUserId),
    handleChange,
    handleDismissStatus,
    handleEditSubmittedUser,
    handleNewRegistration,
    handleOpenSummary,
    handleReturnToSuccess,
    handleSubmit,
  }
}
