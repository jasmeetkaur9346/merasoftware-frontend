import React, { useState } from 'react';
import {
  Smartphone,
  Code,
  Zap,
  Shield,
  Clock,
  Cloud,
  Rocket,
  RefreshCw,
  Globe,
  Layout,
  ShoppingCart,
  Building,
  User,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Check,
  Headset,
  PhoneCall,
  MessageCircle,
  LifeBuoy,
  Layers,
  PenTool,
  TrendingUp,
  AppWindow,
  Puzzle,
  Database,
  Palette,
  Bug,
  CloudCog,
  Phone,
  Star,
  Award,
  Users,
  Calendar,
  MapPin,
  Mail,
  Target,
  Briefcase,
  Heart,
  PlayCircle,
  Download,
  Eye,
  ThumbsUp,
  Quote,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';

const MobileAppServicesPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Testimonials data
  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "FreshMart Groceries",
      text: "Hamara grocery delivery app launch karne ke baad sales 300% badh gaye. Team ne exactly wahi banaya jo humne socha tha.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      company: "EduLearn Platform", 
      text: "Educational app banane mein unki expertise amazing hai. Students ka feedback bahut positive aaya hai.",
      rating: 5
    },
    {
      name: "Amit Patel",
      company: "HealthCare Plus",
      text: "Telemedicine app ne hamare clinic ki reach rural areas tak pahuncha di. Quality aur support dono excellent hai.",
      rating: 5
    }
  ];

  // Portfolio examples
  const portfolioExamples = [
    {
      title: "Food Delivery App",
      category: "E-commerce",
      features: ["Real-time Tracking", "Payment Integration", "Rating System"],
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
    },
    {
      title: "Fitness Tracker",
      category: "Health & Fitness", 
      features: ["Workout Plans", "Progress Analytics", "Social Features"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    },
    {
      title: "Learning Platform",
      category: "Education",
      features: ["Video Lessons", "Quiz System", "Offline Mode"],
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"
    }
  ];

  const handleFormSubmit = () => {
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section (SECTION BG: WHITE) */}
      <section id="hero" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Native Mobile App Development
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto">
              No Cross-Platform Compromises - Pure Native iOS & Android Apps
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left: Enhanced Photo with Visual Elements */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-emerald-800 to-emerald-400 rounded-2xl p-4">
                <img
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop"
                  alt="Native Mobile App Development"
                  className="w-full h-96 object-cover rounded-xl shadow-xl"
                />
                
                {/* Floating stats cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 border-l-4 border-emerald-500">
                  <div className="text-sm text-gray-600">Apps Built</div>
                  <div className="text-xl font-bold text-gray-900">150+</div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border-l-4 border-green-500">
                  <div className="text-sm text-gray-600">App Store Rating</div>
                  <div className="text-xl font-bold text-gray-900">4.8★</div>
                </div>
                
                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-3 border-l-4 border-teal-500">
                  <div className="text-sm text-gray-600">Client Success</div>
                  <div className="text-xl font-bold text-gray-900">98%</div>
                </div>
              </div>
            </div>

            {/* Right: Key Benefits */}
            <div>
              <div className="grid gap-6">
                <p className="text-2xl mb-4 font-semibold text-gray-800 max-w-2xl text-left">
                  Why Native Apps Beat Cross-Platform Solutions
                </p>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-emerald-200" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Superior Performance</h3>
                    <p className="text-gray-600">Native apps run 2-3x faster than cross-platform alternatives with seamless animations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-200" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Better User Experience</h3>
                    <p className="text-gray-600">Platform-specific design guidelines ensure familiar, intuitive user interfaces</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-800 to-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-teal-200" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Access All Features</h3>
                    <p className="text-gray-600">Full access to device capabilities like camera, GPS, sensors without limitations</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <a
                  href="#portfolio"
                  className="inline-flex items-center gap-3 bg-gradient-to-br from-emerald-500 to-gray-900 text-white px-8 py-4 rounded-lg text-md font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  View Our Native Apps
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section (SECTION BG: GRAY) */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Our Native App Portfolio</h2>
              <p className="mt-2 max-w-2xl text-gray-600">
                Real apps, real results - built with native technologies
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="/portfolio"
                className="rounded-xl bg-gray-900 px-6 py-3 text-md font-semibold text-white hover:bg-gray-800"
              >
                View All Apps
              </a>
            </div>
          </div>

          {/* 3 App Highlights */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "FoodieExpress Delivery",
                type: "iOS & Android",
                blurb: "Real-time tracking, 50K+ downloads",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1200&q=60",
                href: "#",
                alt: "Food delivery app interface",
              },
              {
                title: "FitTracker Pro",
                type: "Native App",
                blurb: "AI-powered workouts, 4.9 rating",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=60",
                href: "#",
                alt: "Fitness tracking app dashboard",
              },
              {
                title: "LearnEasy Platform",
                type: "Educational",
                blurb: "Offline learning, 75K+ students",
                image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=60",
                href: "#",
                alt: "Educational app learning interface",
              },
            ].map((h) => (
              <a
                key={h.title}
                href={h.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow hover:shadow-lg"
              >
                <div className="relative">
                  <div className="aspect-[16/10] bg-gray-50">
                    <img
                      src={h.image}
                      alt={h.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-700 ring-1 ring-gray-200">
                    {h.type}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{h.title}</h3>
                  <p className="line-clamp-2 text-sm text-gray-700">{h.blurb}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (SECTION BG: WHITE) */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Real feedback from real app launches</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-xl text-gray-800 italic mb-6">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-gray-600">{testimonials[activeTestimonial].company}</p>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      activeTestimonial === index ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process Section (SECTION BG: GRAY) */}
      <section id="process" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Native App Development Process</h2>
            <p className="text-xl text-gray-600">From concept to App Store launch in 5 clear steps</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                title: "App Strategy",
                desc: "Define features, target audience, and platform strategy",
                icon: MessageCircle
              },
              {
                step: "2", 
                title: "UI/UX Design",
                desc: "Platform-specific designs following iOS and Android guidelines",
                icon: Palette
              },
              {
                step: "3",
                title: "Native Development",
                desc: "Swift for iOS, Kotlin for Android - pure native code",
                icon: Code
              },
              {
                step: "4",
                title: "Testing & QA",
                desc: "Device testing, performance optimization, bug fixes",
                icon: Bug
              },
              {
                step: "5",
                title: "App Store Launch",
                desc: "Submission, approval process, and ongoing support",
                icon: Rocket
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-2">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Pricing Tool Section (SECTION BG: WHITE) */}
      <section id="pricing" className="py-16 bg-white">
        <style jsx>{`
          .group:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          
          .group:has(.cta-button:hover) {
            transform: translateY(-4px);
            transition: transform 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out;
          }
          
          .group:has(.cta-button:hover):nth-child(1) {
            border-color: rgb(16 185 129);
          }
          
          .group:has(.cta-button:hover):nth-child(2) {
            border-color: rgb(5 150 105);
          }
          
          .group:has(.cta-button:hover):nth-child(3) {
            border-color: rgb(55 65 81);
          }
          
          .group:has(.cta-button:hover) .cta-arrow {
            opacity: 1;
            transform: translateX(0);
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Native App Development Packages</h2>
            <p className="text-xl text-gray-600">Choose your native app solution - iOS, Android, or both</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Single Platform Package */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group relative">
              <div className="absolute top-4 right-4 opacity-0 transform translate-x-2 transition-all duration-300 cta-arrow">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    Single Platform
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">iOS or Android App</h3>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">₹75,000</div>
                  <p className="text-sm text-gray-600">Choose One Platform</p>
                </div>
                
                <ul className="space-y-3 mb-6 text-sm">
                  {[
                    "Native iOS (Swift) or Android (Kotlin)", 
                    "Custom UI/UX Design",
                    "App Store Submission",
                    "Backend API Integration",
                    "Push Notifications",            
                    "Analytics Integration",
                    "3 Months Free Support"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3">
                  <button className="cta-button group/btn w-full bg-gradient-to-br from-emerald-500 to-emerald-900 hover:from-emerald-600 hover:to-emerald-900 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
                    <span className="flex items-center justify-center">
                      Start Native App Development
                      <span className="ml-1 opacity-0 group-hover/btn:opacity-100 transform translate-x-1 group-hover/btn:translate-x-0 transition-all duration-300">
                        →
                      </span>
                    </span>
                  </button>
                  <button className="w-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-2 rounded-xl font-medium transition-colors text-sm">
                    Customize Features
                  </button>
                </div>
              </div>
            </div>

            {/* Dual Platform Package */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-200 overflow-hidden group relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
               
              </div>
              
              <div className="absolute top-4 right-4 opacity-0 transform translate-x-2 transition-all duration-300 cta-arrow">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </div>
              
              <div className="p-8 ">
                <div className="text-center mb-6">
                  <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    Dual Platform
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">iOS + Android App</h3>
                  <div className="text-3xl font-bold text-emerald-600  mb-1">₹1,25,000</div>
                  <p className="text-sm text-gray-600">Both Platforms</p>
                </div>
                
                <ul className="space-y-3 mb-6 text-sm">
                  {[
                    "Native iOS (Swift) + Android (Kotlin)",
                    "Platform-Specific UI Design", 
                    "Dual App Store Submission",
                    "Shared Backend Architecture",
                    "Cross-Platform Analytics",
                    "Advanced Features Integration",
                    "6 Months Free Support"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3">
                  <button className="cta-button group/btn w-full bg-gradient-to-br from-emerald-600 to-emerald-900 hover:from-emerald-600 hover:to-gray-900 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
                    <span className="flex items-center justify-center">
                      Build for Both Platforms
                      <span className="ml-1 opacity-0 group-hover/btn:opacity-100 transform translate-x-1 group-hover/btn:translate-x-0 transition-all duration-300">
                        →
                      </span>
                    </span>
                  </button>
                  <button className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-xl font-medium transition-colors text-sm">
                    Add Enterprise Features
                  </button>
                </div>
              </div>
            </div>

            {/* Custom App Calculator - Dark Theme */}
            <div className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative border border-gray-600">
              <div className="absolute top-4 right-4 opacity-0 transform translate-x-2 transition-all duration-300 cta-arrow">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </div>

              <div className="p-8 text-white">
                <div className="text-center mb-6">
                  <div className="inline-block bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    Interactive Tool
                  </div>
                  <h3 className="text-xl font-bold mb-2">App Cost Calculator</h3>
                  <div className="text-3xl font-bold text-gray-200 mb-1">Know Exact Cost</div>
                  <p className="text-sm text-gray-300">Before You Commit</p>
                </div>
                
                <ul className="space-y-3 mb-6 text-sm">
                  {[
                    "Feature-Based Pricing",
                    "Platform Selection", 
                    "Complexity Analysis",
                    "Timeline Estimation",
                    "Instant Quote Generation",
                    "Compare Package Options",
                    "Download Detailed Proposal"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <button className="cta-button group/btn w-full bg-gradient-to-br from-gray-500 to-gray-700 hover:from-gray-500 hover:to-gray-800 text-white py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
                    <span className="flex items-center justify-center">
                      Open App Cost Calculator
                      <span className="ml-1 opacity-0 group-hover/btn:opacity-100 transform translate-x-1 group-hover/btn:translate-x-0 transition-all duration-300">
                        →
                      </span>
                    </span>
                  </button>
                  <button className="w-full border border-gray-500 text-gray-300 hover:bg-gray-700 py-2 rounded-xl font-medium transition-colors text-sm">
                    Get Custom Quote
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Tool CTA Section (kept as inner gradient box) */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Calculate Your Native App Cost</h3>
            <p className="text-gray-600 mb-6">Interactive pricing tool - Get accurate estimates instantly</p>
            
            <button className="bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 mb-3">
              Try App Cost Calculator - Free!
            </button>
            <p className="text-sm text-gray-500">Compare native vs cross-platform costs • No signup required</p>
          </div>
        </div>
      </section>

      {/* Combined FAQ and Contact Section (SECTION BG: GRAY) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">FAQ & Get Started</h2>
            <p className="text-xl text-gray-600">Common questions about native app development</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* FAQ Section - Left Side */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              {[
                {
                  q: "Why choose native over cross-platform development?",
                  a: "Native apps offer superior performance, better user experience, and full access to device features. They're 2-3x faster than cross-platform solutions and provide platform-specific UI guidelines."
                },
                {
                  q: "How long does native app development take?", 
                  a: "Single platform apps take 8-12 weeks, dual platform apps take 12-16 weeks. Complex enterprise apps may take 16-24 weeks. We provide detailed timelines during planning."
                },
                {
                  q: "Do you provide App Store submission support?",
                  a: "Yes! We handle complete App Store and Google Play submission, including app optimization, compliance checks, and approval process management."
                },
                {
                  q: "Can I update the app content myself?",
                  a: "Absolutely! We provide admin panels for content management and basic training. You can update text, images, and basic content without technical knowledge."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{item.q}</h4>
                  <p className="text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>

            {/* Contact Form - Right Side */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-8 text-white h-fit">
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Native App?</h3>
              <p className="text-gray-200 mb-8">Get a free consultation and detailed development proposal</p>

              {!formSubmitted ? (
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <select className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
                      <option value="" className="text-gray-800">App Type Needed</option>
                      <option value="ios" className="text-gray-800">iOS App Only</option>
                      <option value="android" className="text-gray-800">Android App Only</option>
                      <option value="both" className="text-gray-800">Both iOS & Android</option>
                      <option value="unsure" className="text-gray-800">Not Sure Yet</option>
                    </select>
                    <textarea
                      rows={4}
                      placeholder="Describe your app idea..."
                      className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <button
                      onClick={handleFormSubmit}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors w-full"
                    >
                      Get Free App Consultation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Thank You!</h4>
                  <p className="text-gray-200 mb-6">We'll contact you within 24 hours with a detailed native app development proposal.</p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-gray-300 hover:text-white underline"
                  >
                    Submit Another Request
                  </button>
                </div>
              )}

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-white/20 space-y-3">
                <div className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+91 98765-43210</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span>WhatsApp Consultation</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Ludhiana, Punjab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileAppServicesPage;
