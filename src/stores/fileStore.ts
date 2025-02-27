import { defineStore } from 'pinia'
import { JSON_SERVER_URL } from '../../config.js'

interface File {
  id: string
  name: string
  size: number
  [key: string]: unknown
}

interface FileStoreState {
  files: File[]
  loading: boolean
  error: string | null
}

export const useFileStore = defineStore('fileStore', {
  state: (): FileStoreState => ({
    files: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFiles() {
      this.loading = true
      try {
        const response = await fetch(`${JSON_SERVER_URL}/files`)
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des fichiers')
        }
        this.files = await response.json()
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Une erreur inconnue est survenue'
        }
      } finally {
        this.loading = false
      }
    },

    async uploadFile(file: File) {
      this.loading = true
      try {
        const response = await fetch(`${JSON_SERVER_URL}/files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(file),
        })
        if (!response.ok) {
          throw new Error("Erreur lors de l'upload des fichiers")
        }
        this.files.push(await response.json())
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Une erreur inconnue est survenue'
        }
      } finally {
        this.loading = false
      }
    },

    async deleteFile(id: string) {
      try {
        const response = await fetch(`${JSON_SERVER_URL}/files/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du fichier')
        }
        this.files = this.files.filter((file) => file.id !== id)
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Une erreur inconnue est survenue'
        }
      }
    },
  },
  getters: {
    getFileList(state): File[] {
      return state.files
    },
    isLoading(state): boolean {
      return state.loading
    },
    getError(state): string | null {
      return state.error
    },
  },
})
