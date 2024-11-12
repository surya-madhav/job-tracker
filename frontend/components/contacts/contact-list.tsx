'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUpRight, Mail, Phone, Linkedin } from 'lucide-react';
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

export function ContactList({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{contact.name}</span>
                </div>
              </TableCell>
              <TableCell>{contact.position}</TableCell>
              <TableCell>{contact.company}</TableCell>
              <TableCell>
                <div className="space-y-1">
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
                      LinkedIn
                    </a>
                  </div>
                </div>
              </TableCell>
              <TableCell>{contact.lastContact}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/contacts/${contact.id}`}>
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}