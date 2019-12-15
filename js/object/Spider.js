var SpiderMeshes=[], SpiderBodies=[];
var mySpider;
var SpiderBody;

function InitSpider(){
    var SpiderShape = new CANNON.Box(new CANNON.Vec3(1,1,1));
    SpiderBody = new CANNON.Body({mass: 0});
    SpiderBody.addShape(SpiderShape);
    world.addBody(SpiderBody);
    SpiderBody.position.set(0, 1, -8);

    var spiderLoader = new THREE.OBJMTLLoader();
    spiderLoader.load('./assets/models/Spider.obj', './assets/models/Spider.mtl',function(obj){
        
        mySpider = obj;
        mySpider.position.copy(SpiderBody.position);
        scene.add(mySpider);
        mySpider.scale.set(0.03,0.03,0.03);
        SpiderMeshes.push(mySpider);

    });
    SpiderBodies.push(SpiderBody);
}

function UpdateSpider(i){
    SpiderMeshes[i].position.copy(SpiderBodies[i].position);
    SpiderMeshes[i].quaternion.copy(SpiderBodies[i].quaternion);
}