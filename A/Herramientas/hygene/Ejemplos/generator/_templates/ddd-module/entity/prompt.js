module.exports = [
  {
    type: 'input',
    name: 'moduleName',
    message: "¿Nombre del módulo/Bounded Context? (ej. HumanResources)",
    validate: (val) => {
      if (!val) return "El nombre del módulo es obligatorio.";
      return true;
    }
  },
  {
    type: 'input',
    name: 'name',
    message: "¿Nombre de la entidad principal? (ej. Employee)",
    validate: (val) => {
      if (!val) return "El nombre es obligatorio.";
      if (/\s/.test(val)) return "No uses espacios.";
      return true;
    }
  },
  {
    type: 'input',
    name: 'targetPath',
    message: "¿Ruta de destino? (relativa a la raíz del proyecto)",
    default: 'src'
  },
  {
    type: 'confirm',
    name: 'addUseCases',
    message: "¿Deseas generar los casos de uso básicos (CRUD)?",
    default: true
  }
];
