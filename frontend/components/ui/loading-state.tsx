import { LoadingSpinner } from "./loading-spinner"

interface LoadingStateProps {
  isLoading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
}

export function LoadingState({
  isLoading,
  error,
  children,
  loadingMessage = "Loading...",
  errorMessage = "Something went wrong",
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <LoadingSpinner size={32} />
        {loadingMessage && (
          <p className="text-sm text-muted-foreground">{loadingMessage}</p>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-2">
        <p className="text-destructive font-medium">
          {errorMessage}
        </p>
        <p className="text-sm text-muted-foreground">
          {error.message}
        </p>
      </div>
    )
  }

  return <>{children}</>
}