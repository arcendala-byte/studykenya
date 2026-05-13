const mongoose = require('mongoose');
require('dotenv').config();
const University = require('./models/University');

const universitiesData = [
  {
    name: "Strathmore University",
    slug: "strathmore-university",
    location: "Nairobi, Kenya",
    type: "Private",
    description: "Strathmore University est une institution d'enseignement supérieur de premier plan au Kenya, reconnue pour son excellence dans les domaines de la technologie, des affaires et du droit. Située dans un campus moderne à Nairobi, elle offre un environnement d'apprentissage rigoureux et est très appréciée par les étudiants internationaux pour la qualité de ses infrastructures et son réseau professionnel étendu.",
    programs: ["BSc Computer Science", "Bachelor of Commerce", "Bachelor of Laws (LLB)"],
    courses: [
      "Informatique et Réseaux",
      "Gestion d'Entreprise",
      "Finance et Comptabilité",
      "Droit",
      "Génie Logiciel"
    ],
    requirements: [
      "Diplôme d'État avec une moyenne minimale de 60% (ou équivalent KCSE C+).",
      "Preuve de maîtrise de l'anglais (Test interne ou TOEFL/IELTS).",
      "Passeport valide pour les démarches de visa étudiant.",
      "Lettre de motivation (pour certaines facultés)."
    ],
    fees: "$3,000 - $4,500 par an",
    categories: ["Technologie", "Business", "Droit"],
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop",
    featured: true,
    website: "https://strathmore.edu"
  },
  {
    name: "United States International University - Africa (USIU)",
    slug: "usiu-africa",
    location: "Nairobi, Kenya",
    type: "Private",
    description: "L'USIU-Africa offre une expérience véritablement internationale, avec un campus diversifié accueillant des étudiants de plus de 70 pays. Avec une double accréditation aux États-Unis et au Kenya, elle propose des diplômes mondialement reconnus. Le campus est équipé de bibliothèques modernes, de laboratoires de pointe et d'un centre sportif de classe mondiale.",
    programs: ["International Relations", "Pharmacy", "Information Systems"],
    courses: [
      "Relations Internationales",
      "Pharmacie",
      "Systèmes d'Information",
      "Journalisme",
      "Administration des Affaires"
    ],
    requirements: [
      "Diplôme d'État avec une moyenne satisfaisante.",
      "Réussite de l'examen de placement en anglais et mathématiques.",
      "Traductions certifiées des relevés de notes en anglais."
    ],
    fees: "$4,000 - $6,000 par an",
    categories: ["International", "Santé", "Communication"],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop",
    featured: true,
    website: "https://www.usiu.ac.ke"
  },
  {
    name: "University of Nairobi (UoN)",
    slug: "university-of-nairobi",
    location: "Nairobi, Kenya",
    type: "Public",
    description: "Plus grande et plus prestigieuse université publique du Kenya, l'Université de Nairobi possède une riche histoire académique et offre le plus grand nombre de programmes dans le pays. Située en plein cœur du quartier des affaires de Nairobi, elle est un centre d'innovation, de recherche médicale et d'excellence en ingénierie.",
    programs: ["Medicine & Surgery", "Engineering", "Architecture"],
    courses: [
      "Médecine et Chirurgie",
      "Ingénierie Civile et Électrique",
      "Architecture",
      "Économie",
      "Sciences Politiques"
    ],
    requirements: [
      "Diplôme d'État avec d'excellents résultats (spécialement en sciences pour la médecine).",
      "Soumission via le portail des étudiants internationaux.",
      "Certificat médical complet."
    ],
    fees: "$2,500 - $5,000 par an",
    categories: ["Médecine", "Ingénierie", "Recherche"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop",
    featured: true,
    website: "https://www.uonbi.ac.ke"
  },
  {
    name: "Daystar University",
    slug: "daystar-university",
    location: "Nairobi & Athi River, Kenya",
    type: "Private",
    description: "Reconnue pour produire certains des meilleurs journalistes et experts en communication d'Afrique de l'Est, Daystar University offre un enseignement basé sur des valeurs chrétiennes. Le campus principal d'Athi River offre une vue imprenable sur la savane, tandis que le campus de la ville est idéal pour les étudiants en cours du soir.",
    programs: ["Communication", "Nursing", "Psychology"],
    courses: [
      "Communication Audiovisuelle",
      "Soins Infirmiers",
      "Psychologie Clinique",
      "Commerce et Économie"
    ],
    requirements: [
      "Diplôme d'État (équivalent KCSE C+).",
      "Recommandation morale ou religieuse (souvent demandée).",
      "Examen d'entrée en anglais."
    ],
    fees: "$2,800 - $4,200 par an",
    categories: ["Communication", "Arts", "Santé"],
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop",
    featured: false,
    website: "https://www.daystar.ac.ke"
  },
  {
    name: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
    slug: "jkuat",
    location: "Juja, Kenya",
    type: "Public",
    description: "Spécialisée dans l'agriculture, l'ingénierie et les technologies de l'information, la JKUAT est une institution publique réputée pour son approche pratique. Son campus spacieux situé à Juja, juste à l'extérieur de Nairobi, est propice aux études intensives et à la recherche technologique.",
    programs: ["Mechatronic Engineering", "Computer Science", "Architecture"],
    courses: [
      "Ingénierie Mécatronique",
      "Informatique et Technologies",
      "Agriculture Moderne",
      "Sciences Actuarielles"
    ],
    requirements: [
      "Diplôme d'État avec de solides notes en mathématiques et sciences.",
      "Demande d'équivalence au Kenya National Qualifications Authority (KNQA)."
    ],
    fees: "$2,000 - $3,500 par an",
    categories: ["Ingénierie", "Technologie", "Agriculture"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
    featured: false,
    website: "https://www.jkuat.ac.ke"
  },
  {
    name: "Mount Kenya University (MKU)",
    slug: "mount-kenya-university",
    location: "Thika, Kenya",
    type: "Private",
    description: "L'une des universités à la croissance la plus rapide en Afrique de l'Est, MKU est réputée pour ses programmes abordables et très pratiques, particulièrement dans les sciences de la santé. Le campus principal de Thika est moderne, avec un hôpital universitaire de premier plan attenant.",
    programs: ["Medicine", "Nursing", "Information Technology"],
    courses: [
      "Médecine",
      "Soins Infirmiers",
      "Informatique",
      "Gestion et Finance"
    ],
    requirements: [
      "Diplôme d'État (équivalent C+).",
      "Processus d'admission simplifié pour les étudiants de l'EAC (Communauté d'Afrique de l'Est)."
    ],
    fees: "$1,800 - $3,500 par an",
    categories: ["Santé", "Abordable", "Pratique"],
    image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?q=80&w=2000&auto=format&fit=crop",
    featured: false,
    website: "https://www.mku.ac.ke"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🍃 Connecté à MongoDB.");

    await University.deleteMany({});
    console.log("🧹 Anciennes universités effacées.");

    await University.insertMany(universitiesData);
    console.log(`✅ ${universitiesData.length} universités ont été insérées avec succès !`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    process.exit(1);
  }
}

seed();
