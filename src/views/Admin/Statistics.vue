<template>
  <div class="statistics-page p-6 bg-gray-100 min-h-screen">
    <!-- Título principal -->
    <h1 class="text-2xl font-bold mb-6 text-center">Estadísticas de la Veterinaria</h1>

    <!-- Indicadores Clave -->
    <section class="key-metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="metric-card bg-white shadow-md rounded-md p-6 text-center">
        <p class="text-gray-500">Total de Mascotas</p>
        <h2 class="text-3xl font-bold">{{ totalPets }}</h2>
      </div>
      <div class="metric-card bg-white shadow-md rounded-md p-6 text-center">
        <p class="text-gray-500">Usuarios Registrados</p>
        <h2 class="text-3xl font-bold">{{ totalUsers }}</h2>
      </div>
      <div class="metric-card bg-white shadow-md rounded-md p-6 text-center">
        <p class="text-gray-500">Citas Realizadas</p>
        <h2 class="text-3xl font-bold">{{ totalAppointments }}</h2>
      </div>
      <div class="metric-card bg-white shadow-md rounded-md p-6 text-center">
        <p class="text-gray-500">Ingresos Totales (MXN)</p>
        <h2 class="text-3xl font-bold">${{ totalIncome }}</h2>
      </div>
    </section>

    <!-- Gráficos Principales -->
    <section class="charts grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <div class="chart-container bg-white shadow-md rounded-md p-6">
        <h2 class="text-xl font-bold mb-4 text-center">Distribución de Especies</h2>
        <Chart type="doughnut" :data="speciesChartData" />
      </div>
      <div class="chart-container bg-white shadow-md rounded-md p-6">
        <h2 class="text-xl font-bold mb-4 text-center">Citas por Mes</h2>
        <Chart type="bar" :data="appointmentsChartData" :options="chartOptions" />
      </div>
    </section>

    <!-- Comparativa de Servicios y Vacunas -->
    <section class="comparatives grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="chart-container bg-white shadow-md rounded-md p-6">
        <h2 class="text-xl font-bold mb-4 text-center">Servicios más Solicitados</h2>
        <Chart type="pie" :data="servicesChartData" />
      </div>
      <div class="chart-container bg-white shadow-md rounded-md p-6">
        <h2 class="text-xl font-bold mb-4 text-center">Vacunas Aplicadas</h2>
        <Chart type="polarArea" :data="vaccinesChartData" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Chart from 'primevue/chart'

// Indicadores clave
const totalPets = ref(150)
const totalUsers = ref(50)
const totalAppointments = ref(200)
const totalIncome = ref(35000)

// Datos para gráficos
const speciesChartData = ref({
  labels: ['Perros', 'Gatos', 'Aves', 'Reptiles', 'Otros'],
  datasets: [
    {
      data: [80, 50, 10, 5, 5],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }
  ]
})

const appointmentsChartData = ref({
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
  datasets: [
    {
      label: 'Citas Mensuales',
      data: [30, 40, 35, 50, 60, 45],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }
  ]
})

const servicesChartData = ref({
  labels: ['Consulta', 'Vacunación', 'Cirugía', 'Desparasitación'],
  datasets: [
    {
      data: [40, 30, 20, 10],
      backgroundColor: ['#FF9F40', '#FF6384', '#36A2EB', '#4BC0C0']
    }
  ]
})

const vaccinesChartData = ref({
  labels: ['Rabia', 'Moquillo', 'Parvovirus', 'Hepatitis', 'Leptospirosis'],
  datasets: [
    {
      data: [25, 30, 15, 20, 10],
      backgroundColor: ['#66BB6A', '#FFA726', '#29B6F6', '#AB47BC', '#EF5350']
    }
  ]
})

// Opciones de configuración
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      enabled: true
    }
  }
})
</script>

<style scoped>
.statistics-page {
  background-color: #f9f9f9;
}

.metric-card {
  text-align: center;
  padding: 1rem;
}

.chart-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>
