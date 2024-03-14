import { defineStore } from 'pinia'
import { films } from '../../data'

export const useCatalogStore = defineStore('catalogFilms', {
  
  state:()=>{
    return{
      catalogFilm:films,
      loading:false
    }
  },
  actions:{
    // async getCatalog(){
    //   try {
    //     this.loading=false
  
    //      const res= await  fetch('http://localhost:3000/films')
    //      const data=await res.json()
  
    //      this.catalogFilm = data
  
    //     this.loading=true
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    
    addTickets({tickets,nameIndex,sessionIndex}){
         this.catalogFilm[nameIndex.value].sessions[sessionIndex.value].tickets.push(...tickets)
      }
  },
  getters:{
    getAllFilms:(state)=>state.catalogFilm,
    getFilmByName:(state)=>{
      return (name)=>{
        return state.catalogFilm.find(film=>film.title===name)
      }
    },
  }
  }
)
