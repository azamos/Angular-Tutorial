import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css'
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  // selectedHero? : Hero;
  constructor(private heroService: HeroService,
    private messageService: MessageService){}
  // onSelect(hero:Hero):void{
  //   this.selectedHero = hero;
  //   this.messageService.add(`Heroes Component: Selected hero id = ${hero.id}`);
  // }
  ngOnInit():void {
    this.getHereos();
  }
  // getHereos():void {
  //   this.heroes = this.heroService.getHeroes();
  // }
  getHereos():void {
    /*similar to: async call, such as fetch,
    and susbscribe reminds of .then(res=>console.log(res)) */
    this.heroService.getHeroes().subscribe(res => this.heroes = res);
  }
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }
  delete(hero:Hero):void {
    this.heroes = this.heroes.filter(h=>h!==hero);
    /*It must subscribe anyway, even though the component has nothing to do with the Observable
    returned by deleteHero from HeroService*/
    this.heroService.deleteHero(hero.id).subscribe();
    /*An observable does nothing until we call subscribe. Thus, if we remove the
    subscribe call, locally it would appear as though the hero was deleted,
    in reality,it was not actually deleted from the server's DB. */
  }
}
