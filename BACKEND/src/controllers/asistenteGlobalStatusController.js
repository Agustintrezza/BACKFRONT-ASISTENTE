const AsistenteGlobalStatus = require('../models/AsistenteGlobalStatus');

exports.getStatus = async (req, res) => {
  const doc = await AsistenteGlobalStatus.findOne({ tenant: req.tenant });
  if (!doc) {
    return res.json({
      tenant: req.tenant,
      online: true,
      mensajeOffline: null,
      horario: { habilitar: false, rango: '' },
    });
  }
  return res.json(doc);
};

exports.setStatus = async (req, res) => {
  const { online, mensajeOffline, horario } = req.body || {};
  const doc = await AsistenteGlobalStatus.findOneAndUpdate(
    { tenant: req.tenant },
    {
      $set: {
        ...(typeof online === 'boolean' ? { online } : {}),
        ...(typeof mensajeOffline === 'string' ? { mensajeOffline } : {}),
        ...(horario && typeof horario === 'object' ? { horario } : {}),
      },
    },
    { upsert: true, new: true }
  );
  return res.json(doc);
};
