import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight, LineChart, Users, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-secondary/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -top-1/2 right-1/2 w-full h-full bg-gradient-to-b from-accent/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      {/* Main content */}
      <div className="container relative mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="space-y-16 w-full max-w-5xl">
          {/* Hero section */}
          <div className="space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
              <div className="relative bg-primary/10 backdrop-blur-sm p-4 rounded-2xl inline-block mb-8 animate-fade-in">
                <Briefcase className="h-8 w-8 text-primary animate-icon" />
              </div>
            </div>
            
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl animate-fade-in animation-delay-200">
              <span className="text-primary relative">
                JobTrackr
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto animate-fade-in animation-delay-400">
              Your all-in-one solution for managing job applications, tracking interviews, and landing your dream role.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-600">
              <Link href="/dashboard">
                <Button size="lg" className="min-w-[200px] group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="min-w-[200px] hover:scale-105 transition-all duration-300 hover:shadow-lg hover:bg-background">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in animation-delay-800">
            <div className="group p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <LineChart className="h-6 w-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Applications</h3>
              <p className="text-muted-foreground">Keep all your job applications organized in one place with powerful tracking tools.</p>
            </div>
            
            <div className="group p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-secondary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-secondary group-hover:animate-pulse" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Manage Contacts</h3>
              <p className="text-muted-foreground">Build and maintain your professional network with integrated contact management.</p>
            </div>
            
            <div className="group p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-accent/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-accent group-hover:animate-pulse" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Monitor Progress</h3>
              <p className="text-muted-foreground">Track your application status and interview stages with real-time updates.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}