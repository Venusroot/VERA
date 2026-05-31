/**
 * ZOOM DE IMAGEM - VERA
 * Funcionalidade de lupa para visualizar detalhes da imagem do modal
 */

document.addEventListener('DOMContentLoaded', () => {
  const zoomOverlay = document.getElementById('zoom-overlay');
  const zoomImage = document.getElementById('zoom-image');
  const zoomCloseBtn = document.getElementById('zoom-close');
  const modalMainImage = document.getElementById('modal-main-image');
  const mainImageContainer = document.querySelector('.main-image');

  if (!modalMainImage || !zoomOverlay) return;

  /**
   * Abre o zoom da imagem
   */
  function openZoom(imageSrc) {
    zoomImage.src = imageSrc;
    zoomOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Fecha o zoom da imagem
   */
  function closeZoom() {
    zoomOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Click na imagem principal para abrir zoom
  modalMainImage.addEventListener('click', () => {
    if (modalMainImage.src) {
      openZoom(modalMainImage.src);
    }
  });

  // Botão fechar
  zoomCloseBtn.addEventListener('click', closeZoom);

  // Overlay click para fechar
  zoomOverlay.addEventListener('click', (e) => {
    if (e.target === zoomOverlay) {
      closeZoom();
    }
  });

  // Tecla ESC para fechar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && zoomOverlay.classList.contains('active')) {
      closeZoom();
    }
  });

  /**
   * Touch drag para mobile - permitir pan da imagem
   */
  let touchStartX = 0;
  let touchStartY = 0;

  zoomImage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  zoomImage.addEventListener('touchmove', (e) => {
    if (!zoomOverlay.classList.contains('active')) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Se swipe para cima/baixo > 50px, fecha
    if (Math.abs(diffY) > 50) {
      closeZoom();
    }
  });
});
