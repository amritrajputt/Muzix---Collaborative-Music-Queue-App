import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../pages/DashboardPage'
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react'
import { LoaderThree } from '../components/ui/loader'

function DashboardRoute() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <LoaderThree size="md" />
      </div>
    )
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  return <DashboardPage />
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardRoute,
})
