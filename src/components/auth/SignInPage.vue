<script setup lang="ts">
const username = ref<string>('')
const password = ref<string>('')

let usernameRules = [
  (v: string) => !!v || 'Username is required',
]

let passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters',
]


</script>

<template>
  <div
    :style="{
      width:'100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url(http://res.cloudinary.com/blogweb/image/upload/v1730973208/pos/oiryqbpc5safyepd2cdu.jpg)',
      backgroundSize: 'cover'
    }"
  >
    <v-card :style="{ width:'30%', zIndex: 100 }">
      <v-form>
        <v-text-field
          v-model="username"
          :rules="usernameRules"
          label="Username"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
        ></v-text-field>

        <v-btn class="mt-2" type="submit" block>Submit</v-btn>
      </v-form>
    </v-card>
  </div>
  <div
    :style="{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1,
    }"
  ></div>
</template>

<style scoped lang="sass">

</style>
