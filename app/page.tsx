"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Copy,
  Search,
  Trash2,
  Save,
  Download,
  Settings,
  X,
  Check,
  Clock,
  FileText,
  Tag,
  Hash,
  Type,
  Code,
  Link,
  Sparkles,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClipboardItem {
  id: string
  text: string
  timestamp: number
  preview: string
  tags: string[]
  type: "text" | "markdown" | "code" | "url"
}

const PREDEFINED_TAGS = ["Work", "Personal", "Code", "Links", "Notes", "Temp"]
const TYPE_ICONS = {
  text: Type,
  markdown: Hash,
  code: Code,
  url: Link,
}

export default function Clipboard() {
  const [text, setText] = useState("")
  const [items, setItems] = useState<ClipboardItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [contentType, setContentType] = useState<"text" | "markdown" | "code" | "url">("text")
  const [maxItems, setMaxItems] = useState(50)
  const [showSettings, setShowSettings] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>(PREDEFINED_TAGS)
  const [isTagFilterActive, setIsTagFilterActive] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("clipboard-items")
    const savedMaxItems = localStorage.getItem("clipboard-max-items")
    const savedTags = localStorage.getItem("clipboard-tags")

    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved items:", e)
      }
    }

    if (savedMaxItems) {
      setMaxItems(Number.parseInt(savedMaxItems, 10))
    }

    if (savedTags) {
      try {
        setAllTags(JSON.parse(savedTags))
      } catch (e) {
        setAllTags(PREDEFINED_TAGS)
      }
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("clipboard-items", JSON.stringify(items))
  }, [items])

  // Save maxItems to localStorage
  useEffect(() => {
    localStorage.setItem("clipboard-max-items", maxItems.toString())
  }, [maxItems])

  // Save tags to localStorage
  useEffect(() => {
    localStorage.setItem("clipboard-tags", JSON.stringify(allTags))
  }, [allTags])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const createPreview = (text: string): string => {
    return text.length > 50 ? text.substring(0, 50) + "..." : text
  }

  const detectContentType = (text: string): "text" | "markdown" | "code" | "url" => {
    if (text.match(/^https?:\/\//)) return "url"
    if (text.includes("```") || text.includes("function") || text.includes("const ") || text.includes("import "))
      return "code"
    if (text.includes("#") || text.includes("**") || text.includes("*") || text.includes("[") || text.includes("]"))
      return "markdown"
    return "text"
  }

  const addTag = () => {
    if (newTag.trim() && !allTags.includes(newTag.trim())) {
      setAllTags((prev) => [...prev, newTag.trim()])
      setSelectedTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const saveText = useCallback(() => {
    if (!text.trim()) return

    const detectedType = contentType === "text" ? detectContentType(text.trim()) : contentType

    const newItem: ClipboardItem = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: Date.now(),
      preview: createPreview(text.trim()),
      tags: [...selectedTags],
      type: detectedType,
    }

    setItems((prev) => {
      const filtered = prev.filter((item) => item.text !== newItem.text)
      const newItems = [newItem, ...filtered].slice(0, maxItems)
      return newItems
    })

    setText("")
    setSelectedTags([])
    setContentType("text")
    textareaRef.current?.focus()

    toast({
      description: "✨ Content saved successfully",
      className: "bg-sky-400/20 border-sky-300/40 text-sky-100 backdrop-blur-2xl shadow-2xl",
    })
  }, [text, maxItems, selectedTags, contentType, toast])

  const copyToClipboard = async (item: ClipboardItem) => {
    try {
      await navigator.clipboard.writeText(item.text)
      setCopiedId(item.id)

      toast({
        description: "🎉 Copied to clipboard",
        className: "bg-emerald-400/20 border-emerald-300/40 text-emerald-100 backdrop-blur-2xl shadow-2xl",
      })

      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast({
        description: "❌ Copy failed, please try again",
        variant: "destructive",
      })
    }
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    toast({
      description: "🗑️ Entry deleted",
      className: "bg-red-400/20 border-red-300/40 text-red-100 backdrop-blur-2xl shadow-2xl",
    })
  }

  const clearAll = () => {
    setItems([])
    toast({
      description: "🧹 All entries cleared",
      className: "bg-orange-400/20 border-orange-300/40 text-orange-100 backdrop-blur-2xl shadow-2xl",
    })
  }

  const exportData = () => {
    const data = {
      items,
      tags: allTags,
      exportDate: new Date().toISOString(),
      version: "2.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clipboard-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      description: "📦 Data exported successfully",
      className: "bg-sky-400/20 border-sky-300/40 text-sky-100 backdrop-blur-2xl shadow-2xl",
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveText()
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags =
      !isTagFilterActive || selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "now"
  }

  const renderContent = (item: ClipboardItem) => {
    if (item.type === "markdown" && item.text.includes("#")) {
      return (
        <div className="text-white/95 text-base font-mono leading-relaxed break-words">
          {item.preview.split("\n").map((line, i) => (
            <div key={i} className={line.startsWith("#") ? "font-bold text-sky-300" : ""}>
              {line}
            </div>
          ))}
        </div>
      )
    }

    if (item.type === "code") {
      return (
        <div className="text-emerald-300 text-base font-mono leading-relaxed break-words bg-black/30 p-3 rounded-xl border border-emerald-500/20">
          {item.preview}
        </div>
      )
    }

    if (item.type === "url") {
      return (
        <div className="text-sky-300 text-base font-mono leading-relaxed break-words underline decoration-sky-400/50">
          {item.preview}
        </div>
      )
    }

    return <div className="text-white/95 text-base font-mono leading-relaxed break-words">{item.preview}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 p-4 relative overflow-hidden">
      {/* Liquid glass background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main liquid blobs */}
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-sky-400/25 to-cyan-500/25 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-br from-blue-400/25 to-sky-500/25 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-48 left-48 w-96 h-96 bg-gradient-to-br from-cyan-400/25 to-blue-500/25 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

        {/* Additional floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-sky-300/20 to-cyan-400/20 rounded-full filter blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-blue-300/20 to-sky-400/20 rounded-full filter blur-2xl animate-pulse animation-delay-1000"></div>

        {/* Liquid glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-blue-500/5"></div>

        {/* Subtle tech grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 40 40%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg fill%3D%22%2387ceeb%22 fillOpacity%3D%220.03%22%3E%3Ccircle cx%3D%2220%22 cy%3D%2220%22 r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-sky-400 animate-pulse" />
            <h1 className="text-7xl font-extralight bg-gradient-to-r from-sky-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
              Clipboard
            </h1>
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse animation-delay-1000" />
          </div>
          <p className="text-sky-200/70 text-xl font-light tracking-wide">Liquid Design • Tech Aesthetic</p>
        </div>

        {/* Input Section */}
        <Card className="backdrop-blur-3xl bg-white/[0.06] border-white/[0.08] shadow-2xl p-8 rounded-3xl mb-8 hover:bg-white/[0.08] transition-all duration-700 ring-1 ring-sky-400/10 hover:ring-sky-400/20">
          <div className="space-y-6">
            {/* Content Type & Tags */}
            <div className="flex gap-4 flex-wrap items-center">
              <Select
                value={contentType}
                onValueChange={(value: "text" | "markdown" | "code" | "url") => setContentType(value)}
              >
                <SelectTrigger className="w-36 bg-white/5 border-sky-400/20 text-sky-100 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 border-sky-400/20 backdrop-blur-2xl">
                  <SelectItem value="text">📝 Text</SelectItem>
                  <SelectItem value="markdown">📋 Markdown</SelectItem>
                  <SelectItem value="code">💻 Code</SelectItem>
                  <SelectItem value="url">🔗 URL</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2 flex-wrap">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-sky-400/20 text-sky-200 border-sky-300/30 hover:bg-sky-400/30 cursor-pointer backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ✕
                  </Badge>
                ))}
              </div>

              <Select
                value=""
                onValueChange={(value) => {
                  if (value) {
                    setSelectedTags((prev) => [...prev, value])
                    // 不自动激活筛选，让用户手动控制
                  }
                }}
              >
                <SelectTrigger className="w-36 bg-white/5 border-sky-400/20 text-sky-100 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <Tag className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Add Tag" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 border-sky-400/20 backdrop-blur-2xl">
                  {allTags
                    .filter((tag) => !selectedTags.includes(tag))
                    .map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        🏷️ {tag}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Custom tag"
                  className="w-28 bg-white/5 border-sky-400/20 text-sky-100 rounded-2xl text-sm backdrop-blur-sm focus:bg-white/10 transition-all duration-300"
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button
                  onClick={addTag}
                  size="sm"
                  className="bg-sky-400/20 hover:bg-sky-400/30 text-sky-200 border-sky-300/30 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  ✨
                </Button>
              </div>
            </div>

            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your content... (Press Enter to save, Shift+Enter for new line)"
              className="min-h-[140px] text-lg backdrop-blur-sm bg-white/[0.04] border-sky-400/[0.15] text-white placeholder:text-sky-200/50 rounded-2xl resize-none focus:bg-white/[0.06] transition-all duration-500 font-mono shadow-inner"
            />

            <div className="flex justify-between items-center">
              <div className="text-sky-200/60 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {text.length} characters
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  variant="ghost"
                  size="sm"
                  className="text-sky-200/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Settings className="w-4 h-4" />
                </Button>

                <Button
                  onClick={exportData}
                  disabled={items.length === 0}
                  variant="ghost"
                  size="sm"
                  className="text-sky-200/80 hover:text-white hover:bg-white/10 rounded-xl disabled:opacity-50 backdrop-blur-sm transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  onClick={saveText}
                  disabled={!text.trim()}
                  className="bg-gradient-to-r from-sky-400/30 to-cyan-400/30 hover:from-sky-400/40 hover:to-cyan-400/40 text-white rounded-xl px-8 disabled:opacity-50 transition-all duration-500 backdrop-blur-sm border border-sky-300/20 shadow-lg hover:shadow-sky-400/20 hover:scale-105"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="backdrop-blur-3xl bg-white/[0.06] border-white/[0.08] shadow-2xl p-6 rounded-3xl mb-8 ring-1 ring-sky-400/10 animate-in slide-in-from-top-2 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-light text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-400" />
                Settings
              </h3>
              <Button
                onClick={() => setShowSettings(false)}
                variant="ghost"
                size="sm"
                className="text-sky-200/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sky-200/80 font-light">Maximum entries</label>
                <Input
                  type="number"
                  value={maxItems}
                  onChange={(e) => setMaxItems(Math.max(1, Number.parseInt(e.target.value) || 50))}
                  className="w-24 bg-white/5 border-sky-400/20 text-white rounded-xl backdrop-blur-sm"
                  min="1"
                  max="200"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sky-200/80 font-light">Current entries</span>
                <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 backdrop-blur-sm">{items.length}</Badge>
              </div>

              <Button
                onClick={clearAll}
                disabled={items.length === 0}
                variant="destructive"
                className="w-full rounded-xl disabled:opacity-50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear all entries
              </Button>
            </div>
          </Card>
        )}

        {/* Search Bar */}
        <Card className="backdrop-blur-3xl bg-white/[0.06] border-white/[0.08] shadow-2xl p-5 rounded-3xl mb-8 ring-1 ring-sky-400/10 hover:ring-sky-400/20 transition-all duration-500">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-sky-300/60 w-5 h-5" />
            <Input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your clipboard... (Ctrl+F)"
              className="pl-14 bg-white/[0.04] border-sky-400/[0.15] text-white placeholder:text-sky-200/50 rounded-2xl h-14 text-lg focus:bg-white/[0.06] transition-all duration-500 backdrop-blur-sm shadow-inner"
            />
          </div>
          {/* Filter Controls */}
          {selectedTags.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <span className="text-sky-200/60 text-sm">Active filters:</span>
                <div className="flex gap-2 flex-wrap">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-sky-400/20 text-sky-200 border-sky-300/30 hover:bg-sky-400/30 cursor-pointer backdrop-blur-sm transition-all duration-300"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ✕
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsTagFilterActive(!isTagFilterActive)}
                  size="sm"
                  variant={isTagFilterActive ? "default" : "ghost"}
                  className={`rounded-xl backdrop-blur-sm transition-all duration-300 ${
                    isTagFilterActive
                      ? "bg-sky-400/30 text-white border-sky-300/30"
                      : "text-sky-200/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {isTagFilterActive ? "Filter ON" : "Filter OFF"}
                </Button>

                <Button
                  onClick={() => {
                    setSelectedTags([])
                    setIsTagFilterActive(false)
                  }}
                  size="sm"
                  variant="ghost"
                  className="text-sky-200/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-sm"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* History List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card className="backdrop-blur-3xl bg-white/[0.06] border-white/[0.08] shadow-2xl p-12 rounded-3xl text-center ring-1 ring-sky-400/10">
              <div className="text-sky-200/50 text-xl font-light">
                {items.length === 0 ? "✨ No entries yet" : "🔍 No matching entries found"}
              </div>
            </Card>
          ) : (
            filteredItems.map((item, index) => {
              const IconComponent = TYPE_ICONS[item.type]
              return (
                <Card
                  key={item.id}
                  className="backdrop-blur-3xl bg-white/[0.04] border-white/[0.06] shadow-xl p-5 rounded-2xl hover:bg-white/[0.08] transition-all duration-500 group cursor-pointer ring-1 ring-sky-400/5 hover:ring-sky-400/15 hover:scale-[1.02] animate-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onDoubleClick={() => copyToClipboard(item)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <IconComponent className="w-4 h-4 text-sky-300 flex-shrink-0" />
                        <div className="flex gap-2 flex-wrap">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-sky-400/15 text-sky-300 border-sky-300/20 text-xs backdrop-blur-sm"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {renderContent(item)}

                      <div className="flex items-center gap-3 mt-3 text-sky-200/40 text-sm">
                        <Clock className="w-3 h-3" />
                        {formatTime(item.timestamp)}
                        <Badge className="bg-white/10 text-sky-200/60 text-xs backdrop-blur-sm">
                          {item.text.length} chars
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(item)
                        }}
                        size="sm"
                        className={`rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-110 ${
                          copiedId === item.id
                            ? "bg-emerald-400/20 text-emerald-300 border-emerald-300/30 shadow-emerald-400/20"
                            : "bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white border-sky-400/20 shadow-sky-400/10"
                        }`}
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteItem(item.id)
                        }}
                        size="sm"
                        variant="destructive"
                        className="rounded-xl opacity-70 hover:opacity-100 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sky-200/30 text-sm font-light">
          <p className="flex items-center justify-center gap-2">
            <span>Double-click to copy</span>
            <span>•</span>
            <span>Ctrl+F to search</span>
            <span>•</span>
            <span>Enter to save</span>
          </p>
        </div>
      </div>
    </div>
  )
}
