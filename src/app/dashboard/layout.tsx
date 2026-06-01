import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { LayoutDashboard, Users, FileText, Settings, LogOut, Zap } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import styles from './layout.module.css'
import { logout } from '../auth/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  const t = await getTranslations({ locale, namespace: 'Navigation' })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name || 'Freelancer'
  const initials = fullName.substring(0, 2).toUpperCase()

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.sidebarLogo}>
            <div className={styles.sidebarLogoIcon}>
              <Zap size={16} color="white" fill="white" />
            </div>
            <span>Freelance<span className="gradient-text">Flow</span></span>
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          <Link href="/dashboard" className={`${styles.navItem} ${styles.navItemActive}`}>
            <span className={styles.navItemIcon}><LayoutDashboard size={20} /></span>
            {t('dashboard')}
          </Link>
          <Link href="/dashboard/invoices" className={styles.navItem}>
            <span className={styles.navItemIcon}><FileText size={20} /></span>
            {t('invoices')}
          </Link>
          <Link href="/dashboard/clients" className={styles.navItem}>
            <span className={styles.navItemIcon}><Users size={20} /></span>
            {t('clients')}
          </Link>
          <Link href="/dashboard/settings" className={styles.navItem}>
            <span className={styles.navItemIcon}><Settings size={20} /></span>
            {t('settings')}
          </Link>
        </nav>

        <LanguageSwitcher currentLocale={locale} />

        <div className={styles.sidebarFooter}>
          <form action={logout}>
            <button type="submit" className={styles.logoutBtn}>
              <span className={styles.navItemIcon}><LogOut size={20} /></span>
              {t('logout')}
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <h1 className={styles.topbarTitle}>Dashboard</h1>
          
          <div className={styles.userProfile}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{fullName}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
            <div className={styles.userAvatar}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  )
}
