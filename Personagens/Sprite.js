function Sprite(params={}){
    var exemplo={
        x:100,           y:300,
        w:70,           h:40,   
        vx:100,           vy:0,
        vm:0,           imune: 0,
        color: "grey",  
        cooldown: 0,    dash: 0,
        scene: undefined,
        comportamento:undefined,
    }
    Object.assign(this, exemplo, params);
}
Sprite.prototype = new Sprite();
Sprite.prototype.constructor = Sprite;

Sprite.prototype.desenhar = function(ctx)
{     
    ctx.save();
    ctx.fillStyle = 'rgba(190, 190, 190, 0.841)';
    ctx.strokeStyle= "red";
    ctx.lineWidth=2;
    //ctx.strokeRect(this.x, this.y, this.w, this.h);

    if(this.imune > 0){
        ctx.globalAlpha = 0.5*Math.cos(60*this.imune);
    }
    if(this.dash > 0){
        ctx.drawImage(this.scene.assets.img("player"), this.x, this.y, this.w-10, this.h-10);
        ctx.drawImage(this.scene.assets.img("tiro"), this.x+25, this.y+3, 40-10, 30-10);
    }
    else{
        ctx.drawImage(this.scene.assets.img("player"), this.x, this.y, this.w, this.h);
        ctx.drawImage(this.scene.assets.img("tiro"), this.x+25, this.y+3, 40, 30);
    }
    ctx.restore();
    ctx.globalAlpha = 1.0;
}

Sprite.prototype.mover = function(dt){
    //this.x= this.x + this.vx * dt;
    this.y= this.y + this.vy * dt;

    if(this.imune>0){
        this.imune= this.imune- 1*dt;
    }
    if(this.dash>0){
        this.dash= this.dash-1*dt;
    }
    if(this.cooldown>=0){
        this.cooldown= this.cooldown-1*dt;
    }
}

Sprite.prototype.colidiuComNPC = function(alvo, largura){
    if(this.dash > 0){  //Colisão com dash
        if(largura+alvo.x+alvo.w < this.x)  return false;
        if(largura+alvo.x > this.x+this.w-10)  return false;
        if(alvo.y+alvo.h < this.y)          return false;
        if(alvo.y > this.y+this.h-10)          return false;
        return true;
    }
    else{               //Colisão sem dash
        if(largura+alvo.x+alvo.w < this.x)  return false;
        if(largura+alvo.x > this.x+this.w)  return false;
        if(alvo.y+alvo.h < this.y)          return false;
        if(alvo.y > this.y+this.h)          return false;

        return true;
    }
}

Sprite.prototype.perseguir = function(opçcoes){
    this.vx = 20*Math.sign(opçcoes.alvo.x-this.x);
    this.vy = 20*Math.sign(opçcoes.alvo.y-this.y);
}

Sprite.prototype.controle = function(opcoes){
    if(opcoes.teclas.esquerda)  this.vx =-150;
    if(opcoes.teclas.direita)   this.vx = 150;
    if(!opcoes.teclas.esquerda && !opcoes.teclas.direita)
        this.vx=0;

    if(opcoes.teclas.cima)      this.vy =-150;
    if(opcoes.teclas.baixo)     this.vy = 150;
    if(!opcoes.teclas.cima && !opcoes.teclas.baixo)
        this.vy=0;
}

Sprite.prototype.colisaoBorda = function(largura,altura){
    if(this.x < 0)      this.x=0;
    if(this.y <0)       this.y=0;
    if(this.x+this.w >= largura)    this.x= largura-this.w;
    if(this.y+this.h >= altura)     this.y= altura-this.h;
}