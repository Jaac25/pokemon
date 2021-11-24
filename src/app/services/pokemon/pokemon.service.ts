import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(
    private http : HttpClient
  ) { }

  async getAllPokemons() {
    let pokemons: object[] = []
    let responsePokemons: any[] = []
      await this.http.get('https://pokeapi.co/api/v2/pokedex/national').forEach((response: any) => { 
        responsePokemons = response.pokemon_entries
        for(let i = 0;i<responsePokemons.length;i++){
          let name = responsePokemons[i].pokemon_species.name
          let id: string = ""
          this.http.get('https://pokeapi.co/api/v2/pokemon-species/'+name).forEach((pokemon: any) => {
            id = pokemon.id
          }) 
          pokemons.push({
            id,
            name
          })        
        }
      })
      return pokemons    
    
  }

  async get20Pokemons(indice: number) {
    let pokemonsResponse: any[] = []
    let pokemons: any[] = []
    let nextUrl: string = "";
    console.log("1")
    await this.http.get('https://pokeapi.co/api/v2/pokemon?limit=20&offset='+indice).forEach((response: any) => {
      pokemonsResponse = response.results
      nextUrl = response.next
      console.log("2")
    })
    console.log("3")
    for(let i = 0;i<pokemonsResponse.length;i++){
      let name = pokemonsResponse[i].name
      let id: string = ""
      let img: string = ""
      await this.http.get('https://pokeapi.co/api/v2/pokemon-species/'+name).forEach((pokemon: any) => {
        id = pokemon.id
        img = this.getImage(id)
      }) 
      pokemons.push({
        id,
        name,
        picture: img
      })        
    }
    console.log("4")
    return {
      pokemons,
      nextUrl
    }
      /*for(let i = 0;i<response.pokemon_entries.length;i++){
        
        localStorage.setItem("pokemons",response.pokemon_entries[i].pokemon_species)
        await this.http.get('https://pokeapi.co/api/v2/pokemon/'+responsePokemons[i].name).forEach((pokemon: any) => {
          let newPokemon = new Pokemon(
            pokemon.name,
            pokemon.id,
            "descripcion",
            pokemon.height,
            pokemon.weight,
            "categoria",
            "gender_rate species",
            "habitat species",
            "color species",
            pokemon.types,
            "evol especies",
            pokemon.id.length == 
          )
        //console.log(responsePokemons[i].name)
        //await this.http.get('https://pokeapi.co/api/v2/pokemon/'+responsePokemons[i].name).forEach((pokemon: any) => {
          /*new Pokemon(
            pokemon.name,
            pokemon.id,
            "",
            pokemon.height,
            pokemon.weight,
            "",

          )
          console.log(pokemon)
        })
      }*/
    
    /*await this.http.get('https://pokeapi.co/api/v2/pokemon?limit=20&offset=890').forEach(async (response: any) => {
      console.log(response)
      responsePokemons = response.results
      for(let i = 0;i<responsePokemons.length;i++){
        //console.log(responsePokemons[i].name)
        await this.http.get('https://pokeapi.co/api/v2/pokemon/'+responsePokemons[i].name).forEach((pokemon: any) => {
          /*new Pokemon(
            pokemon.name,
            pokemon.id,
            "",
            pokemon.height,
            pokemon.weight,
            "",

          )
          console.log(pokemon)
        })
      }
      //new Pokemon(poke)
      //pokemons.push()
    })
    
    
    return [];*/
  }

  getImage(id:string){
    let newId:string = id+""
    if(newId.length == 1){
      newId = "00"+id
    }else if(newId.length == 2){
      newId = "0"+id
    }
    return "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/"+newId+".png"
  }
}
