//PASSO ================================================================
Scene.prototype.passo =function(dt, tempo){
    tempo=tempo/100;
    console.log(tempo);

    this.limpar();
    this.comportamento();
    this.mover(dt);
    this.desenhar();
    
    if(tempo>5){
    this.moveNPCs();
    this.desenharNPCs();
    }
    barra_HP(this.vida);    

    if(this.vida<=0){
        return false;
    }
    return true;
}
Scene.prototype.limpar= function(){
    this.ctx.clearRect(0,0,this.w, this.h);
}

Scene.prototype.desenharNPCs=function(){
    //Desenha NPCs
    for(var i=0; i<this.NPCs.length; i++){
        this.NPCs[i].desenhar(this.ctx, this.w);
        //Verifica cooldown do imune e se MainSprite colidiu com um NPC
        if(this.mainSprite[0].imune <=0 && this.mainSprite[0].colidiuComNPC(this.NPCs[i], this.w)){
            //Joga o NPC pra longe ao colidir com MainSprite
            this.NPCs[i].x= Math.random()*this.w;
            this.NPCs[i].y= Math.random()*this.h;

            this.mainSprite[0].imune=2;//cooldown do imune
            this.vida-=10;
            barra_HP(this.vida);       //atualiza a barra de vida ao receber dano    
        }
    }
}

Scene.prototype.moveNPCs=function(){
    //Move NPCs e colisão com a borda
    for(var i=0; i<this.NPCs.length; i++){
        //this.NPCs[i].perseguir(this.mainSprite[0]);   //Perseguir
        this.NPCs[i].mover(dt);
        if(this.NPCs[i].colisaoBorda(this.w)){
            this.NPCs[i].x= Math.random()*this.w;
            this.NPCs[i].y= Math.random()*this.h; 
        }
    }
}
