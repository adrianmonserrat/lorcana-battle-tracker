
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/components/auth/AuthProvider';

export function ProfileForm() {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile(displayName.trim());
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando perfil...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Nombre para mostrar</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ingresa tu nombre o apodo"
              disabled={isUpdating}
            />
            <p className="text-sm text-muted-foreground">
              Este nombre se mostrará en lugar de tu email en la aplicación
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isUpdating || !displayName.trim() || displayName === profile?.display_name}
          >
            {isUpdating ? 'Actualizando...' : 'Actualizar Perfil'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
