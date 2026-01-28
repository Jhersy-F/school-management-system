<template>
  <div>
    <form class="space-y-6" @submit.prevent="handleLogin">
      <div>
        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
        <select v-model="form.role" id="role" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label for="identifier" class="block text-sm font-medium text-gray-700">
          {{ form.role === 'student' ? 'Email or Student Number' : 'Username / Email' }}
        </label>
        <div class="mt-1">
          <input v-model="form.identifier" id="identifier" name="identifier" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1">
          <input v-model="form.password" id="password" name="password" type="password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
      </div>

      <div v-if="errorMsg" class="text-red-500 text-sm">
        {{ errorMsg }}
      </div>

      <div>
        <button type="submit" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account? 
        <NuxtLink v-if="form.role === 'instructor'" to="/auth/register/instructor" class="font-medium text-indigo-600 hover:text-indigo-500">Register as Instructor</NuxtLink>
        <NuxtLink v-else-if="form.role === 'student'" to="/auth/register/student" class="font-medium text-indigo-600 hover:text-indigo-500">Register as Student</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const auth = useAuthStore()
const form = reactive({
  identifier: '',
  password: '',
  role: 'student'
})
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(form.identifier, form.password, form.role)
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
