export interface INotification {
  id: number;
  content: string;
  url: string;
  recipient_id: number;
  recipient_type: string;
  is_read: boolean;
}
