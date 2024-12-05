export interface Cage {
  id: number
  name: string
  is_cleaned: boolean
  is_ocuppied: boolean
  food_level?: number
  water_level?: number
  temperature?: number
}
