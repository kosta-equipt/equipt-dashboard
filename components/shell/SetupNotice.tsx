import { AlertCircle } from 'lucide-react'

type SetupNoticeProps = {
  missingVar?: 'SHEET_ID' | 'OPS_SHEET_ID'
}

export function SetupNotice({ missingVar = 'SHEET_ID' }: SetupNoticeProps) {
  return (
    <div className="rounded-2xl border border-gold/40 bg-gold/10 p-6 text-sm text-ink dark:bg-gold/5 dark:text-linen">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
        <div className="space-y-2">
          <h2 className="font-display text-base font-semibold text-midnight dark:text-linen">
            Google Sheets not connected yet
          </h2>
          <p className="text-muted dark:text-muted-dark">
            This section needs three environment variables set in Vercel before it
            can pull live data:
          </p>
          <ul className="list-disc space-y-1 pl-5 text-muted">
            <li>
              <code className="rounded bg-white px-1.5 py-0.5 text-[11px]">
                {missingVar}
              </code>
            </li>
            <li>
              <code className="rounded bg-white px-1.5 py-0.5 text-[11px]">
                GOOGLE_SERVICE_ACCOUNT_EMAIL
              </code>
            </li>
            <li>
              <code className="rounded bg-white px-1.5 py-0.5 text-[11px]">
                GOOGLE_SERVICE_ACCOUNT_KEY
              </code>
            </li>
          </ul>
          <p className="text-muted">
            Make sure the underlying Google Sheet is shared with the service-account
            email as <span className="font-medium">Viewer</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
