const verifyUser = async (app, user) => {
  try {
    await app.client.users.info({ user });
    return true;
  } catch (error) {
    return false;
  }
};

export default verifyUser;
