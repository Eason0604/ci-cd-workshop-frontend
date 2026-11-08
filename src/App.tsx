import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { TodoPage } from './pages/TodoPage'

export function App() {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 10_000 } } }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TodoPage />
    </QueryClientProvider>
  )
}
