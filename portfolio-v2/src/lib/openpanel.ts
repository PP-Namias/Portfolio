import { OpenPanel } from "@openpanel/web"

const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID

export const op = clientId
  ? new OpenPanel({ clientId, trackScreenViews: true })
  : null
