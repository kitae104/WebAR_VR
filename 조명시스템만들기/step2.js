// Check : 방향광 + 그림자 제어 
// 그림자가 생기고, 방향광 세기를 바꾸면 명암이 달라져요.DirectionalLight(“태양빛”) 생성, ShadowGenerator, 패널에 ON/OFF·세기·그림자 토글
var createScene = function () {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.06, 0.08, 0.11, 1.0);
    const canvas = engine.getRenderingCanvas();

    // 카메라
    const camera = new BABYLON.ArcRotateCamera("cam",
        BABYLON.Tools.ToRadians(-40),
        BABYLON.Tools.ToRadians(65),
        14,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    camera.attachControl(canvas, true);
    camera.lowerBetaLimit = BABYLON.Tools.ToRadians(5);
    camera.upperBetaLimit = BABYLON.Tools.ToRadians(89);
    camera.wheelPrecision = 40;
    camera.panningSensibility = 350;

    // 하늘(스카이박스)
    scene.createDefaultEnvironment({
        createSkybox: true,
        skyboxSize: 60,
        skyboxColor: new BABYLON.Color3(0.03,0.05,0.08),
        createGround: false
    });

    // 바닥
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 18, height: 12 }, scene);
    const groundMat = new BABYLON.PBRMaterial("groundMat", scene);
    groundMat.albedoColor = new BABYLON.Color3(0.6, 0.6, 0.62);
    groundMat.roughness = 0.6;
    ground.material = groundMat;    

    // === [NEW: 단계 2] 그림자 받기 준비 ===============================
    ground.receiveShadows = true;

    // 벽 3면
    const wallMat = new BABYLON.PBRMaterial("wallMat", scene);
    wallMat.albedoColor = new BABYLON.Color3(0.85, 0.87, 0.9);
    wallMat.roughness = 0.9;
    const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: 18, height: 6, depth: 0.2 }, scene);
    backWall.position.set(0, 3, -6); backWall.material = wallMat;
    const leftWall  = BABYLON.MeshBuilder.CreateBox("leftWall",  { width: 12, height: 6, depth: 0.2 }, scene);
    leftWall.rotation.y = Math.PI/2; leftWall.position.set(-9, 3, 0); leftWall.material = wallMat;
    const rightWall = leftWall.clone("rightWall"); rightWall.position.set(9, 3, 0); rightWall.material = wallMat;

    // 중앙 오브제
    const sculpture = BABYLON.MeshBuilder.CreateSphere("sculpture", { diameter: 0.8, segments: 24 }, scene);
    sculpture.position.set(0.8, 0.8, -0.2);
    const sculptureMat = new BABYLON.PBRMaterial("sculptureMat", scene);
    sculptureMat.albedoColor = new BABYLON.Color3(0.82,0.82,0.85);
    sculptureMat.roughness = 0.35; sculpture.material = sculptureMat;

    // 가구1(테이블)
    const tableTop = BABYLON.MeshBuilder.CreateBox("tableTop", { width: 3, depth: 1.6, height: 0.1 }, scene);
    tableTop.position.set(-2.5, 0.9, 0.5);
    const legOpts = { diameter: 0.08, height: 0.9 };
    const tLeg1 = BABYLON.MeshBuilder.CreateCylinder("tLeg1", legOpts, scene);
    const tLeg2 = tLeg1.clone("tLeg2"), tLeg3 = tLeg1.clone("tLeg3"), tLeg4 = tLeg1.clone("tLeg4");
    const offsX = 1.35, offsZ = 0.7;
    tLeg1.position.set(tableTop.position.x - offsX, 0.45, tableTop.position.z - offsZ);
    tLeg2.position.set(tableTop.position.x + offsX, 0.45, tableTop.position.z - offsZ);
    tLeg3.position.set(tableTop.position.x - offsX, 0.45, tableTop.position.z + offsZ);
    tLeg4.position.set(tableTop.position.x + offsX, 0.45, tableTop.position.z + offsZ);
    const wood = new BABYLON.PBRMaterial("wood", scene);
    wood.albedoColor = new BABYLON.Color3(0.52, 0.36, 0.22); wood.roughness = 0.5; wood.metallic = 0.0;
    tableTop.material = tLeg1.material = tLeg2.material = tLeg3.material = tLeg4.material = wood;

    // 가구2(의자)
    const chairSeat = BABYLON.MeshBuilder.CreateBox("chairSeat", { width: 0.9, depth: 0.9, height: 0.05 }, scene);
    chairSeat.position.set(-2.5, 0.5, -0.8);
    const chairBack = BABYLON.MeshBuilder.CreateBox("chairBack", { width: 0.9, depth: 0.05, height: 0.9 }, scene);
    chairBack.position.set(-2.5, 0.95, -1.22);
    const chairLegOpts = { diameter: 0.05, height: 0.5 };
    const cLeg1 = BABYLON.MeshBuilder.CreateCylinder("cLeg1", chairLegOpts, scene);
    const cLeg2 = cLeg1.clone("cLeg2"), cLeg3 = cLeg1.clone("cLeg3"), cLeg4 = cLeg1.clone("cLeg4");
    const cOff = 0.4;
    cLeg1.position.set(chairSeat.position.x - cOff, 0.25, chairSeat.position.z - cOff);
    cLeg2.position.set(chairSeat.position.x + cOff, 0.25, chairSeat.position.z - cOff);
    cLeg3.position.set(chairSeat.position.x - cOff, 0.25, chairSeat.position.z + cOff);
    cLeg4.position.set(chairSeat.position.x + cOff, 0.25, chairSeat.position.z + cOff);
    const chairMat = new BABYLON.PBRMaterial("chairMat", scene);
    chairMat.albedoColor = new BABYLON.Color3(0.25, 0.3, 0.36); chairMat.roughness = 0.4; chairMat.metallic = 0.0;
    chairSeat.material = chairBack.material = cLeg1.material = cLeg2.material = cLeg3.material = cLeg4.material = chairMat;

    // 가구3(스탠드)
    const standBase = BABYLON.MeshBuilder.CreateCylinder("standBase", { diameter: 0.4, height: 0.05 }, scene);
    standBase.position.set(3.5, 0.025, 0.5);
    const standPole = BABYLON.MeshBuilder.CreateCylinder("standPole", { diameter: 0.06, height: 1.4 }, scene);
    standPole.position.set(3.5, 0.7, 0.5);
    const standShade = BABYLON.MeshBuilder.CreateCylinder("standShade", { diameterTop: 0.15, diameterBottom: 0.6, height: 0.3, tessellation: 24 }, scene);
    standShade.position.set(3.5, 1.5, 0.5);
    const bulb = BABYLON.MeshBuilder.CreateSphere("bulb", { diameter: 0.14, segments: 16 }, scene);
    bulb.position.set(3.5, 1.4, 0.5);
    const metal = new BABYLON.PBRMaterial("metal", scene);
    metal.albedoColor = new BABYLON.Color3(0.6, 0.62, 0.65); metal.metallic = 1.0; metal.roughness = 0.3;
    standBase.material = standPole.material = metal;
    const shadeMat = new BABYLON.PBRMaterial("shadeMat", scene);
    shadeMat.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95); shadeMat.roughness = 0.9; shadeMat.metallic = 0.0;
    standShade.material = shadeMat;
    const bulbMat = new BABYLON.PBRMaterial("bulbMat", scene);
    bulbMat.emissiveColor = new BABYLON.Color3(1.0, 0.86, 0.6); bulb.material = bulbMat;

    // 베이스 조명
    const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), scene);
    hemiLight.intensity = 0.9;
    
    // === [NEW: 단계 2] 방향광 + 그림자 ==================================
    const dirLight = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-2, -3, -1), scene);
    dirLight.position = new BABYLON.Vector3(6, 8, 4);
    dirLight.intensity = 1.2;

    const shadowGen = new BABYLON.ShadowGenerator(2048, dirLight, true);
    shadowGen.usePoissonSampling = true;
    [tableTop, tLeg1, tLeg2, tLeg3, tLeg4, chairSeat, chairBack, cLeg1, cLeg2, cLeg3, cLeg4, standBase, standPole, standShade, bulb, sculpture]
        .forEach(m => shadowGen.addShadowCaster(m));


    // ================= 패널 UI =================
    // 이전 패널 제거
    const old = document.getElementById("ui-panel"); if (old) old.remove();
    if (!document.getElementById("ui-style")) {
        const style = document.createElement("style");
        style.id = "ui-style";
        style.textContent = `
        .panel{position:fixed;top:12px;left:12px;z-index:10;background:rgba(20,24,30,.88);color:#e9eef5;padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:12px;backdrop-filter:blur(6px);max-width:320px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto}
        .panel h2{margin:0 0 8px;font-size:16px}
        .row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin:8px 0}
        .row input[type="range"]{width:140px}
        .row input[type="color"]{width:40px;height:26px;padding:0;border:none;background:transparent}
        .hr{height:1px;background:linear-gradient(90deg,#233144,transparent);margin:10px 0;border:none}
        .btn{display:inline-block;padding:6px 10px;border-radius:8px;border:1px solid #2a3b52;background:#152131;color:#e9eef5;font-size:12px;text-decoration:none;cursor:pointer}
        .btn:hover{filter:brightness(1.1)}
        .badge{display:inline-block;padding:2px 6px;border-radius:6px;background:#1b2735;border:1px solid #2a3b52;font-size:11px}
        .hint{font-size:11px;opacity:.8}
        `;
        document.head.appendChild(style);
    }

    const panel = document.createElement("div");
    panel.id = "ui-panel";
    panel.className = "panel";
    panel.innerHTML = `
        <h2>건축 조명 컨트롤 <span class="badge">Step 1</span></h2>

        <!-- [NEW: 단계 1] 베이스 조명 -->
        <div class="row"><label>베이스(Hemisphere) ON/OFF</label><input id="hemiToggle" type="checkbox" checked /></div>
        <div class="row"><label>베이스 세기</label><input id="hemiIntensity" type="range" min="0" max="2" step="0.01" value="0.9" /></div>
        <div class="row"><label>베이스 색</label><input id="hemiColor" type="color" value="#ffffff" /></div>

        <div class="hr"></div>

        <!-- [NEW: 단계 2] 방향광 + 그림자 --------------------------------------->
        <div class="row"><label>태양(Directional) ON/OFF</label><input id="dirToggle" type="checkbox" checked /></div>
        <div class="row"><label>태양 세기</label><input id="dirIntensity" type="range" min="0" max="4" step="0.01" value="1.2" /></div>
        <div class="row"><label>그림자 ON/OFF</label><input id="shadowToggle" type="checkbox" checked /></div>

        <div class="hr"></div>

        <a id="resetBtn" class="btn">뷰 초기화</a>
        <div class="hint">마우스: 드래그/휠/우클릭. 이 단계는 베이스 조명만 제어합니다.</div>
    `;
    document.body.appendChild(panel);

    const $ = (id) => document.getElementById(id);
    // 이벤트
    $("hemiToggle").onchange = e => hemiLight.setEnabled(e.target.checked);
    $("hemiIntensity").oninput = e => hemiLight.intensity = parseFloat(e.target.value);
    $("hemiColor").oninput = e => hemiLight.diffuse = BABYLON.Color3.FromHexString(e.target.value);

    // === [NEW: 단계 2] 이벤트====================================================
    $("dirToggle").onchange = e => dirLight.setEnabled(e.target.checked);
    $("dirIntensity").oninput = e => dirLight.intensity = parseFloat(e.target.value);
    $("shadowToggle").onchange = e => {
        const on = e.target.checked;
        [ground, backWall, leftWall, rightWall].forEach(m => m.receiveShadows = on);
        shadowGen.getShadowMap().refreshRate = on ? BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE : BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
    };


    // 리셋 버튼
    $("resetBtn").onclick = () => {
        camera.setPosition(new BABYLON.Vector3(-7, 10, 9));
        camera.setTarget(new BABYLON.Vector3(0, 1, 0));
    };
    $("resetBtn").click();    

    return scene;
}