function Sprite(params={}){
    var exemplo={
        x:250,           y:300,
        w:35,           h:25,   
        vx:0,           vy:0,
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
    //ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = 'rgba(190, 190, 190, 0.841)';
    ctx.strokeStyle= "black";
    ctx.lineWidth=1;

    if(this.imune > 0){
        ctx.globalAlpha = 0.5*Math.cos(60*this.imune);
    }
    ctx.beginPath();

    if(this.dash > 0){
        var auxW=this.w-(this.w/3);
        var auxY=this.h-(this.h/3);
        //ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.moveTo(this.x, this.y + (this.h/3) );
        ctx.lineTo(this.x + auxW, this.y + this.h/2 +(this.h/3));
        ctx.lineTo(this.x, this.y+ auxY +((this.h/3)));
    }
    else{
        //ctx.strokeRect(this.x, this.y, this.w, this.h);
        //ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x+this.w, this.y+this.h/2);
        ctx.lineTo(this.x, this.y+this.h);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1.0;
}

Sprite.prototype.mover = function(dt){
    this.x= this.x + this.vx * dt;
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
    if(largura+alvo.x+alvo.w < this.x)  return false;
    if(largura+alvo.x > this.x+this.w)  return false;
    if(alvo.y+alvo.h < this.y)          return false;
    if(alvo.y > this.y+this.h)          return false;

    return true;
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