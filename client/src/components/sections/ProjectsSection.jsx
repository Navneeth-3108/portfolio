import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import Card from '../common/Card';
import Button from '../common/Button';
import { apiService, ASSET_BASE_URL } from '../../services/api';

const ProjectImage = ({ image, title }) => {
  const [isImageVisible, setIsImageVisible] = useState(true);
  const firstImage = image || '';

  if (!firstImage || !isImageVisible) {
    return (
      <div className="project-image-fallback" role="img" aria-label={`No preview image available for ${title}`}>
        <strong>Preview unavailable</strong>
        <span>Image could not be loaded.</span>
      </div>
    );
  }

  return (
    <img
      src={firstImage.startsWith('http') ? firstImage : `${ASSET_BASE_URL}${firstImage}`}
      alt={`Preview of ${title}`}
      className="project-image"
      onError={() => setIsImageVisible(false)}
    />
  );

};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [techStack, setTechStack] = useState('');

  const fetchProjects = async (currentPage, tech = '') => {
    setLoading(true);
    try {
      const res = await apiService.getProjects(currentPage, 6, tech);
      const apiProjects = Array.isArray(res?.data) ? res.data : [];

      if (apiProjects.length > 0) {
        setProjects(apiProjects);
        setTotalPages(res?.meta?.totalPages || 1);
      } else {
        setProjects([]);
        setTotalPages(1);
      }
    } catch {
      setProjects([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page, techStack);
  }, [page, techStack]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoadingFilters(true);
      try {
        const pageLimit = 50;
        const firstResponse = await apiService.getProjects(1, pageLimit);
        const firstPageProjects = Array.isArray(firstResponse?.data) ? firstResponse.data : [];
        const totalFilterPages = Number(firstResponse?.meta?.totalPages || 1);

        let allProjects = [...firstPageProjects];

        if (totalFilterPages > 1) {
          const remainingResponses = await Promise.all(
            Array.from({ length: totalFilterPages - 1 }, (_, index) =>
              apiService.getProjects(index + 2, pageLimit)
            )
          );

          remainingResponses.forEach((response) => {
            const pageProjects = Array.isArray(response?.data) ? response.data : [];
            allProjects = allProjects.concat(pageProjects);
          });
        }

        const techs = Array.from(
          new Set(
            allProjects
              .flatMap((project) => project.techStack || [])
              .map((tech) => String(tech).trim())
              .filter(Boolean)
          )
        ).sort((a, b) => a.localeCompare(b));

        setAvailableTechs(techs);
      } catch {
        setAvailableTechs([]);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilter = (tech) => {
    const newStack = tech === techStack ? '' : tech;
    setTechStack(newStack);
    setPage(1);
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader title="Projects" subtitle="Recent Work" />
        
        {/* Filters */}
        <nav className="projects-filter-bar" aria-label="Project Tech Filters">
          <button
            onClick={() => handleFilter('')}
            className={`filter-btn ${techStack === '' ? 'active' : ''}`}
            aria-pressed={techStack === ''}
          >
            All
          </button>

          {availableTechs.map(tech => (
            <button
              key={tech}
              onClick={() => handleFilter(tech)}
              className={`filter-btn ${techStack === tech ? 'active' : ''}`}
              aria-pressed={techStack === tech}
            >
              {tech}
            </button>
          ))}

          {!loadingFilters && availableTechs.length === 0 && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No tech filters available yet.
            </span>
          )}
        </nav>

        {loading ? (
          <div className="section-empty-state" style={{ padding: '4rem 0' }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="section-empty-state" style={{ padding: '4rem 0' }}>
            {techStack ? `No projects found for ${techStack}.` : 'No projects added yet.'}
          </div>
        ) : (
          <>
            <motion.div 
              className="projects-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {projects.map((project, index) => (
                <motion.article
                  key={project._id || index}
                  className="project-card"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  whileHover={{ y: -5 }}
                  data-cursor="Project"
                >
                  <Card className="project-card-container">
                    <div className="project-image-wrapper">
                      <ProjectImage
                        key={project.image || project._id || index}
                        image={project.image}
                        title={project.title}
                      />
                    </div>
                    
                    <h3 className="project-title">
                      {project.title}
                    </h3>
                    
                    <p className="project-desc">
                      {project.description}
                    </p>
                    
                    <div className="project-tech-stack" aria-label="Technologies used">
                      {project.techStack?.map(tech => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="project-actions">
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }} aria-label={`View Source Code for ${project.title}`}>
                          <Button variant="outline" style={{ width: '100%' }}>
                            GitHub
                          </Button>
                        </a>
                      )}
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }} aria-label={`View Live Demo for ${project.title}`}>
                          <Button variant="primary" style={{ width: '100%' }}>
                            Live Demo
                          </Button>
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.article>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <nav className="pagination-bar" aria-label="Project Pagination">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous Page"
                >
                  Previous
                </Button>
                <span className="pagination-info" aria-current="page">
                  {page} / {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next Page"
                >
                  Next
                </Button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
