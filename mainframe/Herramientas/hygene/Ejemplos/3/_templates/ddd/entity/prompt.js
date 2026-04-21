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
        message: "¿Deseas añadir un Value Object inicial?",
        default: false
    },
    {
        // Esta pregunta SOLO aparecerá si la anterior fue 'true'
        type: 'input',
        name: 'voName',
        message: "¿Cómo se llama el Value Object? (ej. Email, Password)",
        // Usamos 'skip' para ocultarla si addVO es false
        skip: (answers) => answers.addVO === false,
        validate: (val) => {
            if (!val) return "Debes darle un nombre al Value Object.";
            if (/\s/.test(val)) return "No uses espacios.";
            return true;
        }
    },
    {
        type: 'confirm',
        name: 'addEvents',
        message: "¿Deseas que la entidad emita Eventos de Dominio?",
        default: true
    }
];