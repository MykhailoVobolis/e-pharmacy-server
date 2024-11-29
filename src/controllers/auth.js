import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  // Login користувача при реєстрації
  const session = await loginUser(req.body);

  // Видалення паролю з відповіді на роуті POST /auth/register
  const data = {
    name: user.name,
    email: user.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      data,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
};

// Контроллер login користувача
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
};

// Контроллер logout користувача
export const logoutUserController = async (req, res) => {
  const { accessToken } = req; // Додаємо токен до `req` через `authenticate`

  await logoutUser(accessToken);

  res.status(200).json({ message: 'Logout successful' });
};

// Контроллер refresh session
export const refreshSessionController = async (req, res) => {
  const { refreshToken } = req.body;

  const newSession = await refreshUsersSession({
    refreshToken,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
      refreshToken: newSession.refreshToken,
    },
  });
};

// Контролер отримання даних юзера
export const fetchUserInfoController = async (req, res) => {
  const { name, email } = req.user;

  res.status(200).json({
    status: 200,
    message: 'Successfully found user info!',
    data: {
      userName: name,
      userEmail: email,
    },
  });
};
