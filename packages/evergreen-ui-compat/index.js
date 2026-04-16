const React = require('react');

const DEFAULT_BORDER = '1px solid #e5e7eb';
const SELECTED_TAB_BORDER = '1px solid #2563eb';
const DEFAULT_TAB_BORDER = '1px solid #d1d5db';
const SELECTED_TAB_BACKGROUND = '#eff6ff';
const DEFAULT_TAB_BACKGROUND = '#fff';
const DEFAULT_SHADOW = '0 1px 3px rgba(0,0,0,0.12)';

const styleProps = new Set([
  'display', 'width', 'height', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'flex', 'flexBasis', 'justifyContent',
  'alignItems', 'textAlign', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight', 'borderRadius', 'overflow'
]);

function toStyle(props) {
  const style = { ...(props.style || {}) };
  for (const key of styleProps) {
    if (typeof props[key] !== 'undefined') {
      style[key] = props[key];
    }
  }
  if (props.border) {
    style.border = style.border || DEFAULT_BORDER;
  }
  if (props.elevation) {
    style.boxShadow = style.boxShadow || DEFAULT_SHADOW;
  }
  return style;
}

function cleanProps(props = {}, exclude = []) {
  const out = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || key === 'style' || styleProps.has(key) || exclude.includes(key)) {
      continue;
    }
    out[key] = value;
  }
  return out;
}

function Pane(props) {
  return React.createElement('div', { ...cleanProps(props, ['elevation', 'border']), style: toStyle(props) }, props.children);
}

function Heading(props) {
  return React.createElement('h3', { ...cleanProps(props, ['size']), style: toStyle(props) }, props.children);
}

function Paragraph(props) {
  return React.createElement('p', { ...cleanProps(props), style: toStyle(props) }, props.children);
}

function Button(props) {
  return React.createElement('button', { type: 'button', ...cleanProps(props), style: toStyle(props) }, props.children);
}

function Text(props) {
  return React.createElement('span', { ...cleanProps(props), style: toStyle(props) }, props.children);
}

function Avatar(props) {
  return React.createElement('span', { ...cleanProps(props), style: toStyle(props), role: 'img', 'aria-label': props['aria-label'] || 'avatar' }, props.children || '◯');
}

function IconButton(props) {
  const { icon } = props;
  const iconNode = icon ? React.createElement(icon) : null;
  return React.createElement('button', { type: 'button', ...cleanProps(props, ['icon', 'appearance']), style: toStyle(props) }, iconNode, props.children);
}

function TextDropdownButton(props) {
  const { icon } = props;
  const iconNode = icon ? React.createElement(icon) : null;
  return React.createElement('button', { type: 'button', ...cleanProps(props, ['icon']), style: toStyle(props) }, props.children, iconNode);
}

function ArrowUpIcon() { return React.createElement('span', null, '↑'); }
function ArrowDownIcon() { return React.createElement('span', null, '↓'); }
function CaretDownIcon() { return React.createElement('span', null, '▾'); }
function MoreIcon() { return React.createElement('span', null, '⋯'); }

const Position = {
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
};

function Popover(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const content = typeof props.content === 'function' ? props.content({ close: () => setIsOpen(false) }) : props.content;
  return React.createElement(
    'div',
    { style: toStyle(props) },
    React.createElement(
      'div',
      {
        onClick: () => setIsOpen(!isOpen),
        role: 'button',
        tabIndex: 0,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            setIsOpen(!isOpen);
          }
        }
      },
      props.children
    ),
    isOpen && content ? React.createElement('div', { role: 'dialog' }, content) : null
  );
}

function Menu(props) {
  return React.createElement('div', { ...cleanProps(props), style: toStyle(props) }, props.children);
}

Menu.Group = function MenuGroup(props) {
  return React.createElement('div', { ...cleanProps(props), style: toStyle(props) }, props.children);
};

Menu.Divider = function MenuDivider(props) {
  return React.createElement('hr', { ...cleanProps(props), style: toStyle(props) });
};

Menu.Item = function MenuItem(props) {
  return React.createElement('button', { type: 'button', ...cleanProps(props, ['intent']), style: toStyle(props) }, props.children);
};

Menu.OptionsGroup = function MenuOptionsGroup(props) {
  return React.createElement('div', { ...cleanProps(props, ['title', 'options', 'selected', 'onChange']) },
    props.title ? React.createElement('div', null, props.title) : null,
    (props.options || []).map((option) => React.createElement('label', { key: option.value, style: { display: 'block' } },
      React.createElement('input', {
        type: 'radio',
        name: props.title || 'options',
        checked: props.selected === option.value,
        onChange: () => props.onChange && props.onChange(option.value)
      }),
      option.label
    ))
  );
};

function SideSheet(props) {
  if (!props.isShown) {
    return null;
  }
  return React.createElement('div', { ...cleanProps(props, ['isShown', 'onCloseComplete']), style: { ...toStyle(props), position: 'fixed', right: 0, top: 0, bottom: 0, background: 'white', overflow: 'auto', zIndex: 999 } }, props.children);
}

function TextInputField(props) {
  const label = props.label ? React.createElement('label', null, props.label) : null;
  const input = React.createElement('input', {
    ...cleanProps(props, ['label', 'isInvalid']),
    style: toStyle(props),
    value: props.value,
    onChange: props.onChange
  });
  return React.createElement('div', null, label, input);
}

function SelectField(props) {
  const label = props.label ? React.createElement('label', null, props.label) : null;
  const select = React.createElement('select', {
    ...cleanProps(props, ['label']),
    style: toStyle(props),
    value: props.value,
    onChange: props.onChange
  }, props.children);
  return React.createElement('div', null, label, select);
}

function Checkbox(props) {
  return React.createElement('label', { style: toStyle(props) },
    React.createElement('input', {
      ...cleanProps(props, ['label']),
      type: 'checkbox',
      checked: !!props.checked,
      onChange: props.onChange
    }),
    props.label
  );
}

function Tablist(props) {
  return React.createElement('div', { ...cleanProps(props), style: { ...toStyle(props), display: 'flex', gap: 8, flexWrap: 'wrap' } }, props.children);
}

function Tab(props) {
  return React.createElement('button', {
    type: 'button',
    ...cleanProps(props, ['isSelected', 'onSelect']),
    onClick: props.onSelect,
    style: {
      ...toStyle(props),
      border: props.isSelected ? SELECTED_TAB_BORDER : DEFAULT_TAB_BORDER,
      background: props.isSelected ? SELECTED_TAB_BACKGROUND : DEFAULT_TAB_BACKGROUND
    }
  }, props.children);
}

function tablePart(tag, extraExclude = []) {
  return function Part(props) {
    return React.createElement(tag, { ...cleanProps(props, ['accountForScrollbar', ...extraExclude]), style: toStyle(props) }, props.children);
  }
}

function SearchHeaderCell(props) {
  return React.createElement('div', { style: toStyle(props) },
    React.createElement('input', {
      type: 'search',
      placeholder: props.placeholder,
      value: props.value || '',
      onChange: (event) => props.onChange && props.onChange(event.target.value)
    })
  );
}

function Table(props) {
  return React.createElement('div', { ...cleanProps(props, ['border']), style: { ...toStyle(props), border: props.border ? DEFAULT_BORDER : undefined } }, props.children);
}

Table.Head = tablePart('div');
Table.Body = function TableBody(props) {
  return React.createElement('div', { ...cleanProps(props, ['accountForScrollbar']), style: toStyle(props), 'data-evergreen-table-body': '' }, props.children);
};
Table.Row = tablePart('div');
Table.TextCell = tablePart('div');
Table.Cell = tablePart('div');
Table.HeaderCell = tablePart('div');
Table.TextHeaderCell = tablePart('div');
Table.SearchHeaderCell = SearchHeaderCell;

module.exports = {
  Avatar,
  ArrowDownIcon,
  ArrowUpIcon,
  Button,
  CaretDownIcon,
  Checkbox,
  Heading,
  IconButton,
  Menu,
  MoreIcon,
  Pane,
  Paragraph,
  Popover,
  Position,
  SelectField,
  SideSheet,
  Tab,
  Table,
  Tablist,
  Text,
  TextDropdownButton,
  TextInputField,
};
