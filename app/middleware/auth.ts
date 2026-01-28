export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await useFetch('/api/auth/session')
  const user = data.value?.user

  if (!user && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }
})
