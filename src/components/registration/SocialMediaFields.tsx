import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface SocialMediaFieldsProps {
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const platforms = [
  { key: 'youtube', label: 'YouTube' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'twitter', label: 'X (Twitter)' },
  { key: 'whatsappChannel', label: 'WhatsApp Channel' },
];

const SocialMediaFields = ({ formData, onChange }: SocialMediaFieldsProps) => {
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>(
    formData.enabledPlatforms || []
  );

  const togglePlatform = (key: string) => {
    const updated = enabledPlatforms.includes(key)
      ? enabledPlatforms.filter((p) => p !== key)
      : [...enabledPlatforms, key];
    setEnabledPlatforms(updated);
    onChange({ enabledPlatforms: updated });
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-foreground">Social Media Presence</Label>
      {platforms.map((platform) => (
        <div key={platform.key} className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={enabledPlatforms.includes(platform.key)}
              onCheckedChange={() => togglePlatform(platform.key)}
            />
            <Label className="text-sm">{platform.label}</Label>
          </div>
          {enabledPlatforms.includes(platform.key) && (
            <div className="ml-6 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
              <div>
                <Label className="text-xs text-muted-foreground">ID / Handle</Label>
                <Input
                  placeholder={`${platform.label} ID`}
                  value={formData[`${platform.key}Id`] || ''}
                  onChange={(e) => onChange({ [`${platform.key}Id`]: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Subscriber Count</Label>
                <Input
                  placeholder="Count"
                  type="number"
                  value={formData[`${platform.key}Subscribers`] || ''}
                  onChange={(e) => onChange({ [`${platform.key}Subscribers`]: e.target.value })}
                />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Checkbox
                  checked={formData[`${platform.key}Verified`] || false}
                  onCheckedChange={(checked) => onChange({ [`${platform.key}Verified`]: checked })}
                />
                <Label className="text-xs text-muted-foreground">Verified Badge</Label>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SocialMediaFields;
