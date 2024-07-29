import LoginForm from '@/components/login/LoginForm'
import app from '@/text/app.json'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${app.login} | ${app.title}`,
}

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  )
}
