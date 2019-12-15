
    

function InitSpider(){
    var mySpider;

    var spiderLoader = new THREE.OBJMTLLoader();
    spiderLoader.load('./assets/models/Spider.obj', './assets/models/Spider.mtl',function(obj){

        
        mySpider = obj;
        scene.add(mySpider);
        mySpider.position.set(10,1,60);
        mySpider.scale.set(0.1,0.1,0.1);

    })

}