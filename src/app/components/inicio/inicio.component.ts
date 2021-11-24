import { Component, OnInit } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon/pokemon.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  loading: boolean
  pokemons: any[]
  constructor(
    public pokemonService: PokemonService,
  ) {
    this.loading = true
    this.pokemons = []
  }

  async ngOnInit(): Promise<void> {
    await this.getPokemons()
    await this.get20Pokemons(0)
  }
  async getPokemons() {
    this.loading = true
    let pokemonsResponse = await this.pokemonService.getAllPokemons()
    localStorage.setItem("allPokemons", JSON.stringify(pokemonsResponse))
    this.loading = false
  }

  async get20Pokemons(indice: number) {
    this.loading = true
    let response = await this.pokemonService.get20Pokemons(indice)
    this.pokemons = response.pokemons
    this.loading = false
    //this.loading = false
  }
}
