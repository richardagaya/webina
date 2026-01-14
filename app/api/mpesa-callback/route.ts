import { NextResponse } from 'next/server'

// This is the URL M-Pesa should call after STK push completes.
// Point MPESA_CALLBACK_URL env var to your deployed URL for this route, e.g.:
//   https://your-domain.com/api/mpesa-callback

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    console.log('[mpesa-callback] Incoming callback body:', body)

    // TODO: here you can:
    // - Validate the callback
    // - Match it to a registration using CheckoutRequestID
    // - Mark registration as "paid" in your storage

    // M-Pesa expects a 200 OK with any JSON body
    return NextResponse.json(
      {
        ResultCode: 0,
        ResultDesc: 'Callback received successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[mpesa-callback] Error handling callback:', error)

    // Still respond 200 so M-Pesa does not keep retrying endlessly
    return NextResponse.json(
      {
        ResultCode: 0,
        ResultDesc: 'Callback received (internal error logged)',
      },
      { status: 200 }
    )
  }
}


