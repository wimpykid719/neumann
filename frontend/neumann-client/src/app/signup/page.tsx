import SignupForm from '@/components/signup/SignupForm'
import app from '@/text/app.json'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${app.signup} | ${app.title}`,
}

export default function SignupPage() {
  return (
    <main>
      <SignupForm />
    </main>
  )
}
