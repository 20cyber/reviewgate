export type CardStatus = "inactive" | "active";

export type Card = {
  id: string;
  unique_code: string;
  status: CardStatus;
  owner_id: string | null;
  store_name: string | null;
  google_review_url: string | null;
  activated_at: string | null;
  created_at: string;
};
