<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <img
        src="https://www.titanfile.com/wp-content/uploads/2023/01/Types-of-File-Sharing.png"
        alt="Logo"
        class="logo-image"
      />
      <span class="logo-text">FILES SHARE</span>
    </div>
    <div class="navbar-links">
      <RouterLink to="/" class="nav-link">Accueil</RouterLink>
      <RouterLink to="/files" class="nav-link">Explorer</RouterLink>
      <RouterLink v-for="title in titles" :key="title" :to="`/page/${title}`" class="nav-link">{{
        title
      }}</RouterLink>
    </div>
    <div class="dropdown" v-if="user">
      <button class="dropbtn">
        {{ user.name }}
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a href="#" @click="logout">Déconnexion</a>
        <a href="#">Paramètres</a>
        <a href="#">Aide</a>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const user = computed(() => userStore.user)
const router = useRouter()

const logout = (): void => {
  userStore.logout()
  router.push('/login')
}

const titles: string[] = ['À propos', 'Contact', 'Blog', 'Support']
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #333;
  padding: 0 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
.navbar-logo {
  display: flex;
  align-items: center;
  color: white;
}
.logo-image {
  max-height: 50px;
  margin-right: 10px;
  border-radius: 8px;
}
.logo-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
}

.navbar-links {
  display: flex;
  gap: 20px;
}
.nav-link {
  font-size: 16px;
  color: white;
  text-decoration: none;
  padding: 14px 16px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  border-radius: 10px;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #4caf50;
}

.dropdown {
  position: relative;
}
.dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  font-weight: 700;
  padding: 14px 16px;
  background-color: rgba(91, 93, 95, 0.732);
  font-family: inherit;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  height: 5%;
  border-radius: 10px;
}
.dropbtn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #4caf50;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #f9f9f9;
  min-width: 160px;
  max-width: 200px;
  border-radius: 10px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  overflow: hidden;
}
.dropdown-content a {
  display: block;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  border-radius: 10px;
}
.dropdown-content a:hover {
  background-color: #ddd;
  color: #4caf50;
}

.dropdown:hover .dropdown-content {
  display: block;
}

@media (max-width: 900px) {
  .navbar {
    flex-direction: row;
    align-items: flex-start;
    padding: 16px;
  }
  .navbar-links {
    width: 100%;
    flex-direction: column;
    gap: 5px;
    margin-top: 1px;
  }
  .nav-link {
    width: 100%;
    text-align: center;
  }
  .dropdown {
    width: 100%;
    text-align: center;
  }
  .dropbtn {
    width: 100%;
    text-align: left;
  }
}
</style>
