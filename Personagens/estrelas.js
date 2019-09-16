function estrelas(exemplo = {}){
    var{
        x=0,       y=0,
        w=2,        h=2,    //2
        vx=-30,     vy=0,
        pisca=0,    color="white",  
    } = exemplo;
    this.w=w;   this.h=h;
    this.x=x;   this.y=y;
    this.vx=vx; this.vy=vy;
    this.color=color; 
    this.pisca=pisca;
}
estrelas.prototype = new estrelas({});
// estrelas.prototype.prototype= new Sprite({}); Herança
estrelas.constructor = estrelas;

estrelas.prototype.desenhar = function(ctx, largura){ 
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y, this.w, this.h);
}

estrelas.prototype.mover = function(dt){
    this.x= this.x + this.vx * dt;
    this.y= this.y + this.vy * dt;
}
estrelas.prototype.colisaoBorda = function(largura){
    if(this.x+this.w < 0){
        this.x=0;
        return true;
    }
    return false;
}

