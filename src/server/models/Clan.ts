import { Schema, model, Document } from "mongoose";

export interface IClan {
  guild_id: string;
  name: string;
  alias: string;
  discord_url: string;
  leader_id: string;
  level: number;
  role_id: string | null;
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
  },
  alias: {
    type: String,
    default: null,
  },
  discord_url: {
    type: String,
    required: true,
  },
  leader_id: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    min: 0,
    max: 3,
  },
  role_id: {
    type: String,
    default: null,
  },
};

export const clanSchema = new Schema(ClanSchemaFields, { timestamps: true });

const Clan = model<IClanDoc>("Clan", clanSchema);
export default Clan;
