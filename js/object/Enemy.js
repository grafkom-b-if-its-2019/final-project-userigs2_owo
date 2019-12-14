function initEnemy() {
    // placeholder
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({mass:mass});
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0,0,30);
    sphereBody.linearDamping = 0.9;
    world.addBody(sphereBody);
}