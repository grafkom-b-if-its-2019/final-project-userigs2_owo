var Cube = function(x,y,z){
    var boxes=[], boxMeshes=[];
    colors = [0xff0044, 0x77ff00, 0x6699ff, 0x56789a];

    var halfExtents = new CANNON.Vec3(1,1,10);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
    // var x = (Math.random()-0.5)*20;
    // var y = 1 + (Math.random()-0.5)*1;
    // var z = (Math.random()-0.5)*20;
    var boxBody = new CANNON.Body({ mass: 10 });
    boxBody.addShape(boxShape);
    var boxMaterial = new THREE.MeshLambertMaterial({color: colors[1]});
    var boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(x,y,z);
    boxMesh.position.copy(boxBody.position);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    // boxes.push(boxBody);
    // boxMeshes.push(boxMesh);
}

// function UpdateCube(){
//     boxBody.position.set(x,y,z);
//     boxMesh.position.copy(boxBody.position);
// }