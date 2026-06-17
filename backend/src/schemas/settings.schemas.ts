import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    theme: z.enum(['system', 'light', 'dark']).optional(),
    currency: z.string().length(3).optional(),
    locale: z.string().min(2).max(20).optional(),
    lowStockAlertsEnabled: z.boolean().optional(),
    pushNotificationsEnabled: z.boolean().optional(),
    emailReportsEnabled: z.boolean().optional(),
    defaultLowStockThreshold: z.coerce.number().int().min(0).optional()
  })
});
