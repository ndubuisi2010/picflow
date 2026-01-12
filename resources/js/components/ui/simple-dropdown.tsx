import * as React from "react"
import { Link } from "@inertiajs/react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {AppDropdownItem} from '@/types'
interface AppDropdownProps {
  trigger: React.ReactNode
  items: AppDropdownItem[]
}

export function SimpleDropdown({ trigger, items }: AppDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {items.map((item, index) => {
          if (item.type === "separator") {
            return <DropdownMenuSeparator key={index} />
          }

          if (item.type === "link") {
            return (
              <DropdownMenuItem key={index} inset={item.inset} disabled={item.disabled} asChild>
                <Link href={item.href} className="w-full">
                  {item.label}
                </Link>
              </DropdownMenuItem>
            )
          }

          return (
            <DropdownMenuItem
              key={index}
              inset={item.inset}
              disabled={item.disabled}
              variant={item.variant}
              onClick={item.onClick}
            >
              {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
