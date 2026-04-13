module.exports = [
  {
    type: 'input',
    name: 'name',
    message: "¿A qué entidad pertenece? (ej. User)",
    validate: (val) => val.length > 0 || "Es obligatorio saber el módulo destino."
  },
  {
    type: 'input',
    name: 'voName',
    message: "¿Nombre del nuevo Value Object? (ej. Password, Phone, Address)",
    validate: (val) => {
      if (!val) return "El nombre del VO es obligatorio.";
      if (/\s/.test(val)) return "No uses espacios.";
      return true;
    }
  }
];