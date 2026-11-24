type ListingFormData = {
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

type ImageFiles = {
  images: File[];
};

type FullFormData = ListingFormData & ImageFiles;

type MarkerPosition = {
  markerPosition: L.LatLng | null;
};

type ListingFetchedData = Pick<
  ListingFormData,
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

type ListingsMarkers = {
  listings: ListingFetchedData[];
};

type Filters = {
  page: string;
  city: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
};

type ContactData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

type ListingType = "rent" | "sell";

type Coordinates = {lat: number; lng: number};

type MarkerState = {
  markerPosition?: Coordinates | null;
  setMarkerPosition?: React.Dispatch<React.SetStateAction<Coordinates | null>>;
};
