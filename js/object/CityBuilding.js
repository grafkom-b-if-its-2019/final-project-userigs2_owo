var boxBody, boxMesh;
var boxes=[], boxMeshes=[];

var CityBuilding = function(posX,posY,posZ, x, y, z, i){
    colors = [0xff0044, 0x77ff00, 0x6699ff, 0x56789a];

    var halfExtents = new CANNON.Vec3(x, y, z);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);

    boxBody = new CANNON.Body({ mass: 0, collisionFilterGroup:g[1],collisionFilterMask:g[0]|g[2] });
    boxBody.addShape(boxShape);
    var texture, boxMaterial;
    if(i < 4) {
        boxMaterial = new THREE.MeshPhongMaterial({
            color : 0xaa00aa,
            opacity : 0.1,
            transparent: true
        })
    }
    else {
        if(3 < i && i < 8) {
            texture = THREE.ImageUtils.loadTexture('./assets/textures/wall/wall02.JPG');
        }
        else{
            texture = THREE.ImageUtils.loadTexture('./assets/textures/wall/wall01.JPG',);
        }
        boxMaterial = new THREE.MeshPhongMaterial({
            map: texture });
        boxMaterial.map.wrapS = boxMaterial.map.wrapT = THREE.RepeatWrapping;
        boxMaterial.map.repeat.set(x,y);
    }
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
    boxMeshes.push(boxMesh);
    
}

function UpdateCube(i){
    boxMeshes[i].position.copy(boxes[i].position);
    boxMeshes[i].quaternion.copy(boxes[i].quaternion);
}

