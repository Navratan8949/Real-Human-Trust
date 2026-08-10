import { QRCodeSVG } from "qrcode.react"

export function IdCard({ member, user, verificationUrl }) {
  if (!member || !user) return null

  return (
    <div className="flex justify-center w-full">
      <div id="id-card" className="relative w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-border/60">
        {/* Card Header */}
        <div className="bg-navy p-4 text-center text-white">
          <h2 className="font-serif text-base font-bold tracking-tight">REAL HUMAN EDUCATION & CHARITABLE TRUST</h2>
          <p className="text-[9px] uppercase tracking-widest text-accent mt-0.5">Govt. Regd. NGO</p>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Profile Image */}
            <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
              {member.profileImage?.url || user.profileImage?.url ? (
                <img src={member.profileImage?.url || user.profileImage?.url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-xl font-bold text-navy">
                  {user.fullName?.[0] || "?"}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div>
                <p className="text-[9px] font-semibold uppercase text-muted-foreground">Name</p>
                <p className="text-[13px] font-bold text-navy leading-none truncate">{user.fullName}</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase text-muted-foreground">Member ID</p>
                <p className="text-[13px] font-bold font-mono text-slate-700 leading-none">{member.memberId}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase text-muted-foreground">Blood</p>
                  <p className="text-[12px] font-bold text-rose-600 leading-none">{member.bloodGroup || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase text-muted-foreground">Type</p>
                  <p className="text-[12px] font-bold text-slate-700 leading-none capitalize truncate">{member.membershipType}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-dashed border-slate-200 pt-3">
            <div>
              <p className="text-[8px] font-medium text-slate-500 truncate">Contact: +91 8735899909</p>
              <p className="text-[8px] font-medium text-slate-500 truncate">Address: Rajkot, Gujarat</p>
            </div>
            {/* Dynamic QR Code */}
            <div className="size-12 shrink-0 rounded bg-white p-0.5 border border-slate-200">
              <QRCodeSVG value={verificationUrl} size={44} className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
