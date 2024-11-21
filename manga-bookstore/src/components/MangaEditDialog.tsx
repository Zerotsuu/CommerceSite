import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { CustomUploadButton } from "@/components/UploadButton";

interface MangaEditDialogProps {
    manga: {
        id: number;
        title: string;
        author: string;
        description: string | null;
        price: number;
        image: string;
        anilistImage: string;
        genres: string[];
        status: string;
        volumes: number;
        chapters: number;
        averageScore: number;
        popularity: number;
    };
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function MangaEditDialog({
    manga,
    isOpen,
    onClose,
    onUpdate
}: MangaEditDialogProps) {
    const [formData, setFormData] = useState({
        title: manga.title || '',
    author: manga.author || '',
    description: manga.description || '',
    price: manga.price || 0,
    image: manga.image || '',
    status: manga.status || '',
    volumes: manga.volumes || 0,
    chapters: manga.chapters || 0,
    genres: [...(manga.genres || [])]
    });
    const [newGenre, setNewGenre] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('details');
    const { toast } = useToast();

    const handleImageChange = async (newImageUrl: string) => {
        try {
            const response = await fetch(`/api/manga/${manga.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: newImageUrl })
            });

            if (!response.ok) throw new Error('Failed to update image');

            setFormData(prev => ({ ...prev, image: newImageUrl }));
            toast({
                title: "Success",
                description: "Image updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update image",
                variant: "destructive",
            });
        }
    };

    const resetToAnilistImage = async () => {
        try {
            const response = await fetch(`/api/manga/${manga.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: manga.anilistImage })
            });

            if (!response.ok) throw new Error('Failed to reset image');

            setFormData(prev => ({ ...prev, image: manga.anilistImage }));
            toast({
                title: "Success",
                description: "Image reset to Anilist version",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reset image",
                variant: "destructive",
            });
        }
    };

    const addGenre = () => {
        if (newGenre && !formData.genres.includes(newGenre)) {
            setFormData(prev => ({
                ...prev,
                genres: [...prev.genres, newGenre]
            }));
            setNewGenre('');
        }
    };

    const removeGenre = (genreToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            genres: prev.genres.filter(genre => genre !== genreToRemove)
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/manga/${manga.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update manga');

            toast({
                title: "Success",
                description: "Manga updated successfully",
            });
            onUpdate();
            onClose();
        } catch (error) {
            setError('Failed to update manga');
            toast({
                title: "Error",
                description: "Failed to update manga",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Edit Manga</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="image">Cover Image</TabsTrigger>
                        <TabsTrigger value="genres">Genres</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="author">Author</Label>
                                <Input
                                    id="author"
                                    value={formData.author}
                                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="volumes">Volumes</Label>
                                <Input
                                    id="volumes"
                                    type="number"
                                    value={formData.volumes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, volumes: parseInt(e.target.value) }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="chapters">Chapters</Label>
                                <Input
                                    id="chapters"
                                    type="number"
                                    value={formData.chapters}
                                    onChange={(e) => setFormData(prev => ({ ...prev, chapters: parseInt(e.target.value) }))}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={6}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="image" className="space-y-4">
                        <div className="flex gap-8">
                            <div className="flex-1">
                                <h3 className="font-medium mb-2">Current Cover</h3>
                                <div className="relative aspect-[2/3] max-w-[300px]">
                                    <img
                                        src={formData.image}
                                        alt={formData.title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">Upload New Cover</h3>
                                    <CustomUploadButton
                                        onUploadComplete={(url) => handleImageChange(url)}
                                        onUploadError={(error) => {
                                            toast({
                                                title: "Error",
                                                description: error.message,
                                                variant: "destructive",
                                            });
                                        }}
                                    />
                                </div>
                                {formData.image !== manga.anilistImage && (
                                    <div>
                                        <Button
                                            variant="outline"
                                            onClick={resetToAnilistImage}
                                        >
                                            Reset to Anilist Cover
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="genres" className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add new genre..."
                                value={newGenre}
                                onChange={(e) => setNewGenre(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addGenre()}
                            />
                            <Button onClick={addGenre}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.genres.map((genre) => (
                                <Badge
                                    key={genre}
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => removeGenre(genre)}
                                >
                                    {genre} ×
                                </Badge>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}