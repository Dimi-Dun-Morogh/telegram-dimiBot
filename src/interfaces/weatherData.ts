export interface WeatherResponse {
  cod: string;
  message: number;
  cnt: number;
  list?: (ListEntity)[] | null;
  city: City;
}
export interface ListEntity {
  dt: number;
  main: Main;
  weather?: (WeatherEntity)[] | null;
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
  rain?: Rain | null;
}
export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}
export interface WeatherEntity {
  id: number;
  main: string;
  description: string;
  icon: string;
}
export interface Clouds {
  all: number;
}
export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}
export interface Sys {
  pod: string;
}
export interface Rain {
  [key:string]: number;
}
export interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}
export interface Coord {
  lat: number;
  lon: number;
}

export interface SerializedListEntity extends ListEntity {
  time: string
}

export interface ISerialized {
  weather_today: {
    [key:string]: SerializedListEntity
  };
  city: City;
}
