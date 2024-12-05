export interface Appointment {
  id: string
  date: string
  reason: string
  is_attended: boolean
  follow_up_date: string
  pet: Pet
}

export interface Pet {
  name: string
  breed: Breed
  owner: Breed
}

export interface Breed {
  name: string
}
