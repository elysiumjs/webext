

export type Notification = {
  id?: string;
  text: string;
};

export type State = {
  notifications: Array<Required<Notification>>;
};