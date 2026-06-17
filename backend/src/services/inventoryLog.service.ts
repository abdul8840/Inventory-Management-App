import type { Types } from 'mongoose';
import { InventoryLogModel, type INVENTORY_ACTIONS } from '../models/InventoryLog';

interface CreateInventoryLogInput {
  owner: string | Types.ObjectId;
  product?: string | Types.ObjectId;
  actor: string | Types.ObjectId;
  action: (typeof INVENTORY_ACTIONS)[number];
  quantityDelta?: number;
  stockAvailableBefore?: number;
  stockAvailableAfter?: number;
  stockSoldBefore?: number;
  stockSoldAfter?: number;
  note?: string;
  metadata?: Record<string, unknown>;
}

export function createInventoryLog(input: CreateInventoryLogInput) {
  return InventoryLogModel.create(input);
}
