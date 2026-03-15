import React from 'react';
import Input from '@jetbrains/ring-ui-built/components/input/input';
import searchIcon from '@jetbrains/icons/search';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FunctionComponent<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search posts...',
}) => (
  <Input
    icon={searchIcon}
    value={value}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    placeholder={placeholder}
    borderless={false}
  />
);
