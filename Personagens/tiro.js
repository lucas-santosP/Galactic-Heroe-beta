function tiro(exemplo = {}){
    var{
        x=0,       y=0,
        w=8,       h=8,
        vx=400,       vy=0,
        color="gold",
    } = exemplo;
    this.w=w;   this.h=h;
    this.x=x;   this.y=y;
    this.vx=vx; this.vy=vy;
    this.color=color;
}
tiro.prototype = new tiro({});
tiro.constructor = tiro;

tiro.prototype.desenhar = function(ctx){ 
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

tiro.prototype.mover = function(dt){
    this.x= this.x + this.vx * dt;
    this.y= this.y + this.vy * dt;
}

tiro.prototype.colidiuComNPC = function(npc, largura){    
    if( this.x+this.w >= largura+npc.x-10
        && npc.x+npc.w+largura >= this.x
        && this.y <= npc.y+npc.h
        && this.y+this.h >= npc.y){  
        return true;
    }
    return false;
}

tiro.prototype.colisaoBorda = function(largura){
    if(this.x > largura){
        return true;
    }
    else
        return false;
}

