var createScene = function () {
    // ======== 기본 씬 설정 ========
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.12, 1.0);
    const canvas = engine.getRenderingCanvas();

    // ======== 카메라 설정 ========
    const camera = new BABYLON.ArcRotateCamera("cam",
        0, // 정면을 보도록 alpha 값을 0으로 수정
        BABYLON.Tools.ToRadians(80), // 약간 낮은 각도로 조정
        18, // 조금 더 가깝게 조정
        new BABYLON.Vector3(0, 1.2, 0),
        scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 40;
    camera.wheelPrecision = 50;

    // ======== 조명 추가 ========
    // 장면 전체를 밝혀줄 기본 조명을 추가합니다.
    const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.7; // 조명 강도 설정

    // ======== 바닥 및 벽 생성 ========
    // 바닥 재질
    const groundMat = new BABYLON.PBRMaterial("groundMat", scene);
    groundMat.albedoColor = new BABYLON.Color3.FromHexString("#C8B8A8");
    groundMat.roughness = 0.5;
    
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 16 }, scene);
    ground.material = groundMat;
    ground.receiveShadows = true;

    // 벽 재질
    const wallMat = new BABYLON.PBRMaterial("wallMat", scene);
    wallMat.albedoColor = new BABYLON.Color3.FromHexString("#F0F0F0");
    wallMat.roughness = 0.8;

    const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: 20, height: 8, depth: 0.2 }, scene);
    backWall.position.set(0, 4, -8);
    backWall.material = wallMat;
    backWall.receiveShadows = true;

    const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: 16, height: 8, depth: 0.2 }, scene);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-10, 4, 0);
    leftWall.material = wallMat;
    leftWall.receiveShadows = true;
    
    // ======== 가구 및 오브젝트 생성 ========
    // 소파
    const sofaMat = new BABYLON.PBRMaterial("sofaMat", scene);
    sofaMat.albedoColor = new BABYLON.Color3.FromHexString("#707070");
    sofaMat.roughness = 0.7;

    const sofaBase = BABYLON.MeshBuilder.CreateBox("sofaBase", {width: 6, height: 1.2, depth: 2.5}, scene);
    sofaBase.position.y = 0.6;
    
    const sofaBack = BABYLON.MeshBuilder.CreateBox("sofaBack", {width: 6, height: 1.5, depth: 0.5}, scene);
    sofaBack.position.set(0, 1.95, -1);

    const sofaArmLeft = BABYLON.MeshBuilder.CreateBox("sofaArmLeft", {width: 0.5, height: 0.8, depth: 2.5}, scene);
    sofaArmLeft.position.set(-3.25, 1.2, 0);

    const sofaArmRight = sofaArmLeft.clone("sofaArmRight");
    sofaArmRight.position.x = 3.25;

    const sofa = BABYLON.Mesh.MergeMeshes([sofaBase, sofaBack, sofaArmLeft, sofaArmRight], true, true, undefined, false, true);
    sofa.material = sofaMat;
    sofa.position.z = -2;

    // 사이드 테이블
    const tableMat = new BABYLON.PBRMaterial("tableMat", scene);
    tableMat.albedoColor = new BABYLON.Color3.FromHexString("#5C4033"); // Dark wood
    tableMat.roughness = 0.6;

    const tableTop = BABYLON.MeshBuilder.CreateCylinder("tableTop", {diameter: 1.5, height: 0.15}, scene);
    tableTop.position.set(4.5, 1.2, -2);
    tableTop.material = tableMat;

    const tableLeg = BABYLON.MeshBuilder.CreateCylinder("tableLeg", {diameter: 0.1, height: 1.2}, scene);
    tableLeg.position.set(4.5, 0.6, -2);
    tableLeg.material = tableMat;    

    return scene;
}