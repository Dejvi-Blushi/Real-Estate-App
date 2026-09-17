export type FormData = {
  id: number;
  title: string;
  description: string;
  price: number;
  area_size: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  listing_type: string;
  property_type: string;
  latitude: number;
  longtitude: number;
  user_id: string;
  city: string;
  contact_info: string;
};

export type ImageFiles = {
  images: File[];
};

export type FullFormData = FormData & ImageFiles;

export type MarkerPosition = {
  markerPosition: L.LatLng | null;
};

export type ListingFetchedData = Pick<
  FormData,
  | "id"
  | "title"
  | "price"
  | "bedrooms"
  | "latitude"
  | "longtitude"
  | "bathrooms"
  | "listing_type"
  | "address"
  | "city"
  | "area_size"
  | "property_type"
> & {
  listing_images: {path: string; position?: number}[];
  description?: string;
  contact_info?: string;
};

export type ListingsMarkers = {
  listings: ListingFetchedData[];
};

export type Filters = {
  city: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
};

export type ContactData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};
