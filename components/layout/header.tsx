"use client"

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'


import { Sidebar } from 'lucide-react'

export function Header({ onSidebarToggle }: { onSidebarToggle: () => void }) {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="mr-4 lg:hidden">
          <Sidebar className="h-5 w-5" />
        </Button>
        

        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}