export interface HandlerInterface {
  create?(req: any, res: any): Promise<any>;
  update?(req: any, res: any): Promise<any>;
  get?(req: any, res: any): Promise<any>;
  getAll?(req: any, res: any): Promise<any>;
  delete?(req: any, res: any): Promise<any>;
}
