"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface SearchFormProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function SearchForm({ label, placeholder, value, onChange, onSubmit, isLoading }: SearchFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">{label}</Label>
        <div className="flex gap-2">
          <Input
            id="search"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !value.trim()}>
            {isLoading ? (
              "Searching..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
