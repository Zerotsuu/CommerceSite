'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { Search, Plus, RefreshCw, Trash, ArrowUpDown, Link, Edit, ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImportDialog } from "@/components/ImportDialog";
import { MangaEditDialog } from "@/components/MangaEditDialog";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import debounce from 'lodash/debounce';

type Manga = {
  id: number;
  anilistId: number;
  title: string;
  author: string;
  genres: string[];
  price: number;
  image: string;
  anilistImage: string;
  coverImage: string | null;
  description: string | null;
  averageScore: number;
  popularity: number;
  status: string;
  volumes: number;
  chapters: number;
};

type SortField = 'title' | 'price' | 'popularity' | 'averageScore';

export default function AdminDashboard() {
  const [manga, setManga] = useState<Manga[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editingManga, setEditingManga] = useState<Manga | null>(null);
  const { toast } = useToast();

  const fetchManga = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        sortBy: sortField,
        sortOrder: sortOrder,
        limit: '10'
      });

      const response = await fetch(`/api/manga/search?${params}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setManga(data.manga || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load manga",
        variant: "destructive",
      });
      setManga([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, page, sortField, sortOrder, toast]);

  useEffect(() => {
    fetchManga();
  }, [fetchManga]);

  const debouncedSearch = useCallback(
    debounce(() => fetchManga(), 300),
    [fetchManga]
  );

  const handleSort = (field: SortField) => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    setSortField(field);
    fetchManga();
  };

  const updateMangaDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/manga/${id}/update-details`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Update failed');

      await fetchManga();
      toast({
        title: "Success",
        description: "Manga details updated from Anilist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update manga details",
        variant: "destructive",
      });
    }
  };

  const deleteManga = async (id: number) => {
    try {
      const response = await fetch(`/api/manga/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');

      setManga(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Success",
        description: "Manga deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete manga",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manga Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your manga catalog, update details, and sync with Anilist.
          </p>
        </div>
        <ImportDialog onImportSuccess={fetchManga} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manga Library</CardTitle>
          <CardDescription>
            Browse and manage your manga collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Search by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                debouncedSearch();
              }}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Cover</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('title')}
                      className="font-semibold"
                    >
                      Title {sortField === 'title' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </Button>
                  </TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('price')}
                      className="font-semibold"
                    >
                      Price {sortField === 'price' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('popularity')}
                      className="font-semibold"
                    >
                      Stats {sortField === 'popularity' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : manga.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No manga found.
                    </TableCell>
                  </TableRow>
                ) : (
                  manga.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative w-16 h-24">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded"
                          />
                          {item.image !== item.anilistImage && (
                            <Badge
                              className="absolute -top-2 -right-2"
                              variant="secondary"
                            >
                              <ImageIcon className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.genres.slice(0, 3).map((genre) => (
                              <Badge key={genre} variant="outline" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                            {item.genres.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.genres.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            Score: {item.averageScore}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Pop: {item.popularity}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingManga(item)}
                            title="Edit details"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMangaDetails(item.id)}
                            title="Update from Anilist"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://anilist.co/manga/${item.anilistId}`)}
                            title="View on Anilist"
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteManga(item.id)}
                            title="Delete manga"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
                fetchManga();
              }}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage(p => Math.min(totalPages, p + 1));
                fetchManga();
              }}
              disabled={page === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {editingManga && (
  <MangaEditDialog
    manga={editingManga}
    isOpen={!!editingManga}
    onClose={() => setEditingManga(null)}
    onUpdate={() => {
      fetchManga();
      setEditingManga(null);
    }}
        />
      )}
    </div>
  );
}