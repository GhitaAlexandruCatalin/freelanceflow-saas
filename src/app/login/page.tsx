import Link from 'next/link'
import { Zap } from 'lucide-react'
import styles from '../auth.module.css'
import { login } from '../auth/actions'
import PasswordInput from '@/components/PasswordInput'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string, message?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams.error;
  const message = resolvedSearchParams.message;

  return (
    <div className={styles.authContainer}>
      <Link href="/" className={styles.backLink}>
        ← Back to home
      </Link>
      
      <div className={styles.authBg}></div>
      
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authLogo}><Zap size={24} color="white" fill="white" /></div>
          <h1 className={styles.authTitle}>Welcome back</h1>
          <p className={styles.authSubtitle}>Enter your details to access your dashboard</p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            {error}
          </div>
        )}

        {message && (
          <div className={styles.successBox}>
            {message}
          </div>
        )}

        <form action={login} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className={styles.formInput} 
              placeholder="you@example.com" 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <PasswordInput name="password" placeholder="••••••••" />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            Log In
          </button>
        </form>

        <div className={styles.authFooter}>
          Don&apos;t have an account? <Link href="/register" className={styles.authLink}>Sign up</Link>
        </div>
      </div>
    </div>
  )
}
