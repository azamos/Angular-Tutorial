import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError,map,tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }
  // getHeroes(): Observable<Hero[]> {
  //   const heroes = of(HEROES);/* async call */
  //   this.messageService.add('HeroService: fetched heroes');
  //   return heroes;
  // }
  // getHero(id:number) {
  //   const hero = HEROES.find(h=>h.id === id);
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(hero);
  // }
  // constructor(private messageService: MessageService){}
  constructor(private http: HttpClient,private messageService: MessageService){}

  private log(message:string){
    this.messageService.add(`HeroService: ${message}`);
  }
  //                 :base/:collectionName
  private heroesUrl = 'api/heroes';
  getHeroes(): Observable<Hero[]> {
    /* even though the response indicates multiple Hero[] arrays, only one is fetched */
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_=>this.log('fetched heroes'))
        ,catchError(this.handleError<Hero[]>('getHeroes',[])));
  }
  /**
   * 
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * @returns - empty result
   */
  private handleError<T>(operation='operation',result?:T){
    return (error:any):Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      /*Let the app keep running by returning an empty result */
      return of(result as T);
    }
  }
  /** GET hero by id. Will 404 if id not found */
  getHero(id:number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_=>this.log(`HeroService: feetched hero id = ${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`)));
  }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  updateHero(hero:Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_=>this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }
  addHero(hero:Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl,hero,this.httpOptions)
            .pipe(
              tap((newHero:Hero)=> this.log(`added hero w/ id=${newHero.id}`)),
              catchError(this.handleError<Hero>('addHero'))
            );
  }
  deleteHero(id:number):Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  /* GET heroes whose name contains search term */
searchHeroes(term: string): Observable<Hero[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found heroes matching "${term}"`) :
       this.log(`no heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
}
}
