// Aguarda o carregamento completo do DOM antes de adicionar os event listeners
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Seleciona os botões de navegação
        const nextButton = document.querySelector('.next');
        const prevButton = document.querySelector('.prev');
        const slideContainer = document.querySelector('.slide');

        // Verifica se os elementos existem antes de adicionar os event listeners
        if (!nextButton || !prevButton || !slideContainer) {
            console.warn("Elementos de navegação do slider não encontrados");
            return;
        }

        // Event listener para o botão "próximo"
        nextButton.addEventListener('click', function() {
            try {
                const items = document.querySelectorAll('.item');
                if (items.length > 0) {
                    slideContainer.appendChild(items[0]);
                }
            } catch (error) {
                console.error("Erro ao navegar para o próximo item:", error);
            }
        });

        // Event listener para o botão "anterior"
        prevButton.addEventListener('click', function() {
            try {
                const items = document.querySelectorAll('.item');
                if (items.length > 0) {
                    slideContainer.prepend(items[items.length - 1]);
                }
            } catch (error) {
                console.error("Erro ao navegar para o item anterior:", error);
            }
        });

        console.log("Slider inicializado com sucesso");
    } catch (error) {
        console.error("Erro ao inicializar o slider:", error);
    }
});