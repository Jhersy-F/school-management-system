<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Class Details</h2>
    <div class="bg-white shadow p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Upload Document</h3>
      <form @submit.prevent="uploadFile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Select File (PDF, DOC, Image)</label>
          <input type="file" @change="handleFileChange" class="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100
          ">
        </div>
        <div v-if="message" class="text-sm text-green-600">{{ message }}</div>
        <div v-if="error" class="text-sm text-red-600">{{ error }}</div>
        
        <button type="submit" :disabled="uploading || !selectedFile" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sectionId = route.params.id

const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const message = ref('')
const error = ref('')

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
  }
}

async function uploadFile() {
  if (!selectedFile.value) return
  uploading.value = true
  message.value = ''
  error.value = ''

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('sectionId', sectionId as string)

  try {
    await $fetch('/api/student/upload', {
      method: 'POST',
      body: formData
    })
    message.value = 'File uploaded successfully!'
    selectedFile.value = null
  } catch (e: any) {
    error.value = e.data?.message || 'Upload failed'
  } finally {
    uploading.value = false
  }
}
</script>
