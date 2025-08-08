
import { Check, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { t } = useLanguage();

  if (!password) return null;

  const requirements: PasswordRequirement[] = [
    {
      label: t('auth.requirements.uppercase'),
      test: (password) => /[A-Z]/.test(password)
    },
    {
      label: t('auth.requirements.lowercase'),
      test: (password) => /[a-z]/.test(password)
    },
    {
      label: t('auth.requirements.number'),
      test: (password) => /[0-9]/.test(password)
    },
    {
      label: t('auth.requirements.min_length'),
      test: (password) => password.length >= 8
    }
  ];

  const validRequirements = requirements.filter(req => req.test(password)).length;
  const allValid = validRequirements === requirements.length;

  return (
    <div className="mt-2 space-y-2">
      <div className="text-sm font-medium">
        {t('auth.password_requirements_title')} ({validRequirements}/{requirements.length})
      </div>
      <div className="space-y-1">
        {requirements.map((requirement, index) => {
          const isValid = requirement.test(password);
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              {isValid ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span className={isValid ? 'text-green-600' : 'text-gray-600'}>
                {requirement.label}
              </span>
            </div>
          );
        })}
      </div>
      {allValid && (
        <div className="text-sm text-green-600 font-medium">
          ✓ {t('auth.password_valid')}
        </div>
      )}
    </div>
  );
}
