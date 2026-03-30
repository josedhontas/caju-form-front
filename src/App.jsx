import { useEffect, useState } from 'react'
import './App.css'

const DEFAULT_API_BASE = 'https://caju-form-a90be5eacb3a.herokuapp.com'
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '' : DEFAULT_API_BASE)
).replace(/\/$/, '')

const OCCUPATIONS = [
  'Administrador',
  'Analista',
  'Atendente',
  'Designer',
  'Desenvolvedor',
  'Estudante',
  'Gerente',
  'Professor',
  'Vendedor',
  'Outra',
]

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  occupationSelect: '',
  occupationCustom: '',
}

function onlyDigits(value) {
  return value.replace(/\D/g, '')
}

function formatPhone(value) {
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

function getOccupationValue(form) {
  if (form.occupationSelect === 'Outra') {
    return form.occupationCustom.trim()
  }

  return form.occupationSelect.trim()
}

function toFormState(user) {
  const occupation = user.occupation ?? ''
  const isListedOccupation = OCCUPATIONS.includes(occupation) && occupation !== 'Outra'

  return {
    name: user.name ?? '',
    email: user.email ?? '',
    phone: formatPhone(user.phone ?? ''),
    birthDate: user.birthDate ? user.birthDate.slice(0, 10) : '',
    occupationSelect: isListedOccupation ? occupation : occupation ? 'Outra' : '',
    occupationCustom: isListedOccupation ? '' : occupation,
  }
}

function validateForm(form) {
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
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Digite um e-mail valido.'
  }

  if (!phoneDigits) {
    errors.phone = 'Informe o telefone.'
  } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.phone = 'Telefone precisa ter 10 ou 11 digitos.'
  }

  if (!form.birthDate) {
    errors.birthDate = 'Informe a data de nascimento.'
  } else if (new Date(`${form.birthDate}T00:00:00`).getTime() > Date.now()) {
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

function toPayload(form) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: onlyDigits(form.phone),
    birthDate: new Date(`${form.birthDate}T00:00:00`).toISOString(),
    occupation: getOccupationValue(form),
  }
}

async function saveUser(payload, userId) {
  const isEditing = Boolean(userId)
  const response = await fetch(`${API_BASE}/users${isEditing ? `/${userId}` : ''}`, {
    method: isEditing ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const hasJson = contentType.includes('application/json')
  const data = hasJson ? await response.json() : { success: response.ok }

  if (!response.ok) {
    throw new Error(data?.error || 'Nao foi possivel concluir o envio do formulario.')
  }

  return data
}

function App() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'none', message: '' })
  const [submittedUser, setSubmittedUser] = useState(null)
  const [screen, setScreen] = useState('form')
  const [editingUserId, setEditingUserId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = Boolean(editingUserId)

  useEffect(() => {
    if (status.type === 'none') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setStatus({ type: 'none', message: '' })
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [status])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => {
      if (name === 'phone') {
        return { ...current, phone: formatPhone(value) }
      }

      if (name === 'occupationSelect') {
        return {
          ...current,
          occupationSelect: value,
          occupationCustom: value === 'Outra' ? current.occupationCustom : '',
        }
      }

      return { ...current, [name]: value }
    })

    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function handleEditResponse() {
    if (!submittedUser) {
      return
    }

    setForm(toFormState(submittedUser))
    setErrors({})
    setStatus({ type: 'none', message: '' })
    setEditingUserId(submittedUser.id)
    setScreen('form')
  }

  function handleNewResponse() {
    setForm(EMPTY_FORM)
    setErrors({})
    setStatus({ type: 'none', message: '' })
    setEditingUserId(null)
    setSubmittedUser(null)
    setScreen('form')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validateForm(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus({ type: 'error', message: 'Corrija os campos destacados antes de continuar.' })
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setStatus({ type: 'none', message: '' })

    try {
      const response = await saveUser(toPayload(form), editingUserId)
      setSubmittedUser(response)
      setEditingUserId(response.id)
      setScreen('success')
      setStatus({ type: 'none', message: '' })
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.message || 'Nao foi possivel concluir o envio do formulario. Tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page">
      <section className="form-card">
        <div className="card-accent" aria-hidden="true" />

        {status.type !== 'none' ? (
          <section
            className={`notification-card notification-${status.type}`}
            role="status"
            aria-live={status.type === 'error' ? 'assertive' : 'polite'}
          >
            <div className="notification-badge" aria-hidden="true">
              {status.type === 'success' ? 'OK' : '!'}
            </div>
            <div className="notification-content">
              <strong>{status.type === 'success' ? 'Operacao concluida' : 'Nao foi possivel concluir'}</strong>
              <p>{status.message}</p>
            </div>
            <button
              type="button"
              className="notification-close"
              onClick={() => setStatus({ type: 'none', message: '' })}
              aria-label="Fechar notificacao"
            >
              ×
            </button>
          </section>
        ) : null}

        {screen === 'form' ? (
          <>
            <header className="form-header">
              <p className="form-eyebrow">
                {isEditing ? 'Atualizacao de cadastro' : 'Formulario de cadastro'}
              </p>
              <h1>{isEditing ? 'Atualizar dados cadastrais' : 'Cadastro de usuario'}</h1>
              <p>
                {isEditing
                  ? 'Revise as informacoes abaixo e confirme a atualizacao.'
                  : 'Preencha os campos obrigatorios e envie o formulario.'}
              </p>
            </header>

            <form className="user-form" onSubmit={handleSubmit} noValidate>
              <label className="field">
                <span>Nome completo</span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Maria Silva"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <small className="field-error">{errors.name}</small> : null}
              </label>

              <label className="field">
                <span>E-mail</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="maria@email.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <small className="field-error">{errors.email}</small> : null}
              </label>

              <label className="field">
                <span>Telefone</span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(85) 99999-0000"
                  aria-invalid={Boolean(errors.phone)}
                />
                <small className="field-hint">Informe o numero com DDD.</small>
                {errors.phone ? <small className="field-error">{errors.phone}</small> : null}
              </label>

              <label className="field">
                <span>Data de nascimento</span>
                <input
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.birthDate)}
                />
                {errors.birthDate ? (
                  <small className="field-error">{errors.birthDate}</small>
                ) : null}
              </label>

              <label className="field field-full">
                <span>Profissao</span>
                <select
                  name="occupationSelect"
                  value={form.occupationSelect}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.occupationSelect)}
                >
                  <option value="">Selecione</option>
                  {OCCUPATIONS.map((occupation) => (
                    <option key={occupation} value={occupation}>
                      {occupation}
                    </option>
                  ))}
                </select>
                {errors.occupationSelect ? (
                  <small className="field-error">{errors.occupationSelect}</small>
                ) : null}
              </label>

              {form.occupationSelect === 'Outra' ? (
                <label className="field field-full">
                  <span>Descricao da profissao</span>
                  <input
                    name="occupationCustom"
                    type="text"
                    value={form.occupationCustom}
                    onChange={handleChange}
                    placeholder="Informe a profissao"
                    aria-invalid={Boolean(errors.occupationCustom)}
                  />
                  {errors.occupationCustom ? (
                    <small className="field-error">{errors.occupationCustom}</small>
                  ) : null}
                </label>
              ) : null}

              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Enviando...'
                  : isEditing
                    ? 'Salvar atualizacao'
                    : 'Enviar cadastro'}
              </button>
            </form>
          </>
        ) : (
          <>
            <header className="form-header form-header-success">
              <div className="success-icon" aria-hidden="true">
                OK
              </div>
              <p className="form-eyebrow">Envio concluido</p>
              <h1>Cadastro enviado com sucesso</h1>
              <p>As informacoes foram registradas corretamente.</p>
            </header>

            <div className="success-actions">
              <button type="button" className="secondary-button" onClick={handleEditResponse}>
                Editar cadastro
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setScreen('summary')}
              >
                Visualizar dados enviados
              </button>
              <button type="button" className="secondary-button" onClick={handleNewResponse}>
                Novo cadastro
              </button>
            </div>
          </>
        )}

        {screen === 'summary' && submittedUser ? (
          <section className="result">
            <strong>Resumo do cadastro enviado</strong>
            <dl className="result-list">
              <div>
                <dt>Nome completo</dt>
                <dd>{submittedUser.name}</dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>{submittedUser.email}</dd>
              </div>
              <div>
                <dt>Telefone</dt>
                <dd>{formatPhone(submittedUser.phone ?? '')}</dd>
              </div>
              <div>
                <dt>Data de nascimento</dt>
                <dd>{submittedUser.birthDate ? submittedUser.birthDate.slice(0, 10) : '-'}</dd>
              </div>
              <div>
                <dt>Profissao</dt>
                <dd>{submittedUser.occupation}</dd>
              </div>
            </dl>
            <div className="result-actions">
              <button type="button" className="link-button" onClick={handleEditResponse}>
                Editar cadastro
              </button>
              <button
                type="button"
                className="link-button"
                onClick={() => setScreen('success')}
              >
                Voltar para confirmacao
              </button>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  )
}

export default App
