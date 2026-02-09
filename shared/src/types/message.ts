export enum MessageStatus {
  SENT = "SENT",
  READ = "READ"
}

export type Message = {
  id: string;
  jobId: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: MessageStatus;
  createdAt: string;
  readAt?: string;
};
