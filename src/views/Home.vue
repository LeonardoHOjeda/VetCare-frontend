<template>
  <div class="min-h-screen bg-purple-50">
    <!-- Header -->
    <header class="bg-purple-600 text-white p-6 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <img :src="logo" alt="VetCare Logo" class="h-12 w-12" />
        <h1 class="text-3xl font-bold">VetCare</h1>
      </div>
      <nav class="flex space-x-6">
        <RouterLink to="/" class="hover:text-purple-300">Inicio</RouterLink>
        <RouterLink to="/services" class="hover:text-purple-300">Nuestros Servicios</RouterLink>
        <RouterLink to="/contact" class="hover:text-purple-300">Contáctanos</RouterLink>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="bg-white p-16 text-center">
      <h2 class="text-5xl font-extrabold text-purple-700">El mejor lugar para tus mascotas</h2>
      <p class="mt-4 text-lg text-gray-600">Únete a una comunidad en crecimiento para brindarles a tus mascotas el cuidado que merecen.</p>
      <div class="mt-6 flex justify-center space-x-4">
        <button class="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500">Our Services</button>
        <button class="border border-purple-600 text-purple-600 px-6 py-2 rounded hover:bg-purple-100">Contact Us</button>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-12 px-8">
      <h3 class="text-3xl font-semibold text-center text-purple-700 mb-8">Why Choose Us</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-xl font-semibold text-purple-700">+200 cirugias</h4>
          <p class="mt-4 text-gray-600">Our team of experienced veterinarians and staff are dedicated to providing the best care for your pets.</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-xl font-semibold text-purple-700">+1.6k Tratamientos</h4>
          <p class="mt-4 text-gray-600">Our clinic is equipped with the latest technology to ensure your pets receive the best possible care.</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h4 class="text-xl font-semibold text-purple-700">+1k Clientes satisfechos</h4>
          <p class="mt-4 text-gray-600">Our clinic is equipped with the latest technology to ensure your pets receive the best possible care.</p>
        </div>
      </div>
    </section>

    <!-- Feature Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12">
      <FeatureCard title="200+ Surgeries Done" icon="🩺" />
      <FeatureCard title="1.6K Pets Treated" icon="🐶" />
      <FeatureCard title="1K Happy Customers" icon="🎉" />
    </section>

    <!-- Special Offers Section -->
    <section class="bg-purple-50 py-12">
      <h3 class="text-3xl font-semibold text-center text-purple-700 mb-8">Special Offers</h3>
      <div class="flex space-x-6 overflow-x-auto px-8">
        <OfferCard image="https://via.placeholder.com/150" />
        <OfferCard image="https://via.placeholder.com/150" />
        <OfferCard image="https://via.placeholder.com/150" />
      </div>
    </section>

    <!-- Our Services Section -->
    <section class="py-12 px-8">
      <h3 class="text-3xl font-semibold text-center text-purple-700 mb-8">Our Services</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ServiceCard title="Consultations" />
        <ServiceCard title="Vaccinations" />
        <ServiceCard title="Boarding & Daycare" />
        <ServiceCard title="Grooming" />
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-purple-600 text-white py-6 text-center">
      <p class="text-sm">© 2024 VetCare. All rights reserved.</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const logo = '/path-to-your-logo/VetCare.png'
</script>

<script lang="ts">
export default {
  components: {
    FeatureCard: {
      props: ['title', 'icon'],
      template: `
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-5xl mb-4">{{ icon }}</div>
          <h3 class="text-xl font-bold text-purple-700">{{ title }}</h3>
        </div>
      `
    },
    OfferCard: {
      props: ['image'],
      template: `
        <div class="min-w-[150px] rounded-lg overflow-hidden shadow-md">
          <img :src="image" alt="Offer Image" class="w-full h-32 object-cover" />
          <div class="p-4 text-center">
            <p class="text-gray-600">Lorem ipsum dolor sit amet.</p>
            <button class="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500">
              Book Now
            </button>
          </div>
        </div>
      `
    },
    ServiceCard: {
      props: ['title'],
      template: `
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <h4 class="text-xl font-semibold text-purple-700">{{ title }}</h4>
        </div>
      `
    }
  }
}
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
