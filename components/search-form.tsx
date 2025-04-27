"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

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
        <Label htmlFor="search" className="text-base font-medium">
          {label}
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="search"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pr-10 focus-visible"
              disabled={isLoading}
              aria-describedby="search-description"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              disabled={isLoading || !value.trim()}
              className="min-w-[120px]"
              aria-label={isLoading ? "Searching..." : "Search"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </motion.div>
        </div>
        <p id="search-description" className="text-sm text-muted-foreground">
          Enter a username to search across multiple social networks and platforms.
        </p>
      </div>
    </form>
  )
}
