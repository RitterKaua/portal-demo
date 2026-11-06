const svg = (w, h, body, k = 0.55) =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w * k}" height="${h * k}" fill="#fff" aria-hidden="true">${body}</svg>`;
const usuario = "Giuliana"; // nome exibido no topo; a inicial do circulo vem da primeira letra
let ultimoToque = 0;
// Transicoes: uma copia da tela atual fica por cima (voltar) ou por baixo (avancar) durante o movimento.
let cargaId;
// Cada lugar tem o proprio arquivo em fotos/: carregando-telas.jpg, carregando-login.jpg e menu.jpg.
const telaCarregando = (arquivo) =>
  `<div class="carregando"><div class="bola"><img src="fotos/${arquivo}" alt=""><small>Carregando...</small></div></div>`;
["carregando-telas.jpg", "carregando-login.jpg"].forEach((a) => {
  new Image().src = "fotos/" + a;
});
function copiarTela(classe) {
  const app = document.getElementById("app");
  document.querySelector(".tela-copia")?.remove();
  const rolaveis = ".rolagem,.carousel",
    copia = app.cloneNode(true),
    originais = app.querySelectorAll(rolaveis);
  copia.removeAttribute("id");
  copia.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
  copia
    .querySelectorAll(".page-in")
    .forEach((e) => e.classList.remove("page-in"));
  copia.classList.remove("tela-volta", "tela-entra");
  copia.classList.add("tela-copia", classe);
  document.body.append(copia);
  copia.querySelectorAll(rolaveis).forEach((e, i) => {
    e.scrollTop = originais[i].scrollTop;
    e.scrollLeft = originais[i].scrollLeft;
  });
  setTimeout(() => copia.remove(), 380);
  app.classList.remove("tela-volta", "tela-entra");
  void app.offsetWidth;
  return app;
}
const semMovimento = () =>
  matchMedia("(prefers-reduced-motion:reduce)").matches;
function animarVolta() {
  if (
    !document.getElementById("app").classList.contains("hide") &&
    !semMovimento()
  )
    copiarTela("tela-saindo").classList.add("tela-volta");
}
function animarAvanco() {
  if (!semMovimento()) copiarTela("tela-sob").classList.add("tela-entra");
}
const navIcon = (d) =>
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const iconeMenu = navIcon("M3 5.500H21M3 12H21M3 18.500H21"),
  iconeVoltar = navIcon("M15 4L7 12L15 20");
// Tracado medido na referencia, em coordenadas de cartao 292x72. liso() passa uma curva suave pelos pontos.
const liso = (p) => {
  let d = `M${p[0]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i],
      b = p[i],
      c = p[i + 1],
      e = p[i + 2] || c;
    d += `C${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`;
  }
  return d;
};
const roadSvg = (body) =>
  `<svg class="road" viewBox="0 0 292 72" preserveAspectRatio="none" fill="none" stroke="#fff" stroke-linecap="round" aria-hidden="true">${body}</svg>`;
const faixa = (d, o) =>
    `<path stroke="none" fill="#fff" fill-opacity="${o}" d="${d}"/>`,
  linha = (d, o, w) =>
    `<path stroke-opacity="${o}" stroke-width="${w}" d="${d}"/>`;
const amareloEsq = [
    [213.5, 0],
    [172, 25],
    [168, 38],
    [175, 54],
    [188, 72],
  ],
  amareloDir = [
    [292, 0],
    [276, 18],
    [269, 35],
    [274, 51],
    [292, 68],
  ];
const road = {
  green: roadSvg(
    faixa(
      liso([
        [239, 0],
        [236, 11],
        [255, 26],
        [265, 40],
        [255, 55],
        [221.5, 72],
      ]) + "H292V0Z",
      0.09,
    ) +
      linha(
        liso([
          [258, 0],
          [244, 9.4],
          [249, 21],
          [270, 32],
          [274.5, 42],
          [265, 55],
          [233, 72],
        ]),
        0.55,
        1,
      ) +
      linha(
        liso([
          [292, 14],
          [284, 8],
          [292, 1],
        ]),
        0.55,
        1,
      ) +
      linha(
        "M263 8L268 14M279 21L290 27M282.500 56L292 50M258 72L266.500 68",
        0.55,
        1,
      ),
  ),
  yellow: roadSvg(
    faixa(
      liso(amareloEsq) +
        "L292 72L" +
        liso([...amareloDir].reverse()).slice(1) +
        "Z",
      0.1,
    ) +
      linha(
        liso([
          [221.5, 0],
          [188, 22],
          [179, 38],
          [183, 54.5],
          [194, 72],
        ]),
        0.75,
        1.3,
      ) +
      linha(
        liso([
          [281, 0],
          [262, 18],
          [255, 35],
          [260, 51],
          [284, 72],
        ]),
        0.75,
        1.3,
      ) +
      linha("M229.500 13.600L243 3M226 59L237 71", 0.7, 1.3) +
      linha(
        liso([
          [217.6, 27.4],
          [215.8, 34],
          [215.7, 41],
        ]),
        0.7,
        1.3,
      ),
  ),
  darkblue: roadSvg(
    faixa(
      liso([
        [183, 0],
        [200.6, 19],
        [210, 45],
        [211, 72],
      ]) + "H292V0Z",
      0.1,
    ) +
      linha(
        liso([
          [197, 0],
          [213.5, 18.5],
          [226, 41],
          [229.5, 72],
        ]),
        0.55,
        2.3,
      ) +
      linha(
        liso([
          [242, 0],
          [265, 26],
          [282.5, 56],
        ]),
        0.55,
        2.3,
      ),
  ),
  sky: roadSvg(
    faixa(
      liso([
        [212, 0],
        [204, 37],
        [181, 72],
      ]) + "H292V0Z",
      0.12,
    ) +
      linha(
        liso([
          [230.5, 0],
          [225, 34],
          [200.6, 72],
        ]),
        0.5,
        2.6,
      ) +
      linha(
        liso([
          [287, 23],
          [282.5, 53],
          [273, 72],
        ]),
        0.5,
        2.6,
      ),
  ),
};
const fotos = [
  ["fotos/foto1.jpg", "50% 30%", "Capivara na água com flores"],
  ["fotos/foto2.jpg", "50% 72%", "Capivara na grama"],
  ["fotos/foto3.jpg", "50% 45%", "Capivara descansando"],
  ["fotos/foto4.jpg", "50% 12%", "Capivara de moletom azul"],
];
const slidesFotos = fotos
  .map(
    ([src, pos, alt], i) =>
      `<button class="foto" type="button" aria-label="Ampliar foto ${i + 1}" onclick="abrirFoto(${i})"><img src="${src}" alt="${alt}" decoding="async" style="object-position:${pos}"></button>`,
  )
  .join("");
function ajustarTamanhoFotos() {
  const imagens = document.querySelectorAll(".foto img");
  if (!imagens.length) return;
  const primeira = [...imagens].find(
    (img) => img.naturalWidth && img.naturalHeight,
  );
  if (!primeira) return;
  const largura = primeira.naturalWidth || 354;
  const altura = primeira.naturalHeight || 472;
  const maxLargura = Math.min(window.innerWidth - 32, largura);
  const maxAltura = Math.min(window.innerHeight * 0.58, altura);
  const proporcao = largura / altura;
  const larguraFinal = Math.min(maxLargura, maxAltura * proporcao);
  const alturaFinal = larguraFinal / proporcao;
  document.documentElement.style.setProperty(
    "--foto-largura",
    `${Math.round(larguraFinal)}px`,
  );
  document.documentElement.style.setProperty(
    "--foto-altura",
    `${Math.round(alturaFinal)}px`,
  );
  document.documentElement.style.setProperty(
    "--foto-ratio",
    `${(largura / altura).toFixed(4)}`,
  );
}
window.addEventListener("load", ajustarTamanhoFotos);
window.addEventListener("resize", ajustarTamanhoFotos);
const pagerDots = [0, 1, 2, 3]
  .map(
    (i) =>
      `<button type="button" aria-label="Ir para a imagem ${i + 1}"${i ? "" : ' class="on"'}></button>`,
  )
  .join("");
function ligarCarrossel(c, d) {
  const passo = () => c.children[1].offsetLeft - c.children[0].offsetLeft,
    atual = () => Math.round(c.scrollLeft / passo()),
    marcar = (n) => d.forEach((b, i) => b.classList.toggle("on", i === n)),
    ir = (n, behavior = "smooth") => {
      c.scrollTo({ left: n * passo(), behavior });
      marcar(n);
    };
  c.onscroll = () => marcar(atual());
  d.forEach((b, i) => (b.onclick = () => ir(i)));
  return { ir, atual };
}
let carrossel;
function iniciarCarrossel() {
  carrossel = ligarCarrossel(document.getElementById("carrossel"), [
    ...document.querySelectorAll("#pager button"),
  ]);
}
const icons = {
  condutor: svg(
    706,
    373,
    `<path fill-rule="evenodd" d="M 381.994 0.896 C 380.615 1.336, 377.941 2.496, 376.052 3.473 C 374.163 4.450, 369.464 6.322, 365.610 7.633 C 356.706 10.661, 334.957 23.004, 328.766 28.543 C 317.497 38.623, 301.894 63.165, 297.005 78.500 C 296.304 80.700, 294.719 84.300, 293.484 86.500 C 292.248 88.700, 290.302 93.661, 289.158 97.525 C 287.069 104.586, 284.394 108.167, 279 111.128 C 277.137 112.150, 269.828 112.630, 250.308 113.012 C 220.757 113.589, 219.456 113.919, 217.577 121.333 C 216.579 125.270, 218.995 139.156, 221.533 144.064 C 223.078 147.051, 228.521 149.613, 235.180 150.487 C 247.902 152.157, 248.090 157.205, 236.184 177.500 C 235.539 178.600, 234.069 182.107, 232.918 185.293 C 229.300 195.304, 223.504 198.117, 215.754 193.622 C 213.414 192.265, 209.025 190.698, 206 190.140 C 202.975 189.582, 198.475 188.386, 196 187.483 C 187.146 184.251, 177.507 184.364, 165.886 187.835 C 152.247 191.908, 139.590 193.993, 128.500 193.995 C 117.914 193.996, 92.175 189.861, 85.826 187.140 C 76.341 183.074, 72.785 183.311, 53.500 189.293 C 31.112 196.239, 13.477 212.168, 6.479 231.767 C -0.035 250.010, -1.006 283.756, 4.641 295.655 C 7.016 300.661, 15.018 306.732, 20.265 307.509 C 22.594 307.854, 72.650 308.218, 131.500 308.318 C 263.297 308.542, 249.500 305.422, 249.500 335 C 249.500 356.986, 250.147 359.437, 257.251 364.345 C 260.138 366.340, 263.598 368.766, 264.939 369.736 C 267.025 371.244, 270.161 371.547, 286.555 371.825 C 309.251 372.209, 311.888 371.671, 319.878 365.022 C 327.995 358.267, 329.066 354.947, 329.730 334.500 C 330.290 317.257, 331.554 312.468, 336.253 309.783 C 339.261 308.065, 580.908 308.449, 585.297 310.179 C 590.215 312.118, 591.299 315.863, 592.046 333.500 C 592.972 355.366, 594.554 359.491, 604.652 366.364 C 611.797 371.227, 611.797 371.227, 623.986 371.921 C 645.307 373.135, 655.618 371.985, 662.860 367.585 C 674.382 360.586, 675.992 355.332, 676.020 324.645 C 676.045 296.530, 676.859 290.679, 681.983 281.792 C 691.532 265.229, 691.922 262.342, 693.346 197.498 C 693.552 188.139, 688.462 176.447, 679.672 166.088 C 677.169 163.139, 676.844 162.073, 677.277 158.235 C 677.986 151.942, 679.657 150.687, 687.715 150.393 C 699.815 149.951, 700.785 149.071, 703.572 136 C 706.758 121.065, 706.697 119.497, 702.783 115.583 C 699.316 112.116, 699.316 112.116, 674.908 112.202 C 638.386 112.330, 635.844 111.130, 629.996 91 C 628.216 84.871, 616.692 59.226, 611.717 50.321 C 605.177 38.615, 587.459 22.928, 570.081 13.459 C 551.410 3.286, 547.397 2.861, 461.500 1.966 C 422.450 1.559, 389.150 0.971, 387.500 0.660 C 385.850 0.349, 383.372 0.456, 381.994 0.896 M 115.500 16.055 C 97.820 20.316, 91.627 23.675, 78.955 35.878 C 66.986 47.403, 66.857 47.576, 63.498 56.611 C 52.409 86.443, 58.579 117.103, 79.653 136.889 C 116.265 171.263, 168.315 160.422, 192.321 113.422 C 196.761 104.728, 196.895 104.193, 197.560 92.500 C 198.368 78.307, 196.962 67.342, 193.588 61.508 C 192.313 59.304, 190.705 55.754, 190.014 53.619 C 188.385 48.582, 176.784 35.457, 168.351 29.107 C 154.574 18.734, 129.784 12.612, 115.500 16.055 M 387.173 58.198 C 368.257 60.284, 350.310 78.952, 344.582 102.500 C 344.181 104.150, 341.635 110.744, 338.926 117.154 C 331.549 134.606, 332.195 141.553, 341.411 143.873 C 346.341 145.115, 517.434 145.332, 559.838 144.150 C 583.176 143.500, 583.176 143.500, 585.588 140.694 C 589.679 135.935, 587.870 126.023, 580.444 112.500 C 578.631 109.200, 575.260 101.775, 572.951 96 C 566.129 78.932, 561.925 72.659, 552.700 65.776 C 543.952 59.249, 540.881 58.702, 511 58.341 C 450.559 57.611, 393.096 57.545, 387.173 58.198 M 295.265 183.482 C 275.748 188.960, 266.799 201.696, 268.297 221.862 C 269.466 237.595, 272.990 243.461, 285.272 250.122 C 295.218 255.516, 335.647 255.353, 344.587 249.882 C 356.996 242.289, 358.249 225.555, 347.472 211.374 C 330.280 188.752, 311.753 178.854, 295.265 183.482 M 603.334 186.667 C 590.854 193.247, 577.904 204.607, 574.455 212 C 573.044 215.025, 571.055 219.075, 570.036 221 C 563.374 233.584, 567.615 245.864, 580.662 251.764 C 587.146 254.697, 625.469 254.287, 633.145 251.203 C 652.437 243.452, 658.695 224.942, 649.950 201.500 C 645.922 190.703, 634.244 183.348, 619.500 182.322 C 612.666 181.847, 612.282 181.950, 603.334 186.667"/>`,
    0.0725,
  ),
  veiculos: svg(
    487,
    373,
    `<path fill-rule="evenodd" d="M 266.500 1.677 C 261.214 2.799, 247.744 3.349, 211.500 3.923 C 159.172 4.750, 152.987 5.434, 144.001 11.381 C 138.818 14.811, 132.325 17.996, 126.269 20.079 C 115.004 23.955, 94.813 44.821, 89.871 57.695 C 88.223 61.988, 85.826 67.300, 84.544 69.500 C 83.262 71.700, 79.867 79.575, 76.999 87 C 66.107 115.198, 67.056 114.608, 31.480 115.277 C 1.991 115.832, 0 116.645, 0 128.119 C -0 141.738, 4.767 149.428, 15.403 152.968 C 28.659 157.379, 29.689 161.508, 21.122 175.892 C 14.851 186.421, 14.031 192.130, 13.830 226.689 C 13.618 263.060, 14.063 266.140, 21.785 281.770 L 27.500 293.336 28.253 318.418 C 29.371 355.626, 30.293 359.809, 38.776 366.171 C 46.023 371.607, 48.748 372.209, 68.527 372.745 C 90.666 373.346, 95.902 372.462, 102.812 366.961 C 110.717 360.666, 112.315 355.873, 112.796 337 C 113.494 309.647, 111.286 310.647, 172.072 310.157 C 210.091 309.851, 219.457 310.056, 228.586 311.395 C 242.145 313.384, 253.255 313.403, 267.500 311.463 C 275.972 310.309, 288.152 309.994, 320.500 310.095 C 376.792 310.270, 374.196 308.997, 375.031 336.814 C 375.631 356.753, 376.105 358.366, 383.148 364.395 C 392.190 372.134, 393.926 372.531, 417.500 372.247 C 454.892 371.797, 458.450 367.746, 458.560 325.500 C 458.629 298.790, 458.830 297.436, 464.518 285.500 C 473.341 266.981, 473.500 265.966, 473.500 228 C 473.500 190.239, 472.370 183.420, 464.568 174.082 C 456.834 164.825, 459.557 155.355, 470.500 153.452 C 478.779 152.012, 483.800 146.442, 485.545 136.759 C 485.916 134.701, 486.620 133.265, 487.110 133.568 C 487.600 133.871, 487.964 131.056, 487.921 127.309 C 487.878 123.564, 487.612 121.072, 487.331 121.770 C 486.986 122.626, 486.154 122.194, 484.779 120.446 C 481.377 116.121, 478.909 115.739, 455.623 115.930 C 426.329 116.172, 419.427 112.932, 413.992 96.388 C 412.748 92.600, 408.457 82.750, 404.457 74.500 C 400.457 66.250, 396.580 57.750, 395.842 55.611 C 392.021 44.536, 363.618 19.078, 350.500 14.969 C 348.300 14.280, 344.613 12.372, 342.306 10.728 C 337.467 7.282, 329.693 5.768, 308 4.046 C 300.575 3.457, 292.025 2.311, 289 1.499 C 282.234 -0.316, 275.647 -0.264, 266.500 1.677 M 170 58.622 C 160.712 60.441, 150.137 67.247, 143.909 75.413 C 141.775 78.211, 138.605 82.359, 136.864 84.632 C 135.011 87.051, 131.531 94.737, 128.472 103.166 C 125.597 111.087, 122.036 119.880, 120.558 122.706 C 114.547 134.204, 116.428 142.423, 125.640 144.903 C 133.583 147.042, 194.311 146.496, 204.500 144.194 C 214.128 142.019, 233.638 142.408, 243.918 144.980 C 251.936 146.986, 360.766 146.726, 364.662 144.691 C 372.866 140.406, 373.413 135.933, 367.496 121.500 C 365.693 117.100, 363.021 110.575, 361.559 107 C 360.098 103.425, 357.766 97.731, 356.379 94.346 C 352.581 85.080, 342.031 72.527, 332.882 66.388 C 321.871 59, 318.065 58.419, 283.500 58.847 C 240.900 59.376, 229.835 59.359, 200 58.721 C 184.875 58.397, 171.375 58.352, 170 58.622 M 396 184.945 C 376.111 188.562, 354.181 210.402, 350.607 230.152 C 349.087 238.554, 354.586 248.602, 362.660 252.174 C 369.199 255.066, 402.845 256.668, 411.342 254.491 C 428.261 250.156, 436.241 239.654, 436.408 221.500 C 436.643 196, 419.666 180.642, 396 184.945 M 75.407 186.407 C 58.667 190.470, 51.290 202.088, 52.337 222.740 C 53.279 241.331, 57.917 248.251, 72.928 253.463 C 77.765 255.142, 105.467 255.569, 118.128 254.159 C 136.908 252.069, 143.165 231.336, 130.302 213.824 C 113.172 190.503, 95.301 181.577, 75.407 186.407"/>`,
    0.0725,
  ),
  infracoes: svg(
    603,
    378,
    `<path fill-rule="evenodd" d="M 102.397 3.591 C 98.674 5.566, 94.249 8.206, 92.564 9.456 C 89.063 12.054, 78.234 15.902, 63 19.960 C 48.832 23.734, 49.309 23.445, 45.811 30.376 C 42.384 37.166, 39.440 41.414, 33.786 47.728 C 28.657 53.455, 28.898 55.096, 35.615 60.218 C 47.879 69.570, 47.159 69.451, 58.124 63.937 C 80.091 52.893, 144.568 52.971, 163.060 64.065 C 166.668 66.229, 170.649 68, 171.906 68 C 174.324 68, 180 65.078, 180 63.832 C 180 63.427, 181.971 61.740, 184.380 60.083 C 186.789 58.425, 189.034 56.353, 189.370 55.477 C 190.115 53.538, 187.030 47.237, 183.996 44.500 C 182.777 43.400, 179.862 39.575, 177.517 36 C 171.398 26.670, 166.512 22.347, 160.500 20.944 C 149.840 18.458, 128.736 10.908, 125.140 8.294 C 121.233 5.455, 111.415 -0, 110.211 0 C 109.636 0, 106.120 1.616, 102.397 3.591 M 106.466 17.932 C 99.341 19.639, 93 27, 93 33.561 C 93 41.190, 102.828 50.898, 110.619 50.965 C 115.020 51.002, 124.322 44.859, 125.393 41.208 C 128.511 30.573, 124.020 20.489, 115.057 17.999 C 111.104 16.901, 110.777 16.899, 106.466 17.932 M 328.710 62.069 C 309.020 64.768, 282.710 78.586, 273.210 91.220 C 271.170 93.934, 268.114 97.807, 266.420 99.827 C 263.554 103.245, 255.984 117.981, 252.976 126 C 252.253 127.925, 250.669 131.300, 249.454 133.500 C 248.239 135.700, 246.055 140.685, 244.601 144.578 C 240.386 155.859, 238.547 156.572, 214.544 156.221 C 181.748 155.741, 179.071 157.694, 185.609 177.328 C 188.590 186.277, 191.593 188.990, 198.527 188.996 C 207.515 189.005, 210.054 196.910, 203.988 206 C 202.336 208.475, 200.056 212.975, 198.920 216 C 195.126 226.106, 189.082 228.786, 181.083 223.909 C 176.321 221.006, 158.910 217.701, 152 218.388 C 148.975 218.689, 139.341 220.750, 130.592 222.967 C 111.168 227.891, 109.892 227.904, 91.350 223.365 C 51.706 213.661, 29.508 220.380, 10.896 247.719 C -3.521 268.895, -3.617 314.877, 10.742 321.272 C 12.833 322.203, 36.366 322.621, 108 323 C 193.468 323.452, 202.787 323.658, 205.500 325.155 C 213.719 329.689, 216.040 336.313, 213.374 347.623 C 211.091 357.305, 212.423 363.866, 218.064 370.720 C 223.681 377.545, 224.992 377.904, 244.500 377.949 C 264.669 377.996, 267.683 377.312, 274.208 371.208 C 281.184 364.684, 281.348 364.189, 282.075 347.500 C 282.927 327.939, 283.837 325.591, 291.162 324.070 C 302.210 321.777, 497.356 323.113, 500.033 325.500 C 503.803 328.862, 504.771 332.800, 504.825 345 C 504.908 363.664, 506.188 367.065, 515.551 373.500 C 521.372 377.500, 521.372 377.500, 541.505 377.500 L 561.637 377.500 568.269 372.500 C 577.994 365.168, 577.999 365.151, 578.006 338.849 C 578.013 312.485, 578.823 306.167, 582.932 300.446 C 590.387 290.065, 592.523 278.656, 593.654 243.181 C 594.213 225.651, 593.072 220.058, 587.307 212.085 C 579.077 200.703, 578.234 193.875, 584.877 192.387 C 596.788 189.719, 598.210 188.409, 600.991 177.535 C 605.612 159.469, 604.287 157.371, 587.407 156.025 C 580.858 155.502, 573.700 154.555, 571.500 153.919 C 569.080 153.220, 564.821 153.012, 560.719 153.392 C 549.995 154.385, 543.606 148.819, 539.034 134.500 C 533.257 116.405, 517.487 89.201, 509.679 83.861 C 507.931 82.665, 504.925 80.226, 503 78.440 C 497.651 73.480, 484.609 67.247, 473.500 64.342 C 463.500 61.727, 463.500 61.727, 399.500 61.433 C 363.680 61.268, 332.510 61.548, 328.710 62.069 M 107.500 74.649 C 70.157 76.808, 64.873 78.099, 61.900 85.798 C 60.759 88.753, 63.035 94.413, 66.003 96.002 C 71.733 99.068, 90.669 102.057, 108 102.630 C 125.668 103.215, 126.862 103.095, 143.500 99.068 C 145.700 98.535, 149.288 97.740, 151.473 97.300 C 155.275 96.535, 159.927 91.132, 159.984 87.417 C 160.034 84.069, 153.358 78.757, 147.983 77.870 C 141.466 76.794, 114.932 73.970, 113.500 74.200 C 112.950 74.288, 110.250 74.491, 107.500 74.649 M 330.874 108.941 C 310.794 115.209, 299.849 128.822, 288.927 161.109 C 283.789 176.297, 283.807 178.815, 289.072 181.537 C 292.866 183.499, 490.274 183.649, 495.988 181.694 C 502.392 179.503, 503.278 171.040, 497.999 162.498 C 496.957 160.812, 494.939 155.745, 493.516 151.238 C 487.972 133.690, 477.447 120.101, 463.820 112.898 L 455.500 108.500 394.500 108.311 C 360.950 108.206, 332.318 108.490, 330.874 108.941 M 54.320 112.250 C 47.354 123.157, 46.587 133.829, 51.612 149.927 C 69.365 206.796, 144.495 210.452, 166.127 155.500 C 176.183 129.953, 170.812 107.965, 156.310 115.310 C 154.765 116.092, 151.700 117.039, 149.500 117.413 C 147.300 117.788, 141.450 119.302, 136.500 120.778 C 125.513 124.055, 98.195 124.501, 88 121.569 C 84.975 120.699, 79.236 119.132, 75.247 118.087 C 71.258 117.042, 66.003 115.020, 63.569 113.593 C 58.742 110.764, 55.563 110.303, 54.320 112.250 M 249 218.175 C 247.075 218.722, 243.250 220.900, 240.500 223.015 C 223.903 235.783, 224.040 258.380, 240.792 271.172 C 248.220 276.846, 251.582 277.438, 272.806 276.809 C 289.181 276.324, 291.976 275.509, 298.298 269.368 C 304.130 263.703, 303.435 251.607, 296.776 242.904 C 280.084 221.091, 265.432 213.507, 249 218.175 M 519.127 218.151 C 500.564 223.491, 478.838 253.486, 485.082 265.153 C 489.613 273.620, 496.288 276.242, 514.704 276.789 C 534.998 277.392, 537.443 276.943, 545.130 271.201 C 554.040 264.544, 557.215 259.026, 557.778 249.212 C 558.450 237.493, 557.043 233.691, 549.164 225.931 C 540.520 217.418, 530.604 214.849, 519.127 218.151 M 107.500 249.516 C 106.950 249.686, 105.340 250.079, 103.921 250.389 C 98.635 251.544, 96.977 263.068, 101.455 267.545 C 104.919 271.010, 113.643 271.071, 117.611 267.658 C 122.397 263.541, 120.802 251.593, 115.317 250.473 C 110.267 249.442, 108.458 249.221, 107.500 249.516 M 105.138 281.369 C 96.595 284.460, 96.466 296.969, 104.942 300.360 C 112.451 303.365, 117.858 301.714, 119.925 295.785 C 123.830 284.582, 116.366 277.305, 105.138 281.369"/>`,
    0.0725,
  ),
  educacao: svg(
    464,
    388,
    `<path fill-rule="evenodd" d="M 154.500 1 C 138.366 1.576, 136.938 2.143, 128.108 11.480 C 119.569 20.508, 118.661 23.501, 118.186 44.191 C 117.650 67.502, 118.031 68.163, 134.125 71.861 C 138.731 72.920, 145.374 74.819, 148.887 76.083 C 157.817 79.293, 159 77.862, 159 63.840 C 159 52.575, 160.260 48.951, 165.037 46.481 C 169.643 44.099, 412.786 44.159, 416.425 46.543 C 422.246 50.357, 422 45.456, 422 157.500 C 422 271.344, 422.360 265.178, 415.522 268.423 C 410.646 270.736, 384.470 270.587, 377.516 268.206 C 370.604 265.840, 370.032 264.279, 370.015 247.718 C 369.987 222.124, 369.118 221.514, 333.210 221.886 C 299.028 222.240, 287.664 223.089, 285.011 225.490 C 281.892 228.312, 281.012 233.378, 281.006 248.527 C 280.997 270.150, 280.847 270.251, 248.293 270.509 C 231.935 270.638, 225.679 271.022, 224.543 271.965 C 221.213 274.728, 223.646 281.359, 230.976 289.500 C 232.461 291.150, 234.856 294.574, 236.298 297.109 C 241.283 305.874, 246.464 311.526, 250.617 312.726 C 257.387 314.683, 430.893 314.453, 438.500 312.478 C 448.721 309.823, 454.291 305.329, 459.241 295.746 L 463.500 287.500 463.500 157 L 463.500 26.500 459.937 20 C 455.845 12.535, 445.681 3.985, 438.626 2.072 C 434.350 0.913, 183.448 -0.034, 154.500 1 M 100.500 100.583 C 98.300 101.487, 93.503 103.268, 89.839 104.542 C 79.688 108.069, 78.131 109.122, 68.898 118.700 C 52.038 136.190, 47.694 146.965, 48.217 170 C 48.759 193.878, 53.458 205.582, 68.777 221.209 C 77.418 230.024, 78.948 231.148, 85.397 233.417 C 89.304 234.792, 94.975 236.820, 98 237.925 C 104.195 240.189, 119.806 240.744, 128.877 239.023 C 149.135 235.182, 169.878 217.239, 176.572 197.770 C 181.884 182.317, 182.230 180.234, 181.768 166.500 C 180.775 137.038, 167.022 117.076, 138.976 104.392 C 127.063 99.005, 108.755 97.192, 100.500 100.583 M 74.500 272.506 C 45.553 278.276, 23.734 295.695, 9.170 324.661 C -1.764 346.408, -2.653 375.756, 7.423 382.357 C 14.257 386.835, 15.786 386.901, 116.302 387.067 C 219.897 387.238, 214.704 387.504, 221.631 381.663 C 227.926 376.355, 231.078 362.605, 228.547 351.493 C 226.073 340.627, 222.358 327.539, 221.028 324.999 C 211.740 307.259, 193.190 286.780, 182.850 282.851 C 180.072 281.795, 175.666 279.851, 173.060 278.530 C 160.953 272.396, 155.638 271.720, 117 271.402 C 89.677 271.178, 79.888 271.432, 74.500 272.506"/>`,
    0.0725,
  ),
};
const optIcon = (w, h, k, body) =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w * k}" height="${h * k}" fill="#1450b0" aria-hidden="true">${body}</svg>`;
Object.assign(icons, {
  cnh: optIcon(
    46,
    36,
    0.62,
    `<path fill-rule="evenodd" d="M5 0H41A5 5 0 0 1 46 5V31A5 5 0 0 1 41 36H5A5 5 0 0 1 0 31V5A5 5 0 0 1 5 0ZM3.500 8V30A2.500 2.500 0 0 0 6 32.500H40A2.500 2.500 0 0 0 42.500 30V8Z"/><circle cx="16" cy="17" r="4.500"/><path d="M7 32Q7 23.500 16 23.500 25 23.500 25 32Z"/><rect x="29" y="13" width="9" height="3.500" rx="1"/><rect x="29" y="20" width="9" height="3.500" rx="1"/>`,
  ),
  servicos: optIcon(
    50,
    44,
    0.58,
    `<path fill-rule="evenodd" d="M9 2Q9.500 0 12 0H18V6H24V0H30Q32.500 0 33 2L41 34Q41.500 36 39 36H24V29H18V36H3Q.5 36 1 34ZM18 11V24H24V11Z"/><circle cx="37" cy="31" r="14" fill="#fff"/><circle cx="37" cy="31" r="11.500"/><path fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M31.500 31.500L35.500 35.500 42.500 27.500"/>`,
  ),
  cadastro: optIcon(
    34,
    42,
    0.6,
    `<circle cx="17" cy="8.500" r="8"/><path d="M6 28Q6 19 17 19 28 19 28 28Z"/><path fill="none" stroke="#fff" stroke-width="2.500" stroke-linecap="round" d="M7 29Q17 19 27 29"/><path fill="none" stroke="#1450b0" stroke-width="2.500" stroke-linecap="round" d="M11 33Q17 28 23 33"/><circle cx="4.500" cy="33" r="4.500"/><circle cx="29.500" cy="33" r="4.500"/><path d="M17 31L18.800 34.600 22.800 35.200 19.900 38 20.600 42 17 40.100 13.400 42 14.100 38 11.200 35.200 15.200 34.600Z"/>`,
  ),
  estacionamento: optIcon(
    36,
    36,
    0.68,
    `<circle cx="18" cy="18" r="16" fill="none" stroke="#1450b0" stroke-width="3.500"/><path d="M12 8.500H24.500V12.500H16.500V16H23.500V20H16.500V23.500H24.500V27.500H12Z"/>`,
  ),
});
const screens = {
  home: () =>
    `<button class="tile green" onclick="go('conductor')">${road.green}<span><b>CONDUTOR</b><small>Gerencie sua<br><strong>habilitação</strong></small></span><span class="symbol">${icons.condutor}</span></button><button class="tile yellow" onclick="go('vehicles')">${road.yellow}<span><b>VEÍCULOS</b><small>Acesso ao <strong>CRLV-e</strong><br>venda digital</small></span><span class="symbol">${icons.veiculos}</span></button><button class="tile darkblue" onclick="go('fines')">${road.darkblue}<span><b>INFRAÇÕES</b><small>Visualize e pague infrações<br>com até <strong>40% de desconto</strong></small></span><span class="symbol">${icons.infracoes}</span></button><button class="tile sky" onclick="go('education')">${road.sky}<span><b>EDUCAÇÃO</b><small>Conheça nossa<br><strong>plataforma de cursos</strong></small></span><span class="symbol">${icons.educacao}</span></button>`,
  conductor: () =>
    `<section class="panel"><h3>Informações do Condutor</h3><hr style="border:0;border-top:1px solid #ddd"><div class="info-grid"><div class="wide"><label>Nome</label>G******* D****** D*****</div><div><label>CPF</label>***.325.910-**</div><div><label>Sexo</label>FEMININO</div><div><label>Categoria</label>B</div><div><label>UF de Emissão</label>RS</div><div><label>Data de Validade</label>13/09/2036</div><div><label>Data de Emissão</label>13/09/2023</div><div class="wide"><label>Número de Segurança CNH</label><span class="secure">***********<button class="secure-eye" type="button" aria-label="Mostrar número de segurança" onclick="msg('Indisponível no momento')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3.200"/><path d="M4 3l16 18"/></svg></button></span></div></div></section><div class="options"><button class="opt" onclick="go('license')"><span class="emoji">${icons.cnh}</span>CNH</button><button class="opt" onclick="go('services')"><span class="emoji">${icons.servicos}</span>SERVIÇOS PARA A CNH</button><button class="opt" onclick="go('education')"><span class="emoji">${icons.cadastro}</span>CADASTRO POSITIVO</button><button class="opt" onclick="go('services')"><span class="emoji">${icons.estacionamento}</span>CREDENCIAL DEESTACIONAMENTO</button></div>`,
  license: () =>
    `<div class="carousel" id="carrossel">${slidesFotos}</div><div class="pager" id="pager">${pagerDots}</div><button class="navbutton" onclick="msg('Indisponível no momento')"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm5.500 3.500a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5ZM4 17q0-3.500 4.500-3.500T13 17Zm10-8.500v2h6v-2Zm0 4v2h6v-2Z"/></svg>Histórico de emissões</button><button class="navbutton" onclick="msg('Indisponível no momento')"><svg viewBox="0 0 25 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M6 1h7l6 6v6.500h-6a1.500 1.500 0 0 0 0 3h6V21a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Zm7 2.500V8h4.500Z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 15h8M20 12l3 3-3 3"/></svg>Exportar</button><button class="navbutton" onclick="msg('Indisponível no momento')"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 2h6l1 2h5v3H3V4h5ZM5 8h14l-1 13a2 2 0 0 1-2 1.800H8A2 2 0 0 1 6 21Z"/></svg>Remover</button><button class="navbutton" onclick="msg('Indisponível no momento')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linejoin="round" aria-hidden="true"><rect x="8.500" y="3" width="12" height="15" rx="2"/><path d="M5 7.500H4.500a1.500 1.500 0 0 0-1.500 1.500v10.500A1.500 1.500 0 0 0 4.500 21H13a2 2 0 0 0 2-2"/></svg>Copiar QR Code</button>`,
  vehicles: () =>
    `<section class="panel"><h3>Veículos</h3><p class="muted">Nenhum veículo cadastrado.</p></section>`,
  fines: () =>
    `<section class="panel"><h3>Infrações</h3><p class="muted">Sem infrações.</p></section>`,
  education: () =>
    `<section class="panel"><h3>Educação</h3><p>Conteúdos educativos de direção responsável podem ser integrados aqui.</p></section>`,
  services: () =>
    `<section class="panel"><h3>Serviços para condutores</h3><button class="cta" onclick="go('home')">VOLTAR AO INÍCIO</button></section>`,
};
let page = "home";
function go(p) {
  const falta = 90 - (Date.now() - ultimoToque);
  if (falta > 0) return void setTimeout(() => go(p), falta);
  const nivel = (x) => ({ home: 0, license: 2 })[x] ?? 1,
    voltando = nivel(p) < nivel(page);
  const avancando =
    !voltando &&
    p !== page &&
    !document.getElementById("app").classList.contains("hide");
  if (voltando) animarVolta();
  if (avancando) animarAvanco();
  page = p;
  clearTimeout(cargaId);
  document.getElementById("logos").classList.toggle("hide", p !== "home");
  document.querySelector(".user-actions").style.display =
    p === "conductor" || p === "license" ? "none" : "";
  const names = {
    home: usuario,
    conductor: "CONDUTOR",
    license: "HABILITAÇÃO",
    vehicles: "VEÍCULOS",
    fines: "INFRAÇÕES",
    education: "EDUCAÇÃO",
    services: "SERVIÇOS",
  };
  document.getElementById("heading").textContent = names[p];
  document.getElementById("navBtn").innerHTML =
    p === "home" ? iconeMenu : iconeVoltar;
  document.getElementById("navBtn").classList.toggle("voltar", p !== "home");
  const c = document.getElementById("content"),
    abrir = () => {
      c.innerHTML = screens[p]();
      if (p === "license") iniciarCarrossel();
    };
  document.getElementById("rolagem").scrollTop = 0;
  c.classList.remove("page-in");
  if (avancando) {
    c.innerHTML = telaCarregando("carregando-telas.jpg");
    cargaId = setTimeout(() => {
      abrir();
      void c.offsetWidth;
      c.classList.add("page-in");
    }, 320);
  } else abrir();
}
document.getElementById("navBtn").onclick = () =>
  page === "home" ? abrirMenu() : go(page === "license" ? "conductor" : "home");
let tid;
function msg(s) {
  let e = document.getElementById("toast");
  e.textContent = s;
  e.classList.remove("hide");
  clearTimeout(tid);
  tid = setTimeout(() => e.classList.add("hide"), 3000);
}
document.getElementById("avatar").textContent = usuario[0];
go("home");
// Login demonstrativo: a chave nao e validada, armazenada nem enviada a lugar nenhum.
const chave = document.getElementById("chave");
document.getElementById("eyeBtn").onclick = (e) => {
  const show = chave.type === "password";
  chave.type = show ? "text" : "password";
  document.getElementById("eyeSlash").style.display = show ? "none" : "";
  e.currentTarget.setAttribute(
    "aria-label",
    show ? "Ocultar chave de acesso" : "Mostrar chave de acesso",
  );
  chave.focus();
};
document.getElementById("forgotBtn").onclick = () =>
  msg("Indisponível no momento");
document.getElementById("loginForm").onsubmit = (e) => {
  e.preventDefault();
  if (!chave.value.trim()) {
    msg("Digite a sua chave de acesso");
    chave.focus();
    return;
  }
  chave.value = "";
  chave.blur();
  const login = document.getElementById("login"),
    miolo = login.querySelector(".login-miolo");
  miolo.classList.add("carregando-login");
  miolo.insertAdjacentHTML("beforeend", telaCarregando("carregando-login.jpg"));
  setTimeout(() => {
    document.getElementById("app").classList.remove("hide");
    login.classList.add("hide");
    miolo.classList.remove("carregando-login");
    miolo.querySelector(".carregando").remove();
    window.scrollTo(0, 0);
    abrirAviso("login");
  }, 450);
};
const aviso = document.getElementById("aviso");
// inicio: ao abrir o site, sempre e obrigatorio. login: depois de entrar, com "nao perguntar". menu: reaberto pelo "Sobre".
let modoAviso = "inicio";
function abrirAviso(modo = "inicio") {
  if (modo === "login") {
    try {
      if (localStorage.getItem("avisoDemoOk")) return;
    } catch {}
  }
  modoAviso = modo;
  document.getElementById("avisoNunca").style.display =
    modo === "login" ? "" : "none";
  aviso.classList.remove("hide");
  document.getElementById("avisoSim").focus();
}
function fecharAviso() {
  aviso.classList.add("hide");
}
document.getElementById("avisoSim").onclick = () =>
  setTimeout(() => {
    fecharAviso();
    if (modoAviso === "inicio") chave.focus();
  }, 150);
document.getElementById("avisoNao").onclick = () => {
  if (modoAviso === "inicio") {
    msg("Para entrar, é preciso aceitar o aviso");
    return;
  }
  setTimeout(() => {
    fecharAviso();
    if (modoAviso !== "login") return;
    document.getElementById("app").classList.add("hide");
    document.getElementById("login").classList.remove("hide");
    chave.focus();
  }, 150);
};
document.getElementById("avisoNunca").onclick = () => {
  try {
    localStorage.setItem("avisoDemoOk", "1");
  } catch {}
  fecharAviso();
};
const menuIcone = (c) =>
    `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${c}</svg>`,
  menuTraco =
    'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"',
  menuLetra = (l) =>
    `<circle cx="12" cy="12" r="11"/><text x="12" y="17" text-anchor="middle" font-size="15" font-weight="700" fill="#efefef" font-family="Poppins,sans-serif">${l}</text>`;
const grupoMenu = [
  [
    [
      "Central de Mensagens",
      `<rect x="1" y="4" width="22" height="17" rx="3"/><path d="M2 7l10 7 10-7" fill="none" stroke="#efefef" stroke-width="2"/>`,
    ],
    [
      "Privacidade e Proteção de Dados",
      `<path ${menuTraco} d="M7 11V7a5 5 0 0 1 10 0v4"/><rect x="4" y="10" width="16" height="13" rx="3"/>`,
    ],
    [
      "Termo de Responsabilidade",
      `<rect x="5" y="1.5" width="14" height="21" rx="2.5" ${menuTraco}/><circle cx="12" cy="10.5" r="2.8"/><path d="M7.5 19q0-4.5 4.5-4.5t4.500 4.500Z"/>`,
    ],
    [
      "Avaliar",
      `<circle cx="12" cy="12.5" r="10" ${menuTraco}/><path d="M8 5l1.100 2.200 2.400.3-1.700 1.700.4 2.400L8 10.500l-2.200 1.100.4-2.400L4.500 7.500l2.400-.3ZM16 5l1.100 2.200 2.400.3-1.700 1.700.4 2.400L16 10.500l-2.200 1.100.4-2.400-1.700-1.700 2.400-.3ZM6.500 14.500h11a5.500 5.500 0 0 1-11 0Z"/>`,
    ],
  ],
  [
    [
      "Preferências",
      `<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61ZM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z"/>`,
    ],
    [
      "Tutorial",
      `<path d="M1 5q5.5-2.5 10 0v16q-4.5-2.5-10 0ZM13 5q4.5-2.5 10 0v16q-5.5-2.5-10 0Z"/>`,
    ],
    ["Assistente Virtual", menuLetra("?")],
    ["Sobre o aplicativo", menuLetra("i")],
  ],
  [
    [
      "Sair da Conta",
      `<path ${menuTraco} d="M11 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h5"/><path d="M10 9.5h5V5l8 7-8 7v-4.5h-5Z"/>`,
    ],
  ],
];
const menuEl = document.getElementById("menu"),
  menuLista = document.getElementById("menuLista");
document.getElementById("menuNome").textContent = usuario;
menuLista.innerHTML = grupoMenu
  .map(
    (g) =>
      `<div class="menu-grupo">${g.map(([t, ic]) => `<button class="menu-item" type="button">${menuIcone(ic)}<span>${t}</span></button>`).join("")}</div>`,
  )
  .join("");
function abrirMenu() {
  menuEl.classList.remove("hide", "fechando");
}
function fecharMenu() {
  menuEl.classList.add("fechando");
  setTimeout(() => menuEl.classList.add("hide"), 240);
}
document.getElementById("menuFundo").onclick = fecharMenu;
menuLista.onclick = (e) => {
  const b = e.target.closest(".menu-item");
  if (!b) return;
  const t = b.querySelector("span").textContent;
  if (t === "Sair da Conta") {
    fecharMenu();
    setTimeout(() => {
      go("home");
      document.getElementById("app").classList.add("hide");
      document.getElementById("login").classList.remove("hide");
      chave.focus();
    }, 240);
    return;
  }
  if (t === "Sobre o aplicativo") {
    fecharMenu();
    abrirAviso("menu");
    return;
  }
  msg("Indisponível no momento");
};
let menuX = 0;
menuEl.addEventListener(
  "touchstart",
  (e) => {
    menuX = e.touches[0].clientX;
  },
  { passive: true },
);
menuEl.addEventListener(
  "touchend",
  (e) => {
    if (e.changedTouches[0].clientX - menuX < -60) fecharMenu();
  },
  { passive: true },
);
const fotoView = document.getElementById("fotoView"),
  galeriaEl = document.getElementById("galeria"),
  galeriaPager = document.getElementById("galeriaPager");
galeriaEl.innerHTML = fotos
  .map(
    ([src, , alt]) =>
      `<div class="galeria-item"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"></div>`,
  )
  .join("");
galeriaPager.innerHTML = pagerDots;
const galeria = ligarCarrossel(galeriaEl, [...galeriaPager.children]);
function abrirFoto(i) {
  fotoView.classList.remove("hide");
  document.body.style.overflow = "hidden";
  galeria.ir(i, "instant");
  document.getElementById("fotoFechar").focus();
}
function fecharFoto() {
  const n = galeria.atual();
  fotoView.classList.add("hide");
  document.body.style.overflow = "";
  carrossel.ir(n, "instant");
}
document.getElementById("fotoFechar").onclick = fecharFoto;
document.addEventListener("keydown", (e) => {
  if (fotoView.classList.contains("hide")) return;
  if (e.key === "Escape") fecharFoto();
  if (e.key === "ArrowRight")
    galeria.ir(Math.min(galeria.atual() + 1, fotos.length - 1));
  if (e.key === "ArrowLeft") galeria.ir(Math.max(galeria.atual() - 1, 0));
});
// Sem zoom: o iOS ignora user-scalable=no, entao o gesto de pinca tambem e bloqueado aqui.
["gesturestart", "gesturechange", "gestureend"].forEach((t) =>
  document.addEventListener(t, (e) => e.preventDefault(), {
    passive: false,
  }),
);
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 1) e.preventDefault();
  },
  { passive: false },
);
// Onda de toque: nasce no ponto tocado; segurando, cobre o botao inteiro.
document.addEventListener("pointerdown", (e) => {
  const alvo = e.target.closest(
    ".tile,.opt,.navbutton,.menu-item,.aviso-botoes button",
  );
  if (!alvo) return;
  ultimoToque = Date.now();
  const caixa = alvo.getBoundingClientRect(),
    x = e.clientX - caixa.left,
    y = e.clientY - caixa.top,
    raio = Math.hypot(
      Math.max(x, caixa.width - x),
      Math.max(y, caixa.height - y),
    ),
    onda = document.createElement("span");
  onda.className = "ripple";
  onda.style.cssText = `left:${x - raio}px;top:${y - raio}px;width:${raio * 2}px;height:${raio * 2}px`;
  let solto = false;
  const iniciar = setTimeout(
    () => {
      if (solto) return;
      alvo.classList.add("pressed");
      alvo.append(onda);
    },
    e.pointerType === "touch" ? 25 : 0,
  );
  const soltar = (ev) => {
    if (solto) return;
    solto = true;
    clearTimeout(iniciar);
    removeEventListener("pointerup", soltar);
    removeEventListener("pointercancel", soltar);
    if (ev.type === "pointercancel" && !onda.isConnected) return;
    if (!onda.isConnected) {
      alvo.classList.add("pressed");
      alvo.append(onda);
    }
    setTimeout(() => {
      alvo.classList.remove("pressed");
      onda.classList.add("saindo");
      setTimeout(() => onda.remove(), 320);
    }, 140);
  };
  addEventListener("pointerup", soltar);
  addEventListener("pointercancel", soltar);
});
