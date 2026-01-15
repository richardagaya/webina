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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animate-delay-200"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animate-delay-400"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="flex flex-col gap-12 md:gap-16">
          {/* Header Section */}
          <header className="text-center space-y-8 animate-fade-in">
            <div className="relative mx-auto h-56 md:h-72 w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-white/50 bg-white/50 shadow-2xl backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
              <Image
                src="/poster.jpg"
                alt="Webinar poster"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            <div className="space-y-6 animate-fade-in-up animate-delay-100">
              <Badge className="mx-auto w-fit bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base px-6 py-2 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                Webinar Registration
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-up animate-delay-200">
                Register for the Webinar
              </h1>
              
              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-700 leading-relaxed font-medium animate-fade-in-up animate-delay-300">
                Share your details below to reserve your seat. We'll send the
                webinar link and reminders straight to your email.
              </p>
            </div>
          </header>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto w-full animate-scale-in animate-delay-400">
            <Card className="border-2 border-white/50 shadow-2xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
              <CardHeader className="pb-6 pt-8 px-8 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10">
                <CardTitle className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Registration Form
                </CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Enter your information and we'll email you the webinar details.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-3 transform transition-all duration-300 hover:scale-[1.01]">
                    <Label htmlFor="name" className="text-lg font-semibold text-slate-800">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jane Doe"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="h-14 text-lg px-4 border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="grid gap-3 transform transition-all duration-300 hover:scale-[1.01]">
                    <Label htmlFor="email" className="text-lg font-semibold text-slate-800">
                      Work Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="h-14 text-lg px-4 border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="grid gap-3 transform transition-all duration-300 hover:scale-[1.01]">
                    <Label htmlFor="company" className="text-lg font-semibold text-slate-800">
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Acme Inc."
                      value={form.company}
                      onChange={handleChange}
                      className="h-14 text-lg px-4 border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="grid gap-3 transform transition-all duration-300 hover:scale-[1.01]">
                    <Label htmlFor="notes" className="text-lg font-semibold text-slate-800">
                      What would you like us to cover in the webinar?
                    </Label>
                    <textarea
                      id="notes"
                      name="notes"
                      placeholder="Share any questions, topics, or context you'd like the session to focus on..."
                      value={form.notes}
                      onChange={handleChange}
                      className="min-h-[120px] w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 resize-none"
                    />
                  </div>
                  
                  <div className="grid gap-3 transform transition-all duration-300 hover:scale-[1.01]">
                    <Label htmlFor="phone" className="text-lg font-semibold text-slate-800">
                      M-Pesa Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="07XXXXXXXX or your preferred contact number"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="h-14 text-lg px-4 border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    />
                    <p className="text-base text-slate-600 mt-1">
                      We'll use this if we need to reach you for any updates.
                    </p>
                  </div>

                  {serverMessage && (
                    <div
                      className={`rounded-xl border-2 px-5 py-4 text-lg font-medium transform transition-all duration-500 animate-scale-in ${
                        phase === 'error'
                          ? 'border-red-300 bg-red-50 text-red-800 shadow-lg'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800 shadow-lg'
                      }`}
                    >
                      {serverMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-16 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl"
                    disabled={phase === 'paying'}
                  >
                    {phase === 'paying' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5 mr-2" />
                        Register Now
                      </>
                    )}
                  </Button>
                  
                  <p className="text-base text-slate-600 text-center font-medium">
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

