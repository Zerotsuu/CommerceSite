// lib/anilist.ts

const ANILIST_ENDPOINT = 'https://graphql.anilist.co';

export type AnilistManga = {
  id: number;
  title: {
    romaji: string;
    english: string;
  };
  staff: {
    edges: Array<{
      node: {
        name: {
          full: string;
        };
      };
      role: string;
    }>;
  };
  genres: string[];
  coverImage: {
    large: string;
    medium: string;
  };
  description: string;
  averageScore: number;
  popularity: number;
  status: string;
  format: string;
  volumes: number | null;
  chapters: number | null;
};

const GET_MANGA_BY_ID_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    title {
      romaji
      english
    }
    staff {
      edges {
        node {
          name {
            full
          }
        }
        role
      }
    }
    genres
    coverImage {
      large
      medium
    }
    description(asHtml: false)
    averageScore
    popularity
    status
    format
    volumes
    chapters
  }
}`;

const VERIFY_MANGA_ID_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    title {
      english
      romaji
    }
    format
    status
  }
}`;

export class AnilistError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AnilistError';
  }
}

export const anilistService = {
  async verifyMangaId(id: number): Promise<boolean> {
    try {
      const response = await fetch(ANILIST_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: VERIFY_MANGA_ID_QUERY,
          variables: { id }
        })
      });

      if (!response.ok) {
        throw new AnilistError('Failed to verify manga ID');
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new AnilistError(data.errors[0].message, data.errors[0].status);
      }

      return data.data.Media?.format === 'MANGA' || data.data.Media?.format === 'ONE_SHOT';
    } catch (error) {
      if (error instanceof AnilistError) throw error;
      throw new AnilistError('Failed to verify manga ID');
    }
  },

  async getMangaById(id: number): Promise<AnilistManga> {
    try {
      const response = await fetch(ANILIST_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: GET_MANGA_BY_ID_QUERY,
          variables: { id }
        })
      });

      if (!response.ok) {
        throw new AnilistError('Failed to fetch manga data');
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new AnilistError(data.errors[0].message, data.errors[0].status);
      }

      // Verify it's actually a manga
      if (data.data.Media.format !== 'MANGA' && data.data.Media.format !== 'ONE_SHOT') {
        throw new AnilistError('ID does not correspond to a manga');
      }

      return data.data.Media;
    } catch (error) {
      if (error instanceof AnilistError) throw error;
      throw new AnilistError('Failed to fetch manga data');
    }
  },

  getAuthorFromStaff(staff: AnilistManga['staff']): string {
    const authorPriority = ['Story & Art', 'Story', 'Art', 'Original Story'];
    
    for (const role of authorPriority) {
      const authorEdge = staff.edges.find(edge => 
        edge.role.toLowerCase().includes(role.toLowerCase())
      );
      if (authorEdge) {
        return authorEdge.node.name.full;
      }
    }
    
    return 'Unknown Author';
  },

  formatMangaForDb(anilistManga: AnilistManga) {
    return {
      anilistId: anilistManga.id,
      title: anilistManga.title.english || anilistManga.title.romaji,
      author: this.getAuthorFromStaff(anilistManga.staff),
      genres: anilistManga.genres,
      price: 9.99, // Default price
      image: anilistManga.coverImage.medium,
      coverImage: anilistManga.coverImage.large,
      description: this.sanitizeDescription(anilistManga.description),
      averageScore: anilistManga.averageScore || 0,
      popularity: anilistManga.popularity || 0,
      volumes: anilistManga.volumes || 0,
      chapters: anilistManga.chapters || 0,
      status: this.normalizeStatus(anilistManga.status)
    };
  },

  sanitizeDescription(description: string): string {
    // Remove HTML tags if any
    const cleanDescription = description.replace(/<[^>]*>/g, '');
    // Decode HTML entities
    const decoded = cleanDescription.replace(/&[^;]+;/g, (entity) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = entity;
      return textarea.value;
    });
    return decoded.trim();
  },

  normalizeStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'FINISHED': 'Completed',
      'RELEASING': 'Ongoing',
      'NOT_YET_RELEASED': 'Upcoming',
      'CANCELLED': 'Cancelled',
      'HIATUS': 'On Hiatus'
    };
    return statusMap[status] || 'Unknown';
  }
};