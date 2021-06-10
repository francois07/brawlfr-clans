import { Schema, model, Document } from "mongoose";

export interface IClan {
  guild_id: string;
  name: string;
  alias: string | null;
  discord: { url: string; private: boolean };
  leader_id: string;
  level: number;
  role_id?: string | null;
}

export interface IClanDoc extends IClan, Document {}

const ClanSchemaFields: Record<keyof IClan, any> = {
  guild_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 24,
  },
  alias: {
    type: String,
    maxLength: 6,
  },
  discord: {
    url: { type: String, required: true },
    private: { type: Boolean, default: false },
  },
  leader_id: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: Number,
    min: 0,
    max: 3,
    default: 0,
  },
  role_id: {
    type: String,
    default: null,
  },
};

export const clanSchema = new Schema(ClanSchemaFields, { timestamps: true });

const Clan = model<IClanDoc>("Clan", clanSchema);
export default Clan;
