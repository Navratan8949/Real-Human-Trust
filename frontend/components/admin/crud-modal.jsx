"use client"
import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"

export function CrudModal({ isOpen, onClose, onSubmit, title, schema, initialData }) {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const dataToSet = initialData ? { ...initialData } : {}
      if (dataToSet.password) {
        dataToSet.password = ""
      }
      setFormData(dataToSet)
      setError(null)
      setLoading(false)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = { ...formData }
      if (initialData && payload.password === "") {
        delete payload.password
      }
      await onSubmit(payload)
      onClose()
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border/60 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 bg-secondary/30 px-6 py-4">
          <h2 className="font-serif text-xl font-bold text-navy">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <form id="crud-form" onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            
            try {
              const hasFile = schema.some(f => f.type === 'file');
              
              // Clean payload: extract _id from populated objects
              let cleanPayload = { ...formData };
              Object.keys(cleanPayload).forEach(key => {
                if (cleanPayload[key] && typeof cleanPayload[key] === 'object' && cleanPayload[key]._id && !(cleanPayload[key] instanceof File) && !(cleanPayload[key] instanceof Blob)) {
                  cleanPayload[key] = cleanPayload[key]._id;
                }
              });

              let payload = cleanPayload;
              
              if (hasFile) {
                payload = new FormData();
                Object.keys(cleanPayload).forEach(key => {
                  if (cleanPayload[key] !== undefined && cleanPayload[key] !== null && cleanPayload[key] !== '') {
                    // Do not append existing image objects to FormData as they become "[object Object]"
                    // Backend will keep existing image if no new file is provided.
                    if (typeof cleanPayload[key] === 'object' && cleanPayload[key].url && !(cleanPayload[key] instanceof File) && !(cleanPayload[key] instanceof Blob)) {
                      return; // Skip existing image object
                    }
                    payload.append(key, cleanPayload[key]);
                  }
                });
              }
              
              await onSubmit(payload);
              onClose();
            } catch (err) {
              setError(err.message || "An error occurred");
            } finally {
              setLoading(false);
            }
          }} className="space-y-4">
            {(schema || []).map((field) => (
              <div key={field.name}>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">
                  {field.label} {field.required ? <span className="text-rose-500">*</span> : <span className="text-muted-foreground font-normal text-xs ml-1">(Optional)</span>}
                </label>
                
                {field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full rounded-xl border border-border/60 bg-transparent px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy min-h-[100px]"
                    placeholder={field.placeholder}
                  />
                ) : field.type === "select" ? (
                  <select
                    required={field.required}
                    value={
                      formData[field.name] && typeof formData[field.name] === 'object' && formData[field.name]._id
                        ? formData[field.name]._id
                        : formData[field.name] || ""
                    }
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full rounded-xl border border-border/60 bg-transparent px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  >
                    <option value="" disabled>Select {field.label}</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === "boolean" ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      className="size-4 rounded border-border text-navy focus:ring-navy"
                    />
                    <span className="text-sm text-muted-foreground">{field.placeholder || "Yes"}</span>
                  </label>
                ) : field.type === "file" ? (
                  <div>
                    <input
                      type="file"
                      required={field.required && !initialData?.[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.files[0])}
                      className="w-full rounded-xl border border-border/60 bg-transparent px-4 py-2.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-navy/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-navy hover:file:bg-navy/20"
                    />
                    {initialData?.[field.name]?.url && (
                      <div className="mt-3 flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-2">
                        {initialData[field.name].url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                          <div className="h-10 w-16 shrink-0 overflow-hidden rounded bg-black/5">
                            <img src={initialData[field.name].url} alt="Current" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-navy/5 text-xs font-bold text-navy">
                            DOC
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">Current file is uploaded. Select a new one to replace it.</p>
                      </div>
                    )}
                  </div>
                ) : field.type === "date" ? (
                  <input
                    type="date"
                    required={field.required}
                    value={formData[field.name] ? new Date(formData[field.name]).toISOString().split('T')[0] : ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full rounded-xl border border-border/60 bg-transparent px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    required={field.name === "password" && initialData ? false : field.required}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    disabled={field.name === "email" && !!initialData}
                    className={`w-full rounded-xl border border-border/60 px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy ${field.name === "email" && !!initialData ? "bg-secondary/50 text-muted-foreground cursor-not-allowed" : "bg-transparent"}`}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-secondary/20 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            Cancel
          </button>
          <button 
            type="submit" 
            form="crud-form" 
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-2 text-sm font-bold text-accent-foreground shadow-sm transition hover:bg-accent/90 disabled:opacity-50"
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create"}
          </button>
        </div>

      </div>
    </div>
  )
}
