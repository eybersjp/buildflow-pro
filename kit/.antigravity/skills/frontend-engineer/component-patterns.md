---
name: component-patterns
description: Production-grade React component architecture patterns — compound components, controlled/uncontrolled duality, render props, polymorphic components, form patterns, and component composition. Use when designing complex, reusable UI components that need to be flexible, accessible, and maintainable. Reference alongside the design system.
version: 1.0.0
triggers:
  - "complex component"
  - "reusable component"
  - "component pattern"
  - "compound component"
  - "form pattern"
  - "accessible component"
lifecycle: build
---

# React Component Architecture Patterns
# BuildFlow Pro — Frontend Intelligence Layer
# Source: eybersjp/Code-Kit-Ultra component patterns

## Overview

This skill provides battle-tested patterns for building complex, reusable, accessible React components. These patterns go beyond simple functional components — they govern how components expose their API, how they compose, and how they remain flexible without becoming unmaintainable.

**When to apply these patterns:**
- Building a component that will be used in 3+ places
- Building a component with more than 5 props
- Building a component that needs to be flexible in its internal structure
- Building a form with complex validation and state
- Building a component that needs controlled and uncontrolled usage

---

## Pattern 1: Compound Components

**Use when:** A component has multiple internal parts that need to be composed flexibly by the consumer.

**Problem it solves:** The "prop hell" of passing dozens of props to configure a single component.

```tsx
// ── Definition ────────────────────────────────────────────────
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Context for sharing state between compound parts
interface CardContextValue {
  isExpanded: boolean;
  toggle: () => void;
}

const CardContext = createContext<CardContextValue | null>(null);

function useCardContext() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('Card compound components must be used within <Card>');
  return ctx;
}

// ── Root component ────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

function Card({ children, defaultExpanded = false, className }: CardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const toggle = () => setIsExpanded((prev) => !prev);

  return (
    <CardContext.Provider value={{ isExpanded, toggle }}>
      <div className={cn('rounded-xl border bg-surface shadow-sm', className)}>
        {children}
      </div>
    </CardContext.Provider>
  );
}

// ── Sub-components ────────────────────────────────────────────
function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  const { toggle } = useCardContext();
  return (
    <div
      className={cn('flex items-center justify-between px-6 py-4', className)}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && toggle()}
    >
      {children}
    </div>
  );
}

function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-lg font-semibold text-text-primary', className)}>{children}</h3>
  );
}

function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  const { isExpanded } = useCardContext();
  if (!isExpanded) return null;
  return (
    <div className={cn('px-6 pb-6', className)}>
      {children}
    </div>
  );
}

function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('border-t px-6 py-4', className)}>
      {children}
    </div>
  );
}

// ── Attach sub-components to root ─────────────────────────────
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card };

// ── Usage ─────────────────────────────────────────────────────
/*
<Card defaultExpanded>
  <Card.Header>
    <Card.Title>Project Details</Card.Title>
    <ChevronDownIcon />
  </Card.Header>
  <Card.Content>
    <p>Content here is shown when expanded</p>
  </Card.Content>
  <Card.Footer>
    <Button>Save</Button>
  </Card.Footer>
</Card>
*/
```

---

## Pattern 2: Controlled / Uncontrolled Duality

**Use when:** A component needs to work both as a controlled input (parent manages state) and as an uncontrolled input (component manages its own state).

**Problem it solves:** Components that only support one mode are inflexible.

```tsx
// ── Implementation ────────────────────────────────────────────
import { useState, useCallback, type ChangeEvent } from 'react';

interface SearchInputProps {
  // Controlled mode: provide value + onChange
  value?: string;
  onChange?: (value: string) => void;

  // Uncontrolled mode: provide defaultValue
  defaultValue?: string;

  // Shared
  placeholder?: string;
  disabled?: boolean;
  onSearch?: (value: string) => void; // fires when Enter is pressed
  'aria-label'?: string;
}

export function SearchInput({
  value: controlledValue,
  onChange: onControlledChange,
  defaultValue = '',
  placeholder = 'Search...',
  disabled = false,
  onSearch,
  'aria-label': ariaLabel = 'Search',
}: SearchInputProps) {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Determine which mode we're in
  const isControlled = controlledValue !== undefined;
  const displayValue = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onControlledChange?.(newValue);
    },
    [isControlled, onControlledChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(displayValue);
      }
    },
    [displayValue, onSearch]
  );

  return (
    <div className="relative">
      <input
        type="search"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

// ── Usage: Uncontrolled ───────────────────────────────────────
// <SearchInput defaultValue="initial" onSearch={(v) => console.log(v)} />

// ── Usage: Controlled ─────────────────────────────────────────
// const [search, setSearch] = useState('');
// <SearchInput value={search} onChange={setSearch} onSearch={doSearch} />
```

---

## Pattern 3: Polymorphic Components (The `as` Prop)

**Use when:** A component needs to render as different HTML elements or custom components without losing its styling or behaviour.

**Problem it solves:** Duplication between `<Button>` and `<ButtonLink>`, `<Text>` and `<Heading>`, etc.

```tsx
// ── Generic type helper ───────────────────────────────────────
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type PolymorphicProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

// ── Polymorphic Button ────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-color-primary text-color-text-on-brand hover:bg-color-primary-hover',
  secondary: 'bg-color-surface-elevated text-color-text-primary border hover:bg-color-surface-sunken',
  ghost:     'bg-transparent text-color-text-primary hover:bg-color-surface-elevated',
  danger:    'bg-color-danger text-color-text-inverse hover:bg-color-danger/90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

type ButtonProps<T extends ElementType = 'button'> = PolymorphicProps<T> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as ?? 'button';
  const isDisabled = disabled ?? isLoading;

  return (
    <Component
      disabled={isDisabled}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          <span className="sr-only">Loading...</span>
          {children}
        </>
      ) : (
        children
      )}
    </Component>
  );
}

// ── Usage ─────────────────────────────────────────────────────
// <Button>Click me</Button>
// <Button as="a" href="/dashboard">Go to dashboard</Button>
// <Button as={Link} href="/settings">Settings</Button>
// <Button variant="danger" isLoading={isPending}>Delete</Button>
```

---

## Pattern 4: Headless / Render Props

**Use when:** A component has complex logic but the rendering is entirely custom.

**Problem it solves:** Allows separating behaviour from presentation.

```tsx
// ── Headless pagination logic ─────────────────────────────────
interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  pageRange: number[];
  goToPage: (page: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
}

export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Generate a smart page range with ellipsis slots
  const pageRange = useMemo(() => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  }, [currentPage, totalPages]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  }, [totalPages]);

  const goToNext = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const goToPrev = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  return { currentPage, totalPages, isFirstPage, isLastPage, pageRange, goToPage, goToNext, goToPrev };
}

// ── Consumer assembles their own UI ───────────────────────────
function ProjectsPagination({ totalItems, itemsPerPage }: { totalItems: number; itemsPerPage: number }) {
  const { currentPage, totalPages, isFirstPage, isLastPage, pageRange, goToPage, goToNext, goToPrev } =
    usePagination({ totalItems, itemsPerPage });

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <Button as="button" variant="ghost" size="sm" disabled={isFirstPage} onClick={goToPrev} aria-label="Previous page">
        ←
      </Button>
      {pageRange.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => goToPage(page)}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Button>
      ))}
      <Button as="button" variant="ghost" size="sm" disabled={isLastPage} onClick={goToNext} aria-label="Next page">
        →
      </Button>
    </nav>
  );
}
```

---

## Pattern 5: Form Field Wrapper (Accessible Forms)

**Use when:** Building forms with react-hook-form — wraps error display, label association, and description in a reusable shell.

```tsx
// ── Form Field wrapper ────────────────────────────────────────
import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  description,
  required = false,
  children,
}: FormFieldProps) {
  const descriptionId = description ? `${htmlFor}-description` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-text-primary"
      >
        {label}
        {required && (
          <span className="ml-1 text-color-danger" aria-hidden="true">*</span>
        )}
      </label>

      {/* Inject aria attributes into the child input */}
      {React.cloneElement(children as React.ReactElement, {
        id: htmlFor,
        'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
      })}

      {description && (
        <p id={descriptionId} className="text-xs text-text-secondary">
          {description}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-color-danger"
          data-testid={`${htmlFor}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ── Usage with react-hook-form ────────────────────────────────
/*
const { register, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});

<FormField
  label="Project Name"
  htmlFor="project-name"
  error={errors.name?.message}
  required
>
  <Input {...register('name')} placeholder="Enter project name" />
</FormField>
*/
```

---

## Pattern 6: Data Table Component

**Use when:** Displaying tabular data with sorting, filtering, and row actions.

```tsx
// ── Generic, typed data table ─────────────────────────────────
import type { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  getRowTestId?: (row: T) => string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No items found.',
  emptyAction,
  onSort,
  getRowTestId,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function handleSort(key: string) {
    const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(newDir);
    onSort?.(key, newDir);
  }

  if (isLoading) {
    return (
      <div data-testid="table-skeleton" className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-color-surface-sunken" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div data-testid="table-empty" className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-text-secondary">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm" role="grid">
        <thead className="bg-color-surface-elevated">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left font-medium text-text-secondary',
                  col.sortable && 'cursor-pointer select-none hover:text-text-primary',
                  col.className
                )}
                onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                aria-sort={
                  sortKey === String(col.key)
                    ? sortDir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === String(col.key) && (
                    <span aria-hidden>{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row) => (
            <tr
              key={row.id}
              data-testid={getRowTestId?.(row) ?? `table-row-${row.id}`}
              className="transition-colors hover:bg-color-surface-elevated"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className={cn('px-4 py-3', col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Component Quality Rules

Every component built in BuildFlow Pro must follow:

1. **Single responsibility** — one component does one thing
2. **Explicit prop types** — no implicit any, all props typed with interface
3. **Accessible by default** — ARIA attributes, keyboard navigation, focus management
4. **Design system tokens only** — no hardcoded colors, spacing, or font values
5. **`data-testid` on all interactive elements** — every button, input, and list has a test ID
6. **Controlled state has `default*` equivalent** — every controlled prop has an uncontrolled default
7. **No component over 200 lines** — extract sub-components or custom hooks
8. **Errors are boundary-safe** — components don't crash the page; use error boundaries

---

## Pattern Selection Guide

| Need | Pattern |
|---|---|
| Multi-part flexible component | Compound Components |
| Input works both ways | Controlled/Uncontrolled Duality |
| Same style, different element | Polymorphic (`as` prop) |
| Complex logic, custom rendering | Headless / Custom Hook |
| Form field with label + error | Form Field Wrapper |
| List with loading/empty/error | Data Table |

---

## Verification

Before shipping a complex component:

- [ ] Component uses the correct pattern for its use case
- [ ] All props are explicitly typed (no `any`)
- [ ] Component works with keyboard navigation
- [ ] `data-testid` attributes on all interactive elements
- [ ] Unit test covers the component's primary use case
- [ ] Design system tokens are used — no hardcoded values
- [ ] Component composes cleanly with others (no side effects)
- [ ] Controlled and uncontrolled modes work independently
