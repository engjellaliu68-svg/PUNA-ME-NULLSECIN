export enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN"
}

export type Offer = {
  id: string;
  jobId: string;
  providerId: string;
  price: number;
  message?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
};
