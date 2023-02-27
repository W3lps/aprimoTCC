exports.criarGrupo = async (req, res, next) => {
  try {
    console.log('funciona');
    res.status(200).json({ message: 'funciona' });
  } catch (error) {}
};
