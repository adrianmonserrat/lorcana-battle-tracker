
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "El nombre del torneo es requerido"),
  location: z.string().optional(),
  date: z.date({
    required_error: "La fecha del torneo es requerida",
  }),
  totalMatches: z.number().min(1, "Debe haber al menos 1 partida").max(20, "Máximo 20 partidas")
});

type FormData = z.infer<typeof formSchema>;

interface TournamentFormProps {
  onSuccess?: () => void;
}

export function TournamentForm({ onSuccess }: TournamentFormProps) {
  const { addTournament } = useLorcana();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      date: new Date(),
      totalMatches: 3
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      addTournament({
        name: data.name,
        location: data.location,
        date: data.date,
        totalMatches: data.totalMatches
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Torneo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Torneo</Label>
            <Input
              id="name"
              placeholder="Ej: Torneo Local Lorcana"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación (Opcional)</Label>
            <Input
              id="location"
              placeholder="Ej: Tienda de Cartas Local"
              {...form.register("location")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalMatches">Número de Partidas</Label>
            <Input
              id="totalMatches"
              type="number"
              min="1"
              max="20"
              placeholder="3"
              {...form.register("totalMatches", { 
                valueAsNumber: true,
                min: 1,
                max: 20 
              })}
            />
            {form.formState.errors.totalMatches && (
              <p className="text-sm text-red-600">{form.formState.errors.totalMatches.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Fecha del Torneo</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("date") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("date") ? (
                    format(form.watch("date"), "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch("date")}
                  onSelect={(date) => form.setValue("date", date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.date && (
              <p className="text-sm text-red-600">{form.formState.errors.date.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear Torneo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
