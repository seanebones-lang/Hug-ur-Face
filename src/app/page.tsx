"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { useState } from "react";

const capabilities = [
  {
    id: "photo-to-anime",
    icon: "🎨",
    title: "Photo to Anime",
    shortDesc: "Transform any photo into stunning anime artwork",
    longDesc: "This isn't a simple filter. Our AI understands facial structure, lighting, and artistic style at a fundamental level. It reconstructs your image pixel-by-pixel in authentic anime aesthetic while maintaining identity - something that took professional artists hours, now happens in seconds. The result? Gallery-quality anime portraits that preserve every nuance of the original subject.",
    examples: ["Portrait transformation", "Character design", "Avatar creation"],
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "character-consistency",
    icon: "👤",
    title: "Character Consistency",
    shortDesc: "Maintain identity across imaginative edits",
    longDesc: "Revolutionary breakthrough in AI: our model can place the same person in completely different scenarios while maintaining perfect facial recognition. This technology powers Hollywood-level VFX studios, now available to you. Create entire photo series from a single portrait - change backgrounds, outfits, lighting - while preserving every identifying characteristic.",
    examples: ["Same person, different scenes", "Outfit changes", "Fantasy scenarios"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "upscaling",
    icon: "📐",
    title: "4K Upscaling",
    shortDesc: "Enhance images to 2K-4K resolution losslessly",
    longDesc: "Not interpolation. True AI reconstruction. Our neural network hallucinates missing details based on billions of images it's studied - creating authentic texture, sharpness, and detail where none existed. What was once impossible is now standard: turn phone photos into billboard-quality prints. This is the same technology used by professional photo restoration studios charging $100+ per image.",
    examples: ["Print-ready images", "Detail enhancement", "Quality restoration"],
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: "lighting",
    icon: "💡",
    title: "Light Migration",
    shortDesc: "Realistic lighting control and enhancement",
    longDesc: "Relight your photos as if you'd been there with a $50,000 lighting rig. Our AI understands 3D geometry, surface materials, and light physics. Add golden hour magic to midday photos. Create studio lighting from natural light. Fix shadows, highlights, and reflections with photorealistic accuracy. This is cinematographer-level lighting control - no green screen, no reshoots required.",
    examples: ["Studio lighting", "Golden hour effects", "Dramatic shadows"],
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "viewpoints",
    icon: "🔄",
    title: "Multiple Angles",
    shortDesc: "Generate new viewpoints of your subject",
    longDesc: "Impossible made possible: generate camera angles that don't exist. Our AI constructs 3D understanding from 2D images, then renders new perspectives. E-commerce sellers save thousands on multi-angle product photography. Designers visualize concepts from every direction. It's like having X-ray vision that sees around objects - technology that seems like science fiction.",
    examples: ["Product rotation", "360° views", "Angle variation"],
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "style-transfer",
    icon: "🖼️",
    title: "Style Transfer",
    shortDesc: "Apply artistic styles and effects",
    longDesc: "Not filters. True artistic reimagination. Our AI studied millions of masterworks to understand artistic techniques at a fundamental level - brush strokes, color theory, composition. It doesn't overlay effects; it reconstructs your image in the style of van Gogh, Monet, or modern digital artists. Each result is a unique artwork, not a processed photo.",
    examples: ["Artistic effects", "Painting styles", "Visual aesthetics"],
    color: "from-violet-500 to-purple-500"
  },
  {
    id: "manga-tone",
    icon: "📚",
    title: "Manga Effects",
    shortDesc: "Professional manga-style rendering",
    longDesc: "Authentic Japanese manga rendering trained on thousands of professional manga panels. Not just black and white conversion - true screen tone application, line weight variation, and dramatic shading that manga artists spend years mastering. Comic creators, this is your digital assistant - transforming photo references into publication-ready manga art.",
    examples: ["Comic panels", "Manga portraits", "Screen tones"],
    color: "from-gray-500 to-slate-500"
  },
  {
    id: "industrial",
    icon: "🏭",
    title: "Product Design",
    shortDesc: "Industrial design and material replacement",
    longDesc: "Replace 3D rendering pipelines entirely. Generate product variations in seconds - wood to metal, matte to glossy, red to blue. Design teams iterate 10x faster. E-commerce businesses showcase every option without photographing every SKU. This is CAD-level visualization power without the CAD software, expertise, or render farms. Manufacturing visualization at consumer pricing.",
    examples: ["Material variants", "Color options", "Design iterations"],
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: "pose",
    icon: "🤸",
    title: "Pose Control",
    shortDesc: "Change poses while maintaining character identity",
    longDesc: "Animate the static. Change body positioning while preserving facial identity and clothing details - technology that powers motion capture studios, now accessible to everyone. Fashion designers visualize garments in any pose. Fitness coaches create exercise demonstrations. Character artists generate reference sheets. It's digital puppeteering without the puppet.",
    examples: ["Action poses", "Fashion poses", "Dynamic positioning"],
    color: "from-red-500 to-pink-500"
  }
];

export default function HomePage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6">
              Powered by Qwen AI • 9 Advanced Editing Modes
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Professional AI Image Editing
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                by NextEleven
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform photos to anime • Upscale to 4K • Control lighting • Generate multiple angles • Apply artistic styles • And 4 more powerful modes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/generate"
                className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
              >
                Try It Free - 3 Credits
              </Link>
              <Link
                href="/pricing"
                className="px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg"
              >
                View Pricing
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold text-lg">✓</span>
                <span>No subscription required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold text-lg">✓</span>
                <span>Pay per use</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold text-lg">✓</span>
                <span>Professional quality</span>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
              9 Powerful AI Editing Modes
            </h2>
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto">
              Click any card to explore what's possible with our advanced AI technology
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((capability) => (
                <div
                  key={capability.id}
                  onClick={() => setExpandedCard(expandedCard === capability.id ? null : capability.id)}
                  className={`
                    cursor-pointer p-6 rounded-2xl transition-all duration-300
                    ${expandedCard === capability.id
                      ? 'bg-gradient-to-br ' + capability.color + ' text-white shadow-2xl scale-105 md:col-span-2 lg:col-span-1'
                      : 'bg-gray-50 dark:bg-gray-900 hover:shadow-xl hover:scale-105'
                    }
                  `}
                >
                  <div className="text-5xl mb-4">{capability.icon}</div>
                  <h3 className={`text-2xl font-bold mb-3 ${expandedCard === capability.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {capability.title}
                  </h3>
                  <p className={`mb-4 ${expandedCard === capability.id ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                    {capability.shortDesc}
                  </p>

                  {expandedCard === capability.id && (
                    <div className="mt-6 space-y-4 animate-fadeIn">
                      <p className="text-white/95 text-lg leading-relaxed">
                        {capability.longDesc}
                      </p>
                      <div className="pt-4 border-t border-white/20">
                        <h4 className="font-semibold text-white mb-3">Perfect for:</h4>
                        <ul className="space-y-2">
                          {capability.examples.map((example, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-white/90">
                              <span className="text-xl">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4">
                        <Link
                          href="/generate"
                          className="inline-block px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Try This Mode →
                        </Link>
                      </div>
                    </div>
                  )}

                  {expandedCard !== capability.id && (
                    <div className="mt-4 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-2">
                      Click to learn more →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
              Simple 3-Step Process
            </h2>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  1. Upload Image
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Upload any image you want to transform using our AI-powered editing modes
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  2. Choose Mode & Describe
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Select your editing mode and describe what you want - our AI handles the rest
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  3. Download Results
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Get your professionally edited image in seconds. Just 1 credit per generation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Who's Using NextEleven AI?
            </h2>
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto">
              From tattoo artists to game developers, professionals worldwide are transforming their workflows
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="p-5 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tattoo Artists</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Convert photos to clean line work, generate design variations, create reference sheets from different angles
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="text-3xl mb-3">✏️</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Manga Artists</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Transform photo references into manga panels with authentic screen tones and line art
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-3xl mb-3">🎬</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Animators</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create character turnarounds, generate pose variations, develop style frames from live action
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-3xl mb-3">🎮</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Game Developers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate character concept art, create texture variations, produce 360° asset views
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="text-3xl mb-3">🏪</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">E-commerce Sellers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showcase products in multiple colors/materials without reshooting, generate angle variations
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="text-3xl mb-3">👗</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Fashion Designers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visualize garments in different poses, create lookbooks, test color palettes instantly
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Photographers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upscale to 4K for prints, relight photos post-shoot, offer creative anime-style portraits
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
                <div className="text-3xl mb-3">🏗️</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Product Designers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Replace materials (wood→metal), generate finish options, create client presentation mockups
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Social Media Managers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create eye-catching content, generate thumbnail variations, apply consistent visual styles
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Comic Artists</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Convert photo refs to comic book style, generate panel variations, create character sheets
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 rounded-xl border border-lime-200 dark:border-lime-800">
                <div className="text-3xl mb-3">🎭</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Concept Artists</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore character designs, generate pose variations, create environment mood boards
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="text-3xl mb-3">🖼️</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Fine Artists</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore compositional ideas, test different artistic styles, create digital studies
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 rounded-xl border border-fuchsia-200 dark:border-fuchsia-800">
                <div className="text-3xl mb-3">🎥</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Video Producers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create YouTube thumbnails, enhance video stills, generate promotional artwork
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border border-sky-200 dark:border-sky-800">
                <div className="text-3xl mb-3">🏢</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Marketing Teams</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate campaign visuals, A/B test different styles, create localized content variations
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div className="text-3xl mb-3">📖</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Book Publishers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create cover art concepts, generate character illustrations, produce interior artwork
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 rounded-xl border border-rose-200 dark:border-rose-800">
                <div className="text-3xl mb-3">🎪</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Event Planners</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create event visuals, generate promotional materials, produce venue mockups
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="text-3xl mb-3">🏋️</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Fitness Coaches</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create exercise demonstration images, generate pose variations for form guides
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-3xl mb-3">🏛️</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Architects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visualize material options, create presentation renders, generate lighting studies
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-pink-50 to-fuchsia-50 dark:from-pink-900/20 dark:to-fuchsia-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                <div className="text-3xl mb-3">💅</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Beauty Professionals</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create before/after mockups, visualize makeup looks, generate portfolio pieces
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Educators</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create educational visuals, generate course materials, produce engaging content
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
                <div className="text-3xl mb-3">🎸</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Musicians</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create album covers, generate promotional artwork, design merch graphics
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
                <div className="text-3xl mb-3">🌐</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Web Designers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create hero images, generate icon variations, produce background artwork
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="text-3xl mb-3">📰</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Journalists</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enhance story images, create compelling feature visuals, upscale archived photos
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-3xl mb-3">🛍️</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Dropshippers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create unique product listings, enhance supplier photos, generate lifestyle mockups
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Transform Any Image with the Most Advanced AI Systems in the World
            </h2>
            <p className="text-2xl text-white/90 font-semibold mb-6">
              Made by NextEleven
            </p>
            <p className="text-xl text-indigo-100 mb-10">
              Sign up now and get 3 free credits to try all 9 AI editing modes.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block px-10 py-5 bg-white text-indigo-600 text-lg rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-xl hover:shadow-2xl"
            >
              Get Started Free
            </Link>
            <p className="mt-6 text-indigo-200 text-sm">
              No credit card required • 3 free credits • Access to all features
            </p>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p className="text-lg font-semibold mb-2">&copy; 2026 NextEleven AI. All rights reserved.</p>
          <p className="text-sm">Powered by Qwen Image Edit Models • 9 Advanced AI Editing Modes</p>
        </div>
      </footer>
    </div>
  );
}
