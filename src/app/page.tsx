import Link from "next/link";
import { Zap, FileText, Bot, Clock, PieChart, CreditCard, TrendingUp, Smile, Handshake, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <>
      {/* ========== NAVBAR ========== */}
      <nav className={styles.navbar} id="navbar">
        <div className={styles.navInner}>
          <a href="/" className={styles.navLogo}>
            <span className={styles.navLogoIcon}><Zap size={18} color="white" fill="white" /></span>
            <span>Freelance<span className="gradient-text">Flow</span></span>
          </a>

          <ul className={styles.navLinks}>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How it Works</a></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>

          <div className={styles.navActions}>
            <Link href="/login" className={styles.navLogin} id="nav-login-btn">Log In</Link>
            <Link href="/register" className="btn btn-primary" id="nav-cta-btn">Start Free Trial</Link>
          </div>

          <button className={styles.mobileMenuBtn} id="mobile-menu-btn" aria-label="Toggle menu">
            ☰
          </button>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBg}>
          <div className={styles.heroGrid}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot}></span>
            Now in public beta — Try free for 14 days
          </div>

          <h1 className={styles.heroTitle}>
            Stop Chasing Payments.
            <br />
            <span className="gradient-text">Get Paid Faster.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            AI-powered invoicing and smart follow-up emails that automatically
            escalate from friendly to firm — so you don&apos;t have to.
          </p>

          <div className={styles.heroActions}>
            <Link href="/register" className="btn btn-primary btn-lg" id="hero-cta-btn">
              Start Free Trial →
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg" id="hero-demo-btn">
              See How It Works
            </a>
          </div>

          <div className={styles.heroSocialProof}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>2.5x</div>
              <div className={styles.heroStatLabel}>Faster payments</div>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>85%</div>
              <div className={styles.heroStatLabel}>Collection rate</div>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>4hrs</div>
              <div className={styles.heroStatLabel}>Saved per week</div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className={styles.heroPreview}>
            <div className={styles.previewWindow}>
              <div className={styles.previewTopbar}>
                <span className={`${styles.previewDot} ${styles.previewDotRed}`}></span>
                <span className={`${styles.previewDot} ${styles.previewDotYellow}`}></span>
                <span className={`${styles.previewDot} ${styles.previewDotGreen}`}></span>
                <span className={styles.previewUrl}>app.freelanceflow.io/dashboard</span>
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewStatsRow}>
                  <div className={styles.previewStatCard}>
                    <div className={styles.previewStatCardLabel}>Outstanding</div>
                    <div className={`${styles.previewStatCardValue} ${styles.yellow}`}>$4,280</div>
                  </div>
                  <div className={styles.previewStatCard}>
                    <div className={styles.previewStatCardLabel}>Overdue</div>
                    <div className={`${styles.previewStatCardValue} ${styles.red}`}>$1,650</div>
                  </div>
                  <div className={styles.previewStatCard}>
                    <div className={styles.previewStatCardLabel}>Paid (June)</div>
                    <div className={`${styles.previewStatCardValue} ${styles.green}`}>$8,920</div>
                  </div>
                  <div className={styles.previewStatCard}>
                    <div className={styles.previewStatCardLabel}>Clients</div>
                    <div className={`${styles.previewStatCardValue} ${styles.blue}`}>12</div>
                  </div>
                </div>
                <table className={styles.previewTable}>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Invoice</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Acme Corp</td>
                      <td>#INV-042</td>
                      <td style={{ fontWeight: 600 }}>$2,400</td>
                      <td>
                        <span className={`${styles.previewStatus} ${styles.overdue}`}>
                          ● Overdue
                        </span>
                      </td>
                      <td style={{ color: 'var(--accent-primary)' }}>AI follow-up sent</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>StartupXYZ</td>
                      <td>#INV-041</td>
                      <td style={{ fontWeight: 600 }}>$1,880</td>
                      <td>
                        <span className={`${styles.previewStatus} ${styles.sent}`}>
                          ● Sent
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>Due in 5 days</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>DesignLab</td>
                      <td>#INV-040</td>
                      <td style={{ fontWeight: 600 }}>$3,200</td>
                      <td>
                        <span className={`${styles.previewStatus} ${styles.paid}`}>
                          ● Paid
                        </span>
                      </td>
                      <td style={{ color: 'var(--accent-green)' }}>✓ Collected</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.previewGlow}></div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className={styles.features} id="features">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>✦ Features</div>
          <h2 className={styles.sectionTitle}>
            Everything you need to
            <br />
            <span className="gradient-text">get paid on time</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From creating invoices to collecting payments, FreelanceFlow handles the entire workflow so you can focus on your craft.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={`glass-card ${styles.featureCard}`}>
            <div className={`${styles.featureIcon} ${styles.purple}`}><FileText /></div>
            <h3 className={styles.featureTitle}>Quick Invoice Builder</h3>
            <p className={styles.featureDesc}>
              Create professional invoices in under 60 seconds. Auto-fill client details, add line items, and send instantly.
            </p>
          </div>

          <div className={`glass-card ${styles.featureCard}`}>
            <div className={`${styles.featureIcon} ${styles.pink}`}><Bot /></div>
            <h3 className={styles.featureTitle}>AI Follow-up Emails</h3>
            <p className={styles.featureDesc}>
              Claude AI generates perfectly-toned follow-up emails that escalate naturally — from friendly reminder to final notice.
            </p>
          </div>

          <div className={`glass-card ${styles.featureCard}`}>
            <div className={`${styles.featureIcon} ${styles.green}`}><Clock /></div>
            <h3 className={styles.featureTitle}>Smart Reminders</h3>
            <p className={styles.featureDesc}>
              Automatic reminders triggered by your rules. Set it once and never manually chase a payment again.
            </p>
          </div>

          <div className={`glass-card ${styles.featureCard}`}>
            <div className={`${styles.featureIcon} ${styles.yellow}`}><PieChart /></div>
            <h3 className={styles.featureTitle}>Payment Dashboard</h3>
            <p className={styles.featureDesc}>
              See exactly who owes you what, at a glance. Track outstanding invoices, overdue amounts, and collection progress.
            </p>
          </div>

          <div className={`glass-card ${styles.featureCard}`}>
            <div className={`${styles.featureIcon} ${styles.cyan}`}><CreditCard /></div>
            <h3 className={styles.featureTitle}>Online Payments</h3>
            <p className={styles.featureDesc}>
              Clients pay directly from the invoice via Stripe. Accept cards, bank transfers, and more with zero setup.
            </p>
          </div>

          <div className={`glass-card ${styles.featureCard}`}>
            <div className={`${styles.featureIcon} ${styles.red}`}><TrendingUp /></div>
            <h3 className={styles.featureTitle}>Revenue Analytics</h3>
            <p className={styles.featureDesc}>
              Track your monthly revenue, average payment time, and identify slow-paying clients with detailed insights.
            </p>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>✦ How It Works</div>
          <h2 className={styles.sectionTitle}>
            Four steps to
            <br />
            <span className="gradient-text">effortless payments</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Set up in minutes, get paid for months. Here&apos;s how FreelanceFlow works.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Create Invoice</h3>
            <p className={styles.stepDesc}>
              Build a professional invoice in seconds. Add your client, line items, and payment terms.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Send & Track</h3>
            <p className={styles.stepDesc}>
              Send invoices via email with one click. Track when they&apos;re opened and viewed.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>AI Follow-ups</h3>
            <p className={styles.stepDesc}>
              If payment is late, AI generates and sends perfectly-toned follow-up emails automatically.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3 className={styles.stepTitle}>Get Paid</h3>
            <p className={styles.stepDesc}>
              Clients pay online directly from the invoice. Money hits your account instantly.
            </p>
          </div>
        </div>
      </section>

      {/* ========== AI DEMO ========== */}
      <section className={styles.aiDemo} id="ai-demo">
        <div className={styles.aiDemoContainer}>
          <div className={styles.aiDemoContent}>
            <div className={styles.sectionEyebrow}>✦ AI-Powered</div>
            <h2 className={styles.sectionTitle}>
              The perfect tone,
              <br />
              <span className="gradient-text">every time</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Our AI analyzes the context and writes follow-up emails that maintain your professional relationships while getting you paid.
            </p>

            <ul className={styles.aiToneList}>
              <li className={styles.aiToneItem}>
                <span className={styles.aiToneEmoji}><Smile color="var(--accent-green)" /></span>
                <div>
                  <div className={styles.aiToneLabel}>Friendly Reminder</div>
                  <div className={styles.aiToneDay}>Day 1 after due date</div>
                </div>
              </li>
              <li className={styles.aiToneItem}>
                <span className={styles.aiToneEmoji}><Handshake color="var(--accent-primary)" /></span>
                <div>
                  <div className={styles.aiToneLabel}>Professional & Firm</div>
                  <div className={styles.aiToneDay}>Day 7 after due date</div>
                </div>
              </li>
              <li className={styles.aiToneItem}>
                <span className={styles.aiToneEmoji}><AlertTriangle color="var(--accent-yellow)" /></span>
                <div>
                  <div className={styles.aiToneLabel}>Urgent Notice</div>
                  <div className={styles.aiToneDay}>Day 14 after due date</div>
                </div>
              </li>
              <li className={styles.aiToneItem}>
                <span className={styles.aiToneEmoji}><ShieldAlert color="var(--accent-red)" /></span>
                <div>
                  <div className={styles.aiToneLabel}>Final Warning</div>
                  <div className={styles.aiToneDay}>Day 30 after due date</div>
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.aiDemoVisual}>
            <div className={styles.aiEmailPreview}>
              <div className={styles.aiEmailHeader}>
                <div className={styles.aiEmailMeta}>
                  <span><strong>From:</strong> you@yourbusiness.com</span>
                  <span><strong>To:</strong> billing@acmecorp.com</span>
                </div>
                <div className={styles.aiEmailSubject}>
                  Friendly reminder: Invoice #INV-042 is past due
                </div>
              </div>
              <div className={styles.aiEmailBody}>
                <p>Hi Sarah,</p>
                <br />
                <p>
                  I hope you&apos;re having a great week! I wanted to quickly follow up on
                  Invoice #INV-042 for $2,400, which was due on May 25th.
                </p>
                <br />
                <p>
                  I completely understand that things can get busy — just wanted to make
                  sure this didn&apos;t slip through the cracks. If you&apos;ve already sent the
                  payment, please disregard this message!
                </p>
                <br />
                <p>
                  You can pay directly online here: <span style={{color: 'var(--accent-primary)', textDecoration: 'underline'}}>Pay Invoice →</span>
                </p>
                <br />
                <p>Best regards,<br />Alex</p>

                <div className={styles.aiBadge}>
                  <span className={styles.aiSparkle}><Sparkles size={14} /></span>
                  Generated by AI · Friendly tone
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section className={styles.pricing} id="pricing">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>✦ Pricing</div>
          <h2 className={styles.sectionTitle}>
            Simple pricing,
            <br />
            <span className="gradient-text">serious results</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Start free, upgrade when you&apos;re ready. All plans include a 14-day free trial.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          {/* Free */}
          <div className={`glass-card ${styles.pricingCard}`}>
            <div className={styles.pricingName}>Starter</div>
            <div className={styles.pricingDesc}>Perfect to try it out</div>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>$</span>
              <span className={styles.pricingAmount}>0</span>
              <span className={styles.pricingPeriod}>/forever</span>
            </div>
            <ul className={styles.pricingFeatures}>
              <li><span className="check">✓</span> 3 active clients</li>
              <li><span className="check">✓</span> 5 invoices/month</li>
              <li><span className="check">✓</span> Basic dashboard</li>
              <li><span className="check">✓</span> Manual follow-ups</li>
              <li><span className="cross">✗</span> AI follow-up emails</li>
              <li><span className="cross">✗</span> Auto reminders</li>
            </ul>
            <Link href="/register" className={`btn btn-secondary ${styles.pricingBtn}`} id="pricing-starter-btn">
              Get Started Free
            </Link>
          </div>

          {/* Pro — Featured */}
          <div className={`glass-card ${styles.pricingCard} ${styles.featured}`}>
            <div className={styles.pricingPopular}>Most Popular</div>
            <div className={styles.pricingName}>Professional</div>
            <div className={styles.pricingDesc}>For active freelancers</div>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>$</span>
              <span className={styles.pricingAmount}>9</span>
              <span className={styles.pricingPeriod}>/month</span>
            </div>
            <ul className={styles.pricingFeatures}>
              <li><span className="check">✓</span> 25 active clients</li>
              <li><span className="check">✓</span> Unlimited invoices</li>
              <li><span className="check">✓</span> Full dashboard + analytics</li>
              <li><span className="check">✓</span> AI follow-up emails</li>
              <li><span className="check">✓</span> Auto reminders</li>
              <li><span className="check">✓</span> Online payments (Stripe)</li>
            </ul>
            <Link href="/register" className={`btn btn-primary ${styles.pricingBtn}`} id="pricing-pro-btn">
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Business */}
          <div className={`glass-card ${styles.pricingCard}`}>
            <div className={styles.pricingName}>Business</div>
            <div className={styles.pricingDesc}>For growing freelancers</div>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>$</span>
              <span className={styles.pricingAmount}>19</span>
              <span className={styles.pricingPeriod}>/month</span>
            </div>
            <ul className={styles.pricingFeatures}>
              <li><span className="check">✓</span> Unlimited clients</li>
              <li><span className="check">✓</span> Unlimited invoices</li>
              <li><span className="check">✓</span> Advanced analytics</li>
              <li><span className="check">✓</span> Priority AI follow-ups</li>
              <li><span className="check">✓</span> Custom email templates</li>
              <li><span className="check">✓</span> Priority support</li>
            </ul>
            <Link href="/register" className={`btn btn-secondary ${styles.pricingBtn}`} id="pricing-business-btn">
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className={styles.testimonials} id="testimonials">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>✦ Testimonials</div>
          <h2 className={styles.sectionTitle}>
            Loved by
            <br />
            <span className="gradient-text">freelancers worldwide</span>
          </h2>
        </div>

        <div className={styles.testimonialsGrid}>
          <div className={`glass-card ${styles.testimonialCard}`}>
            <div className={styles.testimonialStars}>★★★★★</div>
            <p className={styles.testimonialText}>
              &ldquo;I used to spend hours every week chasing payments. FreelanceFlow cut that down to zero. 
              The AI follow-ups are incredibly professional — my clients actually compliment them.&rdquo;
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>JM</div>
              <div>
                <div className={styles.testimonialName}>Jake Morrison</div>
                <div className={styles.testimonialRole}>Freelance Designer</div>
              </div>
            </div>
          </div>

          <div className={`glass-card ${styles.testimonialCard}`}>
            <div className={styles.testimonialStars}>★★★★★</div>
            <p className={styles.testimonialText}>
              &ldquo;The progressive tone feature is genius. It starts sweet and gets firm automatically. 
              I&apos;ve collected $12K in overdue payments since I started using it two months ago.&rdquo;
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>SR</div>
              <div>
                <div className={styles.testimonialName}>Sarah Rivera</div>
                <div className={styles.testimonialRole}>Web Developer</div>
              </div>
            </div>
          </div>

          <div className={`glass-card ${styles.testimonialCard}`}>
            <div className={styles.testimonialStars}>★★★★★</div>
            <p className={styles.testimonialText}>
              &ldquo;Finally, an invoicing tool that doesn&apos;t look like it was designed in 2005. 
              Clean, fast, and the AI emails actually sound like me. Worth every penny.&rdquo;
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>DK</div>
              <div>
                <div className={styles.testimonialName}>David Kim</div>
                <div className={styles.testimonialRole}>Copywriter</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className={styles.cta} id="cta">
        <div className={styles.ctaContainer}>
          <div className={styles.ctaBgGlow}></div>
          <h2 className={styles.ctaTitle}>
            Ready to get paid
            <br />
            <span className="gradient-text">without the chase?</span>
          </h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of freelancers who stopped chasing payments
            and started getting paid on time.
          </p>
          <Link href="/register" className="btn btn-primary btn-lg" id="cta-final-btn">
            Start Your Free Trial →
          </Link>
          <p className={styles.ctaNote}>
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className={styles.footer} id="footer">
        <div className={styles.footerInner}>
          <div>
            <div className={styles.navLogo} style={{fontSize: '1.25rem'}}>
              <span className={styles.navLogoIcon}><Zap size={18} color="white" fill="white" /></span>
              <span>Freelance<span className="gradient-text">Flow</span></span>
            </div>
            <p className={styles.footerBrandDesc}>
              AI-powered invoice and payment follow-up automation for freelancers. Get paid faster, stress less.
            </p>
          </div>

          <div>
            <h4 className={styles.footerHeading}>Product</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#how-it-works">How it Works</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>


          <div>
            <h4 className={styles.footerHeading}>Legal</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} FreelanceFlow. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}
