import api from './axios'

export const getTasks = async () => {
  try {
    const res = await api.get('/tasks/')
    return res.data.results
  } catch (err) {
    throw new Error('Erro ao buscar tarefas')
  }
}

export const addTask = async (task) => {
  try {
    const res = await api.post('/tasks/', task)
    return res.data
  } catch (err) {
    throw new Error('Erro ao adicionar tarefa')
  }
}

export const updateTask = async (id, task) => {
  try {
    const res = await api.patch(`/tasks/${id}/`, task)
    return res.data
  } catch (err) {
    throw new Error('Erro ao atualizar tarefa')
  }
}

export const deleteTaskById = async (id) => {
  try {
    await api.delete(`/tasks/${id}/`)
    return true
  } catch (err) {
    throw new Error('Erro ao deletar tarefa')
  }
}
