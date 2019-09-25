function inimigo1(exemplo = {}){
    var{
        x=0,      y=0,
        w=30,       h=30,
        vx=-200,    vy=0,
        color="purple",
    } = exemplo;
    this.w=w;   this.h=h;
    this.x=x;   this.y=y;
    this.vx=vx; this.vy=vy;
    this.color=color;
}
inimigo1.prototype = new inimigo1({});
inimigo1.constructor = inimigo1;

inimigo1.prototype.desenhar = function(ctx, largura){ 
    ctx.strokeStyle= "red";
    ctx.lineWidth=2;
    //ctx.strokeRect(largura+this.x, this.y, this.w, this.h);   

    ctx.drawImage(this.scene.assets.img("asteroid"), largura+this.x, this.y, this.w, this.h);
    
}
inimigo1.prototype.mover = function(dt){
    this.x= this.x + this.vx * dt;
    this.y= this.y + this.vy * dt;
}
inimigo1.prototype.colisaoBorda = function(largura){
    if(this.x+this.w < -largura){
        this.x=0;
        return true;
    }
    return false;
}
inimigo1.prototype.perseguir = function(alvo){
    this.vx = -500*Math.sign(700+alvo.x-this.x);
    //this.vy = 80*Math.sign(alvo.y-this.y);
}