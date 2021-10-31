import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

import { switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({

    region   : ['', Validators.required],
    pais     : ['', Validators.required],
    frontera: ['', Validators.required]

  })

 //Selectores
  regiones : string[]      = [];
  paises   : PaisesSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisesSmall[] = [];
  

  //UI
  carregando: boolean = false;

  constructor(
              private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;
    
    //Quando muda a regiao
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.carregando = true;
          //this.miFormulario.get('frontera')?.disable();
        }),
        switchMap(region => this.paisesService.getPaisesRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.carregando = false;
      })
    
    
    //Quando muda o país
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.carregando = true;
          // this.miFormulario.get('frontera')?.enable();
        }),
        switchMap(codigo => this.paisesService.getPaisCodigo(codigo)),
        switchMap( pais => this.paisesService.getPaisesCodigos(pais?.borders! ) )
      )
      .subscribe(paises => {
        //this.fronteras = pais?.borders || [];
        this.fronteras = paises;
        this.carregando = false;
    })

  }
  

  guardar() {
    console.log(this.miFormulario.value)
  }

  
}


