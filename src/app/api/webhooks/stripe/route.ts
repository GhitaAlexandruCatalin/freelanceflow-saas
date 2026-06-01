import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// We need a Service Role key to bypass RLS in the webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') as string

    let event: Stripe.Event

    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
      }
    } else {
      // Allow testing without webhook secret if not provided
      event = JSON.parse(body)
    }

    const session = event.data.object as any

    switch (event.type) {
      case 'checkout.session.completed': {
        if (session.mode === 'subscription') {
          const customerId = session.customer as string
          const subscriptionId = session.subscription as string
          
          // Determine the plan based on the product or amount
          // In a real app, you'd map Stripe Product ID to your 'pro' or 'business' tier
          // For now, we'll set it to 'pro' when any subscription is purchased
          const planTier = 'pro'

          await supabaseAdmin
            .from('profiles')
            .update({
              stripe_subscription_id: subscriptionId,
              plan_tier: planTier,
              subscription_status: 'active'
            })
            .eq('stripe_customer_id', customerId)
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const customerId = session.customer as string
        const subscriptionId = session.id as string
        const status = session.status

        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: status
          })
          .eq('stripe_subscription_id', subscriptionId)
        break
      }

      case 'customer.subscription.deleted': {
        const customerId = session.customer as string
        const subscriptionId = session.id as string

        // Revert to free tier when subscription is canceled/deleted
        await supabaseAdmin
          .from('profiles')
          .update({
            plan_tier: 'free',
            subscription_status: 'canceled'
          })
          .eq('stripe_subscription_id', subscriptionId)
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new NextResponse('Webhook processed successfully', { status: 200 })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
