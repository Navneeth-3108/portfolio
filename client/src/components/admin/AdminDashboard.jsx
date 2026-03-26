import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '', headline: '', bio: '', email: '', location: '', githubLink: '', linkedinLink: ''
  });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [messages, setMessages] = useState([]);

  // Form states
  const initialProject = { title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' };
  const [newProject, setNewProject] = useState(initialProject);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [newSkill, setNewSkill] = useState({ name: '', category: 'frontend' });
  const [newExp, setNewExp] = useState({ company: '', role: '', duration: '', description: '' });
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', duration: '', description: '' });

  const [uiMessage, setUiMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [personal, projs, skls, exps, edus, msgs] = await Promise.all([
        apiService.getPersonalDetails(),
        apiService.getProjects(),
        apiService.getSkills(),
        apiService.getExperience(),
        apiService.getEducation(),
        apiService.getMessages()
      ]);
      if (personal?.data) setPersonalDetails(personal.data);
      if (projs?.data) setProjects(projs.data);
      if (skls?.data) setSkills(skls.data);
      if (exps?.data) setExperience(exps.data);
      if (edus?.data) setEducation(edus.data);
      if (msgs?.data) setMessages(msgs.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePersonal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.updatePersonalDetails(personalDetails);
      setUiMessage({ text: 'Personal details updated!', type: 'success' });
    } catch (err) {
      setUiMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const startEditProject = (project) => {
    setNewProject({
      ...project,
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack
    });
    setEditingProjectId(project._id);
    setActiveTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditProject = () => {
    setNewProject(initialProject);
    setEditingProjectId(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await apiService.uploadImage(file);
      setNewProject({ ...newProject, image: res.data.url });
      setUiMessage({ text: 'Image uploaded successfully!', type: 'success' });
    } catch (err) {
      setUiMessage({ text: err.message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleCRUD = async (action, type, id, data) => {
    setLoading(true);
    try {
      if (type === 'project') {
        if (action === 'create') {
          const formattedData = {
            ...data,
            techStack: typeof data.techStack === 'string' ? data.techStack.split(',').map(s => s.trim()).filter(Boolean) : data.techStack
          };
          if (editingProjectId) {
            await apiService.updateProject(editingProjectId, formattedData);
          } else {
            await apiService.createProject(formattedData);
          }
        }
        if (action === 'delete') await apiService.deleteProject(id);
      } else if (type === 'skill') {
        if (action === 'create') await apiService.createSkill(data);
        if (action === 'delete') await apiService.deleteSkill(id);
      } else if (type === 'experience') {
        if (action === 'create') await apiService.createExperience(data);
        if (action === 'delete') await apiService.deleteExperience(id);
      } else if (type === 'education') {
        if (action === 'create') await apiService.createEducation(data);
        if (action === 'delete') await apiService.deleteEducation(id);
      } else if (type === 'message') {
        if (action === 'delete') await apiService.deleteMessage(id);
      }
      
      await fetchData();
      setUiMessage({ text: `${type} ${editingProjectId && action === 'create' ? 'updated' : action + 'd'} successfully!`, type: 'success' });
      
      if (type === 'project' && action === 'create') {
        setNewProject(initialProject);
        setEditingProjectId(null);
      }
      if (type === 'skill') setNewSkill({ name: '', category: 'frontend' });
      if (type === 'experience') setNewExp({ company: '', role: '', duration: '', description: '' });
      if (type === 'education') setNewEdu({ institution: '', degree: '', duration: '', description: '' });
    } catch (err) {
      setUiMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (type) => type === 'success' ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #dc2626, #ef4444)';

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(8px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem'
  };

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(16px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  const buttonStyle = (variant = 'primary') => ({
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    background: variant === 'primary' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 
               variant === 'danger' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
               'rgba(255, 255, 255, 0.05)',
    color: 'white',
    boxShadow: variant === 'primary' ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : 'none'
  });

  return (
    <div className="admin-dashboard" style={{ 
      color: 'white', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '4rem 2rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Premium Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '4rem',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '1.5rem 2rem',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.025em' }}>Portfolio Admin</h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Manage Projects & Communications</p>
          </div>
        </div>
        
        {/* Only ONE logout button here */}
        <button 
          onClick={() => { apiService.logout(); window.location.reload(); }} 
          style={buttonStyle('danger')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Log out
        </button>
      </div>

      {uiMessage.text && (
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          marginBottom: '2rem', 
          borderRadius: '16px', 
          background: getStatusColor(uiMessage.type), 
          color: 'white',
          fontWeight: '600',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {uiMessage.type === 'success' ? '✓' : '⚠'} {uiMessage.text}
        </div>
      )}

      {/* Modern Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '3rem', 
        background: 'rgba(15, 23, 42, 0.4)',
        padding: '0.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        width: 'fit-content',
        overflowX: 'auto'
      }}>
        {['personal', 'projects', 'skills', 'experience', 'education', 'messages'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setUiMessage({text:'', type:''}); }}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '12px',
              color: activeTab === tab ? '#0f172a' : '#94a3b8',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {tab} {tab === 'messages' && messages.length > 0 && <span style={{ 
              background: '#ef4444', 
              color: 'white',
              fontSize: '0.7rem', 
              padding: '2px 6px', 
              borderRadius: '6px',
              minWidth: '20px'
            }}>{messages.length}</span>}
          </button>
        ))}
      </div>

      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {activeTab === 'personal' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#3b82f6' }}>•</span> Personal Identity
            </h2>
            <form onSubmit={handleUpdatePersonal} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {Object.keys(personalDetails).filter(k => !['_id', '__v', 'singletonKey', 'createdAt', 'updatedAt'].includes(k)).map(key => (
                <div key={key} style={{ gridColumn: key === 'bio' ? 'span 2' : 'auto' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
                  {key === 'bio' ? (
                    <textarea
                      value={personalDetails[key]}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, [key]: e.target.value })}
                      style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                      placeholder={`Tell your professional story...`}
                    />
                  ) : (
                    <input
                      value={personalDetails[key]}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, [key]: e.target.value })}
                      style={inputStyle}
                      placeholder={`Enter your ${key.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
              <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <button type="submit" disabled={loading} style={{ ...buttonStyle('primary'), width: '100%', justifyContent: 'center' }}>
                  {loading ? 'Processing...' : 'Synchronize Identity'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div style={{ ...cardStyle, marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
                <span style={{ color: '#3b82f6' }}>•</span> {editingProjectId ? 'Modify Project' : 'Forge New Project'}
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Title</label>
                    <input placeholder="Project Name" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Tech Stack</label>
                    <input placeholder="React, Node.js, GraphQL..." value={newProject.techStack} onChange={(e) => setNewProject({...newProject, techStack: e.target.value})} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Description</label>
                  <textarea placeholder="Describe the problem solved and core value..." value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} style={{ ...inputStyle, minHeight: '80px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Github Source</label>
                    <input placeholder="https://github.com/..." value={newProject.githubLink} onChange={(e) => setNewProject({...newProject, githubLink: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Deployment Link</label>
                    <input placeholder="https://..." value={newProject.liveLink} onChange={(e) => setNewProject({...newProject, liveLink: e.target.value})} style={inputStyle} />
                  </div>
                </div>
                
                <div style={{ 
                  border: '2px dashed rgba(255, 255, 255, 0.1)', 
                  padding: '2rem', 
                  borderRadius: '16px', 
                  background: 'rgba(15, 23, 42, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '1rem', color: '#3b82f6' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9m-4-4l4 4 4-4"/></svg>
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem' }}>Media Assets</h4>
                  <p style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Upload a high-resolution project cover (JPG, PNG, WebP)</p>
                  
                  <input id="project-image-upload" type="file" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
                  <label htmlFor="project-image-upload" style={{ ...buttonStyle('secondary'), cursor: 'pointer' }}>
                    {uploading ? 'Processing Image...' : 'Choose File'}
                  </label>
                  
                  {newProject.image && (
                    <div style={{ marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
                      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
                      <img src={newProject.image} alt="Preview" style={{ width: '100%', display: 'block', maxHeight: '300px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)' }} />
                        <div style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '100%', 
                          background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))'
                        }} />
                      </div>
                      <input 
                        value={newProject.image} 
                        onChange={(e) => setNewProject({...newProject, image: e.target.value})}
                        style={{ ...inputStyle, marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}
                      />
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={() => handleCRUD('create', 'project', null, newProject)} disabled={loading || uploading} style={{ ...buttonStyle('primary'), flex: 1, justifyContent: 'center' }}>
                    {editingProjectId ? 'Update Artifact' : 'Deploy Artifact'}
                  </button>
                  {editingProjectId && (
                    <button onClick={cancelEditProject} style={buttonStyle('secondary')}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#3b82f6' }}>•</span> Active Showcase
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {projects.map(p => (
                <div key={p._id} style={{ 
                  background: 'rgba(30, 41, 59, 0.4)', 
                  borderRadius: '24px', 
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'transform 0.3s ease',
                  cursor: 'default'
                }}>
                  <div style={{ height: '220px', background: '#0f172a', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'rgba(0,0,0,0.1)' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{p.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', margin: '0 0 1.5rem', height: '3.2em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {p.description}
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => startEditProject(p)} style={{ ...buttonStyle('secondary'), flex: 1, justifyContent: 'center' }}>Edit</button>
                      <button onClick={() => handleCRUD('delete', 'project', p._id)} style={{ ...buttonStyle('danger'), flex: 1, justifyContent: 'center' }}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add Expertise</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <input placeholder="Skill Name" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} style={inputStyle} />
                <select 
                  value={newSkill.category} 
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                  style={inputStyle}
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="tools">Tools</option>
                  <option value="languages">Languages</option>
                </select>
                <button onClick={() => handleCRUD('create', 'skill', null, newSkill)} disabled={loading} style={{ ...buttonStyle('primary'), width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>Initialize Skill</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', alignContent: 'start' }}>
              {skills.map(s => (
                <div key={s._id} style={{ 
                  background: 'rgba(30, 41, 59, 0.4)', 
                  padding: '1rem 1.25rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>{s.category}</span>
                    <button onClick={() => handleCRUD('delete', 'skill', s._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <strong style={{ fontSize: '0.95rem' }}>{s.name}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'experience' || activeTab === 'education') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Update Timeline</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {activeTab === 'experience' ? (
                  <>
                    <input placeholder="Organization" value={newExp.company} onChange={(e) => setNewExp({...newExp, company: e.target.value})} style={inputStyle} />
                    <input placeholder="Role / Position" value={newExp.role} onChange={(e) => setNewExp({...newExp, role: e.target.value})} style={inputStyle} />
                    <input placeholder="Time Period" value={newExp.duration} onChange={(e) => setNewExp({...newExp, duration: e.target.value})} style={inputStyle} />
                    <textarea placeholder="Key contributions..." value={newExp.description} onChange={(e) => setNewExp({...newExp, description: e.target.value})} style={{ ...inputStyle, minHeight: '80px' }} />
                    <button onClick={() => handleCRUD('create', 'experience', null, newExp)} disabled={loading} style={{ ...buttonStyle('primary'), width: '100%', justifyContent: 'center' }}>Log Entry</button>
                  </>
                ) : (
                  <>
                    <input placeholder="Institution" value={newEdu.institution} onChange={(e) => setNewEdu({...newEdu, institution: e.target.value})} style={inputStyle} />
                    <input placeholder="Degree / Certification" value={newEdu.degree} onChange={(e) => setNewEdu({...newEdu, degree: e.target.value})} style={inputStyle} />
                    <input placeholder="Graduation Year" value={newEdu.duration} onChange={(e) => setNewEdu({...newEdu, duration: e.target.value})} style={inputStyle} />
                    <button onClick={() => handleCRUD('create', 'education', null, newEdu)} disabled={loading} style={{ ...buttonStyle('primary'), width: '100%', justifyContent: 'center' }}>Log Entry</button>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
              {(activeTab === 'experience' ? experience : education).map(item => (
                <div key={item._id} style={{ 
                  background: 'rgba(30, 41, 59, 0.4)', 
                  padding: '1.5rem', 
                  borderRadius: '20px', 
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{item.role || item.degree}</h3>
                    <p style={{ margin: 0, color: '#3b82f6', fontSize: '0.85rem', fontWeight: '500' }}>{item.company || item.institution}</p>
                    <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.75rem' }}>{item.duration}</p>
                  </div>
                  <button onClick={() => handleCRUD('delete', activeTab, item._id)} style={buttonStyle('danger')}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {messages.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                <div style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </div>
                <p>Digital silence. No incoming communications detected.</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m._id} style={{ 
                  background: 'rgba(30, 41, 59, 0.4)', 
                  padding: '2rem', 
                  borderRadius: '24px', 
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem' }}>{m.subject || 'No Subject'}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          {m.name}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                          {m.email}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleCRUD('delete', 'message', m._id)} style={buttonStyle('danger')}>Delete</button>
                  </div>
                  <div style={{ 
                    background: 'rgba(15, 23, 42, 0.4)', 
                    padding: '1.5rem', 
                    borderRadius: '16px', 
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.95rem',
                    lineHeight: '1.7',
                    border: '1px solid rgba(255, 255, 255, 0.03)'
                  }}>
                    {m.message}
                  </div>
                  <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: '#475569', display: 'flex', justifyContent: 'flex-end' }}>
                    Logged on {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .admin-dashboard select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
