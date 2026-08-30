import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Upload, Image as ImageIcon, Video, Link as LinkIcon, Sparkles } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface RichEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Record<string, any>, fileObj?: File | null) => Promise<void>
  title: string
  initialData?: Record<string, any>
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'textarea' | 'editor' | 'select' | 'number' | 'bool' | 'file' | 'json'
    options?: Array<{ label: string; value: string }>
    placeholder?: string
    description?: string
    required?: boolean
  }>
}

export const GenericContentModal: React.FC<RichEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  initialData = {},
  fields,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({ ...initialData })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    setFormData({ ...initialData })
    setSelectedFile(null)
  }, [initialData, isOpen])

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData, selectedFile)
      toast({ title: 'Item salvo com sucesso!' })
      onClose()
    } catch (err: any) {
      console.error(err)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: err.message || 'Ocorreu um erro ao gravar as informações.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Preencha os campos abaixo com suporte a textos formatados, mídias (fotos e vídeos) e
            links.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {fields.map((f) => {
            const val = formData[f.name] !== undefined ? formData[f.name] : ''

            if (f.type === 'file') {
              return (
                <div
                  key={f.name}
                  className="space-y-2 border border-dashed border-slate-300 rounded-lg p-3.5 bg-slate-50"
                >
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" /> {f.label}
                  </Label>
                  {f.description && <p className="text-xs text-slate-500">{f.description}</p>}
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData[f.name] && typeof formData[f.name] === 'string' && (
                      <span className="text-xs text-slate-500 truncate max-w-xs">
                        Atual: {formData[f.name]}
                      </span>
                    )}
                  </div>
                </div>
              )
            }

            if (f.type === 'select') {
              return (
                <div key={f.name} className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    {f.label} {f.required && '*'}
                  </Label>
                  <select
                    value={val}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    required={f.required}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione uma opção...</option>
                    {f.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            if (f.type === 'bool') {
              return (
                <div key={f.name} className="flex items-center gap-3 py-1">
                  <input
                    type="checkbox"
                    id={f.name}
                    checked={!!val}
                    onChange={(e) => handleChange(f.name, e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <Label
                    htmlFor={f.name}
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    {f.label}
                  </Label>
                </div>
              )
            }

            if (f.type === 'textarea') {
              return (
                <div key={f.name} className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    {f.label} {f.required && '*'}
                  </Label>
                  <Textarea
                    rows={3}
                    value={val}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    required={f.required}
                    className="text-sm"
                  />
                </div>
              )
            }

            if (f.type === 'editor') {
              return (
                <div key={f.name} className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                    <span>
                      {f.label} {f.required && '*'}
                    </span>
                    <span className="text-xs font-normal text-slate-400">
                      Suporta HTML e formatação rica
                    </span>
                  </Label>
                  <Textarea
                    rows={6}
                    value={val}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    placeholder="<p>Escreva o conteúdo detalhado aqui...</p>"
                    required={f.required}
                    className="font-mono text-xs bg-slate-900 text-slate-100 p-3 rounded-md"
                  />
                  <div className="flex gap-2 text-xs text-slate-500">
                    <span>Atalhos rápidos:</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(f.name, (val || '') + '<p>Novo parágrafo de texto.</p>')
                      }
                      className="text-blue-600 hover:underline"
                    >
                      + &lt;p&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(f.name, (val || '') + '<strong>Texto em destaque</strong>')
                      }
                      className="text-blue-600 hover:underline"
                    >
                      + &lt;strong&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(
                          f.name,
                          (val || '') + '<ul><li>Item 1</li><li>Item 2</li></ul>',
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      + &lt;ul&gt;
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div key={f.name} className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">
                  {f.label} {f.required && '*'}
                </Label>
                <Input
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={val}
                  onChange={(e) =>
                    handleChange(
                      f.name,
                      f.type === 'number' ? Number(e.target.value) : e.target.value,
                    )
                  }
                  placeholder={f.placeholder}
                  required={f.required}
                  className="text-sm"
                />
              </div>
            )
          })}

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Gravando alterações...' : 'Salvar Conteúdo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
