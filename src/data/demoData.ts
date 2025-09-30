import type { DemoData, DemoComponent } from '../types';
import { FaBalanceScale, FaMedkit } from 'react-icons/fa';
import { 
    FaMugHot, FaFilter,
    FaGrip, FaHandHoldingMedical,
    FaMicrochip,
    FaBolt,
} from 'react-icons/fa6';
import { GiSpinningBlades, GiTeapot } from 'react-icons/gi';


const COFFEE_COMPONENTS: DemoComponent[] = [
  { 
    id: 'c1',
    name: 'إبريق ترشيح كهربائي بعنق طويل',
    type: 'أداة تحضير',
    confidence: 0.99,
    short_summary: 'إبريق بفوهة طويلة وضيقة للتحكم الدقيق بتدفق الماء أثناء تحضير القهوة المقطرة.',
    specs: [
      { label: 'السعة', value: '0.9 لتر' },
      { label: 'المادة', value: 'فولاذ مقاوم للصدأ' },
      { label: 'التحكم', value: 'حرارة متغيرة' }
    ],
    source: 'https://example.com/gooseneck-kettle',
    icon: GiTeapot
  },
  { 
    id: 'c2',
    name: 'قمع ترشيح V60 سيراميك',
    type: 'أداة تحضير',
    confidence: 0.97,
    short_summary: 'أداة مخروطية بأضلاع حلزونية لاستخلاص قهوة نقية وغنية بالنكهات.',
    specs: [
      { label: 'الحجم', value: '02 (1-4 أكواب)' },
      { label: 'المادة', value: 'سيراميك' },
      { label: 'الزاوية', value: '60 درجة' }
    ],
    source: 'https://example.com/v60-dripper',
    icon: FaFilter
  },
  { 
    id: 'c3',
    name: 'ميزان قهوة مع مؤقت',
    type: 'ملحق',
    confidence: 0.94,
    short_summary: 'ميزان رقمي دقيق بمؤقت مدمج، ضروري لقياس نسب القهوة والماء بدقة.',
    specs: [
      { label: 'الدقة', value: '0.1 جرام' },
      { label: 'السعة القصوى', value: '2000 جرام' },
      { label: 'الطاقة', value: 'شحن USB-C' }
    ],
    source: 'https://example.com/coffee-scale',
    icon: FaBalanceScale
  },
];

const MEDICAL_COMPONENTS: DemoComponent[] = [
  { 
    id: 'm1',
    name: 'مقبض مشرط رقم 3',
    type: 'أداة جراحية',
    confidence: 0.98,
    short_summary: 'مقبض قياسي لحمل شفرات المشارط المختلفة وإجراء شقوق دقيقة.',
    specs: [
      { label: 'المادة', value: 'فولاذ مقاوم للصدأ' },
      { label: 'الطول', value: '125 مم' },
      { label: 'توافق الشفرات', value: '10-15' }
    ],
    source: 'https://example.com/scalpel-handle',
    icon: FaMedkit
  },
  { 
    id: 'm2',
    name: 'ملقط أنسجة Adson (مسنن)',
    type: 'أداة جراحية',
    confidence: 0.95,
    short_summary: 'ملقط ذو أطراف دقيقة مع أسنان، يُستخدم للإمساك بالأنسجة الرقيقة وتثبيتها أثناء الجراحة.',
    specs: [
      { label: 'المادة', value: 'فولاذ جراحي' },
      { label: 'الطول', value: '120 مم' },
      { label: 'الطرف', value: '1x2 أسنان' }
    ],
    source: 'https://example.com/adson-forceps',
    icon: FaGrip
  },
  { 
    id: 'm3',
    name: 'حامل إبر Mayo-Hegar',
    type: 'أداة جراحية',
    confidence: 0.92,
    short_summary: 'أداة قوية قابلة للقفل تستخدم لحمل وتوجيه إبر الخياطة عبر الأنسجة بأمان.',
    specs: [
      { label: 'المادة', value: 'فكوك من كربيد التنجستن' },
      { label: 'الطول', value: '150 مم' },
      { label: 'القفل', value: 'سقاطة' }
    ],
    source: 'https://example.com/needle-holder',
    icon: FaHandHoldingMedical
  },
];

const DRONE_COMPONENTS: DemoComponent[] = [
  { 
    id: 'd1',
    name: 'محرك برشلس DC طراز 2207',
    type: 'نظام دفع',
    confidence: 0.99,
    short_summary: 'محرك عالي العزم مصمم لطائرات السباق المسيرة (FPV)، يوفر تسارعًا سريعًا وتحكمًا عالي الاستجابة.',
    specs: [
      { label: 'معدل kV', value: '2450kV' },
      { label: 'حجم الستيتر', value: '22 مم × 7 مم' },
      { label: 'الجهد', value: '4-6S LiPo' }
    ],
    source: 'https://example.com/brushless-motor',
    icon: FaBolt
  },
  { 
    id: 'd2',
    name: 'متحكم طيران F7',
    type: 'إلكترونيات',
    confidence: 0.96,
    short_summary: 'وحدة المعالجة المركزية للطائرة المسيرة، مسؤولة عن تشغيل برامج التحكم لتحقيق الاستقرار وتوجيه الطائرة.',
    specs: [
      { label: 'المعالج', value: 'STM32F722' },
      { label: 'الجيروسكوب', value: 'MPU6000' },
      { label: 'قاعدة التثبيت', value: '30.5x30.5 مم' }
    ],
    source: 'https://example.com/flight-controller',
    icon: FaMicrochip
  },
  { 
    id: 'd3',
    name: 'مروحة كاربون فايبر 5 بوصة',
    type: 'نظام دفع',
    confidence: 0.94,
    short_summary: 'مروحة خفيفة الوزن وصلبة من ألياف الكربون، مصممة للطيران عالي السرعة والمناورات القوية.',
    specs: [
      { label: 'المادة', value: 'ألياف الكربون' },
      { label: 'الحجم', value: '5.1 بوصة' },
      { label: 'ميل الشفرة', value: '4.8 بوصة' }
    ],
    source: 'https://example.com/carbon-propeller',
    icon: GiSpinningBlades
  },
];


export const DEMO_DATA: { [key: string]: DemoData } = {
  coffee: {
    title: 'تجربة: أدوات القهوة المختصة',
    imageUrl: './images/demos/coffee-setup.jpg',
    detectedComponents: COFFEE_COMPONENTS,
    chatHistory: [
      { id: 'chat1', role: 'user', content: 'ما هو أفضل نوع بن لاستخدامه مع قمع الترشيح؟' },
      { id: 'chat2', role: 'model', content: 'لإبراز النكهات، يُفضل استخدام بن بحمصة فاتحة إلى متوسطة. البن المغسول من إثيوبيا أو كولومبيا يعد خيارًا ممتازًا.' },
      { id: 'chat3', role: 'user', content: 'كم نسبة الماء للقهوة المثالية؟' },
      { id: 'chat4', role: 'model', content: 'النسبة الموصى بها هي 1:15 (15 جرام ماء لكل 1 جرام بن)، ويمكنك تعديلها حسب رغبتك.' },
    ]
  },
  medical: {
    title: 'تجربة: أدوات جراحية',
    imageUrl: './images/demos/medical-tools.jpg',
    detectedComponents: MEDICAL_COMPONENTS,
    chatHistory: [
      { id: 'chat1', role: 'user', content: 'ما الفرق بين حامل إبر Mayo-Hegar و Olsen-Hegar؟' },
      { id: 'chat2', role: 'model', content: 'الفرق الرئيسي هو أن حامل إبر Olsen-Hegar يحتوي على مقص مدمج لقطع الخيوط، بينما Mayo-Hegar يتطلب استخدام مقص منفصل.' },
      { id: 'chat3', role: 'user', content: 'متى يستخدم ملقط Adson المسنن وغير المسنن؟' },
      { id: 'chat4', role: 'model', content: 'الملقط المسنن (Toothed) يستخدم للأنسجة الكثيفة كالجلد لتوفير ثبات. أما غير المسنن (Non-toothed) فيستخدم للأنسجة الحساسة كالأوعية الدموية لتقليل الضرر.' },
    ]
  },
  drone: {
    title: 'تجربة: مكونات طائرة مسيرة',
    imageUrl: './images/demos/drone-parts.jpg',
    detectedComponents: DRONE_COMPONENTS,
    chatHistory: [
      { id: 'chat1', role: 'user', content: 'ما معنى معدل kV في محركات الدرون؟' },
      { id: 'chat2', role: 'model', content: "معدل kV يعني 'RPM لكل فولت'. محرك بتقييم 2450kV سيدور 2450 دورة في الدقيقة لكل فولت يُزوّد به. قيم kV الأعلى تعني سرعة أكبر وعزم دوران أقل." },
      { id: 'chat3', role: 'user', content: 'هل يمكنني استخدام بطارية 6S مع هذا المحرك؟' },
      { id: 'chat4', role: 'model', content: 'نعم، هذا المحرك مصمم للعمل مع بطاريات بجهد 4S إلى 6S. استخدام بطارية 6S سيوفر أقصى أداء، لكن تأكد من أن وحدة التحكم (ESC) تدعم هذا الجهد أيضًا.' },
    ]
  }
};