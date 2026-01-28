<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Student Registration</h2>
    <form @submit.prevent="register" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Student Number</label>
        <input v-model="form.studentNumber" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">First Name</label>
        <input v-model="form.firstname" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Middle Name</label>
        <input v-model="form.middlename" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Last Name</label>
        <input v-model="form.lastname" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="form.email" type="email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input v-model="form.password" type="password" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
      </div>

      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

      <button type="submit" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>

      <div class="text-center mt-4">
        <NuxtLink to="/auth/login" class="text-indigo-600 hover:text-indigo-500">Back to Login</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const form = reactive({
  studentNumber: '',
  firstname: '',
  middlename: '',
  lastname: '',
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

async function register() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { ...form, role: 'student' }
    })
    navigateTo('/auth/login')
  } catch (e: any) {
    error.value = e.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
