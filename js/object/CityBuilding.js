var boxBody, boxMesh;
var boxes=[], boxMeshes=[];

var CityBuilding = function(posX,posY,posZ, x, y, z){
    colors = [0xff0044, 0x77ff00, 0x6699ff, 0x56789a];

    var halfExtents = new CANNON.Vec3(x, y, z);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);

    boxBody = new CANNON.Body({ mass: 10 });
    boxBody.addShape(boxShape);
    var texture = THREE.ImageUtils.loadTexture('./assets/textures/metro01.JPG');
    var boxMaterial = new THREE.MeshBasicMaterial({ map: texture });
    boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(posX,posY,posZ);
    boxMesh.position.copy(boxBody.position);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);

}

// function UpdateCube(){
//     boxMesh.position.copy(boxBody.position);
//     boxMesh.quaternion.copy(boxBody.quaternion);
// }
