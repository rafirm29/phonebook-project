export interface IPhones {
  number: string;
}

export interface IContact {
  created_at: string;
  first_name: string;
  last_name: string;
  id: number;
  phones: IPhones[];
}
