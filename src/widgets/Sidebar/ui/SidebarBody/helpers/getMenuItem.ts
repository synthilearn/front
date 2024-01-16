import { MenuProps } from 'antd';

export type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children: !!children?.length ? children : undefined,
    label,
    type,
    disabled: Array.isArray(children) ? !children.length : false,
  } as MenuItem;
}
