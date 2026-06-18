import React from 'react';
import type { ComponentType } from 'react';
import {
  ArrowLeft,
  Barcode,
  Bell,
  Camera,
  Check,
  ChevronDown,
  Chrome,
  CircleAlert,
  CircleHelp,
  CirclePlus,
  CircleX,
  Eye,
  EyeOff,
  ImagePlus,
  LockKeyhole,
  Mail,
  MonitorCog,
  Moon,
  Plus,
  ScanBarcode,
  Search,
  Settings,
  Sun,
  User,
  X,
  type LucideProps
} from 'lucide-react-native';

type PaperIconProps = {
  name: string;
  color?: string;
  size: number;
  direction?: 'rtl' | 'ltr' | null;
  testID?: string;
};

type LucideComponent = ComponentType<LucideProps>;

const icons: Record<string, LucideComponent> = {
  'account-outline': User,
  'alert-circle': CircleAlert,
  'arrow-left': ArrowLeft,
  'barcode-scan': ScanBarcode,
  bell: Bell,
  camera: Camera,
  check: Check,
  'check-bold': Check,
  'chevron-down': ChevronDown,
  close: X,
  'close-circle': CircleX,
  cog: Settings,
  'cog-outline': Settings,
  'email-outline': Mail,
  eye: Eye,
  'eye-off': EyeOff,
  google: Chrome,
  'image-plus': ImagePlus,
  'information-outline': CircleHelp,
  'lock-outline': LockKeyhole,
  magnify: Search,
  'menu-down': ChevronDown,
  moon: Moon,
  'monitor-cog': MonitorCog,
  plus: Plus,
  'plus-circle': CirclePlus,
  qrcode: Barcode,
  scan: ScanBarcode,
  sun: Sun
};

export function renderPaperIcon({ name, color = '#191113', size, direction, testID }: PaperIconProps) {
  const Icon = icons[name] ?? CircleHelp;

  return (
    <Icon
      color={color}
      size={size}
      strokeWidth={2}
      testID={testID}
      style={{ transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }] }}
    />
  );
}

export function paperIcon(name: string) {
  return ({ color, size, direction, testID }: Partial<Omit<PaperIconProps, 'name'>> & Pick<PaperIconProps, 'size'>) =>
    renderPaperIcon({ name, color, size, direction, testID });
}
