<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Profile Settings</h2>
    <form @submit.prevent="updateProfile" class="max-w-lg bg-white p-6 rounded shadow space-y-6">
      
      <div v-if="auth.user?.role !== 'admin'">
        <label class="block text-sm font-medium text-gray-700">First Name</label>
        <input v-model="form.firstname" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
      </div>
       <div v-if="auth.user?.role !== 'admin'">
        <label class="block text-sm font-medium text-gray-700">Last Name</label>
        <input v-model="form.lastname" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
        <input v-model="form.password" type="password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
      </div>

      <div v-if="msg" class="text-green-600 text-sm">{{ msg }}</div>
      <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

      <button type="submit" :disabled="loading" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
        {{ loading ? 'Updating...' : 'Update Profile' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ref } from 'vue'



import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const form = reactive({
  firstname: auth.user?.firstname || '',
  lastname: auth.user?.lastname || '',
  password: ''
})
const loading = ref(false)
const msg = ref('')
const error = ref('')

async function updateProfile() {
  loading.value = true
  msg.value = ''
  error.value = ''
  try {
    await $fetch('/api/profile', {
      method: 'PUT',
      body: form
    })
    msg.value = 'Profile updated successfully'
    auth.fetchUser() // Refresh user data
  } catch (e: any) {
    error.value = e.data?.message || 'Update failed'
  } finally {
    loading.value = false
  }
}
</script>
