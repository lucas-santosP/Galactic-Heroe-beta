function AssetsManager() {
    this.aCarregar=0;
    this.carregadas=0;
    this.assets={};
}
AssetsManager.prototype.loadImage=function(key, url){
    console.log(`Carregando imagem ${url}...`);
    var imagem = new Image();
    console.log(`Imagem ${key}: ${url} carregada`);
    imagem.src=url;
    this.assets[key]=imagem;

    imagem.addEventListener("load", function(){
        this.carregadas++;
    });
}
AssetsManager.prototype.img=function(key){
    return this.assets[key];
}