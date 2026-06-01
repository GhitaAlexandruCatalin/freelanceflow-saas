'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from '@/app/auth.module.css'

export default function PasswordInput({ 
  name = "password", 
  placeholder = "••••••••",
  minLength = 6
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input 
        type={showPassword ? "text" : "password"} 
        id={name} 
        name={name} 
        className={styles.formInput} 
        placeholder={placeholder} 
        required 
        minLength={minLength}
        style={{ paddingRight: '40px' }}
      />
      <button 
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{ 
          position: 'absolute', 
          right: '12px', 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0
        }}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}
