function estrelas(params={}){
    var exemplo={
        x:0,       y:0,
        w:2,        h:2,
        vx:-0.8,     vy:0,
        color:"white",  
    }
    Object.assign(this, exemplo, params);
}
estrelas.prototype = new estrelas();
estrelas.prototype.constructor = estrelas;
//estrelas.prototype.prototype= new Sprite({});     //Herança

estrelas.prototype.desenhar = function(ctx, largura){ 
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y, this.w, this.h);
}

estrelas.prototype.mover = function(dt, mainSprite){
    var x;
    if(mainSprite.vx==0)
        x=0
    else if(mainSprite.vx>=300)
       x=-400; 
    else if(mainSprite.vx<300)
        x=0;
        
    this.x= this.x + this.vx+x * dt;
    this.y= this.y + this.vy * dt;
}
estrelas.prototype.colisaoBorda = function(largura){
    if(this.x+this.w < 0){
        this.x=largura;
    }

    /*
     if(this.x+this.w > 1301){
        this.x=0;
    }
    else if(this.x+this.w < 0){
        this.x=1300;
    }
    */
}

