<template>
  <div class="file-preview-container" v-if="file">
    <button @click="closePreview" class="close-button">Fermer</button>
    <div class="content-wrapper">
      <div class="preview-section">
        <div v-if="file.type.startsWith('image/')">
          <img :src="file.url" :alt="file.name" class="file-preview-image" />
        </div>
        <div v-else-if="file.type === 'application/pdf'">
          <iframe :src="file.url" class="file-preview-iframe" frameborder="0"></iframe>
        </div>
        <div v-else class="no-preview">
          <p>La prévisualisation de ce fichier n'est pas disponible.</p>
        </div>
      </div>
      <div class="details-section">
        <div class="file-details">
          <p><strong>Nom:</strong> {{ file.name }}</p>
          <p><strong>Taille:</strong> {{ (file.size / 1024).toFixed(2) }} KB</p>
          <p><strong>Date:</strong> {{ file.date }}</p>
          <p><strong>Auteur:</strong> {{ file.author }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="loading-text">Chargement de la prévisualisation...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

const route = useRoute()
const router = useRouter()
const file = ref<File | null>(null)

const fetchFile = async (): Promise<void> => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/files/${route.params.fileId}`)
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des fichiers')
    }
    file.value = await response.json()
  } catch (err) {
    console.error((err as Error).message)
  }
}

onMounted(fetchFile)

const closePreview = (): void => {
  router.back()
}
</script>

<style scoped>
.file-preview-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 90%;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  color: white;
  border: solid 2px #f0f9f088;
  border-radius: 15px;
  box-shadow: 0px 0px 15px rgba(9, 193, 9, 0.722);
  backdrop-filter: blur(10px);
  position: relative;
  width: 100%;
  margin: 40px;
}

.close-button {
  position: absolute;
  top: 10px;
  left: 20px;
  padding: 10px 20px;
  width: auto;
  background: #07dd078d;
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: 0.3s;
  box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.5);
}

.close-button:hover {
  background: #03ff036a;
}

.content-wrapper {
  display: flex;
  gap: 80px;
  max-width: 1250px;
  width: 100%;
  margin-top: 70px;
  margin-left: auto;
  margin-right: auto;
}

.preview-section {
  flex: 2.5;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 100%;
}

.file-preview-image,
.file-preview-iframe {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.5);
}

.no-preview {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

.details-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 100%;
}

.file-details {
  text-align: center;
  font-size: 1.6rem;
  line-height: 1.5;
  max-width: 300px;
  max-height: 300px;
  color: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.175);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.8);
}

.loading-text {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    gap: 40px;
  }

  .preview-section {
    flex: none;
    max-width: 100%;
    max-height: 50vh;
  }

  .details-section {
    flex: none;
    max-width: 100%;
  }
}
</style>
