'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCompanies } from '@/hooks/use-companies';

interface CompanyComboboxProps {
  value?: string;
  onChange: (value: string) => void;
}

export function CompanyCombobox({ value, onChange }: CompanyComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  
  const { data: companies = [], isLoading } = useCompanies({ 
    search: search || undefined 
  });

  const selectedCompany = companies.find((company:any) => company.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCompany?.name || "Select company..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search companies..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>
            {isLoading ? (
              "Loading..."
            ) : (
              "No company found."
            )}
          </CommandEmpty>
          <CommandGroup>
            {companies.map((company:any) => (
              <CommandItem
                key={company.id}
                value={company.id}
                onSelect={() => {
                  onChange(company.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === company.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {company.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}