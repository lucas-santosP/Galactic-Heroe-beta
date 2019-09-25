function tiro(exemplo = {}){
    var{
        x=0,       y=0,
        w=25,       h=15,
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
    //ctx.fillRect(this.x, this.y, this.w, this.h);

    ctx.drawImage(this.scene.assets.img("tiro"), this.x-25, this.y-6, this.w, this.h);
}

tiro.prototype.mover = function(dt){
    this.x= this.x + this.vx * dt;
    this.y= this.y + this.vy * dt;
}

tiro.prototype.colidiuComNPC = function(npc, largura){    
    if( this.x-30+this.w >= largura+npc.x-10
        && npc.x+npc.w+largura >= this.x-25
        && this.y <= npc.y+npc.h
        && this.y+this.h >= npc.y){  
        return true;
    }
    return false;
}

tiro.prototype.colisaoBorda = function(largura){
    if(this.x-25 > largura){
        return true;
    }
    else
        return false;
}

