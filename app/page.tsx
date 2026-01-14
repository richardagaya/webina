'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  BadgeCheck,
  CreditCard,
  Loader2,
  Mail,
  Smartphone,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Phase = 'idle' | 'paying' | 'success' | 'error'

type RegisterResponse = {
  ok: boolean
  message?: string
  error?: string
}

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    notes: '',
  })
  const [phase, setPhase] = useState<Phase>('idle')
  const [serverMessage, setServerMessage] = useState<string | null>(null)

  const fee = useMemo(() => Number(process.env.NEXT_PUBLIC_FEE ?? 10), [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setServerMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPhase('paying')
    setServerMessage(null)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as RegisterResponse
      if (!data.ok) {
        throw new Error(data.error || 'Payment failed')
      }
      setPhase('success')
      setServerMessage(
        data.message ||
          'Registration successful! Check your email for booking confirmation.'
      )
    } catch (err) {
      setPhase('error')
      setServerMessage(
        (err as Error).message || 'Something went wrong. Try again.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white text-slate-900">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="flex flex-col gap-8">
          <header className="text-center space-y-6">
            <div className="relative mx-auto h-40 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <Image
                src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg"
                alt="People attending an online webinar"
                fill
                className="object-cover"
                priority
              />
            </div>
            <Badge className="mx-auto w-fit bg-slate-900 text-white">
              <Sparkles className="h-4 w-4" />
              Webinar registration
            </Badge>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Register for the webinar
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              Share your details below to reserve your seat. We’ll send the
              webinar link and reminders straight to your email.
            </p>
          </header>

          <div className="max-w-xl mx-auto">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">
                  Registration form
                </CardTitle>
                <CardDescription>
                  Enter your information and we’ll email you the webinar details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jane Doe"
                      required
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Work email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Acme Inc."
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">
                      What would you like us to cover in the webinar?
                    </Label>
                    <textarea
                      id="notes"
                      name="notes"
                      placeholder="Share any questions, topics, or context you'd like the session to focus on..."
                      value={form.notes}
                      onChange={handleChange}
                      className="min-h-[96px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">M-Pesa phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="07XXXXXXXX or your preferred contact number"
                      required
                      value={form.phone}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      We’ll use this if we need to reach you for any updates.
                    </p>
                  </div>

                  {serverMessage && (
                    <div
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        phase === 'error'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {serverMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={phase === 'paying'}
                  >
                    {phase === 'paying' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Register
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    We respect your privacy and will only contact you about this webinar.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

