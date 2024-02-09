import SignupForm from '@/components/signup/SignupForm'
import { ToastProvider } from '@/contexts/ToastContext'

export default function SignupPage() {
  return (
    <main className=''>
      <ToastProvider>
        <SignupForm />
      </ToastProvider>
    </main>
  )
}
