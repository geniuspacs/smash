export class EventosClass {
    
      private _titulo:string;
      private _ubicacion:string;
      private _num_max_asistentes:number;
      private _publico:boolean;
      private _creador_evento: string;
      private _img: string;
      private _descripcion: string;
      private _fecha: any;
      private _hora: any;
      private _tipo_evento: string;
      private _asistentes: number;
      private _fecha_publicacion: string;
      private _nombre_fichero_imagen: string;
    
      constructor() {
    
      }
    
      // SETTERS
    
      public set titulo(titulo:string) {
        this._titulo = titulo;
      }
      public set ubicacion(ubicacion:string) {
        this._ubicacion = ubicacion;
      }
    
      public set num_max_asistentes(num_max_asistentes:number) {
        this._num_max_asistentes = num_max_asistentes;
      }
    
      public set asistentes(asistentes:number) {
        this._asistentes = asistentes;
      }
    
      public set publico(publico:boolean) {
        this._publico = publico;
      }
    
      public set creador_evento(creador_evento:any) {
        this._creador_evento = creador_evento;
      }
    
      public set img(img:any) {
        this._img = img;
      }
    
      public set descripcion(descripcion:string) {
        this._descripcion = descripcion;
      }
    
      public set fecha(fecha:any) {
        this._fecha = fecha;
      }
    
      public set hora(hora:any) {
        this._hora = hora;
      }
    
      public set tipo_evento(tipo_evento:string) {
        this._tipo_evento = tipo_evento;
      }
    
      public set fecha_publicacion(fecha_publicacion:string) {
        this._fecha_publicacion = fecha_publicacion;
      }
    
      public set nombre_fichero_imagen(nombre_fichero_imagen:string) {
        this._nombre_fichero_imagen = nombre_fichero_imagen;
      }
    
      // GETTERS
    
      public get titulo() {
        return this._titulo;
      }
      public get ubicacion() {
        return this._ubicacion;
      }
    
      public get num_max_asistentes() {
        return this._num_max_asistentes;
      }
    
      public get asistentes() {
        return this._asistentes;
      }
    
      public get publico() {
        return this._publico;
      }
    
      public get creador_evento() {
        return this._creador_evento;
      }
    
      public get img() {
        return this._img;
      }
    
      public get descripcion() {
        return this._descripcion;
      }
    
      public get fecha() {
        return this._fecha;
      }
    
      public get hora() {
        return this._hora;
      }
    
      public get tipo_evento() {
        return this._tipo_evento;
      }
    
      public get fecha_publicacion() {
        return this._fecha_publicacion;
      }
    
      public get nombre_fichero_imagen() {
        return this._nombre_fichero_imagen;
      }
    
    }
    