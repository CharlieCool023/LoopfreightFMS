import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MapPin, Hexagon, Route, Shield, Wrench, BarChart3,
  Car, Plane, Ship, ChevronDown, CheckCircle, Clock, Globe, Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hudBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        heroRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 1.2 }
      )
        .fromTo(
          headlineRef.current?.querySelectorAll('.word') || [],
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.6 },
          '-=0.8'
        )
        .fromTo(
          subheadlineRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          ctaRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.2'
        )
        .fromTo(
          hudBarRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          '-=0.4'
        );

      // Scroll-driven hero animation
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress > 0.7) {
            const exitProgress = (progress - 0.7) / 0.3;
            gsap.to(headlineRef.current, {
              y: -18 * exitProgress + 'vh',
              opacity: 1 - exitProgress * 0.75,
              duration: 0.1,
            });
            gsap.to(hudBarRef.current, {
              y: 10 * exitProgress + 'vh',
              opacity: 1 - exitProgress * 0.8,
              duration: 0.1,
            });
          }
        },
        onLeaveBack: () => {
          gsap.to([headlineRef.current, hudBarRef.current], {
            y: 0,
            opacity: 1,
            duration: 0.3,
          });
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = 'One platform. Every asset. Always on.'.split(' ');

  return (
    <div className="bg-[#0B0C0F]">
      {/* Section 1: HUD Hero */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden vignette"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80')`,
            filter: 'grayscale(100%) contrast(1.2) brightness(0.4)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1
            ref={headlineRef}
            className="text-responsive-h1 font-bold text-[#F2F4F8] text-center max-w-4xl mb-6"
          >
            {headlineWords.map((word, i) => (
              <span key={i} className="word inline-block mr-[0.3em]">
                {word}
              </span>
            ))}
          </h1>

          <p
            ref={subheadlineRef}
            className="text-lg md:text-xl text-[#A6AEB8] text-center max-w-2xl mb-8"
          >
            Real-time tracking, geofencing, and fleet analytics—built for operators who can't afford blind spots.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="btn-primary text-center">
              Request a demo
            </Link>
            <Link to="#platform" className="btn-secondary text-center">
              Explore the platform
            </Link>
          </div>
        </div>

        {/* HUD Bar */}
        <div
          ref={hudBarRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl"
        >
          <div className="hud-bar px-6 py-4 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { icon: CheckCircle, label: 'LIVE CONNECTION' },
              { icon: Globe, label: 'GLOBAL COVERAGE' },
              { icon: Clock, label: 'SUB-SECOND LATENCY' },
              { icon: Headphones, label: '24/7 SUPPORT' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-[#C8FF2E]" />
                <span className="text-xs font-mono text-[#A6AEB8] tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-[#C8FF2E]/50" />
        </div>
      </section>

      {/* Section 2: Live Map Overview */}
      <LiveMapSection />

      {/* Section 3: Feature Grid */}
      <FeatureGridSection />

      {/* Section 4: Asset Classes */}
      <AssetClassesSection />

      {/* Section 5: Command Center */}
      <CommandCenterSection />

      {/* Section 6: Proof / Metrics */}
      <MetricsSection />

      {/* Section 7: Pricing */}
      <PricingSection />

      {/* Section 8: Final CTA */}
      <FinalCTASection />
    </div>
  );
}

// Live Map Section
function LiveMapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;

          // Entrance (0-30%)
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3;
            const mapBg = sectionRef.current?.querySelector('.map-bg');
            if (mapBg) {
              gsap.to(mapBg, {
                scale: 1.1 - 0.1 * entranceProgress,
                opacity: 0.6 + 0.4 * entranceProgress,
                duration: 0.1,
              });
            }
            if (cardRef.current) {
              gsap.to(cardRef.current, {
                y: 60 * (1 - entranceProgress) + 'vh',
                scale: 0.92 + 0.08 * entranceProgress,
                opacity: entranceProgress,
                duration: 0.1,
              });
            }
          }
          // Exit (70-100%)
          else if (progress >= 0.7) {
            const exitProgress = (progress - 0.7) / 0.3;
            if (cardRef.current) {
              gsap.to(cardRef.current, {
                x: -40 * exitProgress + 'vw',
                opacity: 1 - exitProgress * 0.75,
                duration: 0.1,
              });
            }
            const mapBg = sectionRef.current?.querySelector('.map-bg');
            if (mapBg) {
              gsap.to(mapBg, {
                scale: 1 + 0.06 * exitProgress,
                opacity: 1 - exitProgress * 0.65,
                duration: 0.1,
              });
            }
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Map Background */}
      <div
        className="map-bg absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=80')`,
          filter: 'grayscale(100%) contrast(1.3) brightness(0.3)',
          opacity: 0.6,
          transform: 'scale(1.1)',
        }}
      />

      {/* Tracking Card */}
      <div
        ref={cardRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg"
        style={{ opacity: 0, transform: 'translate(-50%, -50%) translateY(60vh) scale(0.92)' }}
      >
        <div className="glass-panel p-6 md:p-8 lime-glow">
          <h3 className="text-2xl font-bold text-[#F2F4F8] mb-4">
            Live location. Zero delay.
          </h3>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-[#0B0C0F]/50 rounded-lg p-4 border border-[#C8FF2E]/20">
              <p className="text-xs text-[#A6AEB8] mb-1">ETA</p>
              <p className="text-xl font-mono text-[#C8FF2E]">14:32</p>
            </div>
            <div className="flex-1 bg-[#0B0C0F]/50 rounded-lg p-4 border border-[#C8FF2E]/20">
              <p className="text-xs text-[#A6AEB8] mb-1">Speed</p>
              <p className="text-xl font-mono text-[#C8FF2E]">68 km/h</p>
            </div>
          </div>

          <div className="h-32 bg-[#0B0C0F]/50 rounded-lg mb-6 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80"
              alt="Route preview"
              className="w-full h-full object-cover opacity-60"
              style={{ filter: 'grayscale(100%) contrast(1.2)' }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="btn-primary text-center flex-1">
              View tracking details
            </Link>
            <Link to="#api" className="text-[#C8FF2E] text-sm hover:underline text-center py-3">
              See how our API works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Feature Grid Section
function FeatureGridSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector('h2');
      if (heading) {
        gsap.fromTo(
          heading,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'top 55%',
              scrub: 0.5,
            },
          }
        );
      }

      const cards = cardsRef.current?.querySelectorAll('.feature-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: '10vh', rotateX: 10, opacity: 0 },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.5,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: MapPin,
      title: 'Real-time tracking',
      description: 'GPS + GLONASS fusion with sub-second updates.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    },
    {
      icon: Hexagon,
      title: 'Geofencing',
      description: 'Draw zones. Get instant entry/exit alerts.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    },
    {
      icon: Route,
      title: 'Route optimization',
      description: 'Cut fuel costs with predictive routing.',
      image: 'https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=400&q=80',
    },
    {
      icon: Shield,
      title: 'Driver safety',
      description: 'Harsh braking, speeding, and fatigue scoring.',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
    },
    {
      icon: Wrench,
      title: 'Maintenance',
      description: 'Predictive alerts based on real usage.',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Live dashboards and scheduled reports.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-responsive-h2 font-bold text-[#F2F4F8] mb-4">
            Everything you need to run a tighter fleet.
          </h2>
          <p className="text-lg text-[#A6AEB8]">
            From geofences to maintenance alerts—built for operators, not data scientists.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card glass-panel p-6 card-hover cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              <div className="asset-icon mb-4">
                <feature.icon className="w-5 h-5 text-[#C8FF2E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F2F4F8] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#A6AEB8] mb-4">{feature.description}</p>
              <div className="h-32 rounded-lg overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  style={{ filter: 'grayscale(100%) contrast(1.2) brightness(0.7)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Asset Classes Section
function AssetClassesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax
      const bgImage = sectionRef.current?.querySelector('.bg-image');
      if (bgImage) {
        gsap.to(bgImage, {
          y: '-8vh',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      // Panels entrance
      const panels = sectionRef.current?.querySelectorAll('.asset-panel');
      if (panels && panels.length > 0) {
        gsap.fromTo(
          panels[0],
          { x: '-40vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 0.5,
            },
          }
        );
        gsap.fromTo(
          panels[1],
          { x: '40vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 0.5,
            },
          }
        );
        gsap.fromTo(
          panels[2],
          { y: '40vh', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'top 30%',
              scrub: 0.5,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const assets = [
    {
      icon: Car,
      title: 'Land',
      metric: '12,400+',
      description: 'Cars, vans, trucks, buses, and heavy equipment.',
      position: 'top-left',
    },
    {
      icon: Plane,
      title: 'Air',
      metric: '380+',
      description: 'Helicopters and fixed-wing fleets.',
      position: 'top-right',
    },
    {
      icon: Ship,
      title: 'Sea',
      metric: '190+',
      description: 'Coastal and inland waterway operations.',
      position: 'bottom-center',
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="bg-image absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
          filter: 'grayscale(100%) contrast(1.3) brightness(0.3)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {assets.slice(0, 2).map((asset, i) => (
            <div key={i} className="asset-panel glass-panel p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="asset-icon">
                  <asset.icon className="w-5 h-5 text-[#C8FF2E]" />
                </div>
                <span className="text-sm font-mono text-[#A6AEB8] tracking-wider">{asset.title}</span>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-[#C8FF2E] mb-2">{asset.metric}</p>
              <p className="text-sm text-[#A6AEB8] mb-4">{asset.description}</p>
              <Link to="#" className="text-[#C8FF2E] text-sm hover:underline">
                Explore {asset.title} features →
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="asset-panel glass-panel p-6 md:p-8 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="asset-icon">
                <Ship className="w-5 h-5 text-[#C8FF2E]" />
              </div>
              <span className="text-sm font-mono text-[#A6AEB8] tracking-wider">Sea</span>
            </div>
            <p className="text-4xl md:text-5xl font-bold text-[#C8FF2E] mb-2">190+</p>
            <p className="text-sm text-[#A6AEB8] mb-4">Coastal and inland waterway operations.</p>
            <Link to="#" className="text-[#C8FF2E] text-sm hover:underline">
              Explore Sea features →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Command Center Section
function CommandCenterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const dashboardImage = sectionRef.current?.querySelector('.dashboard-image');
      if (dashboardImage) {
        gsap.fromTo(
          dashboardImage,
          { x: '-10vw', rotateY: 18, opacity: 0 },
          {
            x: 0,
            rotateY: 6,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 0.5,
            },
          }
        );
      }

      const textContent = sectionRef.current?.querySelector('.text-content');
      if (textContent) {
        gsap.fromTo(
          textContent,
          { x: '6vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 0.5,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { title: 'Fleet analytics', description: 'Fuel, time, and utilization trends.' },
    { title: 'Alert rules', description: 'Speed, curfew, geofence, and custom triggers.' },
    { title: 'Integrations', description: 'Connect your TMS, ERP, or telematics stack.' },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0C0F]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Dashboard Image */}
          <div
            className="dashboard-image relative"
            style={{ perspective: '1000px' }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#C8FF2E]/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Dashboard"
                className="w-full"
                style={{ filter: 'grayscale(30%) contrast(1.1)' }}
              />
              {/* Overlay UI elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F]/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-panel p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#C8FF2E] animate-pulse" />
                    <span className="text-sm text-[#F2F4F8]">8 assets online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-content">
            <h2 className="text-responsive-h2 font-bold text-[#F2F4F8] mb-6">
              A dashboard that feels like command center software.
            </h2>

            <ul className="space-y-4 mb-8">
              {[
                'One map. All assets. Filter by team, status, or region.',
                'Click any dot → instant profile, history, and alerts.',
                'Set rules once. Let automation handle the rest.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C8FF2E] mt-0.5 flex-shrink-0" />
                  <span className="text-[#A6AEB8]">{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/register" className="btn-primary inline-block mb-12">
              See the dashboard
            </Link>

            {/* Secondary Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="bg-[#12151C] rounded-lg p-4 border border-[#C8FF2E]/10">
                  <h4 className="text-sm font-semibold text-[#F2F4F8] mb-1">{feature.title}</h4>
                  <p className="text-xs text-[#A6AEB8]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Metrics Section
function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stats on scroll
      const statNumbers = sectionRef.current?.querySelectorAll('.stat-value');
      if (statNumbers) {
        statNumbers.forEach((stat) => {
          const finalValue = stat.getAttribute('data-value') || '0';
          gsap.fromTo(
            stat,
            { textContent: '0' },
            {
              textContent: finalValue,
              duration: 2,
              ease: 'power1.out',
              snap: { textContent: 1 },
              scrollTrigger: {
                trigger: stat,
                start: 'top 80%',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '99.97', suffix: '%', label: 'Uptime across the tracking network.' },
    { value: '1.2', prefix: '<', suffix: 's', label: 'Average location update latency.' },
    { value: '24/7', label: 'Support and monitoring teams.' },
  ];

  const testimonials = [
    {
      quote: 'We reduced fuel waste by 18% in the first quarter.',
      author: 'Amina K.',
      role: 'Fleet Director, Eastridge Logistics',
    },
    {
      quote: 'The geofence alerts alone saved us from three theft attempts.',
      author: 'David R.',
      role: 'Security Lead, Metro Freight',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel p-8 text-center">
              <p className="text-4xl md:text-5xl font-bold text-[#C8FF2E] mb-2">
                {stat.prefix || ''}
                <span className="stat-value" data-value={stat.value}>
                  {stat.value}
                </span>
                {stat.suffix || ''}
              </p>
              <p className="text-sm text-[#A6AEB8]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="glass-panel p-6 md:p-8">
              <p className="text-lg text-[#F2F4F8] mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 flex items-center justify-center">
                  <span className="text-[#C8FF2E] font-semibold text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F2F4F8]">{testimonial.author}</p>
                  <p className="text-xs text-[#A6AEB8]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pricingCards = sectionRef.current?.querySelectorAll('.pricing-card');
      if (pricingCards && pricingCards.length > 0) {
        gsap.fromTo(
          pricingCards,
          { y: '10vh', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 0.5,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      name: 'Starter',
      description: 'For small fleets',
      price: '₦15,000',
      period: '/ vehicle / month',
      features: ['Up to 10 vehicles', 'Real-time tracking', 'Basic geofencing', 'Email alerts'],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Business',
      description: 'For growing operations',
      price: '₦25,000',
      period: '/ vehicle / month',
      features: [
        'Up to 100 vehicles',
        'Advanced geofencing',
        'Route optimization',
        'Driver safety scoring',
        'API access',
        'Priority support',
      ],
      cta: 'Get started',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'For large-scale fleets',
      price: 'Custom',
      period: 'pricing',
      features: [
        'Unlimited vehicles',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'On-premise option',
      ],
      cta: 'Contact sales',
      highlighted: false,
    },
  ];

  const faqs = [
    { q: 'Do you support mixed fleets (land + air + sea)?', a: 'Yes, our platform supports all asset types including vehicles, aircraft, and vessels under a single dashboard.' },
    { q: 'Can I export data to my own BI tools?', a: 'Absolutely. We offer API access and data export capabilities for Business and Enterprise plans.' },
    { q: 'Is there a minimum contract length?', a: 'No, you can pay monthly. However, annual plans offer significant discounts.' },
    { q: 'How do geofence alerts work?', a: 'You can draw zones on the map and receive instant notifications when assets enter or exit those areas.' },
    { q: 'What happens if a device goes offline?', a: "You'll receive an alert and the last known location will be displayed on the map." },
    { q: 'Do you offer API access?', a: 'Yes, API access is included in Business and Enterprise plans.' },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0C0F]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-responsive-h2 font-bold text-[#F2F4F8] mb-4">
            Simple pricing. No hidden fees.
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`pricing-card glass-panel p-6 md:p-8 ${
                plan.highlighted ? 'lime-glow-strong border-[#C8FF2E]/50' : ''
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block px-3 py-1 bg-[#C8FF2E] text-[#0B0C0F] text-xs font-semibold rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-[#F2F4F8] mb-1">{plan.name}</h3>
              <p className="text-sm text-[#A6AEB8] mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#C8FF2E]">{plan.price}</span>
                <span className="text-sm text-[#A6AEB8]">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-[#A6AEB8]">
                    <CheckCircle className="w-4 h-4 text-[#C8FF2E]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-[#C8FF2E] text-[#0B0C0F] hover:bg-[#d4ff4d]'
                    : 'border border-[#C8FF2E]/30 text-[#C8FF2E] hover:bg-[#C8FF2E]/10'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-[#F2F4F8] mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium text-[#F2F4F8]">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#A6AEB8] transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-[#A6AEB8]">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ctaContent = sectionRef.current?.querySelector('.cta-content');
      if (ctaContent) {
        gsap.fromTo(
          ctaContent,
          { scale: 0.96, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 0.5,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80')`,
          filter: 'grayscale(100%) contrast(1.3) brightness(0.3)',
        }}
      />

      {/* Content */}
      <div className="cta-content relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-responsive-h2 font-bold text-[#F2F4F8] mb-4">
          Ready to see every move?
        </h2>
        <p className="text-lg text-[#A6AEB8] mb-8">
          Talk to our team and get a pilot running in 48 hours.
        </p>
        <Link to="/register" className="btn-primary inline-block">
          Book a pilot
        </Link>
      </div>
    </section>
  );
}

export default LandingPage;
