Sprite.prototype.desenhar = function(ctx){ 
    ctx.fillStyle = this.color;
    var aux=this.w;
    if(this.imune > 0){
        ctx.globalAlpha = 0.5*Math.cos(60*this.imune);
        this.h=this.h-(this.h/2);
    }
    ctx.fillRect(this.x, this.y, this.w, this.h);
    this.h=aux;
    ctx.globalAlpha = 1.0;
}