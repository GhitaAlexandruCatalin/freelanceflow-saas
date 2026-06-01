import Link from 'next/link'
import { Zap } from 'lucide-react'
import styles from '../auth.module.css'
import { signup } from '../auth/actions'
import PasswordInput from '@/components/PasswordInput'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams.error;

  return (
    <div className={styles.authContainer}>
      <Link href="/" className={styles.backLink}>
        ← Back to home
      </Link>
      
      <div className={styles.authBg}></div>
      
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authLogo}><Zap size={24} color="white" fill="white" /></div>
          <h1 className={styles.authTitle}>Create an account</h1>
          <p className={styles.authSubtitle}>Start getting paid faster today</p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            {error}
          </div>
        )}

        <form action={signup} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="full_name">Full Name</label>
            <input 
              type="text" 
              id="full_name" 
              name="full_name" 
              className={styles.formInput} 
              placeholder="Alex Smith" 
              required 
            />
          </div>

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
            <PasswordInput name="password" placeholder="••••••••" minLength={6} />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            Start Free Trial
          </button>
        </form>

        <div className={styles.authFooter}>
          Already have an account? <Link href="/login" className={styles.authLink}>Log in</Link>
        </div>
      </div>
    </div>
  )
}
