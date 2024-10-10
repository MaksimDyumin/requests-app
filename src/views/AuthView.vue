<template>
  <div class="auth-page">
    <div class="form-container">
      <div class="form-header">
        Авторизация
      </div>
      <span class="auth-error-label">{{ authError?.response?.data?.detail }}</span>
      <v-input v-model="phone" :type="'tel'" :labelText="'Логин или Телефон'" :iconNameStart="'mdi:phone'" />
      <v-input v-model="pass" :type="'pass'" :iconNameStart="'mdi:lock'" />
      <v-btn @click="sendForm()" class="send-form-btn">Войти</v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AuthView',
  components: {
  },
  data() {
    return {
      phone: '',
      pass: ''
    }
  },
  computed: {
    ...mapGetters({
      authError: 'user/authError'
    })
  },
  mounted() {

  },
  methods: {
    ...mapActions({
      auth: 'user/auth'
    }),
    async sendForm() {
      const username = this.phone.replace(/[+\-() ]/g, '')

      const requestBody = {
        username: username,
        password: this.pass,
        email: "",
      }
      const reqInfo = await this.auth(requestBody)
      if (reqInfo?.status) {
        this.$router.push('/')
      } else {
        this.$toast.error(this.authError?.response?.data?.detail);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$main-color: #50B053;


.auth-page {
  width: 100%;
  height: 100%;
  display: flex;
  background-image: url('https://s3-alpha-sig.figma.com/img/a7be/90cd/076dc3828d4323a8f6f5d083dfaff115?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NrOMWoqIyCWXNQ8D657ALGp2T8YI4do1maPnbwaOzQ~u3GD9iIRPvtZ6Qb74HcogX7XsZja1BQ3BoIh3S~-QJl4LpjzqKcEyTM1KJWvjL3uSq8noI1L2NQin5HdjoMcp0-zgCxEbTvxYjvkR7s4a3g~cMdgUkT44X8OUah~8d4x~4qhGk6OYa~ykr66HTDRmZ9sG1VAT3BYTOUs0BCRmV8zWjdkyA7HTX39aFXFPFsB8qRShB3MiQXbqBXwjcNPPzl7zLJtB2qEBEfZ5aVEIIHTIQ8lJmWp2PcFKL~n0mGbO8WiTt1FIO6~-1aybSv9ZYla15LNWh7hNq9XpDs96WA__');


  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 330px;
    height: 280px;
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    margin: auto;
    position: relative;

    .form-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 56px;
      width: 308px;
      text-align: center;
      background-color: $main-color;
      border-radius: 5px;
      transform: translateY(-51px);
      color: #fff;
    }

    .auth-error-label{
      color: red;
      position: absolute;
      top: 45px;
      padding: 0 20px;
    }
    .send-form-btn{
      margin-top: 28px;
    }
  }
}
</style>