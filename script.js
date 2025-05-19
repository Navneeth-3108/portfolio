
    const form = document.getElementById('contact-form');
    const contactSection = document.querySelector('.contact');
  
    const responseMessage = document.createElement('p');
    responseMessage.id = 'form-message';
    responseMessage.style.textAlign = 'center';
    responseMessage.style.marginTop = '20px';
    contactSection.appendChild(responseMessage);
  
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
  
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (response.ok) {
          responseMessage.style.color = "green";
          responseMessage.textContent = "Thank you! Your message has been sent.";
          form.reset();
        } else {
          responseMessage.style.color = "red";
          responseMessage.textContent = "Oops! Something went wrong. Please try again.";
        }
      } catch (error) {
        responseMessage.style.color = "red";
        responseMessage.textContent = "Network error. Please try again later.";
      }
    });