import type { Cage } from '@/interfaces/Cage.interface'
import axiosClient from '@/network/client'

class CagesService {
  async fetchCages() {
    const cages = await axiosClient.get('/cages')

    return cages.data
  }

  async storeCage(cageData: Cage) {
    const cage = await axiosClient.post('/cages', cageData)

    return cage.data
  }

  async updateCage(cageId: number, cageData: any) {
    const cage = await axiosClient.put(`/cages/${cageId}`, cageData)

    return cage.data
  }
}

export const cagesService = new CagesService()
