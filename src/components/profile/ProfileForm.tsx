
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { sanitizeInput } from '@/lib/security';

export function ProfileForm() {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync displayName with profile data when it changes
  useEffect(() => {
    setDisplayName(profile?.display_name || '');
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile(displayName.trim());
      toast({
        title: t('profile.updated'),
        description: t('profile.updated_description'),
      });
    } catch (error) {
      // Error is already handled in the hook
      toast({
        title: t('profile.error'),
        description: t('profile.error_description'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('profile.loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">{t('profile.title')}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              readOnly
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              {t('profile.email_readonly')}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">{t('auth.display_name')}</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(sanitizeInput(e.target.value))}
              placeholder={t('profile.display_name_placeholder')}
              disabled={isUpdating}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {t('profile.display_name_help')}
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isUpdating || !displayName.trim() || displayName === profile?.display_name}
            className="w-full sm:w-auto"
          >
            {isUpdating ? t('profile.updating') : t('profile.update')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
