const canvas = document.getElementById('chip-canvas');

if (canvas && window.THREE) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);

  const group = new THREE.Group();
  scene.add(group);

  const buildPointCloud = (count, mode) => {
    const positions = [];
    const colors = [];
    const colorA = new THREE.Color('#f5f7ff');
    const colorB = new THREE.Color('#f7c989');
    const colorC = new THREE.Color('#8fd7ff');

    for (let i = 0; i < count; i += 1) {
      let x = 0;
      let y = 0;
      let z = 0;

      if (mode === 'cube') {
        x = (Math.random() - 0.5) * 3.6;
        y = (Math.random() - 0.5) * 3.6;
        z = (Math.random() - 0.5) * 3.6;
      }

      if (mode === 'sphere') {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2.2;
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      }

      if (mode === 'cone') {
        const theta = Math.random() * Math.PI * 2;
        const t = Math.random();
        const radius = 2.2 * (1 - t);
        x = Math.cos(theta) * radius;
        y = (t - 0.5) * 4.8;
        z = Math.sin(theta) * radius;
      }

      positions.push(x, y, z);

      const color = new THREE.Color().lerpColors(colorA, colorB, Math.random());
      const mix = new THREE.Color().lerpColors(color, colorC, Math.random() * 0.5);
      colors.push(mix.r, mix.g, mix.b);
    }

    return { positions, colors };
  };

  const pointClouds = [
    buildPointCloud(1800, 'cube'),
    buildPointCloud(1800, 'sphere'),
    buildPointCloud(1800, 'cone')
  ];

  const points = pointClouds.map((shape) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(shape.positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(shape.colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const cloud = new THREE.Points(geometry, material);
    cloud.visible = false;
    group.add(cloud);
    return cloud;
  });

  const wireframes = [
    new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 3.4, 3.4),
      new THREE.MeshBasicMaterial({ color: '#dfeaff', transparent: true, opacity: 0.45, wireframe: true })
    ),
    new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: '#dfeaff', transparent: true, opacity: 0.45, wireframe: true })
    ),
    new THREE.Mesh(
      new THREE.ConeGeometry(2.2, 4.6, 42),
      new THREE.MeshBasicMaterial({ color: '#dfeaff', transparent: true, opacity: 0.45, wireframe: true })
    )
  ];

  wireframes.forEach((mesh) => {
    mesh.visible = false;
    group.add(mesh);
  });

  let activeShape = 0;
  let previousShape = 0;
  let transitionProgress = 1;

  const setShapeState = (index) => {
    previousShape = activeShape;
    activeShape = index;
    transitionProgress = 0;

    points.forEach((mesh, meshIndex) => {
      mesh.visible = meshIndex === activeShape || meshIndex === previousShape;
    });

    wireframes.forEach((mesh, meshIndex) => {
      mesh.visible = meshIndex === activeShape || meshIndex === previousShape;
    });

    points[previousShape].material.opacity = 1;
    points[activeShape].material.opacity = 0;
    wireframes[previousShape].material.opacity = 0.45;
    wireframes[activeShape].material.opacity = 0;
  };

  const smoothEase = (value) => 1 - Math.pow(1 - value, 3);

  points[0].visible = true;
  wireframes[0].visible = true;
  points[0].material.opacity = 1;
  wireframes[0].material.opacity = 0.45;

  camera.position.set(0, 0.2, 8);

  const resizeRenderer = () => {
    const parent = canvas.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  resizeRenderer();
  window.addEventListener('resize', resizeRenderer);

  const tick = () => {
    requestAnimationFrame(tick);

    if (transitionProgress < 1) {
      transitionProgress = Math.min(1, transitionProgress + 0.025);
      const ease = smoothEase(transitionProgress);
      points[previousShape].material.opacity = 1 - ease;
      points[activeShape].material.opacity = ease;
      wireframes[previousShape].material.opacity = 0.45 * (1 - ease);
      wireframes[activeShape].material.opacity = 0.45 * ease;

      const scale = 1 + (1 - ease) * 0.12;
      points[previousShape].scale.setScalar(scale);
      points[activeShape].scale.setScalar(1 + ease * 0.12);
      wireframes[previousShape].scale.setScalar(scale);
      wireframes[activeShape].scale.setScalar(1 + ease * 0.12);

      if (transitionProgress >= 1) {
        points[previousShape].visible = false;
        wireframes[previousShape].visible = false;
        points[activeShape].visible = true;
        wireframes[activeShape].visible = true;
        points[previousShape].scale.setScalar(1);
        points[activeShape].scale.setScalar(1);
        wireframes[previousShape].scale.setScalar(1);
        wireframes[activeShape].scale.setScalar(1);
      }
    }

    group.rotation.x += 0.003;
    group.rotation.y += 0.006;
    group.rotation.z += 0.0015;
    renderer.render(scene, camera);
  };

  window.__sbasShapeState = setShapeState;
  tick();
}

const heroFeatureStates = [
  { index: '01', title: 'AI OPS PLATFORM', subtitle: '92% automation coverage' },
  { index: '02', title: 'AUTOMATION WORKFLOW', subtitle: '3.4x faster execution' },
  { index: '03', title: 'INTELLIGENCE LAYER', subtitle: '24/7 operational insight' }
];

const visualPanel = document.querySelector('.visual-panel');
const featureTag = document.querySelector('[data-feature-tag]');
const featureIndex = document.querySelector('[data-feature-index]');
const featureTitle = document.querySelector('[data-feature-title]');
const featureSubtitle = document.querySelector('[data-feature-subtitle]');
const featureButtons = document.querySelectorAll('[data-feature-button]');

if (visualPanel && featureTag && featureIndex && featureTitle && featureSubtitle) {
  let currentFeature = 0;

  const setFeatureState = (index) => {
    currentFeature = (index + heroFeatureStates.length) % heroFeatureStates.length;
    const state = heroFeatureStates[currentFeature];

    visualPanel.dataset.state = String(currentFeature + 1);
    featureTag.classList.remove('is-transitioning');
    void featureTag.offsetWidth;
    featureTag.classList.add('is-transitioning');

    if (window.__sbasShapeState) {
      window.__sbasShapeState(currentFeature);
    }

    window.setTimeout(() => {
      featureIndex.textContent = state.index;
      featureTitle.textContent = state.title;
      featureSubtitle.textContent = state.subtitle;
      featureTag.classList.remove('is-transitioning');
    }, 180);
  };

  featureButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const delta = button.dataset.featureButton === 'next' ? 1 : -1;
      setFeatureState(currentFeature + delta);
    });
  });

  setFeatureState(0);
}

const paymentForm = document.querySelector('[data-payment-form]');
const paymentSubmit = document.querySelector('[data-payment-submit]');
const summaryPackage = document.querySelector('[data-summary-package]');
const summaryTotal = document.querySelector('[data-summary-total]');

if (paymentForm) {
  const updateSummary = (selected) => {
    const planName = selected?.dataset?.planName || 'AI Strategy Sprint';
    const planPrice = Number(selected?.dataset?.planPrice || 4500);

    if (summaryPackage) {
      summaryPackage.textContent = planName;
    }

    if (summaryTotal) {
      summaryTotal.textContent = `$${planPrice.toLocaleString()}`;
    }

    if (paymentSubmit) {
      paymentSubmit.textContent = `Book Discovery Call · $${planPrice.toLocaleString()}`;
    }
  };

  const radioInputs = paymentForm.querySelectorAll('input[name="plan"]');

  radioInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const selected = input.closest('.plan-option');
      updateSummary(selected);
    });
  });

  paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const selected = paymentForm.querySelector('input[name="plan"]:checked')?.closest('.plan-option');
    const selectedName = selected?.dataset?.planName || 'AI Strategy Sprint';
    const selectedPrice = Number(selected?.dataset?.planPrice || 4500);

    const firstName = document.getElementById('first-name')?.value?.trim() || '';
    const lastName = document.getElementById('last-name')?.value?.trim() || '';
    const company = document.getElementById('company')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const budget = document.getElementById('budget')?.value?.trim() || '';
    const notes = document.getElementById('notes')?.value?.trim() || '';

    const recipient = 'landon.sbas@outlook.com';
    const subject = encodeURIComponent(`New Discovery Call Request: ${selectedName}`);
    const body = encodeURIComponent(
      [
        'SBAS Discovery Call Inbound Request',
        '',
        `Plan: ${selectedName}`,
        `Price: $${selectedPrice.toLocaleString()}`,
        `First Name: ${firstName}`,
        `Last Name: ${lastName}`,
        `Company: ${company}`,
        `Email: ${email}`,
        `Budget Range: ${budget}`,
        `Challenge: ${notes}`,
        '',
        'This request was submitted from the SBAS.info contact form.'
      ].join('\n')
    );

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

    paymentForm.reset();
    if (summaryPackage) summaryPackage.textContent = 'AI Strategy Sprint';
    if (summaryTotal) summaryTotal.textContent = '$4,500';
    if (paymentSubmit) paymentSubmit.textContent = 'Book Discovery Call';
  });
}
