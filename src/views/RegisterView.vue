<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthForm from '../components/AuthForm.vue'
import FormField from '../components/FormField.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true
  try {
    await authStore.register({ name: name.value, email: email.value, password: password.value })
    router.push('/trips')
  } catch (err: any) {
    errorMessage.value = err.response?.data?.detail || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthForm
    title="Sign up"
    subtitle="Start planning your next adventure"
    :error-message="errorMessage"
    :loading="loading"
    @submit="handleSubmit"
  >
    <FormField v-model="name" label="Name" />
    <FormField v-model="email" label="Email" type="email" />
    <FormField v-model="password" label="Password" type="password" />

    <template #footer>
      Already have an account? <RouterLink to="/login">Log in</RouterLink>
    </template>
  </AuthForm>
</template>