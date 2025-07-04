
import { Check, X } from 'lucide-react';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

const requirements: PasswordRequirement[] = [
  {
    label: 'Al menos una mayúscula',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    label: 'Al menos una minúscula',
    test: (password) => /[a-z]/.test(password)
  },
  {
    label: 'Al menos un número',
    test: (password) => /[0-9]/.test(password)
  },
  {
    label: 'Mínimo 6 caracteres',
    test: (password) => password.length >= 6
  }
];

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const validRequirements = requirements.filter(req => req.test(password)).length;
  const allValid = validRequirements === requirements.length;

  return (
    <div className="mt-2 space-y-2">
      <div className="text-sm font-medium">
        Requisitos de contraseña ({validRequirements}/{requirements.length})
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
          ✓ Contraseña válida
        </div>
      )}
    </div>
  );
}
