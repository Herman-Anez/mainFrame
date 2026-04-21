module.exports = [
  {
    type: 'input',
    name: 'name',
    message: "¿Nombre de la entidad? (ej. User)",
    validate: (val) => val.length > 0 || "¡El nombre es obligatorio!"
  }
];