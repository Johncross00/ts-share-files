<template>
  <div class="file-list-container">
    <h1>Liste des Fichiers</h1>
    <div v-if="isLoading" class="loading">Chargement des fichiers...</div>
    <div v-else>
      <div v-if="files.length === 0" class="no-files">Aucun fichier disponible.</div>
      <transition-group name="file" tag="div" class="file-previews" v-else>
        <div v-for="file in files" :key="file.id" class="file-card">
          <p>{{ truncateFileName(file.name) }}</p>
          <img
            v-if="file.type.startsWith('image/')"
            :src="file.url"
            alt="Preview"
            class="file-preview-image"
          />
          <p v-else>Aperçu non disponible</p>
          <h6>{{ (file.size / 1024).toFixed(2) }} KB</h6>
          <h6>{{ file.date }}</h6>
          <h6>{{ file.author }}</h6>
          <div class="file-actions">
            <button @click="downloadFile(file.url)">Télécharger</button>
            <button @click="previewFile(file.id)">Prévisualiser</button>
            <button
              v-if="userStore.user && file.author === userStore.user.name"
              @click="deleteFile(file.id)"
              class="delete-button"
            >
              Supprimer
            </button>
          </div>
        </div>
      </transition-group>
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { JSON_SERVER_URL } from '../../config'

interface File {
  id: string
  name: string
  type: string
  url: string
  size: number
  date: string
  author: string
}

const files = ref<File[]>([])
const isLoading = ref<boolean>(true)
const error = ref<string>('')
const router = useRouter()
const userStore = useUserStore()

const truncateFileName = (name: string): string => {
  const maxLength = 20
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name
}

const fetchFiles = async (): Promise<void> => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/files`)
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des fichiers')
    }
    files.value = await response.json()
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    isLoading.value = false
  }
}

const downloadFile = (url: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.download = ''
  link.click()
}

const previewFile = (id: string): void => {
  router.push({ name: 'FilePreview', params: { fileId: id } })
}

const deleteFile = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/files/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du fichier')
    }
    files.value = files.value.filter((file) => file.id !== id)
  } catch (err) {
    error.value = (err as Error).message
  }
}

onMounted(fetchFiles)
</script>

<style scoped>
.file-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  padding: 2px;
  color: white;
  font-weight: bold;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5px;
  text-align: center;
}

.loading,
.no-files {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

.file-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.file-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(50px);
  border: 3px solid #e1f7dec1;
  border-radius: 20px;
  padding: 10px 15px 10px 15px;
  text-align: center;
  width: 250px;
  box-shadow: 0px 0px 10px rgb(0, 255, 0);
  transition:
    transform 0.3s,
    opacity 0.3s;
}

.file-card:hover {
  transform: scale(1.05);
}

.file-preview-image {
  width: 100%;
  height: 120px;
  object-fit: contain;
  border-radius: 20px;
  margin-bottom: 10px;
}

.file-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

button {
  background: #00ff0061;
  color: black;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: 0.5s;
  box-shadow: -14px 6px 15px -1px rgb(0, 70, 0);
  background-color: #080601b4;
  border-radius: 35px;
  border: 1px solid #e1f7dec6;
  display: inline-block;
  cursor: pointer;
  color: #ffffffd6;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  font-size: 19px;
  font-weight: bold;
  padding: 1px;
}

button:hover {
  background: #044704;
}

.delete-button {
  background: f2efe6b4;
  color: rgba(255, 255, 255, 0.733);
}

.delete-button:hover {
  background: darkred;
}

.error-message {
  color: red;
  font-size: 1.2rem;
  margin-top: 10px;
}

.file-enter-active,
.file-leave-active {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}

.file-enter-from,
.file-leave-to {
  opacity: 0;
  transform: translateY(50px);
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}
</style>
