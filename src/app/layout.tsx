import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import "./globals.css";

export const metadata: Metadata = {
  title: "FreelanceFlow — Invoice & Follow-up Automation for Freelancers",
  description:
    "Stop chasing payments. FreelanceFlow auto-generates invoices and AI-powered follow-up emails so you get paid faster. Built for freelancers, by freelancers.",
  keywords: [
    "invoice automation",
    "freelancer invoicing",
    "payment follow-up",
    "AI email automation",
    "freelance tools",
    "get paid faster",
  ],
  openGraph: {
    title: "FreelanceFlow — Get Paid Faster",
    description:
      "AI-powered invoice & payment follow-up automation for freelancers.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`../../messages/en.json`)).default;
  }

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
