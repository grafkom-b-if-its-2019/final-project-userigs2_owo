function initEnemy() {
    // placeholder
    var enemyShape = new CANNON.Sphere(1);
    var enemyBody = new CANNON.Body({mass:0});
    enemyBody.addShape(enemyShape);
    enemyBody.position.set(0,2,50);
    enemyBody.linearDamping = 0.9;

    var sphereGeometry = new THREE.SphereGeometry(enemyShape.radius);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
    enemyMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    enemyMesh.position.copy(enemyBody.position);

    scene.add(enemyMesh);
    world.addBody(enemyBody);
}

