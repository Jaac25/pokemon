import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs';
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
    })
    for(let i = 0;i<responsePokemons.length;i++){
      let name = responsePokemons[i].pokemon_species.name
      let id: string = ""
      let picture: string = ""
      await this.http.get('https://pokeapi.co/api/v2/pokemon-species/'+name).forEach((pokemon: any) => {
        id = pokemon.id
        picture = this.getImage(id)
      }) 
      pokemons.push({
        id,
        name,
        picture
      })        
    }
    return pokemons    
  }

  async getTypes() {
    let types: object[] = []
    await this.http.get('https://pokeapi.co/api/v2/type').forEach((response: any) => {
      types = response.results
    })
    return types    
  }

  async getColors() {
    let colors: object[] = []
    await this.http.get('https://pokeapi.co/api/v2/pokemon-color').forEach((response: any) => {
      colors = response.results
    })
    return colors    
  }

  async getGenders() {
    let genders: string[] = []
    genders.push("all")
    await this.http.get('https://pokeapi.co/api/v2/gender').forEach((response: any) => {
      for(let i = 0;i<response.results.length;i++){
        genders.push(response.results[i].name)
      }
    })
    return genders    
  }

  async get20Pokemons(indice: number) {
    let pokemonsResponse: any[] = []
    let pokemons: any[] = []
    let nextUrl: string = "";
    await this.http.get('https://pokeapi.co/api/v2/pokemon?limit=20&offset='+indice).forEach((response: any) => {
      pokemonsResponse = response.results
      nextUrl = response.next
    })
    for(let i = 0;i<pokemonsResponse.length;i++){
      let name = pokemonsResponse[i].name
      let id: string = ""
      let picture: string = ""
      await this.http.get('https://pokeapi.co/api/v2/pokemon-species/'+name).forEach((pokemon: any) => {
        id = pokemon.id
        picture = this.getImage(id)
      })
      await this.http.get('https://pokeapi.co/api/v2/pokemon/'+id).forEach((pokemon: any) => {
        id = pokemon.id
        picture = this.getImage(id)
      }) 
      pokemons.push({
        id,
        name,
        picture
      })        
    }
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

  async getPokemonsByType(type:string){
    let pokemonsByType: any[] = []
    await this.http.get('https://pokeapi.co/api/v2/type/'+type).forEach((response: any) => {
      for(let i = 0;i<response.pokemon.length;i++){
        pokemonsByType.push({
          name: response.pokemon[i].pokemon.name
        })
      }
    })
    return pokemonsByType
  }

  async getPokemonsByColor(color:string){
    let pokemonsByColor: any[] = []
    await this.http.get('https://pokeapi.co/api/v2/pokemon-color/'+color).forEach((response: any) => {
        pokemonsByColor = response.pokemon_species
    })
    return pokemonsByColor
  }

  async getPokemonsByGender(gender: string){
    let pokemonsByGender: any[] = []
    await this.http.get('https://pokeapi.co/api/v2/gender/'+gender).forEach((response: any) => {
      for (let i = 0;i<response.pokemon_species_details.length;i++){
        let pokemon = response.pokemon_species_details[i].pokemon_species
        pokemonsByGender.push(pokemon)
      }
    })
    return pokemonsByGender
  }

  async getInfoPokemon(id: string){
    let name : string = ""
    let description : string = ""
    let height: string = ""
    let weight: string = ""
    let category: string = ""
    let gender: string = ""
    let habitat: string = ""
    let color: string = ""
    let types: any[] = []
    let evolution: string = ""
    let picture: string = this.getImageFull(id)
    
    await this.http.get('https://pokeapi.co/api/v2/pokemon/'+id).forEach((pokemon: any) => {  
      name = pokemon.name
      height = pokemon.height
      weight = pokemon.weight
      types = pokemon.types
    })
    await this.http.get('https://pokeapi.co/api/v2/pokemon-species/'+id).forEach((pokemon: any) => {  
      if (pokemon.gender_rate == 1){
        gender = "female"
      }else if(pokemon.gender_rate == 2){
        gender = "male"
      }else{
        gender = "genderless"
      }
      habitat = pokemon.habitat.name
      color = pokemon.color.name
      evolution =pokemon.evolution_chain
    })
    
    return new Pokemon(
      name,
      id,
      description,
      height,
      weight,
      category,
      gender,
      habitat,
      color,
      types,
      evolution,
      picture
    )
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

  getImageFull(id:string){
    let newId:string = id+""
    if(newId.length == 1){
      newId = "00"+id
    }else if(newId.length == 2){
      newId = "0"+id
    }
    return "https://assets.pokemon.com/assets/cms2/img/pokedex/full/"+newId+".png"
  }
}
