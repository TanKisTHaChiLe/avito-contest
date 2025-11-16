export type Ad = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  categoryId: number;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  priority: 'normal' | 'urgent';
  createdAt: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    totalAds: number;
    registeredAt: string;
  };
  moderationHistory: ModerationAction[];
  characteristics: Record<string, string>;
};

export type ModerationAction = {
  id: string;
  moderatorName: string;
  action: 'approved' | 'rejected' | 'changes_requested';
  timestamp: string;
  comment?: string;
};

export type AdsFilter = {
  status: string[];
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search: string;
  sortBy: 'createdAt' | 'price' | 'priority';
  sortOrder: 'asc' | 'desc';
};
