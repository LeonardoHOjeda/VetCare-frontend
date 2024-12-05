import axiosClient from '@/network/client'

class AppointmentService {
  async fetchAppointments() {
    const appointments = await axiosClient.get('/appointments')

    return appointments.data
  }
}

export const appointmentService = new AppointmentService()
