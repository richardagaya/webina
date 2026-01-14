import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

export interface Registration {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  notes?: string
  registeredAt: string
}

// In serverless environments (Vercel, AWS Lambda), use /tmp
// In local development, use the data directory
// 
// ⚠️ WARNING: /tmp is ephemeral - data may be lost when function containers recycle.
// For production, consider migrating to a database (Vercel KV, Postgres, MongoDB, etc.)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
const DATA_DIR = isServerless 
  ? path.join(os.tmpdir(), 'webinar-data')
  : path.join(process.cwd(), 'data')
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json')

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function readRegistrations(): Promise<Registration[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(REGISTRATIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeRegistrations(registrations: Registration[]) {
  await ensureDataDir()
  await fs.writeFile(
    REGISTRATIONS_FILE,
    JSON.stringify(registrations, null, 2),
    'utf-8'
  )
}

export async function saveRegistration(
  data: Omit<Registration, 'id' | 'registeredAt'>
): Promise<Registration> {
  const registrations = await readRegistrations()
  const registration: Registration = {
    ...data,
    id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    registeredAt: new Date().toISOString(),
  }
  registrations.push(registration)
  await writeRegistrations(registrations)
  return registration
}

export async function getRegistrations(): Promise<Registration[]> {
  return readRegistrations()
}

