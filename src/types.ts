export type Country = 'NL' | 'DE' | 'AT'
export type ActivityKind = 'sight' | 'train' | 'bus' | 'drive' | 'food' | 'hotel' | 'note'

export interface Activity {
  id: string
  time: string
  title: string
  detail: string
  kind: ActivityKind
  transport?: string
  cost?: string
  payment?: string
  booked?: boolean
  important?: boolean
}

export interface TripDay {
  id: string
  day: number
  date: string
  weekday: string
  city: string
  country: Country
  title: string
  hotel: string
  note?: string
  activities: Activity[]
}

export interface Booking {
  id: string
  date: string
  title: string
  detail: string
  price: string
  status: 'booked' | 'urgent' | 'soon' | 'optional'
  url?: string
}
