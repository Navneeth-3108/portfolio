const Joi = require("joi");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const urlSchema = Joi.string().uri({ scheme: ["http", "https"] });

const idParamSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required(),
});

const listProjectsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  techStack: Joi.string().trim(),
});

const projectCreateSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  techStack: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string().trim()
  ),
  githubLink: urlSchema.allow(""),
  liveLink: urlSchema.allow(""),
  image: Joi.string().trim().allow(""),
});

const projectUpdateSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  techStack: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string().trim()
  ),
  githubLink: urlSchema.allow(""),
  liveLink: urlSchema.allow(""),
  image: Joi.string().trim().allow(""),
}).min(1);

const skillCreateSchema = Joi.object({
  name: Joi.string().trim().required(),
  category: Joi.string().valid("frontend", "backend", "tools", "languages").required(),
});

const skillUpdateSchema = Joi.object({
  name: Joi.string().trim(),
  category: Joi.string().valid("frontend", "backend", "tools", "languages"),
}).min(1);


const experienceCreateSchema = Joi.object({
  company: Joi.string().trim().required(),
  role: Joi.string().trim().required(),
  duration: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
});

const experienceUpdateSchema = Joi.object({
  company: Joi.string().trim(),
  role: Joi.string().trim(),
  duration: Joi.string().trim(),
  description: Joi.string().trim(),
}).min(1);

const educationCreateSchema = Joi.object({
  institution: Joi.string().trim().required(),
  degree: Joi.string().trim().required(),
  duration: Joi.string().trim().required(),
});

const educationUpdateSchema = Joi.object({
  institution: Joi.string().trim(),
  degree: Joi.string().trim(),
  duration: Joi.string().trim(),
}).min(1);

const messageCreateSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  subject: Joi.string().trim().allow(""),
  message: Joi.string().trim().required(),
});

module.exports = {
  idParamSchema,
  listProjectsQuerySchema,
  projectCreateSchema,
  projectUpdateSchema,
  skillCreateSchema,
  skillUpdateSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
  educationCreateSchema,
  educationUpdateSchema,
  messageCreateSchema,
};
