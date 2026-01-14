import { NextResponse } from 'next/server'
import { z } from 'zod'
import { initiateStkPush } from '@/lib/mpesa'
import { sendConfirmationEmail } from '@/lib/email'
import { saveRegistration } from '@/lib/storage'

const payloadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z
    .string()
    .min(10, 'Phone is required')
    .regex(/^[0-9+]+$/, 'Phone must be digits'),
  company: z.string().optional(),
  notes: z.string().optional(),
})

const FEE_AMOUNT = Number(process.env.WEBINAR_FEE ?? 10)

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const data = payloadSchema.parse(json)

    // 1) Save registration data to storage
    const registration = await saveRegistration({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      notes: data.notes,
    })

    // 2) trigger STK push
    const stk = await initiateStkPush({
      phoneNumber: data.phone,
      amount: FEE_AMOUNT,
      accountReference: 'Webinar Seat',
      description: 'Webinar registration fee',
    })

    // 3) send booking confirmation email
    await sendConfirmationEmail({
      to: data.email,
      name: data.name,
      phone: data.phone,
      company: data.company,
      registrationId: registration.id,
    })

    return NextResponse.json(
      {
        ok: true,
        message: stk.CustomerMessage ?? 'Registration successful',
        checkoutRequestId: stk.CheckoutRequestID,
        registrationId: registration.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[register] error', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: error.issues[0]?.message ?? 'Invalid data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { ok: false, error: (error as Error)?.message ?? 'Unexpected error' },
      { status: 500 }
    )
  }
}

