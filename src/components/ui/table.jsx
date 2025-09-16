import * as React from "react"
import { cn } from "../../lib/utils"

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto">
    <table ref={ref} className={cn("w-full text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

export const Thead = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
Thead.displayName = "Thead"

export const Tbody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
Tbody.displayName = "Tbody"

export const Tr = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
Tr.displayName = "Tr"

export const Th = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
))
Th.displayName = "Th"

export const Td = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-2 align-middle", className)} {...props} />
))
Td.displayName = "Td"
