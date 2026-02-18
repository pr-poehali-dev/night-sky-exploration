import { useEffect, useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import AudioPlayer, { type Track } from "@/components/AudioPlayer";

const DEMO_TRACKS: Track[] = [
  { title: "Neon Dreams", author: "AI Studio", genre: "Synthwave", duration: "3:42", plays: "12.4K" },
  { title: "Midnight Flow", author: "beatmaker_pro", genre: "Lo-Fi", duration: "2:58", plays: "8.7K" },
  { title: "Electric Pulse", author: "SoundForge AI", genre: "Electronic", duration: "4:15", plays: "23.1K" },
  { title: "Velvet Sky", author: "marina_music", genre: "Ambient", duration: "5:03", plays: "6.2K" },
  { title: "Bass Theory", author: "AI Studio", genre: "Drum & Bass", duration: "3:27", plays: "15.8K" },
  { title: "Crystal Rain", author: "dj_nova", genre: "Chillstep", duration: "4:48", plays: "9.5K" },
];

const EQ_BARS = 24;

const Equalizer = () => (
  <div className="flex items-end gap-[3px] h-40 lg:h-52">
    {Array.from({ length: EQ_BARS }).map((_, i) => (
      <div
        key={i}
        className="eq-bar w-2 lg:w-3 rounded-full bg-gradient-to-t from-accent/60 via-accent to-accent/40"
        style={{ animationDelay: `${i * 0.08}s`, animationDuration: `${0.8 + Math.random() * 0.8}s` }}
      />
    ))}
  </div>
);

const Index = () => {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observers: Record<string, IntersectionObserver> = {};
    const sectionIds = ["hero", "features", "tracks", "how", "pricing", "cta"];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      observers[id] = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
            observers[id].unobserve(element);
          }
        },
        { threshold: 0.15 }
      );

      observers[id].observe(element);
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTrackClick = (index: number) => {
    if (currentTrackIndex === index) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % DEMO_TRACKS.length;
    });
    setIsPlaying(true);
  }, []);

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => {
      if (prev === null) return 0;
      return prev === 0 ? DEMO_TRACKS.length - 1 : prev - 1;
    });
    setIsPlaying(true);
  };

  const currentTrack = currentTrackIndex !== null ? DEMO_TRACKS[currentTrackIndex] : null;

  return (
    <div className={`min-h-screen bg-background ${currentTrack ? "pb-20" : ""}`}>
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-2xl border-b border-accent/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Music" size={28} className="text-accent" />
            <div className="font-display font-bold text-2xl tracking-tighter bg-gradient-to-r from-white via-accent to-accent/80 bg-clip-text text-transparent">
              SoundForge
            </div>
          </div>
          <nav className="hidden md:flex gap-10 text-sm font-medium">
            <button onClick={() => scrollTo("features")} className="text-muted-foreground hover:text-white transition-colors">
              Возможности
            </button>
            <button onClick={() => scrollTo("tracks")} className="text-muted-foreground hover:text-white transition-colors">
              Треки
            </button>
            <button onClick={() => scrollTo("how")} className="text-muted-foreground hover:text-white transition-colors">
              Как это работает
            </button>
            <button onClick={() => scrollTo("pricing")} className="text-muted-foreground hover:text-white transition-colors">
              Тарифы
            </button>
          </nav>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 text-sm font-medium border border-accent/40 rounded-full hover:border-accent/70 hover:bg-accent/10 transition-all">
              Войти
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-accent via-accent to-accent/80 text-white rounded-full hover:shadow-lg hover:shadow-accent/40 transition-all font-semibold"
            >
              Начать создавать
            </button>
          </div>
        </div>
      </header>

      <section id="hero" className="relative pt-32 pb-32 px-6 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="https://cdn.poehali.dev/projects/fee3d367-2931-45cb-9ac9-3ce92fa841cc/files/75ad0cd9-cf45-4993-b275-7a7f6c2f96ba.jpg"
            alt="Music visualization"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`transition-all duration-1000 ${visibleSections["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="mb-8 inline-block">
                <span className="text-xs font-medium tracking-widest text-accent/80 uppercase">
                  AI-музыкальная платформа нового поколения
                </span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-display font-black leading-tight mb-8 tracking-tighter">
                <span className="bg-gradient-to-br from-white via-white to-accent/40 bg-clip-text text-transparent">
                  Создавай. Слушай.
                </span>
                <br />
                <span className="text-accent">Делись музыкой.</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-xl font-light">
                SoundForge — платформа для создания музыки и клипов с AI-инструментами.
                Загружай треки, редактируй в мощном редакторе и делись ссылкой с миром.
              </p>
              <div className="flex gap-4 mb-12 flex-col sm:flex-row">
                <button
                  onClick={() => scrollTo("pricing")}
                  className="group px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-white rounded-full hover:shadow-2xl hover:shadow-accent/50 transition-all font-semibold text-lg flex items-center gap-3 justify-center"
                >
                  Создать трек
                  <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={() => scrollTo("tracks")}
                  className="px-8 py-4 border border-accent/40 rounded-full hover:border-accent/70 hover:bg-accent/10 transition-all font-medium text-lg text-white"
                >
                  Слушать примеры
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-accent mb-2">50 000+</div>
                  <p className="text-sm text-white/60">Треков создано</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-2">12 000+</div>
                  <p className="text-sm text-white/60">Музыкантов</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent mb-2">3 000+</div>
                  <p className="text-sm text-white/60">Клипов</p>
                </div>
              </div>
            </div>

            <div
              className={`relative h-96 lg:h-[550px] transition-all duration-1000 flex items-center justify-center ${visibleSections["hero"] ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent rounded-3xl blur-3xl animate-pulse" />
              <div className="relative z-10">
                <Equalizer />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${visibleSections["features"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Возможности</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4 mb-6">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Всё для музыки в одном месте
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "Wand2",
                title: "AI-генерация музыки",
                desc: "Создавайте уникальные треки с помощью искусственного интеллекта — задайте стиль, настроение и темп",
              },
              {
                icon: "Sliders",
                title: "Мощный редактор",
                desc: "Профессиональные инструменты для редактирования, сведения и мастеринга треков прямо в браузере",
              },
              {
                icon: "Video",
                title: "Создание клипов",
                desc: "Генерируйте музыкальные клипы с AI или загружайте своё видео и синхронизируйте с треком",
              },
              {
                icon: "Share2",
                title: "Мгновенный шаринг",
                desc: "Делитесь треками по ссылке — слушатели смогут воспроизвести музыку без регистрации",
              },
              {
                icon: "Upload",
                title: "Загрузка треков",
                desc: "Загружайте свою музыку в любом формате — MP3, WAV, FLAC, OGG и другие",
              },
              {
                icon: "Sparkles",
                title: "AI-инструменты",
                desc: "Автоматическое разделение на стемы, удаление вокала, улучшение качества и ремастеринг",
              },
            ].map((item, i) => {
              const isVisible = visibleSections["features"];
              return (
                <div
                  key={i}
                  className={`group p-8 border border-accent/10 hover:border-accent/40 rounded-2xl bg-card/50 hover:bg-card/80 transition-all duration-500 hover:-translate-y-1 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <Icon name={item.icon} size={40} className="mb-6 text-accent group-hover:scale-110 transition-transform" />
                  <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="tracks" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${visibleSections["tracks"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Витрина</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4 mb-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Треки, созданные на платформе
              </span>
            </h2>
            <p className="text-muted-foreground font-light">Нажмите на трек, чтобы послушать демо</p>
          </div>

          <div className="grid gap-3">
            {DEMO_TRACKS.map((track, i) => {
              const isVisible = visibleSections["tracks"];
              const isActive = currentTrackIndex === i;
              const isTrackPlaying = isActive && isPlaying;
              return (
                <div
                  key={i}
                  onClick={() => handleTrackClick(i)}
                  className={`group flex items-center gap-4 p-5 border rounded-xl transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "border-accent/40 bg-accent/10"
                      : "border-accent/10 hover:border-accent/30 bg-card/30 hover:bg-card/60"
                  } ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? "bg-accent border-accent/40" : "bg-accent/20 border-accent/20 group-hover:bg-accent/30"
                  }`}>
                    {isTrackPlaying ? (
                      <div className="flex items-end gap-[2px] h-4">
                        {[0, 1, 2].map((b) => (
                          <div key={b} className="eq-bar w-1 rounded-full bg-white" style={{ animationDelay: `${b * 0.15}s`, animationDuration: "0.6s" }} />
                        ))}
                      </div>
                    ) : (
                      <Icon name={isActive ? "Pause" : "Play"} size={18} className={isActive ? "text-white" : "text-accent"} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm truncate ${isActive ? "text-accent" : "text-white"}`}>{track.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{track.author}</p>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/20">
                    {track.genre}
                  </span>
                  <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                    <Icon name="Headphones" size={14} />
                    <span>{track.plays}</span>
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">{track.duration}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how" className="py-32 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${visibleSections["how"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Процесс</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                От идеи до хита
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Создай", desc: "Запишите трек или сгенерируйте с помощью AI, задав жанр и настроение" },
              { num: "02", title: "Редактируй", desc: "Используйте профессиональный редактор с AI-инструментами для обработки" },
              { num: "03", title: "Визуализируй", desc: "Создайте клип — с помощью AI или загрузите своё видео" },
              { num: "04", title: "Делись", desc: "Отправьте ссылку — ваш трек доступен всему миру за секунды" },
            ].map((step, i) => {
              const isVisible = visibleSections["how"];
              return (
                <div
                  key={i}
                  className={`relative transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="group bg-accent/10 hover:bg-accent/20 border border-accent/20 hover:border-accent/40 rounded-2xl p-8 h-full flex flex-col justify-between transition-all backdrop-blur-sm cursor-pointer">
                    <div>
                      <div className="text-5xl font-display font-black text-accent mb-4 group-hover:scale-110 transition-transform">
                        {step.num}
                      </div>
                      <h3 className="font-display font-bold text-xl mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-accent/40 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${visibleSections["pricing"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-xs font-medium tracking-widest text-accent/60 uppercase">Тарифы</span>
            <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mt-4">
              <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
                Начните бесплатно
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Бесплатный",
                price: "0 ₽",
                features: ["5 треков в месяц", "Базовый AI-редактор", "Шаринг по ссылке", "MP3 экспорт"],
                highlight: false,
              },
              {
                name: "Про",
                price: "990 ₽/мес",
                features: ["Безлимитные треки", "Все AI-инструменты", "Создание клипов", "WAV/FLAC экспорт", "Приоритетная поддержка"],
                highlight: true,
              },
            ].map((plan, i) => {
              const isVisible = visibleSections["pricing"];
              return (
                <div
                  key={i}
                  className={`group relative transition-all duration-700 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  } ${plan.highlight ? "md:scale-105" : ""}`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                >
                  {plan.highlight && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent via-accent to-accent/60 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition" />
                  )}
                  <div
                    className={`relative p-10 border rounded-2xl h-full flex flex-col justify-between backdrop-blur-sm transition-all ${
                      plan.highlight ? "border-accent/40 bg-accent/10" : "border-accent/10 bg-card/50 hover:bg-card/80"
                    }`}
                  >
                    <div>
                      <h3 className="font-display font-bold text-2xl mb-2">{plan.name}</h3>
                      <p className="text-4xl font-black text-accent mb-8">{plan.price}</p>
                      <ul className="space-y-4 mb-10">
                        {plan.features.map((f, j) => (
                          <li key={j} className="flex gap-3 text-sm items-start">
                            <Icon name="Check" size={16} className="text-accent flex-shrink-0 mt-1" />
                            <span className="text-foreground/80">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className={`w-full px-6 py-4 rounded-xl font-semibold transition-all ${
                        plan.highlight
                          ? "bg-gradient-to-r from-accent to-accent/80 text-white hover:shadow-xl hover:shadow-accent/40"
                          : "border border-accent/20 hover:border-accent/40 hover:bg-accent/5"
                      }`}
                    >
                      {plan.highlight ? "Попробовать Про" : "Начать бесплатно"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cta" className="py-32 px-6 bg-accent/5">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${visibleSections["cta"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-white via-white to-accent/40 bg-clip-text text-transparent">
              Готовы создавать музыку?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 font-light max-w-2xl mx-auto">
            Присоединяйтесь к тысячам музыкантов, которые уже создают хиты с SoundForge.
          </p>
          <button
            onClick={() => scrollTo("pricing")}
            className="group px-10 py-5 bg-gradient-to-r from-accent to-accent/90 text-white rounded-full hover:shadow-2xl hover:shadow-accent/40 transition-all font-bold text-lg flex items-center gap-3 mx-auto"
          >
            Создать первый трек
            <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition" />
          </button>
        </div>
      </section>

      <footer className={`border-t border-accent/10 py-12 px-6 bg-background/50 ${currentTrack ? "mb-16" : ""}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="Music" size={18} className="text-accent" />
            <p>© 2025 SoundForge — Создавайте музыку будущего</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">
              Конфиденциальность
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Условия
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Поддержка
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Контакты
            </a>
          </div>
        </div>
      </footer>

      <AudioPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default Index;
