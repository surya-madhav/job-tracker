'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Linkedin, Calendar, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Contact {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  linkedin: string;
  avatar: string;
  lastContact: string;
  notes: string;
}

export function ContactGrid({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <Card key={contact.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <CardTitle className="line-clamp-1">{contact.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{contact.position}</p>
                <p className="text-sm font-medium">{contact.company}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-primary hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Linkedin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last contacted: {contact.lastContact}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {contact.notes}
                </p>
              </div>

              <Button asChild variant="secondary" className="w-full">
                <Link href={`/contacts/${contact.id}`}>
                  View Details
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}