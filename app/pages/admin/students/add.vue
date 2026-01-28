<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Add Student</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6 max-w-lg bg-white p-6 rounded shadow">
      <div>
        <label class="block text-sm font-medium text-gray-700">Student Number</label>
        <input v-model="form.studentNumber" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">First Name</label>
        <input v-model="form.firstname" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Middle Name</label>
        <input v-model="form.middlename" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Last Name</label>
        <input v-model="form.lastname" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="form.email" type="email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input v-model="form.password" type="password" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      
      <div v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</div>

      <div class="flex justify-end">
        <NuxtLink to="/admin/students" class="mr-4 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">Cancel</NuxtLink>
        <button type="submit" :disabled="loading" class="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  studentNumber: '',
  firstname: '',
  middlename: '',
  lastname: '',
  email: '',
  password: ''
})
const loading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/admin/students', {
      method: 'POST',
      body: form
    })
    navigateTo('/admin/students')
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Failed to create student'
  } finally {
    loading.value = false
  }
}
</script>
