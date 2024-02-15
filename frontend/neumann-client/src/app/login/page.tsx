import LoginForm from '@/components/login/LoginForm'
import { ToastProvider } from '@/contexts/ToastContext'

export default function LoginPage() {
  return (
    <main className=''>
      <ToastProvider>
        <LoginForm />
      </ToastProvider>
    </main>
  )
}
