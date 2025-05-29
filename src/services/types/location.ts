export type Location = {
  uid: string;
  Location_id: string;
  name: string;
  address: string;
  coordinates: {
    y: string;
    x: string;
  };
  open_hours: string;
  grand_opening: string;
  soft_opening: string;
  washhall_size: string;
  max_height: string;
  wheel_width: string;
  mirror_length: string;
  wash_name: string;
  country_id: string;
  region: string;
  region_name: string;
  has_addons: string; // Could also be boolean if normalized later
  service_units: {
    hall: {
      total_count: number;
      machine_type: string;
    };
    self_wash: {
      total_count: number;
      details: {
        uid: string;
        name: string;
        service_unit_model_name: string;
      }[];
    };
    mat_cleaner: {
      total_count: number;
      details: any[]; // could also be empty object[], if structure known
    };
    vacuum: {
      total_count: number;
      details: any[];
    };
    pre_wash: {
      total_count: number;
      details: any[];
    };
  };
  infoscreen: string;
  message: string;
  hidden: number;
  post_id: string;
  url: string;
  skip_count: number;
  halls_count: number;
  image: string;
};
