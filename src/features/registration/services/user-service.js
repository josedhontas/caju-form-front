import { API_BASE_URL } from '../../../shared/config/api.js'

async function getResponseData(response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

export async function saveUser(payload, userId) {
  const isEditing = Boolean(userId)
  const response = await fetch(`${API_BASE_URL}/users${isEditing ? `/${userId}` : ''}`, {
    method: isEditing ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await getResponseData(response)

  if (!response.ok) {
    throw new Error(data?.error ?? 'Nao foi possivel concluir o envio do formulario.')
  }

  return data
}
