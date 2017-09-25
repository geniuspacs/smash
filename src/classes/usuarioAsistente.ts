export class UsuarioAsistente {
    private _UID: string;
    private _nombre_completo: string;
    private _email: string;
    private _nombre_usuario: string;
    private _confirmado: boolean
  
    // GETTERS
  
    public get uid(): string {
      return this._UID;
    }
  
    public get nombre_completo(): string {
      return this._nombre_completo;
    }
  
    public get email(): string {
      return this._email;
    }
  
    public get nombre_usuario(): string {
      return this._nombre_usuario;
    }
  
    public get confirmado(): boolean {
      return this._confirmado;
    }
  
    // SETTERS
  
    public set uid(uid:string) {
      this._UID = uid;
    }
  
    public set nombre_completo(nombre_completo:string) {
      this._nombre_usuario = nombre_completo;
    }
  
    public set email(email:string) {
      this._email = email;
    }
  
    public set nombre_usuario(nombre_usuario:string) {
      this._nombre_usuario = nombre_usuario;
    }
  
    public set confirmado(confirmado:boolean) {
      this._confirmado = confirmado;
    }
  
  }