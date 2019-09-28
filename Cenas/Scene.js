function Scene(params){
    var exemplo={
        NPCs: [],       NPCs2: [],
        mainSprite:{}, 
        tiros:[],       estrelas:[], 
        w:1200,         h:600,
        vida:100,       ctx:null,
        pt:0,
    }
    Object.assign(this, exemplo, params);
}
Scene.prototype=new Scene();
Scene.prototype.constructor=Scene;

//METODOS DE ADICIONAR DIFERENTES TIPOS ================================
    Scene.prototype.adicionarMainSprite= function(sprite){  //MainSprite
        this.mainSprite=sprite;
        sprite.scene=this;  }
    Scene.prototype.adicionarNPCs= function(NPC){           //NPCs
        this.NPCs.push(NPC);
        NPC.scene=this; }
    Scene.prototype.adicionarEstrelas= function(estrela){   //Estrelas
        this.estrelas.push(estrela);
        estrela.scene=this; }
    Scene.prototype.adicionarTiros= function(tiro){         //Tiros
        this.tiros.push(tiro);
        tiro.scene=this;    
    }

//MOVIMENTO ============================================================
Scene.prototype.mover= function(dt){
    //Move MainSprite
    this.mainSprite.colisaoBorda(this.w, this.h);
    this.mainSprite.mover(dt);
    //Move estrelas e colisão com a borda
    for(var i=0; i<this.estrelas.length; i++){
        this.estrelas[i].mover(dt, this.mainSprite);
        
        this.estrelas[i].colisaoBorda(this.w)
        //if(this.estrelas[i].colisaoBorda(this.w)){  
            //this.estrelas[i].x= this.w;
            //this.estrelas[i].y= Math.random()*this.h; }
    }
    //Move tiros e remove ao sair da tela
    for(var i=0; i<this.tiros.length; i++){
        this.tiros[i].mover(dt);
        if(this.tiros[this.tiros.length-i-1].colisaoBorda(this.w)){
            this.tiros.splice(this.tiros.length-i-1,1); }
    }
}

//COMPORTAMENTOS ========================================================
Scene.prototype.comportamento= function(){
    //Comportamento Main Sprite de controle com teclas
    if(this.mainSprite.comportamento)
        this.mainSprite.comportamento();
    
    /*
    //Comportamento NPCs de perseguir RUIM (desativado)
    for(var i=0; i<this.NPCs.length; i++){
        if(this.NPCs[i].comportamento)
            this.NPCs[i].comportamento();
    }
    */
}

//DESENHA TODOS E COLISÕES COM NPCS =========================================
Scene.prototype.desenhar= function(){
    //Backgroud
    this.ctx.fillStyle="black";
    this.ctx.fillRect(0,0, this.w, this.h);

    //Desenha estrelas
    for(var i=0; i<this.estrelas.length; i++){
        this.estrelas[i].desenhar(this.ctx, this.w); 
    }
    //Desenha tiros
    for(var i=0; i<this.tiros.length; i++){
        this.tiros[i].desenhar(this.ctx);
        //Percorre todos NPCs, vendo se algum colidiu com o tiro
        for(var j=0; j<this.NPCs.length; j++){
            if(this.tiros[i].colidiuComNPC(this.NPCs[j], this.w)){
                //Move o tiro para cima, saindo da tela. 
                //E lá quando ele chegar no fim da largura será removido pela outra função de colisão com borda
                this.tiros[i].y=-this.h; 
                ////Joga o NPC pra longe ao colidir com tiro
                this.NPCs[j].x= Math.random()*this.w;
                this.NPCs[j].y= Math.random()*this.h;
                //AUMENTA PONTO
                this.pt++;
            }
        }
    }
    //Desenha MainSprite
    this.mainSprite.desenhar(this.ctx);
}

//DESENHA NPCS=============================================
Scene.prototype.desenharNPCs=function(){
    //Desenha NPCs
    for(var i=0; i<this.NPCs.length; i++){
        this.NPCs[i].desenhar(this.ctx, this.w);
        //Verifica cooldown do imune e se MainSprite colidiu com um NPC
        if(this.mainSprite.imune <=0 && this.mainSprite.colidiuComNPC(this.NPCs[i], this.w)){
            //Joga o NPC pra longe ao colidir com MainSprite
            this.NPCs[i].x= Math.random()*this.w;
            this.NPCs[i].y= Math.random()*this.h;

            this.mainSprite.imune=2;//cooldown do imune
            this.vida-=20;
            this.barra_HP();       //atualiza a barra de vida ao receber dano    
        }
    }
}

//MOVE NPCs=============================================
Scene.prototype.moveNPCs=function(){
    //Move NPCs e colisão com a borda
    for(var i=0; i<this.NPCs.length; i++){
        this.NPCs[i].perseguir(this.mainSprite);   //Perseguir
        this.NPCs[i].mover(dt);

        if(this.NPCs[i].colisaoBorda(this.w)){
            this.NPCs[i].x= Math.random()*this.w;
            this.NPCs[i].y= Math.random()*this.h; 
        }
    }
}

//PASSO ================================================================
Scene.prototype.passo =function(dt, tempo, pontos){
    tempo=tempo/100;

    this.limpar();
    this.comportamento();
    this.mover(dt);
    this.desenhar();

    if(tempo>2){
        this.moveNPCs();
        this.desenharNPCs();
    }
    this.barra_HP();
}
//Outras funções =======================================================
Scene.prototype.limpar= function(){
    this.ctx.clearRect(0,0,this.w, this.h);
}
Scene.prototype.getPontos=function(){
    return this.pt;
}
Scene.prototype.getVida=function(){
    return this.vida;
}

//DESENHA BARRA DE VIDA e PONTOS
Scene.prototype.barra_HP= function(){
    if(this.vida<=0)    this.vida=0; //Caso passe de 0, não ira para negativos

    if(this.vida<=30)   this.ctx.fillStyle="red";
    else                this.ctx.fillStyle="blue";
    //Desenha barra de HP
    this.ctx.strokeStyle="white";   this.ctx.globalAlpha=0.7;
    this.ctx.fillRect(50, 4,0, 20);
    this.ctx.fillRect(50, 4,(200*this.vida)/100,20);
    this.ctx.strokeRect(50,4,200,20);
    //Escreve HP
    this.ctx.fillStyle="white";     this.ctx.globalAlpha=1.0;
    this.ctx.font="20px bold monospaced";
    this.ctx.fillText("HP :   "+this.vida+"%",5,20);
    //Escreve os PONTOS
    this.ctx.font="14px bold monospaced";
    this.ctx.fillText("PONTOS:"+this.pt, 1100, 20);
}
