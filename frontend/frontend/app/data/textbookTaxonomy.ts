export type ChapterInfo = {
  chapter_number: number;
  title: string;
  subtopics: string[];
};

export type SubjectTaxonomy = {
  subject: string;
  stream?: "Science" | "Commerce" | "Arts";
  chapters: ChapterInfo[];
};

export const TEXTBOOK_TAXONOMY: Record<string, Record<string, SubjectTaxonomy[]>> = {
  CBSE: {
    "Class 10": [
      {
        subject: "Mathematics",
        chapters: [
          { chapter_number: 1, title: "Real Numbers", subtopics: ["Euclid's Lemma", "Fundamental Theorem of Arithmetic", "Irrational Proofs"] },
          { chapter_number: 2, title: "Polynomials", subtopics: ["Zeros of Polynomial", "Relationship between Zeros and Coefficients"] },
          { chapter_number: 3, title: "Pair of Linear Equations in Two Variables", subtopics: ["Graphical Method", "Elimination & Substitution Methods"] },
          { chapter_number: 4, title: "Quadratic Equations", subtopics: ["Factorisation", "Quadratic Formula", "Discriminant & Nature of Roots"] },
          { chapter_number: 5, title: "Arithmetic Progressions", subtopics: ["n-th Term $a_n$", "Sum of First n Terms $S_n$"] },
          { chapter_number: 6, title: "Triangles", subtopics: ["Similarity Criteria (AAA, SSS, SAS)", "Basic Proportionality Theorem"] },
          { chapter_number: 7, title: "Coordinate Geometry", subtopics: ["Distance Formula", "Section Formula"] },
          { chapter_number: 8, title: "Introduction to Trigonometry", subtopics: ["Trigonometric Ratios", "Identities $\\sin^2\\theta + \\cos^2\\theta = 1$"] },
          { chapter_number: 9, title: "Some Applications of Trigonometry", subtopics: ["Heights and Distances", "Angle of Elevation & Depression"] },
          { chapter_number: 10, title: "Circles", subtopics: ["Tangent Properties", "Tangents from External Point"] },
          { chapter_number: 11, title: "Areas Related to Circles", subtopics: ["Area of Sector", "Area of Segment"] },
          { chapter_number: 12, title: "Surface Areas and Volumes", subtopics: ["Combination of Solids", "Volume of Solids"] },
          { chapter_number: 13, title: "Statistics", subtopics: ["Mean of Grouped Data", "Mode & Median"] },
          { chapter_number: 14, title: "Probability", subtopics: ["Theoretical Probability", "Sample Space & Events"] },
        ],
      },
      {
        subject: "Science",
        chapters: [
          { chapter_number: 1, title: "Chemical Reactions and Equations", subtopics: ["Balancing Equations", "Combination & Decomposition"] },
          { chapter_number: 2, title: "Acids, Bases and Salts", subtopics: ["pH Scale", "Neutralisation", "Bleaching Powder"] },
          { chapter_number: 3, title: "Metals and Non-metals", subtopics: ["Reactivity Series", "Ionic Bonding", "Extraction"] },
          { chapter_number: 4, title: "Carbon and its Compounds", subtopics: ["Covalent Bond", "Homologous Series", "Ethanol"] },
          { chapter_number: 5, title: "Life Processes", subtopics: ["Nutrition", "Respiration", "Transportation", "Excretion"] },
          { chapter_number: 6, title: "Control and Coordination", subtopics: ["Nervous System", "Human Brain", "Plant Tropisms"] },
          { chapter_number: 7, title: "How do Organisms Reproduce?", subtopics: ["Asexual Modes", "Plant & Human Reproduction"] },
          { chapter_number: 8, title: "Heredity", subtopics: ["Mendel's Laws", "Sex Determination"] },
          { chapter_number: 9, title: "Light – Reflection and Refraction", subtopics: ["Mirror Formula", "Snell's Law", "Lens Formula & Power"] },
          { chapter_number: 10, title: "Human Eye and Colourful World", subtopics: ["Myopia & Hypermetropia", "Prism Dispersion"] },
          { chapter_number: 11, title: "Electricity", subtopics: ["Ohm's Law $V=IR$", "Series & Parallel Resistance", "Heating Effect"] },
          { chapter_number: 12, title: "Magnetic Effects of Electric Current", subtopics: ["Field Lines", "Fleming's Left Hand Rule"] },
          { chapter_number: 13, title: "Our Environment", subtopics: ["Ecosystem & Food Chains", "10% Energy Law"] },
        ],
      },
    ],
    "Class 11": [
      {
        subject: "Mathematics Part 1",
        stream: "Science",
        chapters: [
          { chapter_number: 1, title: "Sets", subtopics: ["Types of Sets", "Venn Diagrams", "Operations on Sets"] },
          { chapter_number: 2, title: "Relations and Functions", subtopics: ["Cartesian Product", "Domain & Range", "Types of Functions"] },
          { chapter_number: 3, title: "Trigonometric Functions", subtopics: ["Radian Measure", "Trigonometric Identities", "Equations"] },
          { chapter_number: 4, title: "Complex Numbers and Quadratic Equations", subtopics: ["Imaginary Unit i", "Argand Plane", "Polar Form"] },
          { chapter_number: 5, title: "Linear Inequalities", subtopics: ["Algebraic Solutions", "Graphical Solutions"] },
          { chapter_number: 6, title: "Permutations and Combinations", subtopics: ["Fundamental Principle", "$n P r$ and $n C r$"] },
          { chapter_number: 7, title: "Binomial Theorem", subtopics: ["Expansion of $(x+y)^n$", "General and Middle Terms"] },
        ],
      },
      {
        subject: "Mathematics Part 2",
        stream: "Science",
        chapters: [
          { chapter_number: 1, title: "Sequences and Series", subtopics: ["AP & GP", "Sum to n terms"] },
          { chapter_number: 2, title: "Straight Lines", subtopics: ["Slope of Line", "Forms of Equation of Line", "Distance Formula"] },
          { chapter_number: 3, title: "Conic Sections", subtopics: ["Circles, Parabola, Ellipse, Hyperbola"] },
          { chapter_number: 4, title: "Introduction to Three Dimensional Geometry", subtopics: ["Coordinates in 3D Space", "Distance Formula"] },
          { chapter_number: 5, title: "Limits and Derivatives", subtopics: ["Limits", "First Principles Derivatives"] },
          { chapter_number: 6, title: "Statistics", subtopics: ["Mean Deviation", "Variance & Standard Deviation"] },
          { chapter_number: 7, title: "Probability", subtopics: ["Sample Space", "Axiomatic Approach"] },
        ],
      },
    ],
    "Class 12": [
      {
        subject: "Mathematics Part 1",
        stream: "Science",
        chapters: [
          { chapter_number: 1, title: "Relations and Functions", subtopics: ["Equivalence Relations", "One-One & Onto Functions"] },
          { chapter_number: 2, title: "Inverse Trigonometric Functions", subtopics: ["Principal Value Branches", "Properties"] },
          { chapter_number: 3, title: "Matrices", subtopics: ["Matrix Operations", "Transposition", "Invertible Matrices"] },
          { chapter_number: 4, title: "Determinants", subtopics: ["Properties of Determinants", "Minors and Cofactors", "Matrix Inverse Method"] },
          { chapter_number: 5, title: "Continuity and Differentiability", subtopics: ["Chain Rule", "Implicit Differentiation", "Logarithmic Differentiation"] },
          { chapter_number: 6, title: "Application of Derivatives", subtopics: ["Rate of Change", "Increasing & Decreasing", "Maxima & Minima"] },
        ],
      },
      {
        subject: "Mathematics Part 2",
        stream: "Science",
        chapters: [
          { chapter_number: 1, title: "Integrals", subtopics: ["Indefinite & Definite Integrals", "Integration by Parts & Partial Fractions"] },
          { chapter_number: 2, title: "Application of Integrals", subtopics: ["Area Under Simple Curves", "Area Between Two Curves"] },
          { chapter_number: 3, title: "Differential Equations", subtopics: ["Order & Degree", "Variable Separable", "Homogeneous & Linear DE"] },
          { chapter_number: 4, title: "Vector Algebra", subtopics: ["Dot & Cross Product", "Scalar Triple Product"] },
          { chapter_number: 5, title: "Three Dimensional Geometry", subtopics: ["Direction Cosines & Ratios", "Equation of Line", "Shortest Distance"] },
          { chapter_number: 6, title: "Linear Programming", subtopics: ["Graphical Method for Solving LPP"] },
          { chapter_number: 7, title: "Probability", subtopics: ["Conditional Probability", "Bayes' Theorem", "Binomial Distribution"] },
        ],
      },
    ],
  },
  Maharashtra: {
    "Class 10": [
      {
        subject: "Mathematics Part 1",
        chapters: [
          { chapter_number: 1, title: "Linear Equations in Two Variables", subtopics: ["Cramer's Rule (Determinant Method)", "Simultaneous Equations", "Word Problems"] },
          { chapter_number: 2, title: "Quadratic Equations", subtopics: ["Factorisation Method", "Formula Method & Discriminant"] },
          { chapter_number: 3, title: "Arithmetic Progression", subtopics: ["Sequence & AP", "$t_n$ Formula", "$S_n$ Formula & Applications"] },
          { chapter_number: 4, title: "Financial Planning", subtopics: ["GST (CGST, SGST)", "Tax Invoice", "Shares, Mutual Funds & NAV"] },
          { chapter_number: 5, title: "Probability", subtopics: ["Sample Space S", "Event & Probability $P(A) = n(A)/n(S)$"] },
          { chapter_number: 6, title: "Statistics", subtopics: ["Histogram & Frequency Polygon", "Pie Diagram", "Mean, Median, Mode"] },
        ],
      },
      {
        subject: "Mathematics Part 2",
        chapters: [
          { chapter_number: 1, title: "Similarity", subtopics: ["Ratio of Areas of Two Triangles", "Basic Proportionality Theorem", "Angle Bisector Property"] },
          { chapter_number: 2, title: "Pythagoras Theorem", subtopics: ["Pythagorean Triplets", "Geometric Mean Theorem", "Apollonius Theorem"] },
          { chapter_number: 3, title: "Circle", subtopics: ["Tangent-Radius Theorem", "Inscribed Angle Theorem", "Secant-Tangent Theorem"] },
          { chapter_number: 4, title: "Geometric Constructions", subtopics: ["Construction of Similar Triangles", "Construction of Tangent"] },
          { chapter_number: 5, title: "Coordinate Geometry", subtopics: ["Distance Formula", "Section & Midpoint Formula", "Slope of Line"] },
          { chapter_number: 6, title: "Trigonometry", subtopics: ["Trigonometric Identities", "Heights & Distances Problems"] },
          { chapter_number: 7, title: "Mensuration", subtopics: ["Area of Sector & Segment", "Volume of Sphere, Cylinder, Cone, Frustum"] },
        ],
      },
      {
        subject: "Science & Technology Part 1",
        chapters: [
          { chapter_number: 1, title: "Gravitation", subtopics: ["Kepler's Laws", "Newton's Gravitation Law", "Free Fall & Escape Velocity"] },
          { chapter_number: 2, title: "Periodic Classification of Elements", subtopics: ["Mendeleev's Table", "Modern Periodic Table & Trends"] },
          { chapter_number: 3, title: "Chemical Reactions and Equations", subtopics: ["Types of Reactions", "Oxidation & Reduction"] },
          { chapter_number: 4, title: "Effects of Electric Current", subtopics: ["Joule's Law", "Magnetic Field & Motor"] },
          { chapter_number: 5, title: "Heat", subtopics: ["Anomalous Behaviour of Water", "Specific Heat Capacity"] },
          { chapter_number: 6, title: "Refraction of Light", subtopics: ["Laws of Refraction", "Refractive Index", "Twinkling of Stars"] },
          { chapter_number: 7, title: "Lenses", subtopics: ["Lens Formula", "Human Eye & Vision Defects"] },
          { chapter_number: 8, title: "Metallurgy", subtopics: ["Reactivity Series", "Extraction of Aluminium", "Corrosion Prevention"] },
          { chapter_number: 9, title: "Carbon Compounds", subtopics: ["Covalent Bonds", "Ethanol & Ethanoic Acid"] },
          { chapter_number: 10, title: "Space Missions", subtopics: ["Satellites & Orbits", "Space Launch Vehicles"] },
        ],
      },
      {
        subject: "Science & Technology Part 2",
        chapters: [
          { chapter_number: 1, title: "Heredity and Evolution", subtopics: ["Transcription & Translation", "Evidences of Evolution", "Darwin & Lamarckism"] },
          { chapter_number: 2, title: "Life Processes in Living Organisms Part 1", subtopics: ["Cellular Respiration", "Cell Division (Mitosis & Meiosis)"] },
          { chapter_number: 3, title: "Life Processes in Living Organisms Part 2", subtopics: ["Asexual & Sexual Reproduction", "Human Reproductive System"] },
          { chapter_number: 4, title: "Environmental Management", subtopics: ["Ecosystem & Biodiversity", "Waste Management"] },
          { chapter_number: 5, title: "Towards Green Energy", subtopics: ["Thermal, Hydroelectric, Solar & Wind Power"] },
        ],
      },
    ],
    "Class 12": [
      {
        subject: "Mathematics Part 1",
        stream: "Science",
        chapters: [
          { chapter_number: 1, title: "Mathematical Logic", subtopics: ["Statements and Truth Values", "Logical Connectives", "Quantifiers"] },
          { chapter_number: 2, title: "Matrices", subtopics: ["Elementary Transformations", "Inverse of Matrix"] },
          { chapter_number: 3, title: "Trigonometric Functions", subtopics: ["General Solutions", "Polar & Cartesian Coordinates", "Sine & Cosine Rules"] },
          { chapter_number: 4, title: "Pair of Straight Lines", subtopics: ["Combined Equation of Lines", "Angle Between Lines"] },
          { chapter_number: 5, title: "Vectors", subtopics: ["Section Formula", "Scalar and Vector Product", "Coplanar Vectors"] },
          { chapter_number: 6, title: "Line and Plane", subtopics: ["Vector & Cartesian Equation of Line", "Equation of Plane"] },
          { chapter_number: 7, title: "Linear Programming", subtopics: ["Formulation & Graphical Solution"] },
        ],
      },
      {
        subject: "Mathematics Part 2",
        stream: "Science",
        chapters: [
          { chapter_number: 1, title: "Differentiation", subtopics: ["Derivatives of Composite & Inverse Functions", "Higher Order Derivatives"] },
          { chapter_number: 2, title: "Applications of Derivatives", subtopics: ["Tangent and Normal", "Increasing/Decreasing", "Maxima & Minima"] },
          { chapter_number: 3, title: "Indefinite Integration", subtopics: ["Integration Methods", "Integration by Parts & Partial Fractions"] },
          { chapter_number: 4, title: "Definite Integration", subtopics: ["Fundamental Theorem", "Properties of Definite Integrals"] },
          { chapter_number: 5, title: "Application of Definite Integration", subtopics: ["Area Under Curve"] },
          { chapter_number: 6, title: "Differential Equations", subtopics: ["Formulation & Solution of DE"] },
          { chapter_number: 7, title: "Probability Distributions", subtopics: ["Random Variable & PMF"] },
          { chapter_number: 8, title: "Binomial Distribution", subtopics: ["Bernoulli Trials & Binomial Distribution"] },
        ],
      },
      {
        subject: "Physics",
        stream: "Science",
        chapters: [
          { chapter_number: 1, title: "Rotational Dynamics", subtopics: ["Circular Motion", "Centripetal & Centrifugal Force", "Moment of Inertia"] },
          { chapter_number: 2, title: "Mechanical Properties of Fluids", subtopics: ["Surface Tension", "Bernoulli's Equation", "Viscosity"] },
          { chapter_number: 3, title: "Kinetic Theory of Gases and Radiation", subtopics: ["Ideal Gas Laws", "Stefan-Boltzmann Law", "Black Body Radiation"] },
          { chapter_number: 4, title: "Thermodynamics", subtopics: ["First Law", "Carnot Engine", "Reversible & Irreversible Processes"] },
          { chapter_number: 5, title: "Oscillations", subtopics: ["Differential Equation of SHM", "Composition of Two SHMs", "Simple Pendulum"] },
          { chapter_number: 6, title: "Superposition of Waves", subtopics: ["Stationary Waves", "Vibrations of Air Columns & Strings", "Beats"] },
          { chapter_number: 7, title: "Wave Optics", subtopics: ["Huygens' Principle", "Interference of Light", "Diffraction & Polarization"] },
          { chapter_number: 8, title: "Electrostatics", subtopics: ["Gauss's Theorem", "Electric Potential", "Capacitors in Combination"] },
          { chapter_number: 9, title: "Current Electricity", subtopics: ["Kirchhoff's Laws", "Potentiometer", "Meter Bridge"] },
          { chapter_number: 10, title: "Magnetic Fields due to Electric Current", subtopics: ["Biot-Savart Law", "Cyclotron", "Moving Coil Galvanometer"] },
          { chapter_number: 11, title: "Magnetic Materials", subtopics: ["Magnetization & Magnetic Intensity", "Diamagnetism, Paramagnetism & Ferromagnetism"] },
          { chapter_number: 12, title: "Electromagnetic Induction", subtopics: ["Faraday's Laws", "Lenz's Law", "Eddy Currents & Transformer"] },
          { chapter_number: 13, title: "AC Circuits", subtopics: ["LCR Circuit", "Resonance & Power Factor"] },
          { chapter_number: 14, title: "Dual Nature of Radiation and Matter", subtopics: ["Photoelectric Effect", "Einstein Equation", "de Broglie Hypothesis"] },
          { chapter_number: 15, title: "Structure of Atoms and Nuclei", subtopics: ["Bohr Model", "Radioactive Decay", "Nuclear Energy"] },
          { chapter_number: 16, title: "Semiconductor Devices", subtopics: ["p-n Diode", "Zener Diode", "Transistors & Logic Gates"] },
        ],
      },
      {
        subject: "Chemistry",
        stream: "Science",
        chapters: [
          { chapter_number: 1, title: "Solid State", subtopics: ["Crystal Lattices & Unit Cells", "Packing Efficiency", "Crystal Defects"] },
          { chapter_number: 2, title: "Solutions", subtopics: ["Raoult's Law", "Colligative Properties", "van 't Hoff Factor"] },
          { chapter_number: 3, title: "Ionic Equilibria", subtopics: ["Acids and Bases", "Buffer Solutions", "Solubility Product"] },
          { chapter_number: 4, title: "Chemical Thermodynamics", subtopics: ["First & Second Law", "Enthalpy Changes", "Gibbs Energy"] },
          { chapter_number: 5, title: "Electrochemistry", subtopics: ["Kohlrausch Law", "Nernst Equation", "Dry Cells & Lead Accumulator"] },
          { chapter_number: 6, title: "Chemical Kinetics", subtopics: ["Rate Law", "Integrated Rate Equations", "Arrhenius Equation"] },
          { chapter_number: 7, title: "Elements of Groups 16, 17 and 18", subtopics: ["Oxoacids of Sulphur & Halogens", "Interhalogen Compounds"] },
          { chapter_number: 8, title: "Transition and Inner Transition Elements", subtopics: ["d-Block Elements", "Lanthanoids & Actinoids"] },
          { chapter_number: 9, title: "Coordination Compounds", subtopics: ["IUPAC Nomenclature", "Isomerism", "Crystal Field Theory"] },
          { chapter_number: 10, title: "Halogen Derivatives", subtopics: ["SN1 & SN2 Mechanisms", "Optical Isomerism"] },
        ],
      },
    ],
  },
};

export function getOfficialChapters(board: string, grade: string, subject: string, stream?: string): ChapterInfo[] {
  const safeBoard = TEXTBOOK_TAXONOMY[board] ? board : "CBSE";
  const boardData = TEXTBOOK_TAXONOMY[safeBoard];
  const gradeData = boardData[grade] || boardData["Class 10"] || Object.values(boardData)[0];

  const targetSub = (subject || "").toLowerCase();

  // Try exact match or flexible Math Part 1 / Math Part 2 match
  let subData: SubjectTaxonomy | undefined;

  if (stream && (grade === "Class 11" || grade === "Class 12")) {
    subData = gradeData.find((s) => {
      const matchSubject = s.subject.toLowerCase() === targetSub || s.subject.toLowerCase().includes(targetSub);
      const matchStream = !stream || s.stream?.toLowerCase() === stream.toLowerCase();
      return matchSubject && matchStream;
    });
  }

  if (!subData) {
    subData = gradeData.find((s) => s.subject.toLowerCase() === targetSub || s.subject.toLowerCase().includes(targetSub));
  }

  if (!subData) {
    // Check general subject match
    subData = gradeData[0];
  }

  if (subData && subData.chapters && subData.chapters.length > 0) {
    return subData.chapters;
  }

  // Fallback official structure for any unlisted grade/subject combination
  return [
    { chapter_number: 1, title: `${subject} Fundamentals Part 1`, subtopics: ["Core Definitions", "Primary Axioms", "Standard Units"] },
    { chapter_number: 2, title: `Core Methods in ${subject} Part 2`, subtopics: ["Step-by-step Procedures", "Analytical Rules", "Formula Application"] },
    { chapter_number: 3, title: `Advanced Concepts in ${subject}`, subtopics: ["Problem Synthesis", "Edge Cases", "Exam Patterns"] },
    { chapter_number: 4, title: `Real-World Applications of ${subject}`, subtopics: ["Practical Problems", "Case Studies", "Comprehensive Review"] },
  ];
}
