// backend/src/middleware/validators.js
import { body, validationResult } from 'express-validator';

// Middleware para processar e retornar os erros de validação
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  // Mapeia os erros para um formato mais limpo para o frontend
  const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg }));
  
  return res.status(400).json({ 
    message: 'Erro de validação nos dados enviados.',
    errors: extractedErrors 
  });
};

// Regras para o Registro
export const registerValidationRules = () => {
  return [
    body('username')
      .trim() // Sanitização: remove espaços em branco
      .notEmpty().withMessage('O nome de usuário é obrigatório.')
      .isLength({ min: 4 }).withMessage('O nome de usuário deve ter no mínimo 4 caracteres.')
      .isAlphanumeric().withMessage('O nome de usuário deve conter apenas letras e números.'),
      
    body('email')
      .trim()
      .isEmail().withMessage('Insira um e-mail válido.')
      .normalizeEmail(), // Sanitização: normaliza o e-mail (remove pontos extras do gmail, etc.)
      
    body('password')
      .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres.')
      .not().isEmpty().withMessage('A senha é obrigatória.')
  ];
};

// Regras para o Login
export const loginValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail().withMessage('Insira um e-mail válido.')
      .normalizeEmail(),
      
    body('password')
      .not().isEmpty().withMessage('A senha é obrigatória.')
  ];
};