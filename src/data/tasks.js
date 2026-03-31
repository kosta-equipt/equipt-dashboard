// ─────────────────────────────────────────────
// EQUIPT DASHBOARD — Hardcoded Task Data
// All content lives here. Do not fetch from any API.
// ─────────────────────────────────────────────

export const TABS = [
  { id: 'day1',   label: 'Day 1 Agenda',     accentColor: '#C9A84C' },
  { id: 'week1',  label: 'Week 1 Content',   accentColor: '#1A3A6B' },
  { id: 'email',  label: 'Email Actions',    accentColor: '#8B1A1A' },
  { id: 'tools',  label: 'Tools & Access',   accentColor: '#006039' },
  { id: 'drive',  label: 'Drive Quick Links',accentColor: '#A8893D' },
]

// ─── Tab 1: Day 1 Agenda ────────────────────
export const day1Tasks = [
  {
    id: 'd1_01',
    label: 'Meet Ivan Kruger & Yazan Hammad',
    note: 'Introductions with Managing Partner and Head of Sales & Ops. Get the lay of the land.',
    priority: true,
  },
  {
    id: 'd1_02',
    label: 'Set up company email kosta@equipt.qa',
    note: 'Ensure login works, signature is set, and forwarding is configured if needed.',
  },
  {
    id: 'd1_03',
    label: 'Receive laptop and equipment access',
    note: 'Confirm hardware is set up, VPN access if required, and all peripherals are working.',
  },
  {
    id: 'd1_04',
    label: 'Get added to Google Workspace',
    note: 'Gmail, Drive, Calendar, Docs — confirm access to all shared company folders.',
  },
  {
    id: 'd1_05',
    label: 'Review Equipt brand guidelines',
    note: 'Read through tone of voice, logo usage rules, colour palette, and typography standards.',
    priority: true,
  },
  {
    id: 'd1_06',
    label: 'Get onboarded to Monday.com',
    note: 'Receive invite, tour the workspace, understand active boards and project statuses.',
  },
  {
    id: 'd1_07',
    label: 'Review Instagram & LinkedIn accounts',
    note: 'Audit follower counts, engagement rate, recent posts, and content quality.',
  },
  {
    id: 'd1_08',
    label: 'Read 3 recent sales proposals',
    note: 'Understand deal structure, client types (hotels, gyms, government), and pricing language.',
  },
  {
    id: 'd1_09',
    label: 'Get briefed on current active clients',
    note: 'Yazan to walk through pipeline — who is close to closing, who needs nurturing.',
  },
  {
    id: 'd1_10',
    label: 'Set up Canva with Equipt brand kit',
    note: 'Upload logo, set brand colours, fonts. Build template library for recurring content formats.',
  },
  {
    id: 'd1_11',
    label: 'Review last 3 months of marketing materials',
    note: 'Any ads, posts, brochures, or campaigns that have run. Note what worked and what did not.',
  },
  {
    id: 'd1_12',
    label: 'Book end-of-week debrief with Ivan',
    note: '30-min calendar block for Friday — review first week, align on Week 2 priorities.',
    priority: true,
  },
]

// ─── Tab 2: Week 1 Content ──────────────────
export const week1Tasks = [
  {
    id: 'w1_01',
    label: 'Monday — Instagram: Brand Story Post',
    note: 'Introduce Equipt to the feed. Who we are, what we do, what makes us different. Strong visual.',
    badges: [{ label: 'MON', color: '#1A3A6B' }, { label: 'Instagram', color: '#833AB4' }],
  },
  {
    id: 'w1_02',
    label: 'Monday — LinkedIn: Professional Introduction',
    note: 'Thought-leadership tone. Position Equipt as the premium commercial gym partner in the Gulf.',
    badges: [{ label: 'MON', color: '#1A3A6B' }, { label: 'LinkedIn', color: '#0077B5' }],
  },
  {
    id: 'w1_03',
    label: 'Tuesday — Instagram: Equipment Spotlight',
    note: 'Feature one flagship product (e.g. cable machine or rack system). Clean studio-style shot.',
    badges: [{ label: 'TUE', color: '#1A3A6B' }, { label: 'Instagram', color: '#833AB4' }],
  },
  {
    id: 'w1_04',
    label: 'Tuesday — LinkedIn: Industry Insight',
    note: 'Post about the growing demand for commercial gym fit-outs across Qatar and UAE hospitality sector.',
    badges: [{ label: 'TUE', color: '#1A3A6B' }, { label: 'LinkedIn', color: '#0077B5' }],
  },
  {
    id: 'w1_05',
    label: 'Wednesday — Instagram: Behind the Scenes',
    note: 'Installation in progress or team at work. Humanises the brand, shows craftsmanship and scale.',
    badges: [{ label: 'WED', color: '#1A3A6B' }, { label: 'Instagram', color: '#833AB4' }],
  },
  {
    id: 'w1_06',
    label: 'Wednesday — LinkedIn: Client Case Study',
    note: 'Brief case study or testimonial from a hotel or gym client. Results-focused, professional copy.',
    badges: [{ label: 'WED', color: '#1A3A6B' }, { label: 'LinkedIn', color: '#0077B5' }],
  },
  {
    id: 'w1_07',
    label: 'Thursday — Instagram: Product Feature Reel',
    note: 'Short-form video (15–30s) showcasing a product in a completed gym space. High energy edit.',
    badges: [{ label: 'THU', color: '#1A3A6B' }, { label: 'Instagram', color: '#833AB4' }],
  },
  {
    id: 'w1_08',
    label: 'Thursday — LinkedIn: Thought Leadership',
    note: 'Why commercial gyms in the Gulf are investing in premium equipment post-COVID. Position Equipt.',
    badges: [{ label: 'THU', color: '#1A3A6B' }, { label: 'LinkedIn', color: '#0077B5' }],
  },
  {
    id: 'w1_09',
    label: 'Friday — Instagram: Motivation / Closing Post',
    note: 'End-of-week energy. Motivational caption tied to the Equipt ethos: Built to Perform.',
    badges: [{ label: 'FRI', color: '#1A3A6B' }, { label: 'Instagram', color: '#833AB4' }],
  },
  {
    id: 'w1_10',
    label: 'Friday — LinkedIn: Week-in-Review or Culture Post',
    note: 'Recap of installs completed, team highlights, or company culture moment. Keep it human.',
    badges: [{ label: 'FRI', color: '#1A3A6B' }, { label: 'LinkedIn', color: '#0077B5' }],
  },
]

// ─── Tab 3: Email Actions ───────────────────
export const emailTasks = [
  {
    id: 'em_01',
    label: 'Send intro email to Ivan Kruger',
    note: 'Brief, professional. Outline first-week goals and ask to align on Q2 marketing priorities.',
    priority: true,
  },
  {
    id: 'em_02',
    label: 'Email Yazan Hammad — sales pipeline overview',
    note: 'Request a summary of current leads, proposal stage, and any client comms needing marketing support.',
  },
  {
    id: 'em_03',
    label: 'Review & reply to pending supplier emails',
    note: 'Check inbox for any outstanding supplier threads — photography, printing, event vendors.',
  },
  {
    id: 'em_04',
    label: 'Draft client welcome email template',
    note: 'Reusable template for new clients post-sale. Warm, on-brand, includes next steps and contacts.',
  },
  {
    id: 'em_05',
    label: 'Set up professional email signature',
    note: 'Name, title, phone, equipt.qa domain. Include LinkedIn URL. Match brand fonts and colours.',
  },
]

// ─── Tab 4: Tools & Access ──────────────────
export const toolsTasks = [
  {
    id: 'to_01',
    label: 'Google Workspace — Gmail, Drive, Calendar',
    note: 'Primary comms and file management. Confirm access to shared Marketing Drive folder.',
    priority: true,
  },
  {
    id: 'to_02',
    label: 'Monday.com — Project Management',
    note: 'Receive invite, join Marketing board, understand task assignment conventions.',
  },
  {
    id: 'to_03',
    label: 'Canva Pro — Design & Content Creation',
    note: 'Set up brand kit: logo, colours (#0A0A0A, #C9A84C, #006039), fonts (Inter). Build templates.',
  },
  {
    id: 'to_04',
    label: 'Instagram Business Account — @equipt.shop',
    note: 'Confirm login or be added as admin via Meta Business Suite. Check Insights access.',
  },
  {
    id: 'to_05',
    label: 'LinkedIn Company Page — Equipt',
    note: 'Request Super Admin or Content Admin role. Review existing posts and follower analytics.',
  },
  {
    id: 'to_06',
    label: 'Meta Business Suite — Ads & Page Management',
    note: 'Access to run paid promotions, boost posts, and track paid campaign performance if needed.',
  },
  {
    id: 'to_07',
    label: 'WhatsApp Business — Client Comms',
    note: 'Confirm if Equipt uses WhatsApp for client outreach. Set up or get added to business account.',
  },
]

// ─── Tab 5: Drive Quick Links ───────────────
// No status toggles — reference links only.
export const driveLinks = [
  {
    id: 'dr_01',
    label: 'Brand Guidelines',
    note: 'Logo usage, colour palette, typography rules, tone of voice, do/don\'t examples.',
    url: 'https://drive.google.com/drive/folders/equipt-brand-guidelines',
  },
  {
    id: 'dr_02',
    label: 'Logo Files',
    note: 'All logo variants — primary, reversed, icon only. PNG, SVG, and PDF formats.',
    url: 'https://drive.google.com/drive/folders/equipt-logo-files',
  },
  {
    id: 'dr_03',
    label: 'Social Media Templates',
    note: 'Canva-linked templates for Instagram posts, stories, LinkedIn banners, and reels covers.',
    url: 'https://drive.google.com/drive/folders/equipt-social-templates',
  },
  {
    id: 'dr_04',
    label: 'Sales Proposals',
    note: 'Current and historical client proposals. Reference for tone, structure, and deal values.',
    url: 'https://drive.google.com/drive/folders/equipt-proposals',
  },
  {
    id: 'dr_05',
    label: 'Client Contracts',
    note: 'Signed contracts and project agreements. Confidential — handle carefully.',
    url: 'https://drive.google.com/drive/folders/equipt-contracts',
  },
  {
    id: 'dr_06',
    label: 'Equipment Catalogue',
    note: 'Full product catalogue with specs, pricing tiers, and installation guides.',
    url: 'https://drive.google.com/drive/folders/equipt-catalogue',
  },
  {
    id: 'dr_07',
    label: 'Photography Library',
    note: 'Professional photos of completed installations, products, and team. Use for content.',
    url: 'https://drive.google.com/drive/folders/equipt-photography',
  },
  {
    id: 'dr_08',
    label: 'Marketing Calendar',
    note: 'Content schedule, campaign dates, trade shows, and key marketing milestones.',
    url: 'https://drive.google.com/drive/folders/equipt-marketing-calendar',
  },
  {
    id: 'dr_09',
    label: 'Finance Documents',
    note: 'Invoices, receipts, and budget sheets. Restricted — check access with Ivan.',
    url: 'https://drive.google.com/drive/folders/equipt-finance',
  },
  {
    id: 'dr_10',
    label: 'HR & Admin',
    note: 'Onboarding docs, contracts, company policies, and admin forms.',
    url: 'https://drive.google.com/drive/folders/equipt-hr-admin',
  },
  {
    id: 'dr_11',
    label: 'Press & Media',
    note: 'Press releases, media mentions, interview transcripts, and PR assets.',
    url: 'https://drive.google.com/drive/folders/equipt-press-media',
  },
  {
    id: 'dr_12',
    label: 'Active Project Files',
    note: 'Current installation projects — floor plans, client briefs, equipment lists.',
    url: 'https://drive.google.com/drive/folders/equipt-projects',
  },
]

// ─── All statusable tasks combined ──────────
export const ALL_TASKS = [
  ...day1Tasks,
  ...week1Tasks,
  ...emailTasks,
  ...toolsTasks,
]

export const TASKS_BY_TAB = {
  day1: day1Tasks,
  week1: week1Tasks,
  email: emailTasks,
  tools: toolsTasks,
  drive: driveLinks,
}
