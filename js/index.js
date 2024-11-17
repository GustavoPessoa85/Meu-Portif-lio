window.onload = function() {
    try {
        // Verifica se o aviso já foi mostrado anteriormente
        const avisoMostrado = localStorage.getItem('avisoSiteDesenvolvimento');

        if (!avisoMostrado) {
            // Exibe o alerta
            alert("⚠️ Este site está em desenvolvimento. Alguns erros podem ocorrer!");

            // Salva no localStorage para não exibir novamente
            localStorage.setItem('avisoSiteDesenvolvimento', 'true');
            console.log("Aviso exibido pela primeira vez.");
        } else {
            console.log("Aviso já exibido anteriormente.");
        }
    } catch (error) {
        console.error("Erro ao verificar o localStorage: ", error);
    }
};