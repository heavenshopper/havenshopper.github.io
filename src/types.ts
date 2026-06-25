export interface Product {
  name: string;
  detail: string;
  price: string | number;
  image: string;
  shopeeLink: string;
  stock: string;
  category: string;
  _rowIndex: number;
}

export type CategoryKey =
  | 'all'
  | 'new'
  | 'promotion'
  | 'common'
  | 'gaming'
  | 'gadget it'
  | 'motorcycle/car parts'
  | 'sport'
  | 'music equipment';

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  iconName: string;
}
