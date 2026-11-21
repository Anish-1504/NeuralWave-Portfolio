export interface ProductSpec {
  category: string;
  items: { label: string; value: string; detail?: string }[];
}

export interface StoryScene {
  id: string;
  startProgress: number; // 0 to 1
  endProgress: number;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  highlightStats?: { label: string; value: string }[];
  annotations?: { x: number; y: number; label: string; desc: string }[];
}

export const HALO_STORY_SCENES: StoryScene[] = [
  {
    id: "hero-reveal",
    startProgress: 0,
    endProgress: 0.18,
    tag: "HALO STUDIO",
    title: "Silence, Perfected.",
    subtitle: "A Masterpiece of Acoustic Engineering",
    description:
      "A quiet, balanced fit meets adaptive sound and carefully tuned acoustic architecture for uninterrupted listening.",
    highlightStats: [
      { label: "Driver Size", value: "30mm Carbon Dome" },
      { label: "Battery Life", value: "Up to 30 Hours" },
      { label: "Noise Sensors", value: "8-Microphone Array" },
    ],
  },
  {
    id: "engineering-reveal",
    startProgress: 0.18,
    endProgress: 0.42,
    tag: "INTERNAL ARCHITECTURE",
    title: "Precision Inside.",
    subtitle: "Exploded Engineering Symmetry",
    description:
      "A light, fold-flat frame, soft cushions, and isolated acoustic chambers are shaped for long listening sessions.",
    annotations: [
      { x: 32, y: 38, label: "Driver Unit", desc: "Edge carbon fiber composite dome" },
      { x: 68, y: 35, label: "Acoustic Chamber", desc: "Turbulence-damped internal airflow" },
      { x: 50, y: 65, label: "Soft-Fit Synthetic Leather", desc: "Pressure-relieving multi-density memory foam" },
    ],
    highlightStats: [
      { label: "Weight", value: "About 250 grams" },
      { label: "Chamber Damping", value: "Acoustic Mesh" },
    ],
  },
  {
    id: "anc-technology",
    startProgress: 0.42,
    endProgress: 0.65,
    tag: "ACTIVE NOISE CANCELLATION",
    title: "Adaptive Silence.",
    subtitle: "Adaptive signal processing",
    description:
      "A multi-microphone array monitors the sound around you while adaptive processing adjusts cancellation to fit and surroundings.",
    highlightStats: [
      { label: "Microphones", value: "8 Precision Array" },
      { label: "Control", value: "Adaptive listening modes" },
      { label: "Calls", value: "Beamforming voice capture" },
    ],
  },
  {
    id: "sound-acoustics",
    startProgress: 0.65,
    endProgress: 0.86,
    tag: "HI-RES WIRELESS AUDIO",
    title: "Texture & Detail.",
    subtitle: "High-resolution wireless audio",
    description:
      "High-resolution codec support and signal restoration help preserve texture and detail across compatible wireless sources.",
    highlightStats: [
      { label: "Wireless detail", value: "High-resolution audio with compatible sources" },
      { label: "Frequency Range", value: "4 Hz – 40,000 Hz" },
      { label: "Spatial Sound", value: "Personalized immersive audio" },
    ],
  },
  {
    id: "reassembly",
    startProgress: 0.86,
    endProgress: 1.0,
    tag: "THE REVELATION",
    title: "Hear Everything. Feel Nothing Else.",
    subtitle: "Comfort Beyond Expectations",
    description:
      "Fold the frame flat, reconnect two devices, and carry a quiet listening space from commute to desk.",
    highlightStats: [
      { label: "Quick Charge", value: "3 min = up to 3 hrs" },
      { label: "Multipoint", value: "Simultaneous 2 Devices" },
      { label: "Touch Sensor", value: "Capacitive Gesture Surface" },
    ],
  },
];

export const PULSE_STORY_SCENES: StoryScene[] = [
  {
    id: "watch-hero",
    startProgress: 0,
    endProgress: 0.18,
    tag: "PULSE ONE",
    title: "A clearer view of your day.",
    subtitle: "Bright display, quiet confidence",
    description:
      "A lightweight, always-on display brings time, movement, and useful signals into view without slowing your day.",
    highlightStats: [
      { label: "Display Peak", value: "Up to 2,000 Nits OLED" },
      { label: "Health", value: "Heart, ECG & Sleep" },
      { label: "Battery", value: "Up to 24 Hours" },
    ],
  },
  {
    id: "craftsmanship",
    startProgress: 0.18,
    endProgress: 0.38,
    tag: "CASE & CONTROLS",
    title: "Built for a close fit.",
    subtitle: "Tactile controls, adaptable finishes",
    description:
      "A compact case, tactile crown, and customizable button keep everyday controls close at hand.",
    annotations: [
      { x: 30, y: 40, label: "Digital Crown", desc: "Optical encoder with micro-haptic feedback" },
      { x: 70, y: 55, label: "Action Button", desc: "Machined international orange trigger" },
      { x: 50, y: 25, label: "Dual Speakers", desc: "86dB siren for emergency alerts" },
    ],
    highlightStats: [
      { label: "Case Material", value: "Aluminium, titanium or ceramic" },
      { label: "Display", value: "42 mm or 46 mm options" },
    ],
  },
  {
    id: "exploded-internals",
    startProgress: 0.38,
    endProgress: 0.62,
    tag: "ON-WRIST COMPUTING",
    title: "Useful intelligence, ready.",
    subtitle: "PulseCore processing",
    description:
      "On-device processing keeps everyday interactions responsive and supports voice features while your personal health data remains in your control.",
    highlightStats: [
      { label: "Assistant", value: "On-device voice tools" },
      { label: "Finding", value: "Precision device locating" },
      { label: "Connection", value: "5G-ready configuration" },
    ],
  },
  {
    id: "health-sensors",
    startProgress: 0.62,
    endProgress: 0.85,
    tag: "HEALTH SENSING",
    title: "See patterns, not just numbers.",
    subtitle: "Heart, recovery and sleep signals",
    description:
      "Optical and electrical sensors build a broader picture from heart-rate trends, ECG readings, oxygen measurements, and overnight temperature changes.",
    highlightStats: [
      { label: "Readiness", value: "Activity, sleep & vitals" },
      { label: "Recovery", value: "Overnight HRV trends" },
      { label: "ECG", value: "Single-lead readings" },
    ],
  },
  {
    id: "reassemble-lifestyle",
    startProgress: 0.85,
    endProgress: 1.0,
    tag: "EVERYDAY MOMENTUM",
    title: "Designed to move with you.",
    subtitle: "Training, recovery, and staying connected",
    description:
      "Build a routine around activity goals, guided workouts, recovery signals, and useful safety features.",
    highlightStats: [
      { label: "Battery", value: "Up to 24 hours" },
      { label: "Cellular", value: "5G connectivity" },
      { label: "Safety", value: "Fall & crash alerts" },
    ],
  },
];

export const HALO_SPECS: ProductSpec[] = [
  {
    category: "Acoustic Hardware",
    items: [
      { label: "Driver Unit", value: "30mm Dynamic Driver", detail: "Carbon-fiber composite diaphragm" },
      { label: "Frequency Response", value: "4 Hz – 40,000 Hz", detail: "Active and wired passive operation" },
      { label: "Impedance", value: "48 Ω (active) / 16 Ω (passive)" },
      { label: "Magnet Type", value: "Neodymium High-Flux N52" },
    ],
  },
  {
    category: "Noise Cancellation & Mics",
    items: [
      { label: "NC Processors", value: "Dual adaptive processors", detail: "Continuous fit and ambient analysis" },
      { label: "Microphone Array", value: "8 Microphones total", detail: "4 beamforming microphones per ear cup" },
      { label: "Barometric Optimizer", value: "Built-in atmospheric pressure sensor" },
      { label: "Ambient Sound Control", value: "20 Levels with Voice Passthrough Focus" },
    ],
  },
  {
    category: "Wireless & Connectivity",
    items: [
      { label: "Bluetooth Version", value: "Bluetooth 5.2" },
      { label: "Supported Codecs", value: "AAC, SBC, and high-resolution wireless audio" },
      { label: "Multipoint Connection", value: "Supported (2 devices simultaneously)" },
      { label: "Effective Range", value: "Approximately 30 ft (10 m)" },
    ],
  },
  {
    category: "Battery & Charging",
    items: [
      { label: "Battery Playback Time", value: "Up to 30 hours (NC On) / 40 hours (NC Off)" },
      { label: "Fast Quick Charge", value: "3 minutes charging = 3 hours playback" },
      { label: "Charging Port", value: "USB Type-C with Power Delivery" },
      { label: "Full Charge Time", value: "Approx. 3.5 hours" },
    ],
  },
  {
    category: "Dimensions & Weight",
    items: [
      { label: "Headphone Weight", value: "Approx. 250 grams" },
      { label: "Ear Cushion Material", value: "Soft-fit synthetic leather" },
      { label: "Folding Structure", value: "Silent swivel and collapsible flat case" },
    ],
  },
];

export const PULSE_SPECS: ProductSpec[] = [
  {
    category: "Design & Materials",
    items: [
      { label: "Case Material", value: "Aluminium, titanium or ceramic" },
      { label: "Case Sizes", value: "42 mm or 46 mm" },
      { label: "Construction", value: "Lightweight, water-ready enclosure" },
    ],
  },
  {
    category: "Display Technology",
    items: [
      { label: "Display Type", value: "Wide-angle Always-On OLED" },
      { label: "Peak Brightness", value: "Up to 2,000 nits" },
      { label: "Display Options", value: "42 mm and 46 mm cases" },
    ],
  },
  {
    category: "Silicon & Processing",
    items: [
      { label: "Processor", value: "PulseCore S12 platform" },
      { label: "Voice Features", value: "On-device assistant tools" },
      { label: "Connectivity", value: "5G-ready cellular option" },
    ],
  },
  {
    category: "Health & Vital Sensors",
    items: [
      { label: "Heart Sensors", value: "Optical heart-rate & ECG sensors" },
      { label: "Health Signals", value: "Blood oxygen & wrist temperature" },
      { label: "Recovery", value: "HRV and sleep insights" },
      { label: "Safety", value: "Fall and crash notifications" },
    ],
  },
  {
    category: "Power & Battery",
    items: [
      { label: "Standard Battery", value: "Up to 24 hours" },
      { label: "Low Power Mode", value: "Up to 38 hours" },
      { label: "Charging", value: "Magnetic fast-charge puck" },
    ],
  },
];
