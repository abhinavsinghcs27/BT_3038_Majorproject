const store = require('../data/store');

exports.signup = (req, res) => {
  const { name, email, password, age, gender } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existingUser = store.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    age: age || '',
    gender: gender || '',
  };
  store.users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return res.status(200).json({ success: true, user: userWithoutPassword });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = store.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPassword } = user;
  return res.status(200).json({
    token: `token-${user.id}-${Date.now()}`,
    user: userWithoutPassword,
  });
};
