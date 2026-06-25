import { TopNav } from "./top-nav"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
