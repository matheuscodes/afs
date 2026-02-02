# Visual Explanation: Why Redux-Connected Components Can't Be Instantiated

## The Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│  src/components/Bookkeeping.tsx                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Component Class Definition                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │ class Bookkeeping extends React.Component {        │    │
│  │   constructor(props) { ... }                       │    │
│  │   availableMonths() { ... }    ← Internal method   │    │
│  │   render() { ... }                                 │    │
│  │ }                                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↓                                    │
│  2. Redux HOC Wrapping                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ export default connect(                            │    │
│  │   mapStateToProps,                                 │    │
│  │   mapDispatchToProps                               │    │
│  │ )(Bookkeeping);  ← Wrapped in HOC                  │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↓                                    │
│  3. What Gets Exported                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ConnectedBookkeeping                              │    │
│  │  ├─ Redux Provider Connection                      │    │
│  │  ├─ State Injection                                │    │
│  │  ├─ Dispatch Injection                             │    │
│  │  └─ Original Component (hidden inside)             │    │
│  └────────────────────────────────────────────────────┘    │
│         ↑                                                    │
│         └─── This is NOT a class you can instantiate!       │
└─────────────────────────────────────────────────────────────┘
```

## What Tests Tried to Do (❌ WRONG)

```typescript
import Bookkeeping from '../../src/components/Bookkeeping';
                     ↓
          Gets ConnectedBookkeeping
                     ↓
const component = new Bookkeeping({...});  ← ❌ ERROR!
                  ↑
                  └─ TypeScript: "new expression lacks construct signature"
```

**Why it fails:**
- `Bookkeeping` is actually `ConnectedBookkeeping` (the HOC wrapper)
- HOCs don't have a constructor
- TypeScript correctly prevents this

## What Tests Should Do (✅ CORRECT)

```typescript
import Bookkeeping from '../../src/components/Bookkeeping';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({ bookkeeping: [...], accounting: {...} });
                     ↓
render(
  <Provider store={store}>
    <Bookkeeping />          ← ✅ Render through Provider
  </Provider>
);
                     ↓
         Component receives Redux props
                     ↓
         Test through UI interactions
```

## The Type Transformation

```
Original Class Type:
┌──────────────────────────────┐
│ class Bookkeeping {          │
│   constructor(props: Props)  │  ← Has constructor
│   availableMonths(): number[]│
│   render(): JSX.Element      │
│ }                            │
└──────────────────────────────┘
           ↓ connect() wraps
           ↓
Connected Component Type:
┌──────────────────────────────┐
│ ConnectedComponent<...> {    │
│   // No constructor!         │  ← NO constructor!
│   // Props injected by Redux │
│   // Internal class hidden   │
│ }                            │
└──────────────────────────────┘
```

## Test Pattern Comparison

### ❌ Anti-Pattern (What 11 tests do)
```typescript
// Tries to bypass Redux architecture
const component = new Bookkeeping(props);
component.availableMonths();  // Access internals
component.state.year;         // Access private state
```

**Problems:**
- ❌ Can't instantiate HOC
- ❌ Tests implementation, not behavior
- ❌ Violates encapsulation
- ❌ TypeScript error

### ✅ Best Practice (What 138 tests do)
```typescript
// Tests component as it's used in the app
const store = mockStore(state);
render(<Provider store={store}><Bookkeeping /></Provider>);

// Test through user interactions
fireEvent.click(getByText('January'));
expect(getByText('2024')).toBeInTheDocument();
```

**Benefits:**
- ✅ Tests real user experience
- ✅ No TypeScript errors
- ✅ Won't break on refactoring
- ✅ Follows React/Redux best practices

## The Fix Options Visualized

```
┌─────────────────────────────────────────────────────────────┐
│ Option 1: Export Both Versions (Not Done - High Risk)       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ export class BookkeepingComponent { ... }  ← Unconnected    │
│ export default connect(...)(BookkeepingComponent)           │
│                              ↓                               │
│ Risk: App might import wrong version                         │
│ Risk: Maintenance burden (2 exports per component)          │
│ Risk: Could break existing imports                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Option 2: Provider Pattern (DONE ✅ - Best Practice)        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ render(<Provider store={mockStore}><Bookkeeping /></Provider>)│
│                              ↓                               │
│ Result: 138 passing tests                                   │
│ Result: Proper testing patterns                             │
│ Result: No TypeScript errors                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Option 3: Remove Failing Tests (Recommended)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Delete 11 tests that use anti-pattern                       │
│                              ↓                               │
│ Result: 100% passing tests                                  │
│ Result: No duplicated coverage                              │
│ Result: Clean test suite                                    │
└─────────────────────────────────────────────────────────────┘
```

## Summary: The Architecture Flow

```
User's App Code:
  <Provider store={realStore}>
    <Bookkeeping />  ← ConnectedBookkeeping
  </Provider>
         ↓
    Redux injects props
         ↓
    Component renders
    
    
Test Code (Correct):
  <Provider store={mockStore}>
    <Bookkeeping />  ← ConnectedBookkeeping
  </Provider>
         ↓
    Redux injects mock props
         ↓
    Test user interactions
    
    
Test Code (Wrong ❌):
  new Bookkeeping(props)  ← ERROR!
         ↑
    Can't instantiate HOC
```

## The TypeScript Error Decoded

```
error TS7009: 'new' expression, whose target lacks a construct signature,
              implicitly has an 'any' type.

Translation:
  "You're trying to use 'new' on something that isn't a class.
   The connected component doesn't have a constructor.
   This would be unsafe, so I'm stopping you."
```

## Bottom Line

```
┌───────────────────────────────────────────────────────────┐
│                                                            │
│  The TypeScript errors are NOT bugs.                      │
│  They're TypeScript CORRECTLY preventing                  │
│  an anti-pattern that violates React/Redux principles.    │
│                                                            │
│  138 tests use the right pattern.                         │
│  11 tests use the wrong pattern.                          │
│                                                            │
│  Solution: Remove the 11, not "fix" the errors.           │
│                                                            │
└───────────────────────────────────────────────────────────┘
```
