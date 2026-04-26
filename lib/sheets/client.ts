import 'server-only'
import { google, sheets_v4 } from 'googleapis'

export class SheetsConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SheetsConfigError'
  }
}

export type SheetKind = 'marketing' | 'ops'

const ENV_KEY: Record<SheetKind, string> = {
  marketing: 'SHEET_ID',
  ops: 'OPS_SHEET_ID',
}

export function isSheetsConfigured(kind: SheetKind = 'marketing'): boolean {
  return Boolean(
    process.env[ENV_KEY[kind]] &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  )
}

let cachedClient: sheets_v4.Sheets | null = null

function buildClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

  if (!email || !rawKey) {
    throw new SheetsConfigError(
      'Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_KEY env vars.',
    )
  }

  const key = rawKey.replace(/\\n/g, '\n')

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  cachedClient = google.sheets({ version: 'v4', auth })
  return cachedClient
}

function spreadsheetId(kind: SheetKind): string {
  const id = process.env[ENV_KEY[kind]]
  if (!id) throw new SheetsConfigError(`Missing ${ENV_KEY[kind]} env var.`)
  return id
}

export async function readRange(
  range: string,
  kind: SheetKind = 'marketing',
): Promise<string[][]> {
  const sheets = buildClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId(kind),
    range,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  })

  const values = (res.data.values ?? []) as unknown[][]
  return values.map((row) => row.map((cell) => (cell == null ? '' : String(cell))))
}

export async function listSheetTitles(
  kind: SheetKind = 'marketing',
): Promise<string[]> {
  const sheets = buildClient()
  const res = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId(kind),
    fields: 'sheets.properties.title',
  })
  const list = res.data.sheets ?? []
  return list
    .map((s) => s.properties?.title)
    .filter((t): t is string => typeof t === 'string')
}

export function spreadsheetUrl(kind: SheetKind): string {
  const id = process.env[ENV_KEY[kind]]
  if (!id) return ''
  return `https://docs.google.com/spreadsheets/d/${id}/edit`
}
