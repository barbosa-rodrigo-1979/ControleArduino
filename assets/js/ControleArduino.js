/* ================================================================
   ControleArduino.js – Interações do site do aplicativo ControleArduino
   Autor: Gisele Nunes e Rodrigo Barbosa
   Padrão: comentários em português, código organizado em seções
   ================================================================ */

(function () {
  "use strict";

  /* ================================================================
     SEÇÃO 1 — UTILITÁRIOS
     ================================================================ */

  /**
   * Atalho para querySelectorAll retornando um array.
   * @param {string} selector
   * @param {ParentNode} [context=document]
   * @returns {Element[]}
   */
  function $$(selector, context) {
    return Array.prototype.slice.call(
      (context || document).querySelectorAll(selector)
    );
  }

  /**
   * Verifica se o usuário prefere menos movimento (acessibilidade).
   * @returns {boolean}
   */
  function prefereMenosMovimento() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /* ================================================================
     SEÇÃO 2 — ROLAGEM SUAVE PARA LINKS INTERNOS
     ================================================================ */
  function inicializarRolagemSuave() {
    // Se o navegador já suporta scroll-behavior: smooth via CSS, não força via JS.
    // Ainda assim, garantimos o comportamento para links com âncoras.
    var linksInternos = $$('a[href^="#"]');

    linksInternos.forEach(function (link) {
      link.addEventListener("click", function (evento) {
        var href = link.getAttribute("href");
        if (!href || href === "#") return;

        var alvo = document.querySelector(href);
        if (!alvo) return;

        evento.preventDefault();

        alvo.scrollIntoView({
          behavior: prefereMenosMovimento() ? "auto" : "smooth",
          block: "start",
        });

        // Atualiza o foco para acessibilidade
        alvo.setAttribute("tabindex", "-1");
        alvo.focus({ preventScroll: true });
      });
    });
  }

  /* ================================================================
     SEÇÃO 3 — FEEDBACK DO BOTÃO DE DOWNLOAD
     ================================================================ */
  function inicializarBotaoDownload() {
    var botoes = $$(".download-box .btn-print, a[download]");

    botoes.forEach(function (botao) {
      botao.addEventListener("click", function () {
        var textoOriginal = botao.textContent;

        // Altera temporariamente o texto do botão para dar feedback
        botao.textContent = "⏳ Iniciando download...";
        botao.classList.add("btn-download-ativo");

        // Restaura o texto após 3 segundos
        setTimeout(function () {
          botao.textContent = textoOriginal;
          botao.classList.remove("btn-download-ativo");
        }, 3000);
      });
    });
  }

  /* ================================================================
     SEÇÃO 4 — ANO AUTOMÁTICO NO RODAPÉ
     ================================================================ */
  function inicializarAnoRodape() {
    var copyright = document.querySelector(".copyright");
    if (!copyright) return;

    // Substitui o ano fictício "2026" pelo ano corrente, mantendo o resto do texto
    var anoAtual = new Date().getFullYear();
    copyright.innerHTML = copyright.innerHTML.replace(/\b20\d{2}\b/, anoAtual);
  }

  /* ================================================================
     SEÇÃO 5 — ANIMAÇÃO DE ENTRADA DOS CARDS (fade-in suave)
     ================================================================ */
  function inicializarAnimacaoCards() {
    // Se o usuário prefere menos movimento, não aplica animações
    if (prefereMenosMovimento()) return;

    // Se o navegador não suporta IntersectionObserver, não faz nada
    if (!("IntersectionObserver" in window)) return;

    var cards = $$(".glass-card, .carta-abelha");

    // Estado inicial: invisível e deslocado para baixo
    cards.forEach(function (card) {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition =
        "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            var card = entrada.target;
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
            observador.unobserve(card);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(function (card) {
      observador.observe(card);
    });
  }

  /* ================================================================
     SEÇÃO 6 — LOG DE INICIALIZAÇÃO (apenas em desenvolvimento)
     ================================================================ */
  function logInicializacao() {
    if (window.console && console.log) {
      console.log(
        "%cControleArduino%c – Site carregado com sucesso ✔",
        "background:#ffd200;color:#212529;font-weight:bold;padding:2px 6px;border-radius:4px;",
        "color:#212529;"
      );
    }
  }

  /* ================================================================
     SEÇÃO 7 — PONTO DE ENTRADA
     ================================================================ */
  document.addEventListener("DOMContentLoaded", function () {
    inicializarRolagemSuave();
    inicializarBotaoDownload();
    inicializarAnoRodape();
    inicializarAnimacaoCards();
    logInicializacao();
  });
})();
