'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppConfig, CharacterModelOption } from '@/types/config';
import { useTenant } from './tenantContext';

// ONLY 4 EXACT HIGH-PERFORMANCE MODELS: 2 BOYS + 2 GIRLS
export const availableCharacterModels: CharacterModelOption[] = [
  { id: 'm1', name: 'الشاب الأنيق ببدلة المشي', file: '/models/passive_marker_man.fbx', icon: '🕺', description: 'الشاب الأنيق في المشية الملوكية' },
  { id: 'm2', name: 'ذا بوس - قائد المسرح', file: '/models/The Boss.fbx', icon: '👔', description: 'شخصية ذا بوس المشهورة' },
  { id: 'm3', name: 'الفتاة العصرية (Ch02)', file: '/models/Ch02_nonPBR.fbx', icon: '👸', description: 'الفتاة الأنيقة بسويت شيرت أصفر' },
  { id: 'm4', name: 'الفتاة اللطيفة (Ch46)', file: '/models/Ch46_nonPBR.fbx', icon: '🌸', description: 'الفتاة اللطيفة بشعر ملون' },
];

const defaultConfig: AppConfig = {
  // Step 1: Password Gate Landing Page
  sitePassword: 'love',
  passwordGreeting: 'أهلاً بكِ في عالمنا الخاص.. أدخلي كلمة السر لتبدأ الرحلة ✨',
  herName: 'روضة',
  landingBadge: 'رحلة العشق الملكية 👑',
  landingTitle: 'إلى أميرتي وسر سعادتي 👑💖',
  landingSubtitle: 'عالمٌ خُصص لأجلكِ وحدكِ.. حيث تبتسم الذكريات وتُحكى أجمل حكايات العشق ✨',
  passwordPlaceholder: 'اكتب كلمة السر هنا ✨',
  enterButtonText: 'دخول عالمنا الخاص 🚀',

  // Step 2: 3D Entrance Stage
  selectedCharacterModel: '/models/passive_marker_man.fbx',
  theaterWalkMessage: 'كل خطوة خطيتها في الطريق ده.. كانت عشان أوصل لقلبكِ يا روضة 🌸 أنتي مش مجرد شخص في حياتي، أنتي القصة والروح اللي اتمنيت أعيش معاها طول عمري ✨💖',
  theaterButtonText: 'كلمة حلوة.. تعالي نخش جوه قصة حياتنا 💖✨',
  storySongUrl: '', // Romantic song that auto-plays continuously after the theater entrance

  // Step 3: Star Constellation Name
  constellationName: 'RAWDA',
  constellationTitle: 'نجمتي الأميرة RAWDA... 💫',
  constellationMessage: '"كتبتُ اسمكِ بين النجوم لأنكِ القمر الوحيد الذي ينور سمائي، والسر الجميل الذي يسعد قلبي في كل ثانية." ❤️✨',
  constellationButtonText: 'انتقلي لرحلة عشقنا 💖✨',

  // Step 4: Love Counter
  relationshipStartDate: '2024-03-14',
  counterTitle: 'معكِ في كل ثانية ودقيقة من العمر 🌸',
  counterQuote: '"كل ثانية مرت وأنا معاك، كانت تساوي عمر كامل من السعادة والراحة.. ووقفت قلبي يزيد معك في كل دقيقة تمضي" ❤️✨',
  counterButtonText: 'التالي: المظاريف السرية ✉️💖',

  // Step 5: Open When Letters
  openWhenLettersTitle: 'مظاريف الحب السرية 💌',
  openWhenLetters: [
    {
      id: 1,
      title: 'ماتزعليش مني... 🥺💔',
      subtitle: 'رسالة اعتذار وحنية من قلبي',
      icon: '💔',
      badge: 'حقك عليا 🌸',
      content: 'حبيبتك عليا يا أغلى ما في حياتي.. عيني وحشتني وقلبي اتوجع أكثر لو كنت سبب في زعلكِ لحظة واحدة، أتمنى دايماً تكوني أسعد إنسانة عندي في الدنيا، وزعلكِ عليّ عليّ أوي أوي، سامحيني يا قمر.. ✨💖',
      enabled: true
    },
    {
      id: 2,
      title: 'أنتي بتوحشيني أوي أوي... 💭💖',
      subtitle: 'جرعة حب واشتياق فورية',
      icon: '💌',
      badge: 'توحشيني 🌷',
      content: 'لو أنا مش جنبكِ دلوقتي، غمضي عينيكي وتخيلي إنكِ في حضني.. افتكري إن تفكيري معاكي في كل ثانية، وكل دقيقة بتعدي من غيركِ بتكون ناقصة حاجة حلوة. بحبكِ أوي أوي وما بتبطليش توحشيني ✨💖',
      enabled: true
    },
    {
      id: 3,
      title: 'أنا سندكِ ووطنكِ للأبد... 🛡️❤️',
      subtitle: 'وعد بالبقـاء والوطن المضمون',
      icon: '🕊️',
      badge: 'سندكِ للأبد 👑',
      content: 'أنا هنا دايماً وسندكِ وظاهركِ في كل خطوة في الحياة.. مهما كانت الظروف أو الصعاب، افتكري إن كتفي ملككِ وقلبي بيتكِ الأمني اللي عمري ما هسمح لحد يضايقكِ فيه. إنتي في أمان معايا للأبد ✨💖',
      enabled: true
    },
    {
      id: 4,
      title: 'ارتاحي شوية وكل حاجة هتهون... ☕🌸',
      subtitle: 'تهدئة وتخفيف للروح',
      icon: '🎀',
      badge: 'راحة بال ☕',
      content: 'خدي نفس عميق وافتكري إن أي حاجة في الدنيا دي تهون وتعدي.. إنتي شاطرة وقوية ورقيقة، وأنا فخور بيكي في كل حاجة بتعمليها. ارتاحي شوية وكل حاجة هتبقى أحسن طول ما إحنا سوا ✨💖',
      enabled: true
    },
    {
      id: 5,
      title: 'ضحكتكِ هي سر سعادتي... 😊✨',
      subtitle: 'احتفال بسيط بضحكتكِ',
      icon: '👸',
      badge: 'سر السعادة 💖',
      content: 'ضحكتكِ دي هي السحر اللي بينور عتمة الدنيا كلها! يدوملي السعادة والضحكة الحلوة اللي بتخليني أحس إن الدنيا كلها بخير. خليكي دايماً بتضحكي عشان ضحكتكِ هي دوا لقلبي ✨💖',
      enabled: true
    }
  ],
  openWhenLettersButtonText: 'التالي: ألبوم الذكريات 📸💖',

  // Step 6: Photo Memory Gallery Carousel
  galleryTitle: 'ذكريات منقوشة في القلب والعقل ✨',
  memoryPhotos: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      date: "14 مارس 2024",
      caption: "أول غروب شوفناه مع بعض ونظرة العيون اللي غيرت مجرى حياتي للأبد ❤️",
      tag: "اللقاء الأول ✨"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      date: "5 يناير 2024",
      caption: "يومنا في الحديقة والضحكة الفاتنة اللي بتنور أيامي وتسوى الدنيا وما فيها 🌸",
      tag: "يومنا في الحديقة 👑"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      date: "20 فبراير 2024",
      caption: "ليلة لا تُنسى تحت أنوار العشق واللحظة اللي اتأكدت فيها إن قلبي ملكِك إنتي 💖",
      tag: "ليلة لا تُنسى 💍"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      date: "01 يناير 2025",
      caption: "أجمل بداية لسنة جديدة وأنا معاكي ومطمن بوجودك جنبي ✨",
      tag: "سند العمر 🕊️"
    }
  ],
  galleryButtonText: 'التالي: رسالة بصوتي 🎙️❤️',

  // Step 7: Love Voice Recording
  voiceMessageTitle: 'كلمات بصوتي طالعة من قلبي لأجلكِ',
  voiceMessageSubtitle: 'رسالة حب بصوتي 🎙️❤️',
  voicePhotoUrl: '/images/peasant_girl.jpg',
  voiceAudioUrl: '',
  voiceButtonText: 'التالي: قائمة أمنياتنا 🗺️✨',

  // Step 8: Romantic Spin Wheel (Legacy)
  spinWheelOutcomeText: 'عليكِ بوسة رقيقة يا أميرتي 💋😘',
  spinWheelButtonText: 'التالي: قائمة أمنياتنا 🗺️✨',

  // Step 8: Bucket List (Individual Wish Boxes with Checkmarks)
  bucketListTitle: 'أحلام سنحققها معاً خطوة بخطوة 🌸',
  bucketListItems: [
    { id: 1, text: '✨ أول لقاء يجمعنا ونظرة العيون التي بدأت بها أجمل قصة حب ❤️', completed: true },
    { id: 2, text: '✈️ سفرية سوا لدولة أو مكان بنحبه ننسى فيها كل العالم ونستمتع بالبحر والنجوم', completed: false },
    { id: 3, text: '🍿 سهرة سينما مخصصة تحت النجوم مع فشار وفلمنا المفضل والهدوء التام', completed: false },
    { id: 4, text: '👩‍🍳 طبخة جديدة نجرب نعملها سوياً في المطبخ بكل حب وضحك', completed: false },
    { id: 5, text: '🏡 تفاصيل بيت أحلامنا المستقبلي ونختار كل ركن ولون وديكور سوا لمملكتنا', completed: false }
  ],
  bucketListButtonText: 'التالي: الرسالة الأخيرة 💌👑',

  // Step 9: Final Heartfelt Letter
  finalLetterTitle: 'كلمات نُقشت بماء الذهب',
  finalLetterSubtitle: 'إلى أميرتي الوحيدة وسر سعادتي 💖',
  finalLetterContent: 'يا أغلى ما عندي في الدنيا ✨ لو كتبتلك كل كلام الحب اللي في العالم مش هيكفي، ولا جزء بسيط اللي حاسس بيه ناحيتك. إنتي النور اللي بينور أيامي، والراحة اللي بدونها الدنيا بتكون صعبة، والسر الوحيد اللي يخليني أبتسم من غير أي سبب. نوعد بعض إننا نفضل سند لبعض، ونعدي أي حاجة، ونضحك سوا ونحقق كل أحلامنا الجاية. بحبك من أعماق قلبي.',
  finalLetterPromise: 'بحبك أوي أوي... ووعدتِ، عمرنا دايماً لا ينتهي 💕💖'
};

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cosmic_love_config_v7');
      if (saved) {
        setConfig({ ...defaultConfig, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Error loading config:', e);
    }
  }, []);

  const updateConfig = (newPartial: Partial<AppConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newPartial };
      try {
        localStorage.setItem('cosmic_love_config_v7', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return updated;
    });
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    try {
      localStorage.removeItem('cosmic_love_config_v7');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  try {
    const tenantCtx = useTenant();
    if (tenantCtx && tenantCtx.currentTenant) {
      return {
        config: tenantCtx.currentTenant.config,
        updateConfig: tenantCtx.updateCurrentTenantConfig,
        resetConfig: () => {}
      };
    }
  } catch (_) {}

  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider or TenantProvider');
  return ctx;
};
