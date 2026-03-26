import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { apiService } from '../../services/api';

const EducationSection = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiService.getEducation();
        const apiEducation = Array.isArray(res?.data) ? res.data : [];
        setEducation(apiEducation);
      } catch {
        setEducation([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className="container">
        <SectionHeader title="Education" subtitle="Academic History" id="education-title" />
        
        {loading ? (
          <div className="section-empty-state">Loading education...</div>
        ) : education.length === 0 ? (
          <div className="section-empty-state">
            Academic credentials and certifications are currently being updated. 
            Focusing on continuous learning and mastery of backend technologies.
          </div>
        ) : (
          <div className="timeline-list">
            {education.map((edu, index) => (
              <motion.article 
                key={edu._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="timeline-item"
              >
                <div className="timeline-header">
                  <div className="timeline-title-group">
                    <h3>{edu.degree}</h3>
                    <div className="timeline-org">
                      {edu.institution}
                    </div>
                  </div>
                  <time className="timeline-date">
                    {edu.duration || 'Duration not specified'}
                  </time>
                </div>

                {edu.description && (
                  <p className="timeline-desc">
                    {edu.description}
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EducationSection;
