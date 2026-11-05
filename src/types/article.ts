export interface ArticleItem {
  id: string;
  slug: string;
  category: string;
  badge: string;
  badgeColor: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  tags: string[];
  featured: boolean;
  thumbnail: string;
}

export interface DbArticle {
  id: string;
  judul: string;
  isi: string | null;
  penulis: string;
  kategori: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

