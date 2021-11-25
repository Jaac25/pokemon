import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon/pokemon.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  loading: boolean
  loadMore: boolean
  nextUrl: string
  cantPokemons: number
  showArrow: boolean
  noElements: boolean
  showInfoPokemon: boolean
  haveEvolution: boolean

  pokemons: any[]
  types: any[]
  colors: any[]
  genders: any[]

  filters: {
    types: string[],
    colors: string[],
    genders: string[]
  }

  pokemon: Pokemon

  constructor(
    public pokemonService: PokemonService,
    private router: Router
  ) {
    this.loading = true
    this.loadMore = false
    this.nextUrl = ""
    this.cantPokemons = 0
    this.showArrow = false
    this.noElements = false
    this.showInfoPokemon = false
    this.haveEvolution = false

    this.pokemons = []
    this.types = []
    this.colors = []
    this.genders = []
    this.filters = {
      types: [],
      colors: [],
      genders: []
    }

    this.pokemon = new Pokemon("Charizard","6","Un pokemon dragón volador muy fuerte y gigante","17","905","","Female","mountain","red",[],[],"")
  }

  async ngOnInit(): Promise<void> {
    this.loading = true
    await this.getPokemons()
    await this.getTypes()
    await this.getColors()
    await this.getGenders()
    this.loading = false
    this.add20Pokemons()
    this.loadMore = true
  }
  async getPokemons() {
    let localPokemons = localStorage.getItem("allPokemons")
    if(localPokemons == null){
      let pokemonsResponse = await this.pokemonService.getAllPokemons()
      localStorage.setItem("allPokemons", JSON.stringify(pokemonsResponse))
    }
  }

  async getTypes(){
    let localTypes = localStorage.getItem("typesPokemon")
    if(localTypes == null){
      let typesResponse = await this.pokemonService.getTypes()
      this.types = typesResponse
      localStorage.setItem("typesPokemon", JSON.stringify(typesResponse))
    }else{
      this.types = JSON.parse(localTypes)
    }
  }

  async getColors(){
    let localColors = localStorage.getItem("colorsPokemon")
    if(localColors == null){
      let colorsResponse = await this.pokemonService.getColors()
      this.colors = colorsResponse
      localStorage.setItem("colorsPokemon", JSON.stringify(colorsResponse))
    }else{
      this.colors = JSON.parse(localColors)
    }
  }

  async getGenders(){
    let localGenders = localStorage.getItem("gendersPokemon")
    if(localGenders == null){
      let gendersResponse = await this.pokemonService.getGenders()
      this.genders = gendersResponse
      localStorage.setItem("gendersPokemon", JSON.stringify(gendersResponse))
    }else{
      this.genders = JSON.parse(localGenders)
    }
  }

  add20Pokemons() {
    this.loading = true
    let localStoragePokemon = localStorage.getItem("allPokemons")
    if(localStoragePokemon != null){
      let pokemonsDB = JSON.parse(localStoragePokemon)
      let pokemones : any[] = []
      for(let i = this.cantPokemons;i<this.cantPokemons+20;i++){
        if(i>=pokemonsDB.length){
          this.loadMore = false
        }else{
          this.loadMore = true
          pokemones.push(pokemonsDB[i])
        }
      }
      this.pokemons = pokemones
    }
    this.loading = false
  }

  async addFilter(filter:string, value:string){
    this.loading = true;
    this.loadMore = false
    let index: number = this.searchFilter(filter,value)
    if(filter == "types"){
      index == -1 ? this.filters.types.push(value):this.filters.types.splice(index,1)
    }else if(filter == "colors"){
      index == -1 ? this.filters.colors[0] = value : this.filters.colors = []
    }else if(filter == "genders"){
      this.filters.genders[0] = value
    }
    await this.loadPokemonsWithFilters();
    this.loading = false;
  }

  searchFilter(filter:string, value:string){
    let arrayFilter: any[] = []
    if(filter == "types"){
      arrayFilter = this.filters.types
    }else if(filter == "colors"){
      arrayFilter = this.filters.colors
    }else if(filter == "genders"){
      arrayFilter = this.filters.genders
    }
    for(let i = 0; i < arrayFilter.length; i++){
      if(arrayFilter[i] == value){
        return i
      }
    }
    return -1;
  }

  async loadPokemonsWithFilters(){
    this.noElements = false
    let localStoragePokemon = localStorage.getItem("allPokemons")
    if (localStoragePokemon != null){
      let pokemonsWithFilters: any[] = []
      let pokemonsByType: any[] = await this.filterPokemonsByType();
      let pokemonsByColor: any[] = await this.filterPokemonsByColor();
      let pokemonsByGender: any[] = await this.filterPokemonsByGender();

      if (pokemonsByType.length > 0) {
        if (pokemonsByColor.length > 0){
          if (pokemonsByGender.length > 0){
            for (let i = 0; i<pokemonsByType.length;i++) {
              for(let j = 0;j<pokemonsByColor.length;j++){
                if(pokemonsByType[i].name == pokemonsByColor[j].name){
                  for (let k = 0; k< pokemonsByGender.length;k++){
                    if(pokemonsByType[i].name == pokemonsByGender[k].name){
                      pokemonsWithFilters.push(pokemonsByType[i])
                    }
                  }
                }
              }
            }
          }else{
            for (let i = 0; i<pokemonsByType.length;i++) {
              for(let j = 0;j<pokemonsByColor.length;j++){
                if(pokemonsByType[i].name == pokemonsByColor[j].name){
                  pokemonsWithFilters.push(pokemonsByType[i])
                }
              }
            }
          }
        }else{
          if (pokemonsByGender.length >0 ){
            for (let i = 0; i<pokemonsByType.length;i++) {
              for(let j = 0;j<pokemonsByGender.length;j++){
                if(pokemonsByType[i].name == pokemonsByGender[j].name){
                  pokemonsWithFilters.push(pokemonsByType[i])
                }
              }
            }
          }else{
            pokemonsWithFilters = pokemonsByType
          }
        }
      }else{
        if (pokemonsByColor.length > 0){
          if (pokemonsByGender.length >0 ){
            for (let i = 0; i<pokemonsByColor.length;i++) {
              for (let j = 0; j<pokemonsByGender.length;j++) {
                if (pokemonsByColor[i].name == pokemonsByGender[j].name){
                  pokemonsWithFilters.push(pokemonsByColor[i])
                }
              }
            }
          }else{
            pokemonsWithFilters = pokemonsByColor
          }
        }else{
          if (pokemonsByGender.length > 0 ){
            pokemonsWithFilters = pokemonsByGender
          }else if(pokemonsByGender.length == 0){
            pokemonsWithFilters = JSON.parse(localStoragePokemon)
          }else{
            this.noElements = true
          }
        }
      }
      this.pokemons = pokemonsWithFilters
    }
    this.loading = false
  }

  async filterPokemonsByType(){
    let pokemonsByType: any[] = []
    if(this.filters.types.length>0){
      for(let i = 0; i<this.filters.types.length;i++){
        let pokemons: any[] = await this.pokemonService.getPokemonsByType(this.filters.types[i])
        if(pokemonsByType.length > 0){
          let newPokemonsByType : any[] = []
          for (let j = 0; j<pokemons.length;j++){
            for (let z = 0; z<pokemonsByType.length; z++){
              if (pokemons[j].name == pokemonsByType[z].name){
                let pokemonLocalStorage = this.searchPokemonLocalStorage(pokemons[j].name)
                if(pokemonLocalStorage != null){
                  newPokemonsByType.push(pokemonLocalStorage)
                }
              }
            }
          }
          pokemonsByType = newPokemonsByType
        }else{
          for(let i = 0;i<pokemons.length;i++){
            let pokemonLocalStorage = this.searchPokemonLocalStorage(pokemons[i].name)
            if(pokemonLocalStorage != null){
              pokemonsByType.push(pokemonLocalStorage)
            }
          }
        }
      }
      return pokemonsByType
    }
    return [];
  }

  async filterPokemonsByColor(){
    if(this.filters.colors.length > 0){
      let pokemons: any[] = []
      for(let i = 0; i < this.filters.colors.length; i++ ){
        let pokemonsByColor: any[] = await this.pokemonService.getPokemonsByColor(this.filters.colors[i])
        for(let j = 0; j<pokemonsByColor.length;j++){
          let pokemonLocalStorage = this.searchPokemonLocalStorage(pokemonsByColor[j].name)
          if(pokemonLocalStorage != null){
            pokemons.push(pokemonLocalStorage)
          }
        }
      }
      return pokemons;
    }
    return []
  }

  async filterPokemonsByGender(){
    if(this.filters.genders.length > 0){
      let pokemons: any[] = []
      if(this.filters.genders[0] != "all"){
        for(let i = 0; i < this.filters.genders.length; i++ ){
          let pokemonsByGender: any[] = await this.pokemonService.getPokemonsByGender(this.filters.genders[i])
          for(let j = 0; j<pokemonsByGender.length;j++){
            let pokemonLocalStorage = this.searchPokemonLocalStorage(pokemonsByGender[j].name)
            if(pokemonLocalStorage != null){
              pokemons.push(pokemonLocalStorage)
            }
          }   
        }
      }
      return pokemons;
    }
    return []
  }

  searchPokemonLocalStorage(name:string){
    let localStoragePokemon = localStorage.getItem("allPokemons")
    if (localStoragePokemon != null){
      let localPokemon = JSON.parse(localStoragePokemon)
      for(let i = 0;i<localPokemon.length;i++){
        if(localPokemon[i].name == name){
          return localPokemon[i]
        }
      }
    }
    return null
  }

  async showPokemon(id: string){
    this.haveEvolution = true
    this.loading = true
    this.pokemon = await this.pokemonService.getInfoPokemon(id)
    if(this.pokemon.evolution.length <= 1){
      this.haveEvolution = false
    }else{
      for(let i = 0;i<this.pokemon.evolution.length;i++){
        let pokemon = this.searchPokemonLocalStorage(this.pokemon.evolution[i].name)
        this.pokemon.evolution[i] = pokemon
      }
    }

    this.showInfoPokemon = true
    this.loading = false
  }

  loadMorePokemons(){
    this.cantPokemons = this.cantPokemons + 20
    this.add20Pokemons()
    this.showArrow = true
    setInterval(() => {
      this.showArrow = false
    }, 3000)
  }

  searchPokemonByID_Name(event:any){
    let wordSearch: string = event.target.value
    if(wordSearch != ""){
      this.loadMore = false
      let localStoragePokemon = localStorage.getItem("allPokemons")
      let pokemones : any[] = []
      if (localStoragePokemon != null){
        let localPokemon = JSON.parse(localStoragePokemon)
        for(let i = 0;i<localPokemon.length;i++){
          let name: string = localPokemon[i].name
          let id: string = localPokemon[i].id+""
          if(name.includes(wordSearch) || id.includes(wordSearch)){
            pokemones.push(localPokemon[i])
          }
        }
      }
      if (pokemones.length == 0) {
        this.noElements = true
      }else{
        this.noElements = false
        this.pokemons = pokemones
      }
    }else{
      this.pokemons = []
      this.cantPokemons = 0
      this.add20Pokemons()
    }
  }

  clean(){
    window.location.reload();
  }
}
