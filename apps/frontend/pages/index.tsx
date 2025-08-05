import type { InferGetServerSidePropsType, NextPage } from "next";
import { useState, useEffect } from "react";
import { useTranslation } from '../hooks/useTranslation';

export const getServerSideProps = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const projects: Project[] = await res.json();
    return { props: { projects } };
  } catch (error) {
    console.error(error);
    return { props: { projects: [] } };
  }
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ projects }) => {
  const { t, lang } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  
  const carouselImages = [
    { 
      src: 'https://placehold.co/600x600/1F2937/FFFFFF?text=Code+Snippet', 
      alt: '开发者编码场景' 
    },
    { 
      src: 'https://placehold.co/600x600/3B82F6/FFFFFF?text=Modern+UI', 
      alt: '现代化的网页应用UI设计' 
    },
    { 
      src: 'https://placehold.co/600x600/8B5CF6/FFFFFF?text=Tech+Background', 
      alt: '抽象科技背景' 
    }
  ];

  // 技能数据
  const skillsData = {
    frontend: [
      { name: 'React', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'TypeScript', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Vue.js', level: 80 },
      { name: 'HTML/CSS', level: 95 }
    ],
    backend: [
      { name: 'Node.js', level: 85 },
      { name: 'Java', level: 82 },
      { name: 'Hono.js', level: 88 },
      { name: 'MySQL', level: 80 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'MongoDB', level: 75 }
    ],
    devops: [
      { name: 'Docker', level: 85 },
      { name: 'Git', level: 90 },
      { name: 'AWS', level: 75 },
      { name: 'CI/CD', level: 80 },
      { name: 'Linux', level: 85 },
      { name: 'Nginx', level: 78 }
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % carouselImages.length);
    }, 3500); // 每 3.5 秒切换一次图片
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <div className="container mx-auto px-6 pt-20 pb-8 transition-colors duration-300">
      
      {/* 英雄区域 */}
      <section id="home" className="grid md:grid-cols-2 gap-12 items-center min-h-[calc(60vh)] py-8">
        <div className="flex flex-col justify-center">
          <h1
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight"
          >
            {t('heroGreeting')}&nbsp;
            <span className="text-gradient">{t('heroName')}</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-200 mt-2">
            {t('heroSubtitle')}
          </h2>
          <p className="text-base text-slate-700 dark:text-gray-400 max-w-2xl mt-3">
            {t('heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-5">
              <a href="#projects" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-300 hover:scale-105 text-center">
                  {t('heroBtnProjects')}
              </a>
              <a href="#contact" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-300 hover:scale-105 text-center">
                  {t('heroBtnContact')}
              </a>
          </div>
        </div>
        
        {/* 图片轮播区域 */}
        <div className="hidden md:flex justify-center items-center">
            <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-2xl p-2 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700">
                {carouselImages.map((image, index) => (
                    <img
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        className={`absolute top-0 left-0 w-full h-full rounded-xl object-cover transition-opacity duration-1000 ease-in-out ${currentImage === index ? 'opacity-100' : 'opacity-0'}`}
                    />
                ))}
            </div>
        </div>
      </section>

      {/* 项目区域 */}
      <section id="projects" className="py-20 bg-white/60 dark:bg-gray-800/20 rounded-3xl -mx-6 px-6 my-16 shadow-sm">
        <div className="text-center mb-12">
          <h3 className="text-5xl font-black text-gray-900 dark:text-white text-center mb-4">{t('navProjects')}</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6 transform hover:-translate-y-1 hover:shadow-lg shadow-md transition-all duration-300">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{project.title[lang]}</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{project.description[lang]}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.techStack.map(tech => (
                  <span key={tech} className="bg-blue-100 dark:bg-sky-900/50 text-blue-800 dark:text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 技能区域 */}
      <section id="skills" className="py-20 bg-white/60 dark:bg-gray-900/20 rounded-3xl -mx-6 px-6 my-16 shadow-sm">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4">{t('skillsTitle')}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-700 dark:text-gray-400 text-lg max-w-2xl mx-auto">{t('skillsDescription')}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* 前端技能 */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg shadow-md hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">{t('frontendSkills')}</h3>
            <div className="space-y-3">
              {skillsData.frontend.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                    <span className="text-sky-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-700 dark:bg-gray-700 bg-gray-300 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 后端技能 */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg shadow-md hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">{t('backendSkills')}</h3>
            <div className="space-y-3">
              {skillsData.backend.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                    <span className="text-sky-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-700 dark:bg-gray-700 bg-gray-300 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DevOps技能 */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg shadow-md hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">{t('devopsSkills')}</h3>
            <div className="space-y-3">
              {skillsData.devops.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                    <span className="text-sky-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-700 dark:bg-gray-700 bg-gray-300 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* 联系区域 */}
      <section id="contact" className="py-20 bg-white/60 dark:bg-gray-800/20 rounded-3xl -mx-6 px-6 my-16 shadow-sm">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4">{t('contactTitle')}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-700 dark:text-gray-400 text-lg max-w-2xl mx-auto">{t('contactDescription')}</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center hover:shadow-lg shadow-md hover:scale-105 transition-all duration-300">
            <div className="mb-4">
              <svg className="w-12 h-12 text-sky-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email</h3>
              <a 
                href={`mailto:${t('contactEmail')}`}
                className="text-sky-400 hover:text-sky-300 text-lg font-medium transition-colors duration-300"
              >
                {t('contactEmail')}
              </a>
            </div>
            
            <div className="flex justify-center space-x-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* 推特图标已隐藏 */}
              {/* <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;