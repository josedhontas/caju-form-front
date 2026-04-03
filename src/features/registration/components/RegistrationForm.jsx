import { OCCUPATIONS } from '../constants/occupations.js'
import { getTodayDateValue } from '../utils/form-helpers.js'

export function RegistrationForm({
  form,
  errors,
  isEditing,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  const maxBirthDate = getTodayDateValue()

  return (
    <>
      <header className="section-header">
        <p className="section-eyebrow">
          {isEditing ? 'Atualizacao de cadastro' : 'Formulario de cadastro'}
        </p>
        <h1>{isEditing ? 'Atualizar dados cadastrais' : 'Cadastro de usuario'}</h1>
        <p>
          {isEditing
            ? 'Revise as informacoes abaixo e confirme a atualizacao.'
            : 'Preencha os campos obrigatorios e envie o formulario.'}
        </p>
      </header>

      <form className="registration-form" onSubmit={onSubmit} noValidate>
        <label className="form-field">
          <span>Nome completo</span>
          <input
            autoComplete="name"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            placeholder="Maria Silva"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <small className="form-error">{errors.name}</small> : null}
        </label>

        <label className="form-field">
          <span>E-mail</span>
          <input
            autoComplete="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="maria@email.com"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <small className="form-error">{errors.email}</small> : null}
        </label>

        <label className="form-field">
          <span>Telefone</span>
          <input
            autoComplete="tel-national"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder="(85) 99999-0000"
            aria-invalid={Boolean(errors.phone)}
          />
          <small className="form-hint">Informe o numero com DDD.</small>
          {errors.phone ? <small className="form-error">{errors.phone}</small> : null}
        </label>

        <label className="form-field">
          <span>Data de nascimento</span>
          <input
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={onChange}
            max={maxBirthDate}
            aria-invalid={Boolean(errors.birthDate)}
          />
          {errors.birthDate ? <small className="form-error">{errors.birthDate}</small> : null}
        </label>

        <label className="form-field form-field--full">
          <span>Profissao</span>
          <select
            name="occupationSelect"
            value={form.occupationSelect}
            onChange={onChange}
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
            <small className="form-error">{errors.occupationSelect}</small>
          ) : null}
        </label>

        {form.occupationSelect === 'Outra' ? (
          <label className="form-field form-field--full">
            <span>Descricao da profissao</span>
            <input
              name="occupationCustom"
              type="text"
              value={form.occupationCustom}
              onChange={onChange}
              placeholder="Informe a profissao"
              aria-invalid={Boolean(errors.occupationCustom)}
            />
            {errors.occupationCustom ? (
              <small className="form-error">{errors.occupationCustom}</small>
            ) : null}
          </label>
        ) : null}

        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : isEditing ? 'Salvar atualizacao' : 'Enviar cadastro'}
        </button>
      </form>
    </>
  )
}
