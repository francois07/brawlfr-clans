import { Schema, model, Document } from "mongoose";

export interface IClanMemberApplication {
  author_id: string;
  clan_id: string;
}

export interface IClanMemberApplicationDoc
  extends IClanMemberApplication,
    Document {}

const ClanMemberApplicationSchemaFields: Record<
  keyof IClanMemberApplication,
  any
> = {
  author_id: {
    type: String,
    required: true,
  },
  clan_id: {
    type: String,
    required: true,
  },
};

const ClanMemberApplicationSchema = new Schema(
  ClanMemberApplicationSchemaFields,
  { timestamps: true }
);

const ClanMemberApplication = model<IClanMemberApplicationDoc>(
  "ClanMemberApplication",
  ClanMemberApplicationSchema
);
export default ClanMemberApplication;
