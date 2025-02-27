<template>
  <div class="file-uploader-container">
    <h1>Uploadez vos fichiers</h1>
    <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileInput">
      <p>Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
      <input type="file" multiple @change="handleFileUpload" ref="fileInput" class="hidden" />
    </div>
    <div v-if="isLoading" class="progress-bar">
      <span>Uploading...</span>
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="file-previews-container">
      <div class="file-previews" v-if="selectedFiles.length > 0">
        <div v-for="file in selectedFiles" :key="file.name" class="file-card">
          <button class="delete-button" @click="removeFile(file)">✖</button>
          <p>{{ truncateFileName(file.name) }}</p>
          <img
            v-if="file.type.startsWith('image/')"
            :src="file.url"
            alt="Preview"
            class="file-preview-image"
          />
          <p v-else>Aperçu non disponible</p>
          <p>{{ (file.size / 1024).toFixed(2) }} KB</p>
        </div>
      </div>
    </div>
    <button
      @click="uploadToServer"
      :disabled="selectedFiles.length === 0 || isLoading"
      class="upload-button mt-4 p-2 bg-blue-500 text-white rounded"
    >
      <span v-if="isLoading">Uploading...</span>
      <span v-else>Envoyer les fichiers</span>
    </button>
    <p v-if="successMessage" class="text-green-500">{{ successMessage }}</p>

    <div v-if="showErrorDialog" class="modal">
      <div class="modal-content">
        <p>{{ error }}</p>
        <button @click="closeErrorDialog">Ok</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { JSON_SERVER_URL } from '../../config'

const userStore = useUserStore()
const isLoading = ref<boolean>(false)
const error = ref<string>('')
const successMessage = ref<string>('')
const selectedFiles = ref<Array<FileData>>([])
const progress = ref<number>(0)
const fileInput = ref<HTMLInputElement | null>(null)
const showErrorDialog = ref<boolean>(false)

interface FileData {
  name: string
  type: string
  size: number
  url: string
  author: string
  date: string
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input?.files) {
    processFiles(input.files)
  }
}

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files) {
    processFiles(files)
  }
}

const processFiles = (files: FileList) => {
  const maxSize = 50 * 1024 * 1024 // 50MB
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'video/mp4',
    'application/pdf',
    'application/zip',
  ]

  if (files.length > 0) {
    selectedFiles.value = Array.from(files)
      .map((file) => {
        if (file.size > maxSize) {
          error.value = `Le fichier ${file.name} dépasse la taille maximale de 50MB.`
          showErrorDialog.value = true
          return null
        }
        if (!allowedTypes.includes(file.type)) {
          error.value = `Les fichiers de type:  ${file.type} ne sont pas autorisés.`
          showErrorDialog.value = true
          return null
        }

        if (!userStore.user) {
          error.value = 'Utilisateur non connecté'
          showErrorDialog.value = true
          return null
        }

        return {
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          author: userStore.user.name,
          date: new Date().toLocaleString(),
        }
      })
      .filter((file): file is FileData => file !== null)
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const truncateFileName = (name: string): string => {
  const maxLength = 20
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name
}

const uploadToServer = async () => {
  isLoading.value = true
  try {
    for (let index = 0; index < selectedFiles.value.length; index++) {
      const file = selectedFiles.value[index]
      await delay(100)
      const response = await fetch(`${JSON_SERVER_URL}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(file),
      })
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi des fichiers vers le serveur")
      }
      progress.value = ((index + 1) / selectedFiles.value.length) * 100
    }
    successMessage.value = 'Fichiers envoyés vers le serveur avec succès'
    selectedFiles.value = []
  } catch (err) {
    error.value = (err as Error).message
    showErrorDialog.value = true
  } finally {
    isLoading.value = false
  }
}

const closeErrorDialog = () => {
  showErrorDialog.value = false
  error.value = ''
}

const removeFile = (file: FileData) => {
  selectedFiles.value = selectedFiles.value.filter((f) => f !== file)
}
</script>

<style scoped>
.file-uploader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

h1 {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 10px;
  width: 100%;
  text-align: center;
}

.drop-zone {
  width: 100%;
  max-width: 600px;
  padding: 50px;
  border: 2px dashed #ccc;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
  position: sticky;
  top: 50px;
  z-index: 10;
}

.drop-zone:hover {
  background-color: #f0f0f047;
}

.hidden {
  display: none;
}

.file-previews-container {
  max-width: 700px;
  max-height: 250px;
  overflow-y: auto;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 10px;
}

.file-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.file-card {
  border: 1px solid #ccc;
  border-radius: 30px;
  padding: 10px;
  text-align: center;
  width: 150px;
  position: relative;
}

.file-preview-image {
  max-width: 100%;
  max-height: 100px;
  object-fit: contain;
}

.delete-button {
  position: absolute;
  top: 0;
  left: 115px;
  background: none;
  border: none;
  color: red;
  font-size: 16px;
  cursor: pointer;
  width: 20px;
}

.text-red-500 {
  color: red;
}

.text-green-500 {
  color: green;
}

.upload-button {
  margin-top: 20px;
}

.upload-button:disabled {
  background-color: rgba(230, 124, 124, 0.99);
  cursor: not-allowed;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #2b2828b4;
  backdrop-filter: blur(10px);
  color: rgba(255, 0, 0, 0.752);
  font-weight: bold;
  font-size: 30px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
.text-green-500 {
  color: greenyellow;
  font-size: 25px;
  font-weight: bold;
}
</style>
