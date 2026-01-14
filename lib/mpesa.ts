import crypto from 'node:crypto'

const MPESA_BASE_URL = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke'

type StkPushRequest = {
  phoneNumber: string
  amount: number
  accountReference?: string
  description?: string
}

type StkResponse = {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY
  const secret = process.env.MPESA_CONSUMER_SECRET

  if (!key || !secret) {
    throw new Error('Missing MPESA consumer credentials')
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64')
  const res = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to get access token: ${text}`)
  }

  const data = await res.json()
  return data.access_token as string
}

export async function initiateStkPush(
  payload: StkPushRequest
): Promise<StkResponse> {
  const {
    MPESA_SHORTCODE,
    MPESA_PASSKEY,
    MPESA_CALLBACK_URL,
  } = process.env

  if (!MPESA_SHORTCODE || !MPESA_PASSKEY || !MPESA_CALLBACK_URL) {
    throw new Error('Missing MPESA STK configuration')
  }

  const accessToken = await getAccessToken()

  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14)

  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString(
    'base64'
  )

  const body = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: payload.amount,
    PartyA: payload.phoneNumber,
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: payload.phoneNumber,
    CallBackURL: MPESA_CALLBACK_URL,
    AccountReference: payload.accountReference ?? 'Webinar',
    TransactionDesc: payload.description ?? 'Webinar registration',
  }

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`STK push failed: ${text}`)
  }

  return (await res.json()) as StkResponse
}

