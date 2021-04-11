import { Schema, model, Document } from "mongoose";
import { clanSchema, IClan } from "./Clan";

export interface IClanApplication {
  author_id: string;
  embed_id: string;
  clan: IClan;
}

export interface IClanApplicationDoc extends IClanApplication, Document {}

const ClanApplicationSchemaFields: Record<keyof IClanApplication, any> = {
  author_id: {
    type: String,
    required: true,
  },
  embed_id: {
    type: String,
    required: true,
  },
  clan: {
    type: clanSchema,
    required: true,
  },
};

const ClanApplicationSchema = new Schema(ClanApplicationSchemaFields, {
  timestamps: true,
});

const ClanApplication = model<IClanApplicationDoc>(
  "ClanApplication",
  ClanApplicationSchema
);
export default ClanApplication;
