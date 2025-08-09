
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { useUserDecks } from "@/hooks/useUserDecks";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es, enUS, de, fr, it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const getFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("tournament.form.errors.name_required")),
    location: z.string().optional(),
    date: z.date({
      required_error: t("tournament.form.errors.date_required"),
    }),
    totalMatches: z
      .number()
      .min(1, t("tournament.form.errors.totalMatches_min"))
      .max(20, t("tournament.form.errors.totalMatches_max")),
    defaultDeckId: z.string().optional(),
  });

type FormData = z.infer<ReturnType<typeof getFormSchema>>;

interface TournamentFormProps {
  onSuccess?: () => void;
}

export function TournamentForm({ onSuccess }: TournamentFormProps) {
  const { addTournament } = useLorcana();
  const { decks } = useUserDecks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, language } = useLanguage();
  const formSchema = getFormSchema(t);
  const localeMap = { es, en: enUS, de, fr, it } as const;
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      date: new Date(),
      totalMatches: 3,
      defaultDeckId: ""
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Find the selected default deck
      const defaultDeck = data.defaultDeckId && data.defaultDeckId !== ""
        ? decks.find(deck => deck.id === data.defaultDeckId)
        : undefined;
      
      addTournament({
        name: data.name,
        location: data.location || undefined,
        date: data.date,
        totalMatches: data.totalMatches,
        defaultDeck: defaultDeck ? {
          name: defaultDeck.name,
          colors: defaultDeck.colors
        } : undefined
      });
      
      // Reset form with proper default values
      form.reset({
        name: "",
        location: "",
        date: new Date(),
        totalMatches: 3,
        defaultDeckId: ""
      });
      
      toast.success(t('tournament.form.success'));
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error(t('tournament.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('tournament.create')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('tournament.form.name')}</Label>
            <Input
              id="name"
              placeholder={t('tournament.form.name_placeholder')}
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('tournament.form.location_optional')}</Label>
            <Input
              id="location"
              placeholder={t('tournament.form.location_placeholder')}
              {...form.register("location")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalMatches">{t('tournament.form.total_matches')}</Label>
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
            <Label>{t('tournament.form.default_deck_optional')}</Label>
            <Select onValueChange={(value) => form.setValue("defaultDeckId", value)} value={form.watch("defaultDeckId")}>
              <SelectTrigger>
                <SelectValue placeholder={t('tournament.form.default_deck_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-deck">{t('tournament.form.no_default_deck')}</SelectItem>
                {decks.map((deck) => (
                  <SelectItem key={deck.id} value={deck.id}>
                    {deck.name} ({deck.colors.join(', ')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('tournament.form.default_deck_help')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t('tournament.form.date')}</Label>
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
                    format(form.watch("date"), "PPP", { locale: localeMap[language] })
                  ) : (
                    <span>{t('tournament.form.select_date')}</span>
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
            {isSubmitting ? t('tournament.form.submitting') : t('tournament.form.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
