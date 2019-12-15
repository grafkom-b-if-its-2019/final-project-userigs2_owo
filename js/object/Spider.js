var SpiderMeshes=[], SpiderBodies=[];
var mySpider;
var SpiderBody;

function InitSpider(){
    var SpiderShape = new CANNON.Box(new CANNON.Vec3(3,1,3));
    SpiderBody = new CANNON.Body({mass: 0, collisionFilterGroup:g[1],collisionFilterMask:g[0]|g[2]});
    SpiderBody.addShape(SpiderShape);
    world.addBody(SpiderBody);
    SpiderBody.position.set(0, 50, -48);

    var spiderLoader = new THREE.OBJMTLLoader();
    spiderLoader.load('./assets/models/Spider.obj', './assets/models/Spider.mtl',function(obj){
        
        mySpider = obj;
        mySpider.position.copy(SpiderBody.position);
        scene.add(mySpider);
        mySpider.castShadow = true;
        mySpider.scale.set(0.04,0.04,0.04);
        SpiderMeshes.push(mySpider);

    });
    SpiderBodies.push(SpiderBody);
}

function UpdateSpider(i){
    SpiderMeshes[i].position.copy(SpiderBodies[i].position);
    SpiderMeshes[i].quaternion.copy(SpiderBodies[i].quaternion);
}