'use client'

import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
import {useState} from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always fetch fresh data
      refetchOnWindowFocus: true, // Prevent automatic refetching on window focus
    },
  },
})

const ReactQueryProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default ReactQueryProvider
