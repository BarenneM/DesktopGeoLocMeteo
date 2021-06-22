export default {
    data(){
      return{
        user: '',
        password: '',
        error: null
      }
    },
    methods:{
      connect: async function(){
        console.log('Connexion : ' + this.user + this.password)
        const cryptedData = window.btoa(this.user + ':' + this.password)
        await fetch('http://localhost:8080/gsb/user/' + this.user.toLowerCase(), {
          method: 'GET',
          headers:{
            "Content-type": "application/json",
            "Authorization": "Basic " + cryptedData
          },
          credentials: "include"
        })
        .then((response) => {
          if(response.status === 401){
            this.error = 'Bad login or password'
            console.log('Unauthorized')
          }else{
            this.$router.push('/')
            //localStorage.setItem('username', this.user)
            this.$store.dispatch('setLogin', this.user)
            //console.log('user ' + this.user + ' connecté')
            return response.json()
          } 
        })
        .then((data) => {
          console.log(data)
        })
      }
    }
  }