const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// --- MODELS ---
const University = require('./models/University');
const Inquiry = require('./models/Inquiry');
const BlogPost = require('./models/BlogPost');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

// --- MIDDLEWARE ---
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`📡 ${req.method} request to: ${req.url}`);
  next();
});

// Auth Middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.adminId = payload.adminId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("🍃 Success: Connected to MongoDB Atlas");
    // Seed default admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = new Admin({ email: 'admin@studykenya.com', password: 'password123' });
      await defaultAdmin.save();
      console.log('👤 Default admin created: admin@studykenya.com / password123');
    }
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// --- ROUTES ---

// 1. Universities (Public)
app.get('/api/universities', async (req, res) => {
  try {
    const universities = await University.find();

    // If DB is empty, provide a robust fallback so the UI always shows content
    if (universities.length === 0) {
      return res.status(200).json([
        {
          name: 'Strathmore University',
          slug: 'strathmore-university',
          location: 'Nairobi, Kenya',
          description: "Institution de premier plan en technologie et business.",
          categories: ['Technologie', 'Business'],
          image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
          fees: '$3,000 - $4,500 / an',
          courses: ['IT', 'Business', 'Law']
        },
        {
          name: 'USIU-Africa',
          slug: 'usiu-africa',
          location: 'Nairobi, Kenya',
          description: "L'université la plus internationale d'Afrique de l'Est.",
          categories: ['International', 'Arts'],
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
          fees: '$2,500 - $4,000 / an',
          courses: ['Relations Internationales', 'Psychologie']
        },
        {
          name: 'University of Nairobi',
          slug: 'university-of-nairobi',
          location: 'Nairobi, Kenya',
          description: "La plus ancienne et prestigieuse université publique.",
          categories: ['Public', 'Médecine'],
          image: 'https://images.unsplash.com/photo-1562774053-701939374585',
          fees: '$1,500 - $3,500 / an',
          courses: ['Médecine', 'Génie Civil']
        },
        {
          name: 'Mount Kenya University',
          slug: 'mount-kenya-university',
          location: 'Thika, Kenya',
          description: "Leader de l'éducation privée abordable.",
          categories: ['Privé', 'Santé'],
          image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952',
          fees: '$1,200 - $2,800 / an',
          courses: ['Pharmacie', 'Business']
        },
        {
          name: 'Kenyatta University',
          slug: 'kenyatta-university',
          location: 'Nairobi, Kenya',
          description: "Excellence en éducation et recherche.",
          categories: ['Public', 'Arts'],
          image: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc',
          fees: '$1,400 - $3,200 / an',
          courses: ['Éducation', 'Environnement']
        },
        {
          name: 'Daystar University',
          slug: 'daystar-university',
          location: 'Athi River, Kenya',
          description: "Hub de communication et de journalisme.",
          categories: ['Chrétien', 'Médias'],
          image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846',
          fees: '$2,000 - $3,500 / an',
          courses: ['Communication', 'Journalisme']
        },
        {
          name: 'Riara University',
          slug: 'riara-university',
          location: 'Nairobi, Kenya',
          description: "Innovation et excellence en droit.",
          categories: ['Droit', 'Innovation'],
          image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae',
          fees: '$2,200 - $3,800 / an',
          courses: ['Droit', 'IT']
        },
        {
          name: 'KCA University',
          slug: 'kca-university',
          location: 'Nairobi, Kenya',
          description: "Leader en finance et comptabilité.",
          categories: ['Finance', 'Audit'],
          image: 'https://images.unsplash.com/photo-1454165833762-02ab4f40b630',
          fees: '$1,800 - $3,000 / an',
          courses: ['Comptabilité', 'Finance']
        },
        {
          name: 'Catholic University',
          slug: 'cuea',
          location: 'Nairobi, Kenya',
          description: "Rigueur académique à Karen.",
          categories: ['Karen', 'Arts'],
          image: 'https://images.unsplash.com/photo-1498243639359-2830baa750c8',
          fees: '$1,900 - $3,400 / an',
          courses: ['Théologie', 'Philosophie']
        },
        {
          name: 'Zetech University',
          slug: 'zetech-university',
          location: 'Ruiru, Kenya',
          description: "Innovation technologique et emploi.",
          categories: ['Tech', 'Innovation'],
          image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
          fees: '$1,300 - $2,500 / an',
          courses: ['IT', 'Hôtellerie']
        },
        {
          name: 'Multimedia University',
          slug: 'mmu',
          location: 'Nairobi, Kenya',
          description: "Centre d'excellence pour les médias.",
          categories: ['Médias', 'Tech'],
          image: 'https://images.unsplash.com/photo-1491845339675-238fee7b7d41',
          fees: '$1,500 - $3,000 / an',
          courses: ['Film', 'Animation']
        },
        {
          name: 'Africa Nazarene University',
          slug: 'anu',
          location: 'Nairobi, Kenya',
          description: "Leadership global basé sur des valeurs.",
          categories: ['Karen', 'International'],
          image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
          fees: '$2,100 - $3,600 / an',
          courses: ['Droit', 'Peace Studies']
        },
        {
          name: 'Technical University',
          slug: 'tuk',
          location: 'Nairobi CBD, Kenya',
          description: "Sciences appliquées et technologie.",
          categories: ['Public', 'Ingénierie'],
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
          fees: '$1,200 - $3,000 / an',
          courses: ['Ingénierie Électrique', 'Chimie Appliquée']
        },
        {
          name: 'Scott Christian University',
          slug: 'scott',
          location: 'Machakos, Kenya',
          description: "Excellence et formation spirituelle.",
          categories: ['Chrétien', 'Abordable'],
          image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2',
          fees: '$1,000 - $2,200 / an',
          courses: ['Théologie', 'Éducation']
        },
        {
          name: 'Lukenya University',
          slug: 'lukenya',
          location: 'Makueni, Kenya',
          description: "Innovation et développement rural.",
          categories: ['Rural', 'Agriculture'],
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
          fees: '$1,100 - $2,400 / an',
          courses: ['Agriculture', 'Business']
        },
        {
          name: 'Maseno University',
          slug: 'maseno',
          location: 'Kisumu, Kenya',
          description: "L'université de l'équateur.",
          categories: ['Kisumu', 'Public'],
          image: 'https://images.unsplash.com/photo-1460518451285-cd7bcaf19591',
          fees: '$1,300 - $2,900 / an',
          courses: ['Informatique', 'Santé']
        },
        {
          name: 'Egerton University',
          slug: 'egerton',
          location: 'Njoro, Kenya',
          description: "Hub agricole d'Afrique de l'Est.",
          categories: ['Agriculture', 'Recherche'],
          image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
          fees: '$1,400 - $3,100 / an',
          courses: ['Génie Agricole', 'Vétérinaire']
        },
        {
          name: 'JKUAT',
          slug: 'jkuat',
          location: 'Juja, Kenya',
          description: "Leader en technologie et ingénierie.",
          categories: ['Tech', 'Ingénierie'],
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
          fees: '$1,600 - $3,800 / an',
          courses: ['Mécatronique', 'Informatique']
        },
        {
          name: 'Moi University',
          slug: 'moi',
          location: 'Eldoret, Kenya',
          description: "Réputée pour sa faculté de médecine.",
          categories: ['Eldoret', 'Médecine'],
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
          fees: '$1,500 - $3,500 / an',
          courses: ['Médecine', 'Journalisme']
        },
        {
          name: 'Kabarak University',
          slug: 'kabarak',
          location: 'Nakuru, Kenya',
          description: "Éducation basée sur des valeurs bibliques.",
          categories: ['Nakuru', 'Chrétien'],
          image: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc',
          fees: '$2,000 - $3,800 / an',
          courses: ['Pharmacie', 'Musique']
        },
        {
          name: 'Meru University',
          slug: 'must',
          location: 'Meru, Kenya',
          description: "Hub technologique en pleine croissance.",
          categories: ['Tech', 'Science'],
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
          fees: '$1,200 - $2,600 / an',
          courses: ['IT', 'Génie Civil']
        },
        {
          name: 'Karatina University',
          slug: 'karu',
          location: 'Karatina, Kenya',
          description: "Études environnementales au pied du Mont Kenya.",
          categories: ['Mont Kenya', 'Nature'],
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
          fees: '$1,100 - $2,500 / an',
          courses: ['Environnement', 'Agriculture']
        },
        {
          name: 'SEKU',
          slug: 'seku',
          location: 'Kitui, Kenya',
          description: "Sciences arides et gestion des ressources.",
          categories: ['Science', 'Aride'],
          image: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4',
          fees: '$1,000 - $2,400 / an',
          courses: ['Géologie', 'Hydrologie']
        },
        {
          name: 'Management University of Africa',
          slug: 'mua',
          location: 'Nairobi, Kenya',
          description: "Développement de leaders visionnaires.",
          categories: ['Leadership', 'Business'],
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
          fees: '$1,800 - $3,200 / an',
          courses: ['Gestion', 'Leadership']
        },
        {
          name: 'Kiriri Women\'s University',
          slug: 'kwust',
          location: 'Nairobi, Kenya',
          description: "Autonomisation des femmes par l'éducation.",
          categories: ['Femmes', 'Science'],
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
          fees: '$1,500 - $2,800 / an',
          courses: ['Informatique', 'Mathématiques']
        },
        {
          name: 'Pwani University',
          slug: 'pwani',
          location: 'Kilifi, Kenya',
          description: "Études marines et tropicales sur la côte.",
          categories: ['Côte', 'Océan'],
          image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2',
          fees: '$1,200 - $2,700 / an',
          courses: ['Biologie Marine', 'Agriculture']
        },
        {
          name: 'Chuka University',
          slug: 'chuka',
          location: 'Chuka, Kenya',
          description: "Institution dynamique dans les collines fertiles.",
          categories: ['Mont Kenya', 'Public'],
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
          fees: '$1,100 - $2,500 / an',
          courses: ['Informatique', 'Éducation']
        },
        {
          name: 'Maasai Mara University',
          slug: 'mmarau',
          location: 'Narok, Kenya',
          description: "Tourisme et gestion de la faune.",
          categories: ['Tourisme', 'Faune'],
          image: 'https://images.unsplash.com/photo-1516422213484-21437ef130c6',
          fees: '$1,300 - $2,800 / an',
          courses: ['Wildlife Management', 'Tourisme']
        },
        {
          name: 'Laikipia University',
          slug: 'laikipia',
          location: 'Nyahururu, Kenya',
          description: "Arts libéraux et sciences sociales.",
          categories: ['Arts', 'Public'],
          image: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc',
          fees: '$1,200 - $2,600 / an',
          courses: ['Philosophie', 'Communication']
        },
        {
          name: 'Taita Taveta University',
          slug: 'ttu',
          location: 'Voi, Kenya',
          description: "Hub pour les mines et l'ingénierie.",
          categories: ['Mines', 'Tech'],
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
          fees: '$1,400 - $3,000 / an',
          courses: ['Génie Minier', 'Informatics']
        },
        {
          name: 'Kabianga University',
          slug: 'kabianga',
          location: 'Kericho, Kenya',
          description: "Études parmi les théiers.",
          categories: ['Thé', 'Nature'],
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
          fees: '$1,100 - $2,400 / an',
          courses: ['Agriculture', 'Biologie']
        },
        {
          name: 'St. Paul\'s University',
          slug: 'spu',
          location: 'Limuru, Kenya',
          description: "Théologie et développement à Limuru.",
          categories: ['Limuru', 'Privé'],
          image: 'https://images.unsplash.com/photo-1491845339675-238fee7b7d41',
          fees: '$1,900 - $3,200 / an',
          courses: ['Théologie', 'Communication']
        },
        {
          name: 'Pan Africa Christian University',
          slug: 'pac',
          location: 'Nairobi, Kenya',
          description: "Leadership transformationnel chrétien.",
          categories: ['Leadership', 'Nairobi'],
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
          fees: '$1,800 - $3,100 / an',
          courses: ['Psychologie', 'Leadership']
        },
        {
          name: 'Garissa University',
          slug: 'garissa',
          location: 'Garissa, Kenya',
          description: "Excellence académique dans le Nord-Est.",
          categories: ['Nord-Est', 'Public'],
          image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
          fees: '$1,000 - $2,200 / an',
          courses: ['Gestion', 'Éducation']
        },
        {
          name: 'Rongo University',
          slug: 'rongo',
          location: 'Rongo, Kenya',
          description: "Innovation et développement durable.",
          categories: ['Innovation', 'Public'],
          image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
          fees: '$1,100 - $2,500 / an',
          courses: ['Informatics', 'Science']
        },
        {
          name: 'University of Kabianga',
          slug: 'kabianga-uni',
          location: 'Kericho, Kenya',
          description: "Recherche de pointe dans les hautes terres.",
          categories: ['Agriculture', 'Kericho'],
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
          fees: '$1,200 - $2,600 / an',
          courses: ['Agribusiness', 'Environnement']
        },
        {
          name: 'Embu University',
          slug: 'embu',
          location: 'Embu, Kenya',
          description: "Hub de science et d'innovation.",
          categories: ['Science', 'Public'],
          image: 'https://images.unsplash.com/photo-1454165833762-02ab4f40b630',
          fees: '$1,200 - $2,700 / an',
          courses: ['Sciences Pures', 'Informatique']
        },
        {
          name: 'Murang\'a University',
          slug: 'mut',
          location: 'Murang\'a, Kenya',
          description: "Hub technologique central.",
          categories: ['Tech', 'Public'],
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
          fees: '$1,300 - $2,800 / an',
          courses: ['Software Engineering', 'Génie']
        },
        {
          name: 'Kirinyaga University',
          slug: 'kiru',
          location: 'Kutus, Kenya',
          description: "Excellence et innovation à Kutus.",
          categories: ['Santé', 'Public'],
          image: 'https://images.unsplash.com/photo-1527336367561-83d230bc364a',
          fees: '$1,100 - $2,600 / an',
          courses: ['Santé', 'Computing']
        },
        {
          name: 'Co-operative University',
          slug: 'cuk',
          location: 'Karen, Nairobi',
          description: "Leader en éducation coopérative.",
          categories: ['Coopérative', 'Karen'],
          image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
          fees: '$1,500 - $3,000 / an',
          courses: ['Co-operative Business', 'ICT']
        },
        {
          name: 'DeKUT',
          slug: 'dekut',
          location: 'Nyeri, Kenya',
          description: "Science pour le développement industriel.",
          categories: ['Tech', 'Industriel'],
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
          fees: '$1,600 - $3,500 / an',
          courses: ['Mécatronique', 'Génie']
        },
        {
          name: 'Gretsa University',
          slug: 'gretsa',
          location: 'Thika, Kenya',
          description: "Innovation et excellence privée.",
          categories: ['Privé', 'Thika'],
          image: 'https://images.unsplash.com/photo-1540317580114-ed684c0c5c14',
          fees: '$1,400 - $2,800 / an',
          courses: ['Hôtellerie', 'ICT']
        },
        {
          name: 'African International University',
          slug: 'aiu',
          location: 'Karen, Nairobi',
          description: "Formation de leaders chrétiens globaux.",
          categories: ['Chrétien', 'Karen'],
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
          fees: '$2,200 - $4,000 / an',
          courses: ['Théologie', 'Business']
        },
        {
          name: 'The East African University',
          slug: 'teau',
          location: 'Kitengela, Kenya',
          description: "Éducation régionale accessible.",
          categories: ['Régional', 'Kitengela'],
          image: 'https://images.unsplash.com/photo-1460518451285-cd7bcaf19591',
          fees: '$1,200 - $2,500 / an',
          courses: ['Business', 'ICT']
        },
        {
          name: 'Adventist University',
          slug: 'aua',
          location: 'Ongata Rongai, Kenya',
          description: "Études postgrades pour l'Afrique.",
          categories: ['Adventiste', 'Postgrade'],
          image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
          fees: '$2,500 - $4,500 / an',
          courses: ['Santé Publique', 'Théologie']
        },
        {
          name: 'Management University',
          slug: 'mua-main',
          location: 'Nairobi, Kenya',
          description: "Excellence en gestion africaine.",
          categories: ['Leadership', 'Nairobi'],
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
          fees: '$1,800 - $3,500 / an',
          courses: ['Gestion Stratégique', 'RH']
        },
        {
          name: 'SEKU V2',
          slug: 'seku-v2',
          location: 'Kitui, Kenya',
          description: "Programmes publics innovants.",
          categories: ['Santé', 'Public'],
          image: 'https://images.unsplash.com/photo-1540317580114-ed684c0c5c14',
          fees: '$1,000 - $2,200 / an',
          courses: ['Infirmier', 'Génie']
        },
        {
          name: 'Machakos University',
          slug: 'mksu',
          location: 'Machakos, Kenya',
          description: "Innovation technologique au service de tous.",
          categories: ['Tech', 'Public'],
          image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
          fees: '$1,200 - $2,500 / an',
          courses: ['Génie Mécanique', 'Hôtellerie']
        },
        {
          name: 'Kisii University',
          slug: 'kisii',
          location: 'Kisii, Kenya',
          description: "Compétences mondiales à Kisii.",
          categories: ['Droit', 'Public'],
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
          fees: '$1,100 - $2,400 / an',
          courses: ['Droit', 'Médecine']
        },
        {
          name: 'Alupe University',
          slug: 'alupe',
          location: 'Busia, Kenya',
          description: "Santé et sciences appliquées à Busia.",
          categories: ['Santé', 'Public'],
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
          fees: '$1,200 - $2,600 / an',
          courses: ['Santé', 'Sciences Physiques']
        },
        {
          name: 'Turkana University',
          slug: 'tuc',
          location: 'Lodwar, Kenya',
          description: "Accès à l'éducation dans le Nord.",
          categories: ['Nord', 'Public'],
          image: 'https://images.unsplash.com/photo-1516422213484-21437ef130c6',
          fees: '$1,000 - $2,000 / an',
          courses: ['Travail Social', 'Éducation']
        },
        {
          name: 'University of Eldoret',
          slug: 'uoeld',
          location: 'Eldoret, Kenya',
          description: "Large éventail de programmes scientifiques.",
          categories: ['Science', 'Public'],
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
          fees: '$1,400 - $3,000 / an',
          courses: ['Agriculture', 'Biologie']
        },
        {
          name: 'Zetech V2',
          slug: 'zetech-v2',
          location: 'Ruiru, Kenya',
          description: "Employabilité et technologie moderne.",
          categories: ['Tech', 'Privé'],
          image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
          fees: '$1,500 - $2,900 / an',
          courses: ['IT', 'Médias']
        },
        {
          name: 'Strathmore V2',
          slug: 'strath-v2',
          location: 'Nairobi, Kenya',
          description: "Formation éthique pour leaders.",
          categories: ['Elite', 'Privé'],
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
          fees: '$2,800 - $5,000 / an',
          courses: ['Finance', 'Droit']
        },
        {
          name: 'USIU V2',
          slug: 'usiu-v2',
          location: 'Nairobi, Kenya',
          description: "Apprentissage multiculturel accrédité.",
          categories: ['International', 'Privé'],
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
          fees: '$3,200 - $5,500 / an',
          courses: ['Relations Int.', 'Psychologie']
        },
        {
          name: 'Daystar V2',
          slug: 'daystar-v2',
          location: 'Nairobi, Kenya',
          description: "Communication chrétienne de pointe.",
          categories: ['Médias', 'Privé'],
          image: 'https://images.unsplash.com/photo-1491845339675-238fee7b7d41',
          fees: '$2,400 - $4,200 / an',
          courses: ['Communication', 'Éducation']
        },
        {
          name: 'Riara V2',
          slug: 'riara-v2',
          location: 'Nairobi, Kenya',
          description: "Innovation redéfinie à Nairobi.",
          categories: ['Innovation', 'Privé'],
          image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
          fees: '$2,300 - $4,100 / an',
          courses: ['Droit', 'Computing']
        },
        {
          name: 'KCA V2',
          slug: 'kca-v2',
          location: 'Nairobi, Kenya',
          description: "Hub de finance d'Afrique de l'Est.",
          categories: ['Finance', 'Privé'],
          image: 'https://images.unsplash.com/photo-1454165833762-02ab4f40b630',
          fees: '$1,600 - $3,100 / an',
          courses: ['Comptabilité', 'Finance']
        }
      ]);
    }
    res.status(200).json(universities);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des universités" });
  }
});

// Detailed University View (Fixed to handle both ID and Slug)
app.get('/api/universities/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let university;

    // First attempt: Find by ID if the string is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      university = await University.findById(identifier);
    }

    // Second attempt: Find by Slug if no university was found by ID
    if (!university) {
      university = await University.findOne({ slug: identifier });
    }

    if (!university) {
      return res.status(404).json({ message: "Université introuvable." });
    }

    res.status(200).json(university);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Erreur serveur interne" });
  }
});

// 2. Admin Auth
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. Blog (Public & Protected)
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching blog posts" });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
});

app.post('/api/blog', requireAuth, async (req, res) => {
  try {
    const post = new BlogPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
});

// 4. Contact/Inquiries
app.post('/api/contact', async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Save Error" });
  }
});

// --- START SERVER ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BACKEND ACTIVE ON: http://localhost:${PORT}`);
});