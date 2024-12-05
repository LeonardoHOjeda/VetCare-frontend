import axiosClient from '@/network/client'

class PetsService {
  async fetchPets() {
    const pets = await axiosClient.get('/pets')

    console.log('Pets:', pets)

    return pets.data
  }
}

export const petsService = new PetsService()
