export function StatusNotification({ status, onClose }) {
  if (status.type === 'none') {
    return null
  }

  const isSuccess = status.type === 'success'

  return (
    <section
      className={`status-banner status-banner--${status.type}`}
      role="status"
      aria-live={isSuccess ? 'polite' : 'assertive'}
    >
      <div className="status-banner__badge" aria-hidden="true">
        {isSuccess ? 'OK' : '!'}
      </div>

      <div className="status-banner__content">
        <strong>{isSuccess ? 'Operacao concluida' : 'Nao foi possivel concluir'}</strong>
        <p>{status.message}</p>
      </div>

      <button
        type="button"
        className="status-banner__close"
        onClick={onClose}
        aria-label="Fechar notificacao"
      >
        &times;
      </button>
    </section>
  )
}
