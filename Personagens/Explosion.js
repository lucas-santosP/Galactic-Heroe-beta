function Explosion(params ={}) {
    exemplo = {
        x: 0,
        y: 0,
        frame: 0,
        w: 64,
        h: 64,
        props: {
            tipo: "boom"
        },
    }
    Object.assign(this, exemplo, params);
}

Explosion.prototype.mover = function(dt){
    this.frame += 24*dt;
    if(Math.floor(this.frame) > 16){
        //this.frame = 0;
        this.morto = true;
    }
}

Explosion.prototype.desenhar = function(ctx, largura){ 
    ctx.save();
    ctx.translate(this.x+largura, this.y);
    var F = Math.floor(this.frame);
    ctx.drawImage(
        this.scene.assets.img("explosion"),
        (F%12)*95,   //colunas
        Math.floor(F/12)*95,
        95,
        95,
        -this.w/2,
        -this.h/2,
        this.w,
        this.h 
    );
    ctx.restore();
}

Explosion.prototype.comportar = function(){
}