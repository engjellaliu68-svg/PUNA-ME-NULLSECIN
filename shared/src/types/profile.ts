export enum ProfileType {
  INDIVIDUAL = "INDIVIDUAL",
  BUSINESS = "BUSINESS"
}

export type Profile = {
  id: string;
  userId: string;
  type: ProfileType;
  displayName: string;
  companyName?: string;
  bio?: string;
  phone?: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
};
