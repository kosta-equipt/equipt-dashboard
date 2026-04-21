import 'server-only'
import { google, sheets_v4 } from 'googleapis'

export class SheetsConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SheetsConfigError'
  }
}

export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.SHEET_ID &&
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

function spreadsheetId(): string {
  const id = process.env.SHEET_ID
  if (!id) throw new SheetsConfigError('Missing SHEET_ID env var.')
  return id
}

export async function readRange(range: string): Promise<string[][]> {
  const sheets = buildClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId(),
    range,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  })

  const values = (res.data.values ?? []) as unknown[][]
  return values.map((row) => row.map((cell) => (cell == null ? '' : String(cell))))
}
