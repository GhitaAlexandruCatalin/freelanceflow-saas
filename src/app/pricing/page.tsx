import Link from 'next/link'
import { Check, X, Sparkles, Zap, Shield } from 'lucide-react'
import styles from './pricing.module.css'

export default function PricingPage() {
  return (
    <div className={styles.pricingContainer}>
      <div className={styles.pricingHeader}>
        <span className={styles.badge}>Simple Pricing</span>
        <h1 className={styles.title}>Choose the plan that fits your workflow</h1>
        <p className={styles.subtitle}>Start free. Upgrade when you need the power of AI.</p>
      </div>

      <div className={styles.plansGrid}>
        {/* Free Plan */}
        <div className={styles.planCard}>
          <div className={styles.planHeader}>
            <h2 className={styles.planName}>Starter</h2>
            <div className={styles.planPrice}>
              <span className={styles.priceAmount}>$0</span>
              <span className={styles.pricePeriod}>/month</span>
            </div>
            <p className={styles.planDesc}>Perfect for getting started with invoicing</p>
          </div>

          <div className={styles.planFeatures}>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span>Up to 5 invoices per month</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span>Up to 3 clients</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span>PDF invoice generation</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span>Multi-currency support</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span>Client management</span>
            </div>
            <div className={`${styles.featureItem} ${styles.featureDisabled}`}>
              <X size={16} />
              <span>AI Follow-up Emails</span>
            </div>
            <div className={`${styles.featureItem} ${styles.featureDisabled}`}>
              <X size={16} />
              <span>Dispute Resolution AI</span>
            </div>
            <div className={`${styles.featureItem} ${styles.featureDisabled}`}>
              <X size={16} />
              <span>Direct email sending</span>
            </div>
          </div>

          <Link href="/register" className={styles.planButton}>
            Get Started Free
          </Link>
        </div>

        {/* Pro Plan */}
        <div className={`${styles.planCard} ${styles.planCardPro}`}>
          <div className={styles.popularBadge}>
            <Zap size={12} /> Most Popular
          </div>
          <div className={styles.planHeader}>
            <h2 className={styles.planName}>Professional</h2>
            <div className={styles.planPrice}>
              <span className={styles.priceAmount}>$9</span>
              <span className={styles.pricePeriod}>/month</span>
            </div>
            <p className={styles.planDesc}>Everything you need to get paid on time</p>
          </div>

          <div className={styles.planFeatures}>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span><strong>Unlimited</strong> invoices</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span><strong>Unlimited</strong> clients</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span>PDF invoice generation</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span>Multi-currency support</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheck} />
              <span>Client management</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheckPro} />
              <span><strong>AI Follow-up Emails</strong> — tone auto-adjusts</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheckPro} />
              <span><strong>Dispute Resolution AI</strong> — de-escalating</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheckPro} />
              <span><strong>Direct email sending</strong> with PDF attached</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureCheckPro} />
              <span><strong>8 languages</strong> supported</span>
            </div>
          </div>

          <Link href="/register" className={`${styles.planButton} ${styles.planButtonPro}`}>
            <Sparkles size={16} />
            Start Pro Trial
          </Link>
        </div>
      </div>

      {/* Trust badges */}
      <div className={styles.trustSection}>
        <div className={styles.trustItem}>
          <Shield size={20} />
          <span>Secure payments via Stripe</span>
        </div>
        <div className={styles.trustItem}>
          <Zap size={20} />
          <span>Cancel anytime, no lock-in</span>
        </div>
      </div>
    </div>
  )
}
