export interface RESTResponse {
  msg: string;
  data: any;
  token?: string;
}

export interface ZodiacAndHoroscope {
  zodiac: string;
  horoscope: string;
}
