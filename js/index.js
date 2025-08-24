// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Verifica se o localStorage está disponível
        if (typeof(Storage) === "undefined") {
            console.warn("localStorage não suportado neste navegador");
            return;
        }

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
        console.error("Erro ao verificar o localStorage:", error);
        // Fallback: exibe o aviso mesmo sem localStorage
        alert("⚠️ Este site está em desenvolvimento. Alguns erros podem ocorrer!");
    }
});