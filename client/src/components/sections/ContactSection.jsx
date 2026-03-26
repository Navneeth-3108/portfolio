import React, { useState } from 'react';
import SectionHeader from '../common/SectionHeader';
import Card from '../common/Card';
import Button from '../common/Button';
import Magnetic from '../common/Magnetic';
import { apiService } from '../../services/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await apiService.submitMessage(formData);
      if (res.success || res.message) {
        setStatus({ type: 'success', msg: 'Message sent successfully. Talk soon.' });
      }
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader title="Contact" subtitle="Let's Connect" />
        
        <div className="contact-container">
          <Card hoverEffect={false} className="contact-card">
            {status.msg && (
              <div 
                className={`status-message ${status.type}`} 
                role="alert"
                aria-live="polite"
              >
                {status.type === 'success' ? '✓' : '⚠'} {status.msg}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form" aria-label="Contact Form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject (Optional)</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="What's this about?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="form-textarea"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <Magnetic scale={0.2} style={{ width: '100%' }}>
                <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.25rem' }} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Magnetic>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
