import './App.css'
import { RegistrationForm } from '../features/registration/components/RegistrationForm.jsx'
import { RegistrationSuccess } from '../features/registration/components/RegistrationSuccess.jsx'
import { RegistrationSummary } from '../features/registration/components/RegistrationSummary.jsx'
import { StatusNotification } from '../features/registration/components/StatusNotification.jsx'
import { useRegistrationFlow } from '../features/registration/hooks/useRegistrationFlow.js'

function App() {
  const {
    errors,
    form,
    isEditing,
    isSubmitting,
    screen,
    status,
    submittedUser,
    handleChange,
    handleDismissStatus,
    handleEditSubmittedUser,
    handleNewRegistration,
    handleOpenSummary,
    handleReturnToSuccess,
    handleSubmit,
  } = useRegistrationFlow()

  const isFormScreen = screen === 'form'

  return (
    <main className="app-shell">
      <section className="registration-card">
        <div className="registration-card__accent" aria-hidden="true" />

        <StatusNotification status={status} onClose={handleDismissStatus} />

        {isFormScreen ? (
          <RegistrationForm
            form={form}
            errors={errors}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        ) : (
          <RegistrationSuccess
            onEdit={handleEditSubmittedUser}
            onNew={handleNewRegistration}
            onShowSummary={handleOpenSummary}
          />
        )}

        {screen === 'summary' ? (
          <RegistrationSummary
            submittedUser={submittedUser}
            onBack={handleReturnToSuccess}
            onEdit={handleEditSubmittedUser}
          />
        ) : null}
      </section>
    </main>
  )
}

export default App
