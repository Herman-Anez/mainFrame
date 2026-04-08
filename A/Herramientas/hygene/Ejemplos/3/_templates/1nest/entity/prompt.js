module.exports = [
    {
        type: 'input',
        name: 'name',
        message: "¿Nombre de la entidad? (ej. User)",
        validate: (val) => {
            if (!val) return "El nombre es obligatorio.";
            if (/\s/.test(val)) return "No uses espacios.";
            return true;
        }
    },
        {
        type: 'input',
        name: 'plural',
        message: "¿Nombre de la entidad en plural? (ej. User)",
        validate: (val) => {
            if (!val) return "El nombre es obligatorio.";
            if (/\s/.test(val)) return "No uses espacios.";
            return true;
        }
    },
    {
        type: 'confirm',
        name: 'addVO',
        message: "¿Deseas añadir  Value Objects iniciales?",
        default: false
    },
    {
        type: 'input',
        name: 'voList',
        message: "Introduce los Value Objects separados por comas (ej: Email, Password, Phone) o deja vacío:",
        result: (val) => {
            if (!val) return [];
            return typeof val === 'string' ? val.split(',').map(s => s.trim()) : val;
        }
    },
    {
        type: 'confirm',
        name: 'addEvents',
        message: "¿Deseas que la entidad emita Eventos de Dominio?",
        default: true
    },
    {
        type: 'confirm',
        name: 'addBoilerplate',
        message: "¿Deseas añadir un Boilerplate de nest?",
        default: false
    },
];