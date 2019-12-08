var sphereBody, sphereMesh;
var mass = 5, radius = 1.3;
var cityBlocks = [];

function InitWorld(){
    //Setup World
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;

    solver = new CANNON.GSSolver();

    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    
    solver.iterations = 7;
    solver.tolerance = 0.1;
    split = true;
    if(split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    world.gravity.set(0,-20,0);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, 
        physicsMaterial, 0.0, 0.3);
    
    // Add material to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create Sphere
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({mass:mass});
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0,100,0);
    sphereBody.linearDamping = 0.9;
    world.addBody(sphereBody);

    // Create Plane
    groundShape = new CANNON.Plane();
    groundBody = new CANNON.Body({mass: 0});
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.addBody(groundBody);
}

function InitScene(){
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    scene = new THREE.Scene();

    ambient = new THREE.AmbientLight( 0x111111);
    scene.add(ambient);

    light = new THREE.SpotLight( 0xffffff );
    light.position.set(100,100,0);
    light.target.position.set(0,0,0);

    if(true) {
        light.castShadow = true;

        light.shadowCameraNear = 20;
        light.shadowCameraFar = 50;
        light.shadowCameraFov = 40;
    }
    scene.add(light);

    controls = new PointerLockControls(camera, sphereBody);
    scene.add(controls.getObject());

    //Sphere
    var sphereGeometry = new THREE.SphereGeometry(radius);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
    sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    scene.add(sphereMesh);

    // floor
    geoPlane = new THREE.PlaneGeometry( 300, 300, 1, 1);
    geoPlane.applyMatrix(new THREE.Matrix4().makeRotationX( -Math.PI / 2));

    material = new THREE.MeshPhongMaterial({color: 0xdddddd});

    planeMesh = new THREE.Mesh(geoPlane, material);
    planeMesh.castShadow = true;
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);

    cityBlocks[0] = new CityBuilding(50, 10, -20, 50, 10, 5);
    cityBlocks[1] = new CityBuilding(-18, 10, 50, 15, 10, 50);
    cityBlocks[2] = new CityBuilding(30, 5, 20, 30, 5, 20);
    cityBlocks[3] = new CityBuilding(-25, 5, -15, 20, 5, 10);
    // city = new City();

    //     gun.load('./assets/OBJ/SniperRifle.obj', './assets/OBJ/SniperRifle.mtl', mat);

}

function SceneUpdate(){
    if(controls.enabled){
        world.step(dt);

        sphereMesh.position.copy(sphereBody.position);
        sphereMesh.quaternion.copy(sphereBody.quaternion);

        // Update ball positions
        for(var i=0; i<balls.length; i++){
            ballMeshes[i].position.copy(balls[i].position);
            ballMeshes[i].quaternion.copy(balls[i].quaternion);
        }

        // UpdateCube();   
        // boxMesh.position.copy(boxBody.position);
        // boxMesh.quaternion.copy(boxBody.quaternion);
    }
    
    controls.update( Date.now() - time );
    
    renderer.render( scene, camera );
    time = Date.now();
}