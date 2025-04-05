<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="bg-teal-500 text-white p-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <UserIcon class="w-5 h-5" />
              <h2 class="font-medium">Olá, Usuário!</h2>
            </div>
            <button 
              @click="logout" 
              class="bg-white text-teal-600 hover:bg-teal-50 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <LogOutIcon class="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Tarefas</h1>
        
        <!-- Add Task Form -->
        <div class="flex mb-6">
          <input 
            v-model="newTask" 
            @keyup.enter="addNewTask"
            type="text" 
            placeholder="Adicionar nova tarefa..." 
            class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button 
            @click="addNewTask" 
            class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-r-lg transition-colors"
          >
            <PlusIcon class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Filter Tabs -->
        <div class="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button 
            v-for="filter in filters" 
            :key="filter.value"
            @click="currentFilter = filter.value"
            :class="[
              'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
              currentFilter === filter.value 
                ? 'bg-white shadow text-gray-800' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            <component :is="filter.icon" class="w-4 h-4" />
            {{ filter.label }}
          </button>
        </div>
        
        <!-- Task List -->
        <div v-if="filteredTasks.length > 0" class="space-y-3">
          <div 
            v-for="(task, index) in filteredTasks" 
            :key="index"
            class="p-4 rounded-lg border transition-all"
            :class="getTaskClasses(task.status)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 flex-grow">
                <button @click="cycleTaskStatus(task)" class="flex-shrink-0">
                  <component :is="getStatusIcon(task.status)" 
                    :class="getStatusIconClass(task.status)"
                    class="w-5 h-5" 
                  />
                </button>
                
                <div v-if="editingTaskId === task.id" class="flex-grow flex">
                  <input 
                    v-model="editingText" 
                    @keyup.enter="saveEdit(task)"
                    @blur="saveEdit(task)"
                    ref="editInput"
                    type="text" 
                    class="flex-grow px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <span 
                  v-else
                  @dblclick="startEdit(task)"
                  :class="{ 'line-through opacity-70': task.status === 'completed' }"
                  class="flex-grow"
                >
                  {{ task.title }}
                </span>
              </div>
              
              <div class="flex items-center gap-2">
                <button @click="startEdit(task)" class="text-gray-500 hover:text-gray-700">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button @click="deleteTask(task.id)" class="text-gray-500 hover:text-red-500">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <ClipboardListIcon class="w-12 h-12 mx-auto text-gray-300" />
          <p class="mt-2 text-gray-500">Nenhuma tarefa encontrada</p>
          <p class="text-sm text-gray-400">
            {{ currentFilter === 'all' ? 'Adicione uma nova tarefa acima' : 'Tente outro filtro' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import {
  CheckCircle as CheckCircleIcon,
  Circle as CircleIcon,
  Clock as ClockIcon,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  Pencil as PencilIcon,
  ClipboardList as ClipboardListIcon,
  ListChecks as ListChecksIcon,
  LogOutIcon as LogOutIcon,
  User as UserIcon,
} from 'lucide-vue-next';

import { getTasks, addTask, updateTask, deleteTaskById } from '@/api/tasks.js';
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
// Estado de tarefas
const tasks = ref([]);
const isLoading = ref(false);


// Estado de filtro
const filters = [
  { label: 'Todas', value: 'all', icon: ListChecksIcon },
  { label: 'Pendentes', value: 'pending', icon: CircleIcon },
  { label: 'Em Progresso', value: 'in_progress', icon: ClockIcon },
  { label: 'Concluídas', value: 'completed', icon: CheckCircleIcon },
];
const currentFilter = ref('all');

// Novo texto de tarefa
const newTask = ref('');

// Estado de edição
const editInput = ref(null);
const editingTaskId = ref(null);
const editingText = ref('');

// Buscar tarefas na API
const fetchTasks = async () => {
  try {
    isLoading.value = true;
    tasks.value = await getTasks();
  } catch (err) {
    console.error('Erro ao carregar tarefas:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTasks);

// Computed: tarefas filtradas
const filteredTasks = computed(() => {
  if (currentFilter.value === 'all') {
    return tasks.value;
  }
  return tasks.value.filter(task => task.status === currentFilter.value);
});

// Adicionar tarefa via API
const addNewTask = async () => {
  const trimmed = newTask.value.trim();
  if (!trimmed) return;

  try {

    const createdTask = await addTask({ title: trimmed, status: 'pending', user: authStore.userId, description: 'a' });
    tasks.value.push(createdTask);
    newTask.value = '';
  } catch (err) {
    console.error('Erro ao adicionar tarefa:', err);
  }
};

// Deletar tarefa via API
const deleteTask = async (id) => {
  try {
    await deleteTaskById(id);
    tasks.value = tasks.value.filter(task => task.id !== id);
  } catch (err) {
    console.error('Erro ao deletar tarefa:', err);
  }
};

// Ciclar status da tarefa via API
const cycleTaskStatus = async (task) => {
  const statusCycle = {
    pending: 'in_progress',
    'in_progress': 'completed',
    completed: 'pending'
  };


  const status = statusCycle[task.status];
  try {
    await updateTask(task.id, {"status": status});
    task.status = status;
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
  }
};

// Começar edição
const startEdit = (task) => {
  editingTaskId.value = task.id;
  editingText.value = task.title;

  nextTick(() => {
    if (editInput.value && typeof editInput.value.focus === 'function') {
      editInput.value.focus();
    }
  });
};

// Salvar edição via API
const saveEdit = async (task) => {
  const trimmed = editingText.value.trim();
  if (!trimmed) return;

  const title = task.title
  try {
    await updateTask(task.id, { title: title });
    task.title = trimmed;
    editingTaskId.value = null;
  } catch (err) {
    console.error('Erro ao salvar edição:', err);
  }
};

// Estilos auxiliares
const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return CheckCircleIcon;
    case 'in_progress': return ClockIcon;
    case 'pending': return CircleIcon;
    default: return CircleIcon;
  }
};

const getStatusIconClass = (status) => {
  switch (status) {
    case 'completed': return 'text-green-500';
    case 'in_progress': return 'text-amber-500';
    case 'pending': return 'text-blue-500';
    default: return 'text-gray-400';
  }
};

const getTaskClasses = (status) => {
  switch (status) {
    case 'completed': return 'border-green-100 bg-green-50';
    case 'in_progress': return 'border-amber-100 bg-amber-50';
    case 'pending': return 'border-blue-100 bg-blue-50';
    default: return 'border-gray-200';
  }
};

import { useRouter } from 'vue-router'
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
