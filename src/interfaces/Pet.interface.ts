export interface Pet {
  id: string
  name: string
  breed_id: number
  owner_id: string
  birth_date: Date
  sterilized: boolean
  created_at: Date
  updated_at: Date
  deleted_at: null
  breed: Breed
  owner: Owner
}

interface Breed {
  id: number
  name: string
  specie: Specie
}

interface Specie {
  id: number
  name: string
}

interface Owner {
  id: string
  name: string
}
