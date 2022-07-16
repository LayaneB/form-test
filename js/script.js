let today = new Date().toISOString().split("T")[0];
document.getElementById("event-day").setAttribute("min", today);

let form = document.getElementById("form")
let submit = document.getElementById("btn")

const inputs = form.getElementsByTagName('input')
let inputsArray = [...inputs]

const spans = form.getElementsByTagName('span')
let spansArray = [...spans]

let valid = []

submit.addEventListener('click', function (e) {
    e.preventDefault();

    inputsArray.forEach((input, index) => {
        validator(input, index)
    });

    onSuccess = function () {
        try {
            const isValid = valid.findIndex(element => !element);
            if (isValid >= 0) {
                throw new Error("Por favor, preencha todos os campos corretamente para enviar seu formulário.");
            }
            
            alert("Informações enviadas com sucesso.");
        } catch (error) {
            this.onError(999999, error.message);
        }
    };

    onError = function (errorCode, message) {
        alert(`Error ${errorCode}: ${message}`);
    };

    ReCaptchav3UtilsRequest('submit', onSuccess, onError);
})

inputsArray.forEach((input, index) => {
    input.addEventListener('change', function (e) {
        validator(input, index)
    })

});

validator = (input, index) => {
    if (input.required) {
        required(input, index)
    }
    if (input.value !== "" && input.type === "email") {
        validateEmail(input, index)
    }
    if (input.value !== "" && input.id.includes("cnpj")) {
        validateCNPJ(input, index)
    }
};

required = (input, index) => {
    const inputValue = input.value;
    if (inputValue === '') {
        const errorMessage = '<i class="fa fa-info-circle"></i> Campo Obrigatório*';
        input.style.borderColor = "rgba(243, 10, 10, 0.375)";
        this.printMessage(index, errorMessage);
        valid[index] = false
    } else {
        this.cleanValidations(input, index);
        valid[index] = true
    }
};

validateEmail = (input, index) => {
    let regexp = /\S+@\S+\.\S+/;

    let email = input.value;

    if (!regexp.test(email)) {
        const errorMessage = `<i class="fa fa-info-circle"></i> Digite um e-mail válido*`;
        input.style.borderColor = "rgba(243, 10, 10, 0.375)";
        this.printMessage(index, errorMessage);
        valid[index] = false;
    } else {
        this.cleanValidations(input, index);
        valid[index] = true;
    }

};

validateCNPJ = (input, index) => {
    let regexp = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/

    let cnpj = input.value;
    if (!regexp.test(cnpj)) {
        const errorMessage = `<i class="fa fa-info-circle"></i> Digite um CNPJ válido*`;
        input.style.borderColor = "rgba(243, 10, 10, 0.375)";
        this.printMessage(index, errorMessage);
        valid[index] = false;
    } else {
        this.cleanValidations(input, index);
        valid[index] = true;
    }
};

printMessage = (index, message) => {
    spansArray[index].innerHTML = message;
};

cleanValidations = (input, index) => {
    input.style.borderColor = "rgba(0, 31, 63, 0.3)";
    spansArray[index].innerHTML = "";
};

ReCaptchav3UtilsRequest = function (action, onSuccess, onError) {
    const PUBLIC_KEY = '6LeQdPEgAAAAAKusWKDghRm1uHSf2SldxBHo0RlK';

    if (window.grecaptcha) {
        window.grecaptcha.ready(function () {
            const config = {
                action: action
            };
            try {
                var query = window.grecaptcha.execute(PUBLIC_KEY, config);
                if (onSuccess) {
                    query.then(onSuccess);
                }
            } catch (e) {
                var message = e && e.message || 'Erro na requisição.';
                if (onError) {
                    onError(450, message);
                }
            }
        });
    } else {
        if (onError) {
            onError(131, 'reCAPTCHA v3 não carregou corretamente.');
        }
    }
};
