import * as React from 'react';

export const Position: {
  BOTTOM_LEFT: string;
  BOTTOM_RIGHT: string;
};

type AnyProps = Record<string, any>;
type Comp = React.ComponentType<AnyProps>;

export const Avatar: Comp;
export const ArrowDownIcon: Comp;
export const ArrowUpIcon: Comp;
export const Button: Comp;
export const CaretDownIcon: Comp;
export const Checkbox: Comp;
export const Heading: Comp;
export const IconButton: Comp;
export const Menu: Comp & {
  Group: Comp;
  Divider: Comp;
  Item: Comp;
  OptionsGroup: Comp;
};
export const MoreIcon: Comp;
export const Pane: Comp;
export const Paragraph: Comp;
export const Popover: Comp;
export const SelectField: Comp;
export const SideSheet: Comp;
export const Tab: Comp;
export const Tablist: Comp;
export const Text: Comp;
export const TextDropdownButton: Comp;
export const TextInputField: Comp;
export const Table: Comp & {
  Head: Comp;
  Body: Comp;
  Row: Comp;
  TextCell: Comp;
  Cell: Comp;
  HeaderCell: Comp;
  TextHeaderCell: Comp;
  SearchHeaderCell: Comp;
};
