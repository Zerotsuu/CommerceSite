import React, { useState } from 'react';
import { AlertTriangle, Plus, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ImportDialogProps {
  onImportSuccess: () => void;
}

export function ImportDialog({ onImportSuccess }: ImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anilistId, setAnilistId] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const { toast } = useToast();

  const resetForm = () => {
    setAnilistId('');
    setImportError('');
    setIsImporting(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const importManga = async () => {
    if (!anilistId.trim()) {
      setImportError('Please enter an Anilist ID');
      return;
    }

    setIsImporting(true);
    setImportError('');

    try {
      const id = parseInt(anilistId);
      if (isNaN(id) || id <= 0) {
        throw new Error('Please enter a valid Anilist ID');
      }

      console.log('Sending import request for ID:', id);

      const response = await fetch('/api/manga/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anilistId: id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import manga');
      }

      console.log('Import successful:', data);

      toast({
        title: "Success",
        description: "Manga imported successfully",
      });
      
      onImportSuccess();
      handleClose();
    } catch (error) {
      console.error('Import error:', error);
      const message = error instanceof Error ? error.message : 'Failed to import manga';
      setImportError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Import New Manga
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Manga from Anilist</DialogTitle>
          <DialogDescription>
            Enter the Anilist ID of the manga you want to import.
            You can find this ID in the URL of the manga page on Anilist (e.g., https://anilist.co/manga/30002).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="anilistId" className="text-right">
              Anilist ID
            </Label>
            <Input
              id="anilistId"
              type="number"
              value={anilistId}
              onChange={(e) => {
                setAnilistId(e.target.value);
                setImportError('');
              }}
              className="col-span-3"
              placeholder="e.g., 30002"
              disabled={isImporting}
            />
          </div>
          {importError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleClose} 
            variant="outline" 
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button 
            onClick={importManga} 
            disabled={isImporting || !anilistId.trim()}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              'Import'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}