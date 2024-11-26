// src/components/ui/card.tsx
import * as React from 'react'
import { cn } from '@/utils/tailwind'
import Link from 'next/link'
import { HiCheckCircle } from 'react-icons/hi2'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  voted?: boolean
  href?: string
  variant?: 'default' | 'ranking'
}

const Card = React.forwardRef<HTMLDivElement | HTMLAnchorElement, CardProps>(
  ({ className, voted = false, href, variant = 'default', ...props }, ref) => {
    const Comp: React.ElementType = href ? Link : 'div'
    return (
      <Comp
        {...(href ? { href } : {})}
        ref={ref as React.Ref<HTMLDivElement & HTMLAnchorElement>}
        className={cn(
          'relative rounded-xl border',
          variant === 'default' ? 'h-64 w-64' : 'w-full',
          voted ? 'border-[#FFEC40]' : 'border-zinc-800',
          'text-white',
          'shadow-lg',
          'transition-all duration-300 ease-in-out',
          'hover:scale-105',
          voted ? 'hover:border-[#FFEC40]/80' : 'hover:border-zinc-700',
          'hover:shadow-xl hover:shadow-black/20',
          href && 'cursor-pointer',
          className,
        )}
        {...props}
      >
        {voted && (
          <div className="absolute right-2 top-2 z-10">
            <HiCheckCircle
              className="h-6 w-6 text-[#FFEC40]"
              aria-hidden="true"
            />
          </div>
        )}
        {props.children}
      </Comp>
    )
  },
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col items-center justify-center p-4',
      'transition-transform duration-300',
      'group-hover:scale-102',
      className,
    )}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-2xl font-bold',
      'transition-colors duration-300',
      'line-clamp-2',
      'max-w-full',
      'overflow-hidden',
      className,
    )}
    style={{ color: '#FFEC40' }}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mb-6 mt-2 text-xs text-white',
      'transition-colors duration-300',
      'line-clamp-4',
      'overflow-hidden',
      className,
    )}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'p-4 pt-0 text-center',
      'transition-transform duration-300',
      className,
    )}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex justify-center p-4',
      'transition-all duration-300',
      className,
    )}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
