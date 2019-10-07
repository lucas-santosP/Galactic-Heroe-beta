function Scene(params) {
    var exemplo = {
        NPCs: [], explosoes: [],
        mainSprite: {},
        tiros: [], estrelas: [],
        w: 0, h: 0,  //largura e altura do canvas
        vida: 100, ctx: null,
        pt: 0, assets: null,
    }
    Object.assign(this, exemplo, params);
}
Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;

//PASSO ================================================================
Scene.prototype.passo = function (dt, tempo) {
    tempo = tempo / 100;
    this.limpar();
    this.comportamento();
    this.mover(dt);
    this.desenhar();

    if (tempo > 2) {
        this.moveNPCs(dt);
        this.desenharNPCs();
        this.moveExplosoes(dt);
        this.desenharExplosoes();
    }
    this.barra_HP();
}


//MOVIMENTO ============================================================
Scene.prototype.mover = function (dt){
    //Move MainSprite
    this.mainSprite.colisaoBorda(this.w, this.h);
    this.mainSprite.mover(dt);

    //Move estrelas e colisão com a borda
    for (var i = 0; i < this.estrelas.length; i++) {
        this.estrelas[i].mover(dt, this.mainSprite);
        this.estrelas[i].colisaoBorda(this.w)
        /*
        //colisão com borda gerando novas estrelas
        if(this.estrelas[i].colisaoBorda(this.w)){  
            this.estrelas[i].x= this.w;
            this.estrelas[i].y= Math.random()*this.h; 
        }
        */
    }

    //Move tiros e remove ao sair da tela
    for (var i = 0; i < this.tiros.length; i++) {
        this.tiros[i].mover(dt);
        if (this.tiros[this.tiros.length - i - 1].colisaoBorda(this.w)) {
            this.tiros.splice(this.tiros.length - i - 1, 1);
        }
    }
}
//DESENHA TODOS E COLISÕES COM NPCS =========================================
Scene.prototype.desenhar = function () {
    //Backgroud
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.w, this.h);

    //Desenha estrelas
    for (var i = 0; i < this.estrelas.length; i++) {
        this.estrelas[i].desenhar(this.ctx, this.w);
    }

    //Desenha tiros e verifica colisão com NPCs
    for (var i = 0; i < this.tiros.length; i++) {
        this.tiros[i].desenhar(this.ctx);
        
        for (var j = 0; j < this.NPCs.length; j++){ //Percorre todos NPCs, vendo se algum colidiu com o tiro
            if (this.tiros[i].colidiuComNPC(this.NPCs[j], this.w)) {
                //Move o tiro para cima, saindo da tela. E quando chegar no fim da largura será removido pela colisão com borda
                this.tiros[i].y = -this.h;
                //Adiciona explosão
                this.adicionarExplosoes(new Explosion({ x: this.NPCs[j].x, y: this.NPCs[j].y }));
                this.assets.play("explosion");
                ////Joga o NPC pra longe
                this.NPCs[j].x = Math.random() * this.w;
                this.NPCs[j].y = Math.random() * this.h;
                //AUMENTA PONTO
                this.pt++;
            }
        }
    }
    //Desenha MainSprite
    this.mainSprite.desenhar(this.ctx);
}
//DESENHA NPCS=============================================
Scene.prototype.desenharNPCs = function () {
    //Desenha NPCs
    for (var i = 0; i < this.NPCs.length; i++) {
        this.NPCs[i].desenhar(this.ctx, this.w);
        //Verifica colisão entre NPC e MainSprite, e cooldown do imune
        if (this.mainSprite.imune <= 0 && this.mainSprite.colidiuComNPC(this.NPCs[i], this.w)) {
            //Adiciona explosão
            this.adicionarExplosoes(new Explosion({ x: this.NPCs[i].x, y: this.NPCs[i].y }));
            this.assets.play("explosion");
            //Joga o NPC pra longe ao colidir com MainSprite
            this.NPCs[i].x = Math.random() * this.w;
            this.NPCs[i].y = Math.random() * this.h;
            //cooldown do imune
            this.mainSprite.imune = 2;
            this.vida -= 10;          //Dano pela colisão
            this.barra_HP();        //atualiza a barra de vida ao receber dano    
        }
    }
}
//MOVE NPCs=============================================
Scene.prototype.moveNPCs = function () {
    //Move NPCs e colisão com a borda
    for (var i = 0; i < this.NPCs.length; i++) {
        //this.NPCs[i].perseguir(this.mainSprite);   //Perseguir
        this.NPCs[i].mover(dt);

        if (this.NPCs[i].colisaoBorda(this.w)) {
            this.NPCs[i].x = Math.random() * this.w;
            this.NPCs[i].y = Math.random() * this.h;
        }
    }
}
//EXPLOSÃO =============================================
Scene.prototype.desenharExplosoes = function () {
    for (var i = 0; i < this.explosoes.length; i++) {
        this.explosoes[i].desenhar(this.ctx, this.w);
    }
}
Scene.prototype.moveExplosoes = function (dt) {
    for (var i = 0; i < this.explosoes.length; i++) {
        this.explosoes[i].mover(dt);
    }
}

//METODOS DE ADICIONAR DIFERENTES TIPOS ================================
Scene.prototype.adicionarMainSprite = function (sprite) {  //MainSprite
    this.mainSprite = sprite;
    sprite.scene = this;
}
Scene.prototype.adicionarNPCs = function (NPC) {           //NPCs
    this.NPCs.push(NPC);
    NPC.scene = this;
}
Scene.prototype.adicionarEstrelas = function (estrela) {   //Estrelas
    this.estrelas.push(estrela);
    estrela.scene = this;
}
Scene.prototype.adicionarTiros = function (tiro) {         //Tiros
    this.tiros.push(tiro);
    tiro.scene = this;
}
Scene.prototype.adicionarExplosoes = function (eplx) {     //explosões
    this.explosoes.push(eplx);
    eplx.scene = this;
}

//COMPORTAMENTOS ========================================================
Scene.prototype.comportamento = function () {
    //Comportamento Main Sprite de controle com teclas
    if (this.mainSprite.comportamento)
        this.mainSprite.comportamento();

    /*
    //Comportamento NPCs de perseguir RUIM (desativado)
    for(var i=0; i<this.NPCs.length; i++){
        if(this.NPCs[i].comportamento)
            this.NPCs[i].comportamento();
    }
    */
}

//Outras funções =======================================================
Scene.prototype.limpar = function () {
    this.ctx.clearRect(0, 0, this.w, this.h);
}
Scene.prototype.getPontos = function () {
    return this.pt;
}
Scene.prototype.getVida = function () {
    if(this.vida<=0){
        this.assets.playSound("deathSound");
    }
    return this.vida;
}
//DESENHA BARRA DE VIDA e PONTOS
Scene.prototype.barra_HP = function () {
    if (this.vida <= 0) this.vida = 0; //Caso passe de 0, não ira para negativos

    if (this.vida <= 30) this.ctx.fillStyle = "red";
    else this.ctx.fillStyle = "blue";
    //Desenha barra de HP
    this.ctx.strokeStyle = "white"; this.ctx.globalAlpha = 0.7;
    this.ctx.fillRect(50, 4, 0, 20);
    this.ctx.fillRect(50, 4, (200 * this.vida) / 100, 20);
    this.ctx.strokeRect(50, 4, 200, 20);
    //Escreve HP
    this.ctx.fillStyle = "white"; this.ctx.globalAlpha = 1.0;
    this.ctx.font = "20px bold monospaced";
    this.ctx.fillText("HP :   " + this.vida + "%", 5, 20);
    //Escreve os PONTOS
    this.ctx.font = "14px bold monospaced";
    this.ctx.fillText("PONTOS:" + this.pt, 1100, 20);
}
