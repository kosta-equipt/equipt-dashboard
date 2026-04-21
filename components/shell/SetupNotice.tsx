import { AlertCircle } from 'lucide-react'

export function SetupNotice() {
  return (
    <div className="rounded-2xl border border-gold/40 bg-gold/10 p-6 text-sm text-ink">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
        <div className="space-y-2">
          <h2 className="font-display text-base font-semibold text-midnight">
            Google Sheets not connected yet
          </h2>
          <p className="text-muted">
            The dashboard is deployed but needs three environment variables set in
            Vercel before it can pull live data:
          </p>
          <ul className="list-disc space-y-1 pl-5 text-muted">
            <li>
              <code className="rounded bg-white px-1.5 py-0.5 text-[11px]">
                SHEET_ID
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
            See <code className="rounded bg-white px-1.5 py-0.5 text-[11px]">SETUP.md</code> in the repo for the full walkthrough.
          </p>
        </div>
      </div>
    </div>
  )
}
