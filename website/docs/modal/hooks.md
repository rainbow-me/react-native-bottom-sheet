---
id: hooks
title: Hooks
slug: /modal/hooks
hide_table_of_contents: true
---

## `useBottomSheetModal`

This hook provides modal functionalities only, for sheet functionalities please look at [Bottom Sheet Hooks](../hooks).

> This hook works at any component in `BottomSheetModalProvider`.

```tsx
import { useBottomSheet} from '@gorhom/bottom-sheet';

const SheetContent = () => {
  const { dismiss, dismissAll } = useBottomSheet();

  return (
    <View>
      <Button onPress={expand}>
    </View>
  )
}
```

## `dismiss`

```ts
type dismiss = (key: string) => void;
```

Dismiss a modal by its name/key.

## `dismissAll`

```ts
type dismissAll = () => void;
```

Dismiss all mounted/presented modals.