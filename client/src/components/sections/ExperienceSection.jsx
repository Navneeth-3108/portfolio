import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { apiService } from '../../services/api';

const ExperienceSection = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiService.getExperience();
        const apiExperience = Array.isArray(res?.data) ? res.data : [];
        setExperience(apiExperience);
      } catch {
        setExperience([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container">
        <SectionHeader title="Experience" subtitle="Work History" id="experience-title" />
        
        {loading ? (
          <div className="section-empty-state">Loading experience...</div>
        ) : experience.length === 0 ? (
          <div className="section-empty-state">
            Currently focusing on building high-impact backend systems through specialized projects. 
            Actively seeking opportunities to apply my technical skills in a professional role.
          </div>
        ) : (
          <div className="timeline-list">
            {experience.map((exp, index) => (
              <motion.article 
                key={exp._id || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="timeline-item"
                data-cursor="View"
              >
                <div className="timeline-header">
                  <div className="timeline-title-group">
                    <h3>{exp.role || 'Role'}</h3>
                    <div className="timeline-org">
                      {exp.company}
                    </div>
                  </div>
                  <time className="timeline-date">
                    {exp.duration || 'Duration not specified'}
                  </time>
                </div>
                
                <p className="timeline-desc">
                  {exp.description}
                </p>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
