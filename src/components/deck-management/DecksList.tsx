
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { SavedDeck } from "@/types";
import { getInkColorHex } from "@/components/statistics/utils";
import { Trash2, Edit, Book, PlusCircle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { DeckForm } from "./DeckForm";
import { useIsMobile } from "@/hooks/use-mobile";

export function DecksList() {
  const { decks, deleteDeck } = useLorcana();
  const isMobile = useIsMobile();
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<SavedDeck | undefined>(undefined);
  
  const handleDeleteDeck = () => {
    if (deckToDelete) {
      deleteDeck(deckToDelete);
      setDeckToDelete(null);
    }
  };
  
  const handleEditDeck = (deck: SavedDeck) => {
    setEditingDeck(deck);
    setIsFormOpen(true);
  };
  
  const handleAddDeck = () => {
    setEditingDeck(undefined);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDeck(undefined);
  };
  
  const FormComponent = (
    <DeckForm 
      onClose={handleCloseForm} 
      editDeck={editingDeck}
    />
  );
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mis Mazos</CardTitle>
          <Button onClick={handleAddDeck} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Mazo
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {decks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Book className="mx-auto h-12 w-12 mb-4 opacity-30" />
              <p>No hay mazos guardados</p>
              <Button 
                variant="link" 
                onClick={handleAddDeck}
                className="mt-2"
              >
                Crea tu primer mazo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map(deck => (
                <Card key={deck.id} className="relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleEditDeck(deck)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => setDeckToDelete(deck.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{deck.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1 mb-1">
                        {deck.colors.map(color => (
                          <div 
                            key={color} 
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: getInkColorHex(color) }}
                            title={color}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {deck.format}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!deckToDelete} onOpenChange={(open) => !open && setDeckToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Mazo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este mazo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeckToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteDeck}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {isMobile ? (
        <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>{editingDeck ? 'Editar Mazo' : 'Nuevo Mazo'}</SheetTitle>
              <SheetDescription>
                Completa el formulario para {editingDeck ? 'actualizar el' : 'crear un nuevo'} mazo.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              {FormComponent}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDeck ? 'Editar Mazo' : 'Nuevo Mazo'}</DialogTitle>
              <DialogDescription>
                Completa el formulario para {editingDeck ? 'actualizar el' : 'crear un nuevo'} mazo.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {FormComponent}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
