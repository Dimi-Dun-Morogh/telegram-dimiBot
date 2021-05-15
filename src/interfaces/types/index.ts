type ID = string | number;

type DataObj = {
  [key in string | number]: any;
};

type GenreObj = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type AnimeObj = {
  title: string;
  url: string;
  image_url?: string;
  trailer_url?: string;
  status: string;
  duration: string;
  rating: string;
  synopsis: string;
  genres: [GenreObj];
  episodes: number;
  aired: { string: string };
};

type CommandsObj = {
  [key in string] : string | Array<string> | Array<RegExp> | RegExp
};

export {
  ID, DataObj, AnimeObj, CommandsObj,
};
