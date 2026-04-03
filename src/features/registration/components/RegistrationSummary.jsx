import { formatPhone, toDateInputValue } from '../utils/form-helpers.js'

export function RegistrationSummary({ submittedUser, onBack, onEdit }) {
  if (!submittedUser) {
    return null
  }

  return (
    <section className="summary-card">
      <strong>Resumo do cadastro enviado</strong>

      <dl className="summary-card__list">
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
          <dd>{toDateInputValue(submittedUser.birthDate) || '-'}</dd>
        </div>

        <div>
          <dt>Profissao</dt>
          <dd>{submittedUser.occupation}</dd>
        </div>
      </dl>

      <div className="summary-card__actions">
        <button type="button" className="button button--link" onClick={onEdit}>
          Editar cadastro
        </button>
        <button type="button" className="button button--link" onClick={onBack}>
          Voltar para confirmacao
        </button>
      </div>
    </section>
  )
}
