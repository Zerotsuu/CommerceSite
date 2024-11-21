// lib/manga.ts

export type MangaSearchParams = {
    query?: string;
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'price' | 'popularity' | 'averageScore';
    sortOrder?: 'asc' | 'desc';
  };
  
