import React, { useState, useEffect } from 'react';
import SectionHeader from '../common/SectionHeader';
import { motion } from 'framer-motion';
import { apiService } from '../../services/api';

const CATEGORY_META = {
  frontend: { label: 'Frontend', hint: 'UI/UX Engineering' },
  backend: { label: 'Backend', hint: 'Scalable Architecture' },
  languages: { label: 'Languages', hint: 'Core R&D' },
  tools: { label: 'Tools', hint: 'Ops & Workflow' },
};

const CATEGORY_ORDER = ['languages', 'backend', 'frontend', 'tools'];

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const groupedSkills = CATEGORY_ORDER.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  skills.forEach((skill) => {
    const key = String(skill.category || '').toLowerCase();
    if (groupedSkills[key]) {
      groupedSkills[key].push(skill);
    } else {
      groupedSkills.tools.push(skill);
    }
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await apiService.getSkills();
        const apiSkills = Array.isArray(res?.data) ? res.data : [];
        setSkills(apiSkills);
      } catch {
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="section skills-section-shell">
      <div className="container">
        <SectionHeader title="Skills" subtitle="Technical Proficiency" />
      </div>

      {loading ? (
        <div className="container section-empty-state">Synthesizing Expertise...</div>
      ) : skills.length === 0 ? (
        <div className="container section-empty-state">No skills detected.</div>
      ) : (
        <div className="container">
          <div className="skills-showcase">
            {CATEGORY_ORDER.map((category, categoryIndex) => {
              const values = groupedSkills[category];
              const sortedValues = values
                .slice()
                .sort((a, b) => String(a.name).localeCompare(String(b.name)));

              return (
                <motion.article
                  key={category}
                  className={`skills-showcase-card skills-showcase-card-${category}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: categoryIndex * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <div className="skills-showcase-head">
                    <div>
                      <h4 className="skills-showcase-title">{CATEGORY_META[category].label}</h4>
                      <p className="skills-showcase-hint">{CATEGORY_META[category].hint}</p>
                    </div>
                    <motion.span
                      className="skills-showcase-count"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: categoryIndex * 0.1 + 0.4,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                    >
                      {values.length}
                    </motion.span>
                  </div>

                  {values.length === 0 ? (
                    <div className="skills-card-empty">Building Stack...</div>
                  ) : (
                    <div className="skills-tag-grid">
                      {sortedValues.map((skill, index) => (
                        <motion.span
                          key={skill._id || `${category}-${index}`}
                          className="skills-tag"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: categoryIndex * 0.1 + index * 0.03,
                            ease: "easeOut"
                          }}
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default SkillsSection;
