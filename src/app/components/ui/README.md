# UI Component Abstraction

**Swap UI frameworks easily (ShadCN → Bootstrap → Material-UI)**

## Pattern

All UI components are WRAPPERS around the actual framework:

```typescript
// src/app/components/ui/button.tsx
import { Button as ShadCNButton } from '@/components/ui/shadcn/button';
// import { Button as BootstrapButton } from 'react-bootstrap';
// import { Button as MUIButton } from '@mui/material';

export function Button(props) {
  // Use ShadCN
  return <ShadCNButton {...props} />;
  
  // Swap to Bootstrap
  // return <BootstrapButton {...props} />;
  
  // Swap to Material-UI
  // return <MUIButton {...props} />;
}
```

## Usage in App

```typescript
// Always import from /ui (never direct)
import { Button, Input, Card } from '@/app/components/ui';

// These work regardless of underlying framework
<Button onClick={handleClick}>Click Me</Button>
<Input value={value} onChange={setValue} />
<Card>Content</Card>
```

## Swapping Frameworks

1. Install new framework
2. Update imports in `src/app/components/ui/*`
3. Map props if needed
4. Done - all app code unchanged

## File Structure

```
src/app/components/ui/
  button.tsx       ← Wrapper (edit this to swap)
  input.tsx        ← Wrapper
  card.tsx         ← Wrapper
  select.tsx       ← Wrapper
  modal.tsx        ← Wrapper
  ...
```

## Example: Swap to Bootstrap

```bash
npm install react-bootstrap bootstrap
```

```typescript
// button.tsx
import { Button as BootstrapButton } from 'react-bootstrap';

export function Button({ children, variant, ...props }) {
  return (
    <BootstrapButton 
      variant={variant === 'default' ? 'primary' : variant}
      {...props}
    >
      {children}
    </BootstrapButton>
  );
}
```

All your app code stays the same!
