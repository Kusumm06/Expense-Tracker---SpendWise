import { Coffee, Car, ShoppingBag, Receipt, HeartPulse, MoreHorizontal } from 'lucide-react';

export const CATEGORIES = [
  { value: 'Food', label: 'Food & Dining', color: '#F59E0B', icon: Coffee },
  { value: 'Travel', label: 'Travel & Transport', color: '#3B82F6', icon: Car },
  { value: 'Shopping', label: 'Shopping', color: '#EC4899', icon: ShoppingBag },
  { value: 'Bills', label: 'Bills & Utilities', color: '#8B5CF6', icon: Receipt },
  { value: 'Health', label: 'Health & Fitness', color: '#EF4444', icon: HeartPulse },
  { value: 'Other', label: 'Other', color: '#64748B', icon: MoreHorizontal },
];

export const getCategoryConfig = (categoryValue) => {
  return CATEGORIES.find(c => c.value === categoryValue) || CATEGORIES[CATEGORIES.length - 1];
};
