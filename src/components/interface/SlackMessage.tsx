'use client'
import { cn } from '@/lib/utils'
import React from 'react'

export interface SlackMessageProps {
  message: string
  type: "error" | "success" | "info" | "alert"
}

const SlackMessage = ({ message, type }: SlackMessageProps) => {
  const border = type === 'error' ? 'border-btnRed'
    : type === 'success' ? 'border-btnGreen'
      : type === 'info' ? 'border-btnBlue'
        : type === 'alert' ? 'border-btnOrange'
          : 'border-white'

  const text = type === 'error' ? 'text-btnRed'
    : type === 'success' ? 'text-btnGreen'
      : type === 'info' ? 'text-btnBlue'
        : type === 'alert' ? 'text-btnOrange'
          : 'text-white'
  return (
    <div
      className={cn(`w-full p-2.5 border-2 border-l-[32px] 
        rounded-lg transition-all ease-linear`, border)}
    >
      <p className={`${text} text-sm font-semibold`}>{message}</p>
    </div>
  )
}

export default SlackMessage