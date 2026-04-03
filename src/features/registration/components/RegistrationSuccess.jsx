export function RegistrationSuccess({ onEdit, onNew, onShowSummary }) {
  return (
    <>
      <header className="section-header section-header--success">
        <div className="success-badge" aria-hidden="true">
          OK
        </div>
        <p className="section-eyebrow">Envio concluido</p>
        <h1>Cadastro enviado com sucesso</h1>
        <p>As informacoes foram registradas corretamente.</p>
      </header>

      <div className="action-group">
        <button type="button" className="button button--secondary" onClick={onEdit}>
          Editar cadastro
        </button>
        <button type="button" className="button button--secondary" onClick={onShowSummary}>
          Visualizar dados enviados
        </button>
        <button type="button" className="button button--secondary" onClick={onNew}>
          Novo cadastro
        </button>
      </div>
    </>
  )
}
