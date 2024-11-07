import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="bg-primary p-4 rounded-full inline-block mb-8">
          <Briefcase className="h-8 w-8 text-primary-foreground" />
        </div>
        
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl mb-6">
          JobTrackr
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
          Your all-in-one solution for managing job applications, tracking interviews, and landing your dream role.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="min-w-[200px]">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="min-w-[200px]">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Track Applications</h3>
            <p className="text-muted-foreground">Keep all your job applications organized in one place</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Manage Contacts</h3>
            <p className="text-muted-foreground">Store and manage your professional network</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Monitor Progress</h3>
            <p className="text-muted-foreground">Track your application status and interview stages</p>
          </div>
        </div>
      </div>
    </main>
  );
}